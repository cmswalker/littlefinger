
const compose = require('../lib');

const dependencies = {
  eslint:
    'https://raw.githubusercontent.com/cmswalker/littlefinger/master/fixtures/remotes-eslint.json',
  functional:
    'https://raw.githubusercontent.com/cmswalker/littlefinger/master/fixtures/remotes-functional.json',
  http:
    'https://raw.githubusercontent.com/cmswalker/littlefinger/master/fixtures/remotes-http.json',
};

const output = `${process.cwd()}/examples/simple.package.json`;

// Choose to ignore packages found in dependencies
const blacklist = ['eslint-plugin-import'];

// Enables logging to console instead of writing to filesystem
const dryrun = false;

// The types of dependencies you wish to gather
const types = { dependencies: true, devDependencies: true, peerDependencies: false };

// NOTE: littlefinger takes the latest package version by default

compose.build({
  dependencies, output, types, blacklist, dryrun,
}).catch(console.log); // eslint-disable-line
