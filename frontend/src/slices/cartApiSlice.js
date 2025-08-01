import { apiSlice } from './apiSlice';

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => '/api/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: '/api/cart',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart'], // 🚀 triggers refetch automatically
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/api/cart/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
} = cartApiSlice;
