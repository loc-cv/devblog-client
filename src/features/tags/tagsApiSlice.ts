import { apiSlice } from 'features/api/apiSlice';
import { IGenericResponse, IListResponse, ITag } from 'features/api/interfaces';
import { TagInput } from './components/TagForm';

export const tagsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    /* Query tags */
    getTags: builder.query<
      IListResponse<ITag>,
      { limit?: number; page?: number }
    >({
      query: args => {
        const { limit = 10, page = 1 } = args;
        return {
          url: '/tags',
          method: 'GET',
          params: { limit, page },
        };
      },
      // Just to make sure
      transformResponse: (result: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
        data: { tags: ITag[] };
      }) => ({
        page: result.page,
        perPage: result.perPage,
        total: result.total,
        totalPages: result.totalPages,
        data: result.data.tags,
      }),
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id: _id }) => ({
                type: 'Tags' as const,
                id: _id,
              })),
              { type: 'Tags', id: 'LIST' },
            ]
          : [{ type: 'Tags', id: 'LIST' }],
    }),

    /* Create a new tag */
    createNewTag: builder.mutation<IGenericResponse, TagInput>({
      query: data => ({
        url: '/tags',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Tags', id: 'LIST' }],
    }),

    /* Update tag */
    updateTag: builder.mutation<
      IGenericResponse,
      { name: string; data: TagInput }
    >({
      query: arg => ({
        url: `/tags/${arg.name}`,
        method: 'PATCH',
        body: arg.data,
      }),
      invalidatesTags: [{ type: 'Tags', id: 'LIST' }],
    }),

    /* Delete a tag */
    deleteTag: builder.mutation<IGenericResponse, string>({
      query: tagName => ({
        url: `/tags/${tagName}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Tags', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTagsQuery,
  useCreateNewTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = tagsApiSlice;
