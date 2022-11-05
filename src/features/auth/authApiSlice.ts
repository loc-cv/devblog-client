import { apiSlice } from 'features/api/apiSlice';
import { IGenericResponse } from 'features/api/interfaces';
import { usersApiSlice } from 'features/users/usersApiSlice';
import { LoginFormInput } from './pages/LoginPage';
import { RegisterFormInput } from './pages/RegisterPage';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    register: builder.mutation<IGenericResponse, RegisterFormInput>({
      query: data => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          await dispatch(usersApiSlice.endpoints.getCurrentUser.initiate());
        } catch (error) {
          console.log(error);
        }
      },
    }),

    login: builder.mutation<IGenericResponse, LoginFormInput>({
      query: data => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          await dispatch(usersApiSlice.endpoints.getCurrentUser.initiate());
        } catch (error) {
          console.log(error);
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 0);
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
  authApiSlice;
