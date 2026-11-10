import { APIRequestContext } from '@playwright/test';
import { API } from '../constants/api-endpoints';
import { Anime, AnimeInput } from '../models/api.models';
import { BaseApi } from './base.api';

export class AnimeApi extends BaseApi {
  constructor(request: APIRequestContext, actorUsername: string) {
    super(request, actorUsername);
  }

  async list(params: Record<string, string | number> = {}) {
    return this.request.get(API.anime, { headers: this.headers(), params });
  }

  async create(payload: AnimeInput) {
    // console.log('Endpoint:', API.anime);
    const response = await this.request.post(API.anime, {
      headers: this.headers(),
      data: payload,
    });
    // console.log('Status:', response.status());

    return response;
  }

  async getById(id: number) {
    // The current backend does not expose GET /api/anime/{id}.
    // Fetch the collection and find the requested record.
    const response = await this.list();
    if (!response.ok()) return response;
    const records = (await response.json()) as Anime[];
    return records.find((item) => item.id === id) ?? null;
  }

  async update(id: number, payload: AnimeInput) {
    return this.request.put(`${API.anime}/${id}`, {
      headers: this.headers(),
      data: payload,
    });
  }

  async delete(id: number) {
    return this.request.delete(`${API.anime}/${id}`, { headers: this.headers() });
  }
}
