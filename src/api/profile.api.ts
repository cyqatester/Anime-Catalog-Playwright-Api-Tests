import { APIRequestContext } from '@playwright/test';
import { API } from '../constants/api-endpoints';
import { BaseApi } from './base.api';

export class ProfileApi extends BaseApi {
  constructor(request: APIRequestContext, actorUsername: string) {
    super(request, actorUsername);
  }

  async getProfile() {
    return this.request.get(API.me, { headers: this.headers() });
  }

  async changePassword(newPassword: string) {
    return this.request.put(API.mePassword, {
      headers: this.headers(),
      data: { newPassword },
    });
  }

  async changeUsername(username: string) {
    return this.request.put(API.meUsername, {
      headers: this.headers(),
      data: { username },
    });
  }
}
