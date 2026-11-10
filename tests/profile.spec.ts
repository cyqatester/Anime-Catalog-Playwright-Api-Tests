import { test, expect } from '../src/fixtures/api.fixture';
import { environment } from '../src/config/environment';

test.describe('GET /api/me', () => {
  test('returns the authenticated administrator profile', async ({ profileApi }) => {
    const response = await profileApi.getProfile();
    expect(response.status()).toBe(200);

    const profile = await response.json();
    expect(profile).toMatchObject({
      username: environment.adminUsername,
      role: 'ADMIN',
    });
    expect(profile.name).toBeTruthy();
  });

  test('rejects an unknown username', async ({ adminRequest }) => {
    const response = await adminRequest.get('/api/me', {
      headers: { 'X-Username': `unknown-${Date.now()}` },
    });
    expect(response.status()).toBe(401);
  });
});
