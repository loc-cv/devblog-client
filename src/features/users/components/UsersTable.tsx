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
import { IUser } from 'features/api/interfaces';
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGetUsersQuery,
  usersApiSlice,
  useToggleBanUserMutation,
} from '../usersApiSlice';

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
              <span className="font-semibold text-gray-600">@{username}</span>
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
              <span className="font-semibold text-gray-600">{email}</span>
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
        cell: ({ getValue }) => {
          const isBanned = getValue();
          return (
            <span
              className={`${
                isBanned ? 'text-red-700' : 'text-green-700'
              } font-semibold uppercase`}
            >
              {isBanned ? 'Banned' : 'Active'}
            </span>
          );
        },
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
              className={`${
                isBanned
                  ? 'bg-green-200 hover:bg-green-300'
                  : 'bg-red-200 hover:bg-red-300'
              } rounded p-1 px-2 font-medium`}
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
    // TODO: replace with some placeholder component
    return null;
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
        <p className="mb-4 text-lg text-gray-700">
          Do you really want to {singleUser?.isBanned ? 'unban' : 'ban'} this
          user?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="rounded bg-indigo-500 p-1 px-3 font-medium text-gray-100 hover:bg-indigo-600"
            {...(singleUser && {
              onClick: () => handleToggleBan(singleUser._id),
            })}
          >
            Confirm
          </button>
          <button
            className="rounded bg-black p-1 px-3 font-medium text-gray-100 hover:bg-gray-700"
            onClick={() => setIsBanningModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
      <main>
        <DashboardTable
          table={table}
          type="users"
          isFetchingData={isFetchingUsers}
        />
      </main>
    </Fragment>
  );
};
