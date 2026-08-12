const REQUIRED_ENV_VARS = ['CLIENT_EMAIL', 'PRIVATE_KEY', 'FOLDER_ID'];

// CI secrets arrive with escaped newlines (\\n), so restore real newlines
// before handing the key to the JWT client.
function normalizePrivateKey(privateKey) {
  return privateKey.toString().replace(/\\n/g, '\n');
}

function getConfig(env = process.env) {
  for (const key of REQUIRED_ENV_VARS) {
    if (!env[key]) {
      throw new Error(`Missing env: ${key}`);
    }
  }

  return {
    clientEmail: env.CLIENT_EMAIL,
    privateKey: normalizePrivateKey(env.PRIVATE_KEY),
    folderId: env.FOLDER_ID,
  };
}

module.exports = { REQUIRED_ENV_VARS, getConfig, normalizePrivateKey };
