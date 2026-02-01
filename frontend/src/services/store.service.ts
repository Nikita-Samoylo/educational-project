import { api } from '../api/axios';

export const StoreService = {
  async create(data: { name: string; location: string }) {
    return api.post('/stores', data);
  },
};