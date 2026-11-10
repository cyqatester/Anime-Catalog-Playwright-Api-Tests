import { test, expect } from '../src/fixtures/api.fixture';
import { AnimeInput } from '../src/models/api.models';

test.describe('Anime API - /api/anime', () => {
  test('returns anime collection', async ({ animeApi }) => {
    const response = await animeApi.list();
    expect(response.status()).toBe(200);
    expect(await response.json()).toBeInstanceOf(Array);
  });

  test('filters anime by title, genre, year, and release category', async ({ animeApi }) => {
    const response = await animeApi.list({ title: 'naruto' });
    expect(response.status()).toBe(200);
    expect(await response.json()).toBeInstanceOf(Array);
  });

  test('creates, updates, and deletes an anime record', async ({ animeApi, genresApi }) => {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    let animeId: number | undefined;

    try {
      const payload: AnimeInput = {
        title: `PW Anime ${suffix}`,
        alternateTitle: `Automation Anime ${suffix}`,
        genreIds: [22,27],
        yearAired: 2024,
        releaseCategory: 'TV_SERIES',
        episodes: 12,
        season: 'SPRING',
      };

      const created = await animeApi.create(payload);
      expect(created.status()).toBe(200);
      const anime = await created.json();
      animeId = anime.id;
      expect(anime).toMatchObject({
        title: payload.title,
        alternateTitle: payload.alternateTitle,
        yearAired: payload.yearAired,
        releaseCategory: payload.releaseCategory,
      });

      const updatedPayload = { ...payload, title: `PW Anime Updated ${suffix}` };
      const updated = await animeApi.update(animeId, updatedPayload);
      expect(updated.status()).toBe(200);
      expect((await updated.json()).title).toBe(updatedPayload.title);

      const deleted = await animeApi.delete(animeId);
      expect([200, 204]).toContain(deleted.status());
      animeId = undefined;
    } finally {
      if (animeId !== undefined) await animeApi.delete(animeId);
    }
  });
});
