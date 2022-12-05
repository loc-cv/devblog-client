/* eslint-disable import/named */

import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useAppDispatch } from 'app/hooks';
import { Modal } from 'components/Modal';
import { DashboardTable } from 'components/Table';
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
              <span className="font-semibold text-gray-700 hover:text-gray-800">
                {row.original.title}
              </span>
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
              <span className="font-semibold text-gray-600">@{username}</span>
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
            className="rounded bg-red-200 p-1 px-2 font-medium hover:bg-red-300"
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
    // TODO: replace with some placeholder component
    return null;
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
        <p className="mb-4 text-lg text-gray-700">
          Do you really want to delete this post?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="rounded bg-indigo-500 p-1 px-3 font-medium text-gray-100 hover:bg-indigo-600"
            {...(singlePost && {
              onClick: () => handleDeletePost(singlePost._id),
            })}
          >
            Delete
          </button>
          <button
            className="rounded bg-black p-1 px-3 font-medium text-gray-100 hover:bg-gray-700"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>

      <main>
        <DashboardTable
          table={table}
          type="posts"
          isFetchingData={isFetchingPosts}
        />
      </main>
    </Fragment>
  );
};
