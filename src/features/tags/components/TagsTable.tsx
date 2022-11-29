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
import { ITag } from 'features/api/interfaces';
import React, { Fragment, useState } from 'react';
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
      },
      {
        accessorKey: 'description',
        header: 'Description',
      },
      {
        accessorKey: 'createdBy',
        header: 'Created By',
        cell: ({ row }) => {
          return (
            <div>
              <span>{row.original.createdBy.username}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'lastUpdatedBy',
        header: 'Last Updated By',
        cell: ({ row }) => {
          return (
            <div>
              <span>{row.original.lastUpdatedBy.username}</span>
            </div>
          );
        },
      },
      {
        header: 'Actions',
        cell: ({ row }) => {
          return (
            <div>
              <button
                onClick={() => {
                  setSingleTag(row.original);
                  setIsDeleteModalOpen(false);
                  setIsUpdateModalOpen(true);
                }}
              >
                Update
              </button>
              <button
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
    return <p>Loading...</p>;
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
        <p>Do you really want to delete this tag?</p>
        <button
          {...(singleTag && { onClick: () => handleDeleteTag(singleTag.name) })}
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
          {isFetchingTags ? 'Loading...' : null}
        </div>
      </main>
    </Fragment>
  );
};
