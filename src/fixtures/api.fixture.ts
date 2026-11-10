import { test as base, APIRequestContext } from '@playwright/test';
import { environment } from '../config/environment';
import { AnimeApi } from '../api/anime.api';
import { GenresApi } from '../api/genres.api';
import { AdminUsersApi } from '../api/admin-users.api';
import { ProfileApi } from '../api/profile.api';

type ApiFixtures = {
  adminRequest: APIRequestContext;
  animeApi: AnimeApi;
  genresApi: GenresApi;
  adminUsersApi: AdminUsersApi;
  profileApi: ProfileApi;
};

export const test = base.extend<ApiFixtures>({
  adminRequest: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: environment.baseURL,
      timeout: environment.timeout,
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Username': environment.adminUsername,
      },
    });
    await use(context);
    await context.dispose();
  },

  animeApi: async ({ adminRequest }, use) => {
    await use(new AnimeApi(adminRequest, environment.adminUsername));
  },

  genresApi: async ({ adminRequest }, use) => {
    await use(new GenresApi(adminRequest, environment.adminUsername));
  },

  adminUsersApi: async ({ adminRequest }, use) => {
    await use(new AdminUsersApi(adminRequest, environment.adminUsername));
  },

  profileApi: async ({ adminRequest }, use) => {
    await use(new ProfileApi(adminRequest, environment.adminUsername));
  },
});

export { expect } from '@playwright/test';
