const R = require('ramda');

const {
  collect, parse, filter, dedupe, get, build, logDryRun, logOutput, DEPENDENCY_TYPES, errorMessages
} = require('./utils');

const errorFactory = msg => Promise.reject(new Error(`::package-json-compose::Error:: ${msg}`));

class Littlefinger {
  build({
    dependencies, output, types = {}, blacklist = [], indentation = 2, dryrun = false,
  }) {
    if (R.isEmpty(dependencies)) {
      return errorFactory(errorMessages.noDependencies);
    }

    if (!R.type(output) === 'String') {
      return errorFactory(errorMessages.noOutput);
    }

    if (R.isEmpty(types) || R.isEmpty(R.pick(Array.from(DEPENDENCY_TYPES), types))) {
      return errorFactory(errorMessages.noDependencyTypes);
    }

    this.dependencies = dependencies;
    this.output = output;
    this.indentation = indentation;
    this.blacklist = blacklist;
    this.dryrun = dryrun;

    const mappedDependencies = collect(this.dependencies);

    if (R.isEmpty(mappedDependencies)) {
      return errorFactory(errorMessages.noDependencies);
    }

    return get(mappedDependencies)
      .then((deps) => {
        const parsedDependencies = parse(deps);
        const filteredDependencies = filter(blacklist, parsedDependencies);
        const dedupedDependencies = dedupe(types, filteredDependencies);

        if (this.dryrun) {
          return logDryRun(this.indentation, dedupedDependencies);
        }

        logOutput(this.indentation, dedupedDependencies);
        return build(this.output, this.indentation, dedupedDependencies);
      });
  }
}

const littlefinger = new Littlefinger();
module.exports = littlefinger;
