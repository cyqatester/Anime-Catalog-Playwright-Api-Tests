import { APIRequestContext } from '@playwright/test';
import { API } from '../constants/api-endpoints';
import { UserInput } from '../models/api.models';
import { BaseApi } from './base.api';

export class AdminUsersApi extends BaseApi {
  constructor(request: APIRequestContext, actorUsername: string) {
    super(request, actorUsername);
  }

  async list(search?: string) {
    return this.request.get(API.adminUsers, {
      headers: this.headers(),
      params: search ? { search } : {},
    });
  }

  async create(payload: UserInput) {
    return this.request.post(API.adminUsers, { headers: this.headers(), data: payload });
  }

  async update(id: number, payload: UserInput) {
    return this.request.put(`${API.adminUsers}/${id}`, {
      headers: this.headers(),
      data: payload,
    });
  }

  async delete(id: number) {
    return this.request.delete(`${API.adminUsers}/${id}`, { headers: this.headers() });
  }
}
