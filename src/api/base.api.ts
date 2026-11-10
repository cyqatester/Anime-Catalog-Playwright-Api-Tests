import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export class BaseApi {
  constructor(
    protected readonly request: APIRequestContext,
    protected readonly actorUsername: string,
  ) {}

  protected headers(username = this.actorUsername): Record<string, string> {
    return { 'X-Username': username };
  }

  protected async expectStatus(response: APIResponse, status: number): Promise<void> {
    expect(
      response.status(),
      `Expected HTTP ${status}, received ${response.status()}: ${await response.text()}`,
    ).toBe(status);
  }

  protected async json<T>(response: APIResponse): Promise<T> {
    return (await response.json()) as T;
  }
}
