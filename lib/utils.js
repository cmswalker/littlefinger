const fs = require('fs');
const util = require('util');

const R = require('ramda');
const request = require('superagent');

const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);

const DEPENDENCY_TYPES = new Set(['dependencies', 'devDependencies', 'peerDependencies']);
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const STRIP_NON_NUMERICS = /[^a-zA-Z0-9 ]/g;

const errorMessages = {
  noDependencies: 'Missing required property dependencies',
  noOutput: 'Must provide output path for desired package.json',
  noDependencyTypes: `Must provide at least one of package.json dependency types: ${Array.from(DEPENDENCY_TYPES)}`,
};

const stringify = (indentation, dependencyMap) => JSON.stringify(dependencyMap, null, indentation);

/* eslint-disable no-console */
const logDryRun = (indentation, dependencies) => console.log(`::package-json-compose::Dry Run Output\n${stringify(indentation, dependencies)}`);
const logOutput = (indentation, dependencies) => console.log(`::package-json-compose::Generating\n${stringify(indentation, dependencies)}`);
/* eslint-enable no-console */

const collect = dependencies => R.map(key => dependencies[key], R.keys(dependencies));

const parse = data => R.map(({ body, text = '' }) => {
  const bodyIsEmpty = R.isEmpty(body);
  const result = !bodyIsEmpty ? body : JSON.parse(text);

  const { dependencies = {}, devDependencies = {}, peerDependencies = {} } = result;
  return { dependencies, devDependencies, peerDependencies };
}, data);

const getTypes = (types) => {
  const isInTypes = t => DEPENDENCY_TYPES.has(t);
  const isAllowed = dependencyType => !!types[dependencyType];

  return R.filter(isInTypes, R.filter(isAllowed, R.keys(types)));
};

const filter = (blacklist, parsedDependencies) => R.map(packageDependencies => R.reduce((m, k) => {
  const dependencies = R.omit(blacklist, packageDependencies[k]);
  m[k] = dependencies; // eslint-disable-line
  return m;
}, {}, R.keys(packageDependencies)), parsedDependencies);

const get = mappedDependencies => Promise.all(R.map(url => request.get(url).accept('json'), mappedDependencies));

const write = (output, indentation, fileContents) => writeFilePromise(output, stringify(indentation, fileContents), 'utf-8').then(() => fileContents);

// Non-destructive to all other package.json properties
const build = (output, indentation, fileContents) => readFilePromise(output)
  .then((data) => {
    let parsed;

    try {
      parsed = JSON.parse(data);
    } catch (e) {
      parsed = {};
    }

    const dupeKeys = (k, l, r) => r;
    const merged = R.mergeWithKey(dupeKeys, parsed, fileContents);
    return write(output, indentation, merged);
  });

const parseVersion = str => str.split('.').map(s => s.replace(STRIP_NON_NUMERICS, '')).map(s => parseInt(s, 10));

const getSemVer = (versionArr) => {
  const [major, minor, patch] = versionArr;
  return {
    major, minor, patch,
  };
};

const determineLargerVersion = (l, r) => {
  const leftSemVer = getSemVer(l);
  const rightSemVer = getSemVer(r);

  if (leftSemVer.major > rightSemVer.major) {
    return LEFT;
  } else if (rightSemVer.major > leftSemVer.major) {
    return RIGHT;
  }

  if (leftSemVer.minor > rightSemVer.minor) {
    return LEFT;
  } else if (rightSemVer.minor > leftSemVer.minor) {
    return RIGHT;
  }

  if (leftSemVer.patch > rightSemVer.patch) {
    return LEFT;
  }

  return RIGHT;
};

const dedupe = (types, filteredDependencies) => {
  const allowedTypes = getTypes(types);

  const parseLatestVersion = (k, l, r) => {
    const leftVersion = parseVersion(l);
    const rightVersion = parseVersion(r);
    const higher = determineLargerVersion(leftVersion, rightVersion);

    if (higher === LEFT) {
      return l;
    }

    return r;
  };

  const getLatestVersion = (k, l, r) => R.mergeWithKey(parseLatestVersion, l, r);

  return R.reduce((memo, dependencies) => {
    const picked = R.pick(allowedTypes, dependencies);
    // NOTE: if it already exists, take the latest one
    memo = R.mergeWithKey(getLatestVersion, memo, picked); // eslint-disable-line
    return memo;
  }, {}, filteredDependencies);
};

module.exports = {
  DEPENDENCY_TYPES,
  errorMessages,
  get,
  parse,
  filter,
  dedupe,
  collect,
  build,

  logOutput,
  logDryRun,
};
