#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const scopes = ['https://www.googleapis.com/auth/drive'];

if(!process.env.CLIENT_EMAIL){
  throw new Error('Missing env: CLIENT_EMAIL');
}

if(!process.env.PRIVATE_KEY){
  throw new Error('Missing env: PRIVATE_KEY');
}

if(!process.env.FOLDER_ID){
  throw new Error('Missing env: FOLDER_ID');
}

const auth = new google.auth.JWT(
  process.env.CLIENT_EMAIL,
  null,
  process.env.PRIVATE_KEY,
  scopes
);

const drive = google.drive({ version: 'v3', auth });
const folderId = process.env.FOLDER_ID;

const pathFile = path.resolve(process.argv[2]);
if (!fs.existsSync(pathFile)) {
  console.error(`File not found: ${pathFile}`);
  return;
}

const pathPermissions = path.resolve(process.argv[3]);
if (!fs.existsSync(pathFile)) {
  console.error(`Permission not found: ${pathFile}`);
  return;
}

const permissions = fs.readFileSync(pathPermissions);

const name = path.basename(pathFile);
upload(name, pathFile);

async function upload(name, pathFile) {

  const fileMetadata = {
    name,
    parents: [folderId]
  };

  const file = fs.createReadStream(pathFile);

  try {
    const fileCreated = await drive.files.create({
      resource: fileMetadata,
      media: {
        mimeType: file.mimeType,
        body: file
      },
      fields: 'id'
    });

    for (const permission of permissions) {
      const files = await drive.permissions.create({
        resource: permission,
        fileId: fileCreated.data.id,
        fields: 'id',
      });
    }
  } catch (error) {
    console.log(error);
  }
}