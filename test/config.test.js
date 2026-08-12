const { getConfig, REQUIRED_ENV_VARS, normalizePrivateKey } = require('../src/config');

describe('getConfig', () => {
  afterEach(() => {
    delete process.env.CLIENT_EMAIL;
    delete process.env.PRIVATE_KEY;
    delete process.env.FOLDER_ID;
  });

  it('throws when CLIENT_EMAIL is missing', () => {
    expect(() => getConfig({})).toThrow('Missing env: CLIENT_EMAIL');
  });

  it('throws when PRIVATE_KEY is missing', () => {
    expect(() => getConfig({ CLIENT_EMAIL: 'a@b.com' })).toThrow(
      'Missing env: PRIVATE_KEY'
    );
  });

  it('throws when FOLDER_ID is missing', () => {
    expect(() =>
      getConfig({ CLIENT_EMAIL: 'a@b.com', PRIVATE_KEY: 'secret' })
    ).toThrow('Missing env: FOLDER_ID');
  });

  it('returns a normalized config when all env vars are present', () => {
    const config = getConfig({
      CLIENT_EMAIL: 'svc@example.com',
      PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\\nline\\n-----END PRIVATE KEY-----',
      FOLDER_ID: 'folder-123',
    });

    expect(config).toEqual({
      clientEmail: 'svc@example.com',
      privateKey: '-----BEGIN PRIVATE KEY-----\nline\n-----END PRIVATE KEY-----',
      folderId: 'folder-123',
    });
  });

  it('reads from process.env by default', () => {
    process.env.CLIENT_EMAIL = 'svc@example.com';
    process.env.PRIVATE_KEY = 'secret';
    process.env.FOLDER_ID = 'folder-123';

    expect(getConfig()).toEqual({
      clientEmail: 'svc@example.com',
      privateKey: 'secret',
      folderId: 'folder-123',
    });
  });

  it('lists every required env var', () => {
    expect(REQUIRED_ENV_VARS).toEqual(['CLIENT_EMAIL', 'PRIVATE_KEY', 'FOLDER_ID']);
  });
});

describe('normalizePrivateKey', () => {
  it('converts escaped newlines into real newlines', () => {
    expect(normalizePrivateKey('a\\nb\\nc')).toBe('a\nb\nc');
  });

  it('stringifies non-string values', () => {
    expect(normalizePrivateKey(Buffer.from('abc'))).toBe('abc');
  });
});
