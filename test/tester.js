const compose = require('../lib/index');

const dependencies = {
  'fullpage-react': 'https://raw.githubusercontent.com/cmswalker/fullpage-react/master/package.json',
  'ddfullpage-react': 'https://raw.githubusercontent.com/cmswalker/fullpage-react/master/package.json',
  'scroll-swipe': 'https://raw.githubusercontent.com/cmswalker/scroll-swipe/master/package.json',
  'my-npm-profile': 'https://raw.githubusercontent.com/cmswalker/my-npm-profile/master/package.json',
};

// TEST GET
const get = () => Promise.resolve([
  {
    body: {
      dependencies: { react: '^1.2.8' },
      peerDependencies: { bar: '100' },
    },
  },
  {
    body: {
      dependencies: { foo: '111', react: '^1.2.4' },
      peerDependencies: { bar: '3' },
    },
  },
]);

const output = './composed2.json';
const blacklist = ['foo'];
const dryrun = false;

const types = { dependencies: true, devDependencies: false, peerDependencies: true };

// NOTE: take the latest by default

compose.build({
  dependencies, output, types, blacklist, dryrun,
})
  .then((data) => {
    console.log('data', data);
  }).catch(console.log);
