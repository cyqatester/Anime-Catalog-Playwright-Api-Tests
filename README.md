# Anime Catalog API Automation

Playwright + TypeScript API automation project for the Anime Catalog Spring Boot backend. The tests use Playwright's `APIRequestContext` and a Page Object Model-style resource layer: each API resource has its own class that owns its endpoints and request methods.

## Technologies

- TypeScript
- Playwright Test
- Node.js 22
- dotenv

## API coverage

The project is based on the controllers in the supplied Anime Catalog backend ZIP. The Swagger UI address is for documentation; the test `BASE_URL` must be the API server origin, for example `http://localhost:8080`.

| Resource | Endpoint | Methods represented |
|---|---|---|
| Profile | `/api/me` | GET |
| Profile password | `/api/me/password` | PUT |
| Profile username | `/api/me/username` | PUT |
| Anime | `/api/anime` | GET, POST, PUT `/{id}`, DELETE `/{id}` |
| Genres | `/api/genres` | GET, POST, PUT `/{id}`, DELETE `/{id}` |
| Admin users | `/api/admin/users` | GET, POST, PUT `/{id}`, DELETE `/{id}` |

All current controllers expect the `X-Username` request header. The default local administrator is `superadmin`, as created by the backend's `DataInitializer`.

## Project structure

```text
anime-catalog-api-tests/
├── src/
│   ├── api/
│   │   ├── admin-users.api.ts
│   │   ├── anime.api.ts
│   │   ├── base.api.ts
│   │   ├── genres.api.ts
│   │   └── profile.api.ts
│   ├── config/
│   │   └── environment.ts
│   ├── constants/
│   │   └── api-endpoints.ts
│   ├── fixtures/
│   │   └── api.fixture.ts
│   └── models/
│       └── api.models.ts
├── tests/
│   ├── admin-users.spec.ts
│   ├── anime.spec.ts
│   ├── genres.spec.ts
│   └── profile.spec.ts
├── .env.example
├── .env.dev.example
├── .env.qa.example
├── .env.prod.example
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
└── tsconfig.json
```

## Setup

Requirements: Node.js 22+ and npm. Start the Spring Boot API and PostgreSQL database before running tests.

```bash
npm install
```

Copy `.env.example` to `.env.dev` and set the local values:

```dotenv
BASE_URL=http://localhost:8080
API_ADMIN_USERNAME=superadmin
API_TIMEOUT=15000
```

The API root is `http://localhost:8080`, not `http://localhost:8080/swagger-ui/index.html`.

## Run tests

```bash
# Development
npm run test:dev

# QA
npm run test:qa

# Production (smoke tests only are recommended)
npm run test:prod

# TypeScript validation
npm run typecheck

# Open the HTML report
npm run report
```

For QA and production, create `.env.qa` and `.env.prod` locally with the corresponding API URL and administrator username. Do not commit real credentials or environment files.

## Page Object Model design

- `src/api/*` contains API resource objects, analogous to page objects in UI automation.
- `BaseApi` centralizes shared request headers and response helpers.
- `src/fixtures/api.fixture.ts` creates the authenticated request context and injects resource objects into tests.
- `src/models` contains request/response types.
- `src/constants` centralizes endpoint paths.
- `tests` contains scenarios and assertions; endpoint construction stays in the resource objects.

Example:

```ts
test('lists genres', async ({ genresApi }) => {
  const response = await genresApi.list();
  expect(response.status()).toBe(200);
});
```

## Notes and known limitations

1. The current backend archive exposes no `GET /api/anime/{id}` route. The `AnimeApi.getById()` helper therefore searches the collection rather than issuing a nonexistent endpoint.
2. `PUT /api/me/password` changes the account password, and `PUT /api/me/username` changes the current username. They are deliberately not executed in the default suite because they mutate the shared configured administrator and can break later runs.
3. The anime list endpoint has a nullable string filter query in the supplied backend. If the backend still returns PostgreSQL `lower(bytea)` for an unfiltered request, fix that backend query before expecting the anime list tests to pass.
4. CRUD tests create uniquely named temporary records and clean them up. Run the full CRUD suite against isolated DEV/QA data. If you test against production, run only `tests/prod-smoke.spec.ts`, which contains read-only checks; do not run CRUD mutation tests.
5. The current backend `DataInitializer` seeds `superadmin`; it does not guarantee any anime or genre records. The test suite creates its own genre where needed.

## Reports

Playwright writes HTML and JUnit reports under `playwright-report/` and `test-results/`. You can open the HTML report locally with `npm run report`.
