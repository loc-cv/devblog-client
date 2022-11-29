import { apiSlice } from 'features/api/apiSlice';
import { IListResponse, IReport } from 'features/api/interfaces';

export const reportsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    /* Query reports */
    getReports: builder.query<
      IListResponse<IReport>,
      { limit?: number; page?: number }
    >({
      query: args => {
        const { limit = 10, page = 1 } = args;
        return {
          url: '/reports',
          method: 'GET',
          params: { limit, page },
        };
      },
      transformResponse: (result: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
        data: { reports: IReport[] };
      }) => ({
        page: result.page,
        perPage: result.perPage,
        total: result.total,
        totalPages: result.totalPages,
        data: result.data.reports,
      }),
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Reports' as const,
                id: _id,
              })),
              { type: 'Reports', id: 'LIST' },
            ]
          : [{ type: 'Reports', id: 'LIST' }],
    }),
  }),
});
