const littlefinger = require('../lib');

const CWD = process.cwd();
const remoteFixture = 'https://raw.githubusercontent.com/cmswalker/littlefinger/master/fixtures/remotes.json';

const awaitBuild = config => littlefinger.build({ ...config });

describe('littlefinger', () => {

  let types;
  let dependencies;
  let output;

  beforeEach(() => {
    types = { dependencies: true, devDependencies: true, peerDependencies: true };
    dependencies = {
      'remote-fixture': remoteFixture,
    };
    output = `${CWD}/__tests__/fixtures/remote-test.json`;
  });

  describe('happy path', () => {
    it('should work as described', async () => {
      await expect(awaitBuild({ output, dependencies, types })).resolves.toMatchSnapshot();
    });
  });

  describe('error path', () => {
    it('should require types', async () => {
      // TODO: assert actual error messages
      await expect(awaitBuild({ dependencies: {} })).rejects.toThrow();
    });
  });
});
