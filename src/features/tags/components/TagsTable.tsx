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
import { ITag } from 'features/api/interfaces';
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  tagsApiSlice,
  useDeleteTagMutation,
  useGetTagsQuery,
} from '../tagsApiSlice';
import { TagForm } from './TagForm';

export const TagsTable = () => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [singleTag, setSingleTag] = useState<ITag | null>(null);

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const pagination = React.useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  );

  const {
    data: tagsQueryResult,
    isLoading: isLoadingTags,
    isFetching: isFetchingTags,
  } = useGetTagsQuery({ page: pageIndex + 1, limit: pageSize });

  const defaultData = React.useMemo(() => [], []);

  const [deleteTag] = useDeleteTagMutation();
  const dispatch = useAppDispatch();

  const handleDeleteTag = React.useCallback(
    async (tagName: string) => {
      const patchResult = dispatch(
        tagsApiSlice.util.updateQueryData(
          'getTags',
          { page: pageIndex + 1, limit: pageSize },
          draft => {
            return {
              ...draft,
              data: draft.data.filter(tag => tag.name !== tagName),
            };
          },
        ),
      );
      try {
        await deleteTag(tagName);
        toast.success('Delete tag successfully');
      } catch (error: any) {
        patchResult.undo();
        toast.error('Something went wrong when deleting tag');
      } finally {
        setIsDeleteModalOpen(false);
      }
    },
    [deleteTag, dispatch, pageIndex, pageSize],
  );

  // Define columns for tags table
  const columns = React.useMemo<ColumnDef<ITag>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Tag Name',
        cell: ({ getValue }) => {
          return <span className="font-bold">{getValue() as string}</span>;
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
      },
      {
        accessorKey: 'createdBy',
        header: 'Created By',
        cell: ({ row }) => {
          const username = row.original.createdBy.username;
          return (
            <Link to={`/profiles/${username}`} target="_blank">
              <span className="font-semibold text-gray-600">@{username}</span>
            </Link>
          );
        },
      },
      {
        accessorKey: 'lastUpdatedBy',
        header: 'Last Updated By',
        cell: ({ row }) => {
          const username = row.original.lastUpdatedBy.username;
          return (
            <Link to={`/profiles/${username}`} target="_blank">
              <span className="font-semibold text-gray-600">@{username}</span>
            </Link>
          );
        },
      },
      {
        header: 'Actions',
        cell: ({ row }) => {
          return (
            <div className="flex justify-center gap-1">
              <button
                className="rounded bg-green-200 p-1 px-2 font-medium hover:bg-green-300"
                onClick={() => {
                  setSingleTag(row.original);
                  setIsDeleteModalOpen(false);
                  setIsUpdateModalOpen(true);
                }}
              >
                Update
              </button>
              <button
                className="rounded bg-red-200 p-1 px-2 font-medium hover:bg-red-300"
                onClick={() => {
                  setSingleTag(row.original);
                  setIsUpdateModalOpen(false);
                  setIsDeleteModalOpen(true);
                }}
              >
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: tagsQueryResult?.data ?? defaultData,
    columns,
    pageCount: tagsQueryResult?.totalPages ?? -1,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (isLoadingTags) {
    // TODO: replace with some placeholder component
    return null;
  }

  if (!tagsQueryResult?.data) {
    return <p>No tags to display :(</p>;
  }

  return (
    <Fragment>
      <Modal
        isOpen={isUpdateModalOpen}
        setIsOpen={setIsUpdateModalOpen}
        title="Update Tag"
      >
        <TagForm {...(singleTag && { tag: singleTag })} />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Tag"
      >
        <p className="mb-4 text-lg text-gray-700">
          Do you really want to delete this tag?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="rounded bg-indigo-500 p-1 px-3 font-medium text-gray-100 hover:bg-indigo-600"
            {...(singleTag && {
              onClick: () => handleDeleteTag(singleTag.name),
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
          type="tags"
          isFetchingData={isFetchingTags}
        />
      </main>
    </Fragment>
  );
};
