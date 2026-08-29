const SecurityUtil = require('../../src/core/SecurityUtil');
const { ROLES, ROLE_PERMISSIONS } = require('../../src/config/roles.config');

describe('Auth & Security Suite', () => {
  it('should securely hash password with bcrypt', async () => {
    const hash = await SecurityUtil.hashPassword('Secret123!');
    expect(typeof hash).toBe('string');
    expect(hash.length > 20).toBeTruthy();
  });

  it('should verify correct password match', async () => {
    const hash = await SecurityUtil.hashPassword('CorrectPass@2026');
    const isMatch = await SecurityUtil.comparePassword('CorrectPass@2026', hash);
    expect(isMatch).toBe(true);
  });

  it('should generate and verify valid JWT token payload', () => {
    const payload = { userId: 'usr_test_01', role: ROLES.SUPER_ADMIN };
    const token = SecurityUtil.generateJwtToken(payload);
    const decoded = SecurityUtil.verifyJwtToken(token);
    expect(decoded.userId).toBe('usr_test_01');
    expect(decoded.role).toBe(ROLES.SUPER_ADMIN);
  });

  it('should have all permissions mapped for SUPER_ADMIN role', () => {
    const perms = ROLE_PERMISSIONS[ROLES.SUPER_ADMIN];
    expect(perms.length > 10).toBeTruthy();
  });
});
