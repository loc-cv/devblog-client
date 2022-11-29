/* eslint-disable import/named */
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { IUser } from 'features/api/interfaces';
import React, { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import {
  useGetUsersQuery,
  usersApiSlice,
  useToggleBanUserMutation,
} from '../usersApiSlice';
import { useAppDispatch } from 'app/hooks';
import { Link } from 'react-router-dom';
import { Modal } from 'components/Modal';

export const UsersTable = () => {
  const [isBanningModalOpen, setIsBanningModalOpen] = useState(false);
  const [singleUser, setSingleUser] = useState<IUser | null>(null);

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const pagination = React.useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  );

  const {
    data: usersQueryResult,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
  } = useGetUsersQuery({
    page: pageIndex + 1,
    limit: pageSize,
  });

  const defaultData = React.useMemo(() => [], []);

  const [toggleBanUser] = useToggleBanUserMutation();
  const dispatch = useAppDispatch();

  const handleToggleBan = React.useCallback(
    async (userId: string) => {
      const patchResult = dispatch(
        usersApiSlice.util.updateQueryData(
          'getUsers',
          { page: pageIndex + 1, limit: pageSize },
          draft => {
            const updatedUser = draft.data.find(user => user._id === userId);
            if (!updatedUser) return;
            updatedUser.isBanned = !updatedUser.isBanned;
          },
        ),
      );
      try {
        const res = await toggleBanUser(userId).unwrap();
        toast.success(res.message);
      } catch (error: any) {
        patchResult.undo();
        toast.error('Something went wrong, please try again');
      } finally {
        setIsBanningModalOpen(false);
      }
    },
    [dispatch, pageIndex, pageSize, toggleBanUser],
  );

  // Define columns for users table
  const columns = React.useMemo<ColumnDef<IUser>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'username',
        header: 'Username',
        cell: ({ row }) => {
          const username = row.original.username;
          return (
            <Link to={`/profiles/${username}`} target="_blank">
              <span>{username}</span>
            </Link>
          );
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => {
          const username = row.original.username;
          const email = row.original.email;
          return (
            <Link to={`/profiles/${username}`} target="_blank">
              <span>{email}</span>
            </Link>
          );
        },
      },
      {
        accessorKey: 'postCount',
        header: 'Post Count',
      },
      {
        accessorKey: 'isBanned',
        header: 'Status',
        cell: ({ getValue }) =>
          getValue() ? <span>Banned</span> : <span>Active</span>,
      },
      {
        header: 'Actions',
        cell: ({ row }) => {
          const isBanned = row.original.isBanned;
          return (
            <button
              onClick={() => {
                setSingleUser(row.original);
                setIsBanningModalOpen(true);
              }}
            >
              {isBanned ? 'Unban' : 'Ban'}
            </button>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: usersQueryResult?.data ?? defaultData,
    columns,
    pageCount: usersQueryResult?.totalPages ?? -1,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (isLoadingUsers) {
    return <p>Loading...</p>;
  }

  if (!usersQueryResult?.data) {
    return <p>No users to display :(</p>;
  }

  return (
    <Fragment>
      <Modal
        isOpen={isBanningModalOpen}
        setIsOpen={setIsBanningModalOpen}
        title={singleUser?.isBanned ? 'Unban User' : 'Ban User'}
      >
        <p>
          Do you really want to {singleUser?.isBanned ? 'unban' : 'ban'} this
          user?
        </p>
        <button
          {...(singleUser && {
            onClick: () => handleToggleBan(singleUser._id),
          })}
        >
          Confirm
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
          {isFetchingUsers ? 'Loading...' : null}
        </div>
      </main>
    </Fragment>
  );
};
