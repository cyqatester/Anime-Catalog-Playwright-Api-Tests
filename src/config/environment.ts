export const environment = {
  name: process.env.TEST_ENV ?? 'dev',
  baseURL: process.env.BASE_URL ?? 'http://localhost:8080',
  adminUsername: process.env.API_ADMIN_USERNAME ?? 'superadmin',
  timeout: Number(process.env.API_TIMEOUT ?? 15_000),
};
