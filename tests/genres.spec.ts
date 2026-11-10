import { test, expect } from '../src/fixtures/api.fixture';

test.describe('Genres API - /api/genres', () => {
  test('lists genres', async ({ genresApi }) => {
    const response = await genresApi.list();
    expect(response.status()).toBe(200);
    expect(await response.json()).toBeInstanceOf(Array);
  });

  test('searches, creates, updates, and deletes a genre', async ({ genresApi }) => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const originalName = `PW Genre ${suffix}`;
    const updatedName = `PW Genre Updated ${suffix}`;
    let genreId: number | undefined;

    try {
      const created = await genresApi.create(originalName);
      expect(created.status()).toBe(200);
      const genre = await created.json();
      genreId = genre.id;
      expect(genre.name).toBe(originalName);

      const searched = await genresApi.list(originalName);
      expect(searched.status()).toBe(200);
      expect((await searched.json()).some((item: { id: number }) => item.id === genreId)).toBe(true);

      const updated = await genresApi.update(genreId, updatedName);
      expect(updated.status()).toBe(200);
      expect((await updated.json()).name).toBe(updatedName);

      const deleted = await genresApi.delete(genreId);
      expect([200, 204]).toContain(deleted.status());
      genreId = undefined;
    } finally {
      if (genreId !== undefined) await genresApi.delete(genreId);
    }
  });

  test('requires administrator privileges to create a genre', async ({ adminRequest }) => {
    const response = await adminRequest.post('/api/genres', {
      headers: { 'X-Username': `unknown-${Date.now()}` },
      data: { name: `Should Not Exist ${Date.now()}` },
    });
    expect(response.status()).toBe(401);
  });
});
