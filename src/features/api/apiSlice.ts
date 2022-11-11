import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { authApiSlice } from 'features/auth/authApiSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api/v1',
  credentials: 'include',
});

// TODO: log user out right after 403 (forbidden) status
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (
    typeof args !== 'string' &&
    args.url !== '/auth/login' &&
    result.error &&
    result.error.status === 401
  ) {
    // Send refresh token to get new access token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
    if (refreshResult.data) {
      // Retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Log user out
      api.dispatch(authApiSlice.endpoints.logout.initiate());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Post'],
  endpoints: builder => ({}),
});
