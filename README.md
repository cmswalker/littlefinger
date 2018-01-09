# littlefinger :point_up:

Extend and compose package.json by pointing at multiple remotes

`npm i littlefinger`

on [NPM](https://www.npmjs.com/package/littlefinger)

## tldr;

Create this

```json
{
  "dependencies": {
    "ramda": "^0.25.0",
    "superagent": "^3.8.2"
  },
  "devDependencies": {
    "eslint": "^4.15.0",
    "eslint-config-airbnb-base": "^12.1.0",
    "eslint-plugin-import": "^2.8.0"
  }
}
```

From [these](https://github.com/cmswalker/littlefinger/tree/master/fixtures)

With this setup

```js
const littlefinger = require('littlefinger');

const dependencies = {
  eslint:
    'https://raw.githubusercontent.com/cmswalker/littlefinger/master/fixtures/remotes-eslint.json',
  functional:
    'https://raw.githubusercontent.com/cmswalker/littlefinger/master/fixtures/remotes-functional.json',
  http:
    'https://raw.githubusercontent.com/cmswalker/littlefinger/master/fixtures/remotes-http.json',
};

const output = './simple.package.json';

// The types of dependencies you wish to gather
const types = { dependencies: true, devDependencies: true, peerDependencies: false };

littlefinger.build({
  dependencies, output, types,
}).catch(console.log);
```

### Usage

[Examples](https://github.com/cmswalker/littlefinger/tree/master/examples)

```js
const littlefinger = require('littlefinger');

// Lets create a package.json that combines dependencies from these 3 remote urls
// NOTE: you can view them here https://github.com/cmswalker/littlefinger/tree/master/fixtures

const dependencies = {
  eslint:
    'https://raw.githubusercontent.com/cmswalker/littlefinger/master/fixtures/remotes-eslint.json',
  functional:
    'https://raw.githubusercontent.com/cmswalker/littlefinger/master/fixtures/remotes-functional.json',
  http:
    'https://raw.githubusercontent.com/cmswalker/littlefinger/master/fixtures/remotes-http.json',
};

const output = './simple.package.json';

// Choose to ignore packages found in dependencies
const blacklist = ['eslint-plugin-import'];

// Enables logging to console instead of writing to filesystem
const dryrun = false;

// The types of dependencies you wish to gather
const types = { dependencies: true, devDependencies: true, peerDependencies: false };

// NOTE: littlefinger takes the latest package version by default if duplicates are found

littlefinger.build({
  dependencies, output, types, blacklist, dryrun,
}).catch(console.log);

// The result can be found @ https://github.com/cmswalker/littlefinger/blob/master/examples/simple.package.json
```