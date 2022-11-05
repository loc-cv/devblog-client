import { apiSlice } from 'features/api/apiSlice';
import { IUser } from './interfaces';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCurrentUser: builder.query<IUser, void>({
      query: () => ({
        url: '/users/me',
        method: 'GET',
      }),
      transformResponse: (result: { data: { user: IUser } }) =>
        result.data.user,
    }),
  }),
});

export const { useGetCurrentUserQuery } = usersApiSlice;
