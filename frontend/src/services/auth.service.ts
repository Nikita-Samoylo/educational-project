import { api } from '../api/axios';

export const AuthService = {
  async register(data: { email: string; password: string; name: string; position: string }) {
    return api.post('/auth/register', data);
  },

  async login(data: { email: string; password: string }) {
    return api.post('/auth/login', data);
  },

  async logout() {
    return api.post('/auth/logout');
  },
};