const fs = require('fs');
const os = require('os');
const path = require('path');
const { google } = require('googleapis');
const {
  DRIVE_SCOPES,
  DRIVE_VERSION,
  createAuth,
  createDriveClient,
  uploadFile,
} = require('../src/drive');

jest.mock('googleapis', () => ({
  google: {
    auth: { JWT: jest.fn() },
    drive: jest.fn(),
  },
}));

describe('createAuth', () => {
  it('creates a JWT with the configured credentials and Drive scopes', () => {
    const config = { clientEmail: 'svc@example.com', privateKey: 'key', folderId: 'f1' };

    createAuth(config);

    expect(google.auth.JWT).toHaveBeenCalledWith(
      'svc@example.com',
      null,
      'key',
      DRIVE_SCOPES
    );
  });
});

describe('createDriveClient', () => {
  it('creates a Drive v3 client bound to the auth', () => {
    const auth = { clientEmail: 'svc@example.com' };

    createDriveClient(auth);

    expect(google.drive).toHaveBeenCalledWith({ version: DRIVE_VERSION, auth });
  });
});

describe('uploadFile', () => {
  let tmpDir;
  let filePath;
  const drive = {
    files: { create: jest.fn() },
    permissions: { create: jest.fn() },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'upload-drive-'));
    filePath = path.join(tmpDir, 'report.pdf');
    fs.writeFileSync(filePath, 'fake pdf content');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('uploads the file and applies every permission', async () => {
    drive.files.create.mockResolvedValue({ data: { id: 'FILE_ID' } });
    drive.permissions.create.mockResolvedValue({ data: { id: 'PERM_ID' } });
    const permissions = [
      { type: 'anyone', role: 'reader' },
      { type: 'user', role: 'writer', emailAddress: 'x@y.z' },
    ];

    const id = await uploadFile(drive, {
      name: 'report.pdf',
      folderId: 'FOLDER_ID',
      pathFile: filePath,
      permissions,
    });

    expect(id).toBe('FILE_ID');
    expect(drive.files.create).toHaveBeenCalledWith({
      resource: { name: 'report.pdf', parents: ['FOLDER_ID'] },
      media: { body: expect.any(fs.ReadStream) },
      fields: 'id',
    });
    expect(drive.permissions.create).toHaveBeenCalledTimes(permissions.length);
    expect(drive.permissions.create).toHaveBeenNthCalledWith(1, {
      resource: permissions[0],
      fileId: 'FILE_ID',
      fields: 'id',
    });
    expect(drive.permissions.create).toHaveBeenNthCalledWith(2, {
      resource: permissions[1],
      fileId: 'FILE_ID',
      fields: 'id',
    });
  });

  it('propagates upload failures', async () => {
    drive.files.create.mockRejectedValue(new Error('quota exceeded'));

    await expect(
      uploadFile(drive, { name: 'x', folderId: 'F', pathFile: filePath, permissions: [] })
    ).rejects.toThrow('quota exceeded');
    expect(drive.permissions.create).not.toHaveBeenCalled();
  });

  it('propagates permission failures', async () => {
    drive.files.create.mockResolvedValue({ data: { id: 'FILE_ID' } });
    drive.permissions.create.mockRejectedValue(new Error('forbidden'));

    await expect(
      uploadFile(drive, { name: 'x', folderId: 'F', pathFile: filePath, permissions: [{}] })
    ).rejects.toThrow('forbidden');
  });
});
