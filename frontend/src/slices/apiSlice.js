import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL || '',
  prepareHeaders: (headers) => {
    try {
      const raw = localStorage.getItem('userInfo');
      const userInfo = raw ? JSON.parse(raw) : null;

      if (userInfo?.token) {
        headers.set('Authorization', `Bearer ${userInfo.token}`);
      }
    } catch (error) {
      console.warn('⚠️ Failed to parse userInfo from localStorage', error);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'User', 'Order', 'Cart'],
  endpoints: (builder) => ({}),
});
