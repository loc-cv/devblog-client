import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { apiSlice } from 'features/api/apiSlice';
import {
  IGenericResponse,
  IListResponse,
  IPost,
} from 'features/api/interfaces';
import { selectCurrentUser } from 'features/users/usersApiSlice';
import { PostInput } from './components/PostForm';

dayjs.extend(calendar);

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    /* Query posts */
    getPosts: builder.query<
      IListResponse<IPost>,
      { limit?: number; page?: number; author?: string; savedby?: string }
    >({
      query: args => {
        const { limit = 5, page = 1, author = '', savedby = '' } = args;
        return {
          url: '/posts',
          method: 'GET',
          params: { limit, page, author, savedby },
        };
      },
      transformResponse: (result: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
        data: { posts: IPost[] };
      }) => ({
        page: result.page,
        perPage: result.perPage,
        total: result.total,
        totalPages: result.totalPages,
        data: result.data.posts
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )
          .map(post => ({
            ...post,
            updatedAt: dayjs(post.updatedAt).calendar(null, {
              sameDay: '[Today at] h:mm A', // The same day ( Today at 2:30 AM )
              nextDay: '[Tomorrow]', // The next day ( Tomorrow at 2:30 AM )
              nextWeek: 'dddd', // The next week ( Sunday at 2:30 AM )
              lastDay: '[Yesterday]', // The day before ( Yesterday at 2:30 AM )
              lastWeek: '[Last] dddd', // Last week ( Last Monday at 2:30 AM )
              sameElse: 'DD/MM/YYYY', // Everything else ( 7/10/2011 )
            }),
          })),
      }),
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id: _id }) => ({
                type: 'Posts' as const,
                id: _id,
              })),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),

    /* Query single post */
    getSinglePost: builder.query<IPost, string>({
      query: id => `/posts/${id}`,
      providesTags: (_result, _error, arg) => [{ type: 'Posts', id: arg }],
      transformResponse: (result: { data: { post: IPost } }) =>
        result.data.post,
    }),

    /* Create a new post */
    createNewPost: builder.mutation<IGenericResponse, PostInput>({
      query: data => ({
        url: '/posts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),

    /* Update a post */
    updatePost: builder.mutation<
      IGenericResponse,
      { id: string; data: PostInput }
    >({
      query: arg => ({
        url: `/posts/${arg.id}`,
        method: 'PATCH',
        body: arg.data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Posts', id: arg.id },
        { type: 'Posts', id: 'LIST' },
      ],
    }),

    /* Toggle like a post */
    toggleLikePost: builder.mutation<IGenericResponse, string>({
      query: postId => ({
        url: `/posts/${postId}/toggle-like`,
        method: 'PUT',
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled, getState }) {
        const currentUser = selectCurrentUser(getState());
        const patchResult = dispatch(
          postsApiSlice.util.updateQueryData('getSinglePost', postId, draft => {
            if (currentUser) {
              const isAlreadyLiked = draft.likes.includes(currentUser._id);
              if (isAlreadyLiked) {
                draft.likes = draft.likes.filter(
                  userId => userId !== currentUser._id,
                );
              } else {
                draft.likes.push(currentUser._id);
                draft.dislikes = draft.dislikes.filter(
                  userId => userId !== currentUser._id,
                );
              }
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    /* Toggle dislike a post */
    toggleDislikePost: builder.mutation<IGenericResponse, string>({
      query: postId => ({
        url: `/posts/${postId}/toggle-dislike`,
        method: 'PUT',
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled, getState }) {
        const currentUser = selectCurrentUser(getState());
        const patchResult = dispatch(
          postsApiSlice.util.updateQueryData('getSinglePost', postId, draft => {
            if (currentUser) {
              const isAlreadyDisliked = draft.dislikes.includes(
                currentUser._id,
              );
              if (isAlreadyDisliked) {
                draft.dislikes = draft.dislikes.filter(
                  userId => userId !== currentUser._id,
                );
              } else {
                draft.dislikes.push(currentUser._id);
                draft.likes = draft.likes.filter(
                  userId => userId !== currentUser._id,
                );
              }
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    /* Delete a post */
    deletePost: builder.mutation<IGenericResponse, string>({
      query: postId => ({
        url: `/posts/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetSinglePostQuery,
  useCreateNewPostMutation,
  useUpdatePostMutation,
  useToggleLikePostMutation,
  useToggleDislikePostMutation,
  useDeletePostMutation,
} = postsApiSlice;
