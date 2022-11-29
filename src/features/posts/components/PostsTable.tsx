/* eslint-disable import/named */

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useAppDispatch } from 'app/hooks';
import { Modal } from 'components/Modal';
import { IPost } from 'features/api/interfaces';
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  postsApiSlice,
  useDeletePostMutation,
  useGetPostsQuery,
} from '../postsApiSlice';

export const PostsTable = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [singlePost, setSinglePost] = useState<IPost | null>(null);

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const pagination = React.useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  );

  const {
    data: postsQueryResult,
    isLoading: isLoadingPosts,
    isFetching: isFetchingPosts,
  } = useGetPostsQuery({ page: pageIndex + 1, limit: pageSize });

  const defaultData = React.useMemo(() => [], []);

  const [deletePost] = useDeletePostMutation();
  const dispatch = useAppDispatch();

  const handleDeletePost = React.useCallback(
    async (postId: string) => {
      const patchResult = dispatch(
        postsApiSlice.util.updateQueryData(
          'getPosts',
          { page: pageIndex + 1, limit: pageSize },
          draft => {
            return {
              ...draft,
              data: draft.data.filter(post => post._id !== postId),
            };
          },
        ),
      );
      try {
        await deletePost(postId);
        toast.success('Delete post successfully');
      } catch (error: any) {
        patchResult.undo();
        toast.error('Something went wrong when deleting post');
      } finally {
        setIsDeleteModalOpen(false);
      }
    },
    [deletePost, dispatch, pageIndex, pageSize],
  );

  // Define columns for posts table
  const columns = React.useMemo<ColumnDef<IPost>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => {
          return (
            <Link to={`/posts/${row.original._id}`} target="_blank">
              <span>{row.original.title}</span>
            </Link>
          );
        },
      },
      {
        accessorKey: 'author',
        header: 'Author',
        cell: ({ row }) => {
          const username = row.original.author.username;
          return (
            <Link to={`/profiles/${username}`} target="_blank">
              <span>{username}</span>
            </Link>
          );
        },
      },
      {
        accessorKey: 'viewCount',
        header: 'Views',
      },
      {
        accessorKey: 'updatedAt',
        header: 'Last Update',
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <button
            onClick={() => {
              setSinglePost(row.original);
              setIsDeleteModalOpen(true);
            }}
          >
            Delete
          </button>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: postsQueryResult?.data ?? defaultData,
    columns,
    pageCount: postsQueryResult?.totalPages ?? -1,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (isLoadingPosts) {
    return <p>Loading...</p>;
  }

  if (!postsQueryResult?.data) {
    return <p>No posts to display :(</p>;
  }

  return (
    <Fragment>
      <Modal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Post"
      >
        <p>Do you really want to delete this post?</p>
        <button
          {...(singlePost && {
            onClick: () => handleDeletePost(singlePost._id),
          })}
        >
          Delete
        </button>
      </Modal>

      <main>
        <table>
          {/* Table header */}
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Table body */}
          <tbody>
            {table.getRowModel().rows.map(row => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="h-2" />
        <div className="flex items-center gap-2">
          <button
            className="rounded border p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="rounded border p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            className="rounded border p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="rounded border p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-16 rounded border p-1"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          {isFetchingPosts ? 'Loading...' : null}
        </div>
      </main>
    </Fragment>
  );
};
