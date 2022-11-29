import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { authApiSlice } from 'features/auth/authApiSlice';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

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
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (
    typeof args !== 'string' &&
    args.url !== '/auth/login' &&
    result.error &&
    result.error.status === 401
  ) {
    // Checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        // Send refresh token to get new access token
        const refreshResult = await baseQuery(
          '/auth/refresh',
          api,
          extraOptions,
        );
        if (refreshResult.data) {
          // Retry original query with new access token
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Log user out
          api.dispatch(authApiSlice.endpoints.logout.initiate());
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Posts', 'Tags', 'Users', 'Reports'],
  endpoints: builder => ({}),
});
