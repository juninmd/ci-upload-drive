const fs = require('fs');
const os = require('os');
const path = require('path');
const drive = require('../src/drive');
const { main } = require('../index');

jest.mock('../src/drive', () => ({
  createAuth: jest.fn(() => ({})),
  createDriveClient: jest.fn(() => ({})),
  uploadFile: jest.fn(),
}));

const VALID_ENV = {
  CLIENT_EMAIL: 'svc@example.com',
  PRIVATE_KEY: 'secret',
  FOLDER_ID: 'FOLDER_ID',
};

function makeFiles(content = JSON.stringify([{ type: 'anyone', role: 'reader' }])) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ci-upload-'));
  const filePath = path.join(dir, 'artifact.zip');
  const permsPath = path.join(dir, 'permissions.json');
  fs.writeFileSync(filePath, 'artifact data');
  fs.writeFileSync(permsPath, content);
  return { dir, filePath, permsPath };
}

function cleanUp(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe('main', () => {
  let output;

  beforeEach(() => {
    jest.clearAllMocks();
    output = { error: jest.fn(), info: jest.fn(), log: jest.fn() };
  });

  it('throws when required env vars are missing', () => {
    expect(() => main(['node', 'index.js', 'a', 'b'], {}, output)).toThrow(
      'Missing env: CLIENT_EMAIL'
    );
  });

  it('reports a missing file without uploading', async () => {
    const { dir, permsPath } = makeFiles();

    await main(['node', 'index.js', path.join(dir, 'nope.bin'), permsPath], VALID_ENV, output);

    expect(output.error).toHaveBeenCalledWith(
      expect.stringContaining('File not found:')
    );
    expect(drive.uploadFile).not.toHaveBeenCalled();
    cleanUp(dir);
  });

  it('reports a missing permissions file without uploading', async () => {
    const { dir, filePath } = makeFiles();

    await main(['node', 'index.js', filePath, path.join(dir, 'nope.json')], VALID_ENV, output);

    expect(output.error).toHaveBeenCalledWith(
      expect.stringContaining('Permission not found:')
    );
    expect(drive.uploadFile).not.toHaveBeenCalled();
    cleanUp(dir);
  });

  it('throws when the permissions file is not valid JSON', async () => {
    const { dir, filePath, permsPath } = makeFiles('not json');

    expect(() =>
      main(['node', 'index.js', filePath, permsPath], VALID_ENV, output)
    ).toThrow();
    cleanUp(dir);
  });

  it('uploads the file and reports success', async () => {
    const { dir, filePath, permsPath } = makeFiles();
    drive.uploadFile.mockResolvedValue('FILE_ID');

    await main(['node', 'index.js', filePath, permsPath], VALID_ENV, output);

    expect(drive.createAuth).toHaveBeenCalledTimes(1);
    expect(drive.createDriveClient).toHaveBeenCalledTimes(1);
    expect(drive.uploadFile).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'artifact.zip',
        folderId: 'FOLDER_ID',
        pathFile: filePath,
        permissions: [{ type: 'anyone', role: 'reader' }],
      })
    );
    expect(output.info).toHaveBeenCalledWith(
      'Google Drive file uploaded with success'
    );
    expect(output.log).not.toHaveBeenCalled();
    cleanUp(dir);
  });

  it('logs upload failures without reporting success', async () => {
    const { dir, filePath, permsPath } = makeFiles();
    drive.uploadFile.mockRejectedValue(new Error('boom'));

    await main(['node', 'index.js', filePath, permsPath], VALID_ENV, output);

    expect(output.log).toHaveBeenCalledWith('boom');
    expect(output.info).not.toHaveBeenCalled();
    cleanUp(dir);
  });
});
