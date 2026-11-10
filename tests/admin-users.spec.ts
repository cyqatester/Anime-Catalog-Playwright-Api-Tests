import { test, expect } from '../src/fixtures/api.fixture';
import { environment } from '../src/config/environment';
import { UserInput } from '../src/models/api.models';

test.describe('Admin users API - /api/admin/users', () => {
  test('lists administrator-managed users', async ({ adminUsersApi }) => {
    const response = await adminUsersApi.list();
    expect(response.status()).toBe(200);
    const users = await response.json();
    expect(users).toBeInstanceOf(Array);
    expect(users.some((user: { username: string }) => user.username === environment.adminUsername)).toBe(true);
  });

  test('creates, searches, updates, and deletes a user', async ({ adminUsersApi }) => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const username = `pw-user-${suffix}`;
    let userId: number | undefined;

    try {
      const payload: UserInput = {
        name: `Playwright User ${suffix}`,
        username,
        password: 'Temporary-Password-123!',
        role: 'STANDARD',
      };

      const created = await adminUsersApi.create(payload);
      expect(created.status()).toBe(200);
      const user = await created.json();
      userId = user.id;
      expect(user).toMatchObject({ name: payload.name, username, role: 'STANDARD', superAdmin: false });

      const searched = await adminUsersApi.list(username);
      expect(searched.status()).toBe(200);
      expect((await searched.json()).some((item: { id: number }) => item.id === userId)).toBe(true);

      const updatedPayload = { ...payload, name: `Updated ${payload.name}` };
      const updated = await adminUsersApi.update(userId, updatedPayload);
      expect(updated.status()).toBe(200);
      expect((await updated.json()).name).toBe(updatedPayload.name);

      const deleted = await adminUsersApi.delete(userId);
      expect([200, 204]).toContain(deleted.status());
      userId = undefined;
    } finally {
      if (userId !== undefined) await adminUsersApi.delete(userId);
    }
  });

  test('does not allow deleting the protected superadmin', async ({ adminUsersApi }) => {
    const listResponse = await adminUsersApi.list(environment.adminUsername);
    expect(listResponse.status()).toBe(200);
    const users = await listResponse.json();
    const superAdmin = users.find((user: { username: string; superAdmin: boolean }) =>
      user.username === environment.adminUsername && user.superAdmin,
    );

    test.skip(!superAdmin, 'The configured administrator is not marked as protected superadmin.');
    const response = await adminUsersApi.delete(superAdmin.id);
    expect(response.status()).toBe(403);
  });
});
