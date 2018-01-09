const littlefinger = require('../lib');

const CWD = process.cwd();

const dependencies = {
  eslint:
    'https://raw.githubusercontent.com/cmswalker/littlefinger/master/fixtures/remotes-eslint.json',
  functional:
    'https://raw.githubusercontent.com/cmswalker/littlefinger/master/fixtures/remotes-functional.json',
  http:
    'https://raw.githubusercontent.com/cmswalker/littlefinger/master/fixtures/remotes-http.json'
};

const awaitBuild = config => littlefinger.build({ ...config });

describe('littlefinger', () => {

  let types;
  let output;

  beforeEach(() => {
    types = { dependencies: true, devDependencies: true, peerDependencies: true };
    output = `${CWD}/__tests__/fixtures/remote-test.json`;
  });

  describe('happy path', () => {
    it('should work as described', async () => {
      await expect(awaitBuild({ output, dependencies, types })).resolves.toMatchSnapshot();
    });
  });

  describe('error path', () => {
    it('should require types', async () => {
      // TODO: assert actual error messages per step
      await expect(awaitBuild({ dependencies: {} })).rejects.toThrow();
    });
  });
});
