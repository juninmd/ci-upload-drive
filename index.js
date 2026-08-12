#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { getConfig } = require('./src/config');
const { createAuth, createDriveClient, uploadFile } = require('./src/drive');

function resolvePath(filePath) {
  return path.resolve(filePath);
}

function main(argv = process.argv, env = process.env, output = console) {
  const config = getConfig(env);

  const pathFile = resolvePath(argv[2]);
  if (!fs.existsSync(pathFile)) {
    output.error(`File not found: ${pathFile}`);
    return Promise.resolve();
  }

  const pathPermissions = resolvePath(argv[3]);
  if (!fs.existsSync(pathPermissions)) {
    output.error(`Permission not found: ${pathFile}`);
    return Promise.resolve();
  }

  const permissions = JSON.parse(fs.readFileSync(pathPermissions).toString());
  const auth = createAuth(config);
  const drive = createDriveClient(auth);
  const name = path.basename(pathFile);

  return uploadFile(drive, {
    name,
    folderId: config.folderId,
    pathFile,
    permissions,
  })
    .then(() => output.info('Google Drive file uploaded with success'))
    .catch((error) => output.log(error.toString()));
}

if (require.main === module) {
  main();
}

module.exports = { main };
