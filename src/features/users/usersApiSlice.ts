import { createSelector } from '@reduxjs/toolkit';
import { apiSlice } from 'features/api/apiSlice';
import {
  IGenericResponse,
  IListResponse,
  IUser,
} from 'features/api/interfaces';
import { postsApiSlice } from 'features/posts/postsApiSlice';
import { UpdatePasswordFormInput } from './pages/settingsPages/PasswordSettingsPage';
import { UpdateUserFormInput } from './pages/settingsPages/ProfileSettingsPage';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    /* Query users */
    getUsers: builder.query<
      IListResponse<IUser>,
      { limit?: number; page?: number }
    >({
      query: args => {
        const { limit = 10, page = 1 } = args;
        return {
          url: '/users',
          method: 'GET',
          params: { limit, page },
        };
      },
      transformResponse: (result: {
        page: number;
        results: number;
        total: number;
        totalPages: number;
        data: { users: IUser[] };
      }) => ({
        page: result.page,
        results: result.results,
        total: result.total,
        totalPages: result.totalPages,
        data: result.data.users,
      }),
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Users' as const,
                id: _id,
              })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    /* Get info of current user */
    getCurrentUser: builder.query<IUser, void>({
      query: () => ({
        url: '/users/me',
        method: 'GET',
      }),
      transformResponse: (result: { data: { user: IUser } }) =>
        result.data.user,
    }),

    /* Get info of a single user */
    getSingleUser: builder.query<IUser, string>({
      // userInfo can be user id or username
      query: userInfo => ({
        url: `/users/profile/${userInfo}`,
        method: 'GET',
      }),
      transformResponse: (result: { data: { user: IUser } }) =>
        result.data.user,
    }),

    /* Add a post to current user saved list */
    addPostToSavedList: builder.mutation<IGenericResponse, string>({
      query: postId => ({
        url: '/users/me/savedposts',
        method: 'POST',
        body: { postId },
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
      async onQueryStarted(postId, { queryFulfilled, dispatch }) {
        const patchResult = dispatch(
          usersApiSlice.util.updateQueryData(
            'getCurrentUser',
            undefined,
            draft => {
              draft.savedPosts.push(postId);
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    /* Remove a post from current user saved list */
    removePostFromSavedList: builder.mutation<IGenericResponse, string>({
      query: postId => ({
        url: `/users/me/savedposts/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
      async onQueryStarted(postId, { queryFulfilled, dispatch, getState }) {
        const currentUserPatchResult = dispatch(
          usersApiSlice.util.updateQueryData(
            'getCurrentUser',
            undefined,
            draft => {
              draft.savedPosts = draft.savedPosts.filter(
                post => post !== postId,
              );
            },
          ),
        );
        const currentUser = selectCurrentUser(getState());
        const savedListPatchResult = dispatch(
          postsApiSlice.util.updateQueryData(
            'getPosts',
            { savedby: currentUser?.username },
            draft => ({
              ...draft,
              data: draft.data.filter(post => post._id !== postId),
            }),
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          currentUserPatchResult.undo();
          savedListPatchResult.undo();
        }
      },
    }),

    /* Update current user info */
    updateCurrentUser: builder.mutation<IGenericResponse, UpdateUserFormInput>({
      query: data => ({
        url: '/users/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
      async onQueryStarted(data, { queryFulfilled, dispatch }) {
        const patchResult = dispatch(
          usersApiSlice.util.updateQueryData(
            'getCurrentUser',
            undefined,
            draft => {
              return { ...draft, ...data };
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    /* Update current user password */
    updateCurrentUserPassword: builder.mutation<
      IGenericResponse,
      UpdatePasswordFormInput
    >({
      query: data => ({
        url: 'users/me/password',
        method: 'PUT',
        body: data,
      }),
    }),

    /* Ban user */
    toggleBanUser: builder.mutation<IGenericResponse, string>({
      query: userId => ({
        url: `users/${userId}/toggleban`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetCurrentUserQuery,
  useGetSingleUserQuery,
  useAddPostToSavedListMutation,
  useRemovePostFromSavedListMutation,
  useUpdateCurrentUserMutation,
  useUpdateCurrentUserPasswordMutation,
  useToggleBanUserMutation,
} = usersApiSlice;

const selectCurrentUserResult = usersApiSlice.endpoints.getCurrentUser.select();
export const selectCurrentUser = createSelector(
  selectCurrentUserResult,
  currentUserResult => currentUserResult?.data ?? null,
);
