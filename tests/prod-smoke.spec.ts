import { test, expect } from '../src/fixtures/api.fixture';
import { environment } from '../src/config/environment';

test('PROD smoke: authenticated profile endpoint responds', async ({ profileApi }) => {
  const response = await profileApi.getProfile();
  expect(response.status()).toBe(200);
  const profile = await response.json();
  expect(profile.username).toBe(environment.adminUsername);
});

test('PROD smoke: genres endpoint responds with a collection', async ({ genresApi }) => {
  const response = await genresApi.list();
  expect(response.status()).toBe(200);
  expect(await response.json()).toBeInstanceOf(Array);
});
