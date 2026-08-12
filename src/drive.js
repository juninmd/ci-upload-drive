const fs = require('fs');
const { google } = require('googleapis');

const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive'];
const DRIVE_VERSION = 'v3';

function createAuth(config) {
  return new google.auth.JWT(
    config.clientEmail,
    null,
    config.privateKey,
    DRIVE_SCOPES
  );
}

function createDriveClient(auth) {
  return google.drive({ version: DRIVE_VERSION, auth });
}

async function uploadFile(drive, { name, folderId, pathFile, permissions }) {
  const file = fs.createReadStream(pathFile);
  const fileCreated = await drive.files.create({
    resource: { name, parents: [folderId] },
    // Let the Drive API infer the mimeType from the filename; a read stream
    // carries no reliable mimeType of its own.
    media: { body: file },
    fields: 'id',
  });

  for (const permission of permissions) {
    await drive.permissions.create({
      resource: permission,
      fileId: fileCreated.data.id,
      fields: 'id',
    });
  }

  return fileCreated.data.id;
}

module.exports = {
  DRIVE_SCOPES,
  DRIVE_VERSION,
  createAuth,
  createDriveClient,
  uploadFile,
};
