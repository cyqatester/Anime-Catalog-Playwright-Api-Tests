import { APIRequestContext } from '@playwright/test';
import { API } from '../constants/api-endpoints';
import { Genre } from '../models/api.models';
import { BaseApi } from './base.api';

export class GenresApi extends BaseApi {
  constructor(request: APIRequestContext, actorUsername: string) {
    super(request, actorUsername);
  }

  async list(search?: string) {
    return this.request.get(API.genres, {
      headers: this.headers(),
      params: search ? { search } : {},
    });
  }

  async create(name: string) {
    return this.request.post(API.genres, {
      headers: this.headers(),
      data: { name },
    });
  }

  async update(id: number, name: string) {
    return this.request.put(`${API.genres}/${id}`, {
      headers: this.headers(),
      data: { name },
    });
  }

  async delete(id: number) {
    return this.request.delete(`${API.genres}/${id}`, { headers: this.headers() });
  }
}
