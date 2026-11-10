import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'node:path';

const environment = process.env.TEST_ENV ?? 'dev';
if (!['dev', 'qa', 'prod'].includes(environment)) {
  throw new Error(`Unsupported TEST_ENV "${environment}". Use dev, qa, or prod.`);
}

// Environment variables already supplied by CI take precedence over local env files.
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${environment}`),
  override: false,
});
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: false });

const baseURL = process.env.BASE_URL ?? 'http://localhost:8080';
const timeout = Number(process.env.API_TIMEOUT ?? 15_000);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: `playwright-report/${environment}`, open: 'never' }],
    ['junit', { outputFile: `test-results/${environment}-junit.xml` }],
  ],
  use: {
    baseURL,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ignoreHTTPSErrors: environment !== 'prod',
    trace: 'retain-on-failure',
  },
  metadata: { environment, apiBaseURL: baseURL },
  projects: [
    {
      name: `api-${environment}`,
      testMatch: '**/*.spec.ts',
      use: { },
    },
  ],
  outputDir: `test-results/${environment}`,
});
