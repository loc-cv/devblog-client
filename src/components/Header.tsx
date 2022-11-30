import { Menu, Transition } from '@headlessui/react';
import {
  ArrowLeftOnRectangleIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  ChartBarSquareIcon,
  AtSymbolIcon,
} from '@heroicons/react/20/solid';
import { useLogoutMutation } from 'features/auth/authApiSlice';
import { usersApiSlice } from 'features/users/usersApiSlice';
import { Fragment, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DropdownOptions = [
  { text: 'Dashboard', url: '/dashboard', Icon: ChartBarSquareIcon },
  { text: 'Create Post', url: '/posts/new', Icon: PencilSquareIcon },
  { text: 'Reading List', url: '/posts/saved', Icon: BookOpenIcon },
  { text: 'Settings', url: '/settings', Icon: Cog6ToothIcon },
];

export const Header = () => {
  const navigate = useNavigate();
  const [logout, { isSuccess }] = useLogoutMutation();

  const { data: currentUser, isFetching } =
    usersApiSlice.endpoints.getCurrentUser.useQueryState();

  useEffect(() => {
    if (isSuccess) {
      navigate('/');
    }
  }, [isSuccess, navigate]);

  const handleLogout = () => logout();

  return (
    <nav className="py-10 px-5">
      <div className="container mx-auto flex h-full max-w-5xl items-center justify-between">
        <Link to="/">
          <span className="text-4xl font-bold text-gray-800 hover:text-gray-900">
            DevBlog
          </span>
        </Link>
        {!isFetching && (
          <div>
            {currentUser ? (
              <div className="flex items-center text-gray-700">
                {currentUser.role === 'admin' && (
                  <Link to="/dashboard">
                    <span className="hidden items-center rounded p-2 px-4 text-xl underline underline-offset-4 hover:bg-cyan-100 sm:flex">
                      <ChartBarSquareIcon className="mr-1 h-6 w-6" />
                      Dashboard
                    </span>
                  </Link>
                )}
                <Link to="/posts/new">
                  <span className="hidden items-center rounded p-2 px-4 text-xl underline underline-offset-4 hover:bg-cyan-100 sm:mr-4 sm:flex">
                    <PencilSquareIcon className="mr-1 h-6 w-6" />
                    Create post
                  </span>
                </Link>

                {/* Dropdown menu */}
                <Menu
                  as="div"
                  className="relative flex items-center text-gray-800"
                >
                  {/* User avatar (dropdown button) */}
                  <Menu.Button>
                    <img
                      src={currentUser.profilePhoto}
                      alt="User avatar"
                      className="h-12 w-12 rounded"
                    />
                  </Menu.Button>

                  {/* Dropdown items */}
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    {/* User's name */}
                    <Menu.Items className="absolute right-0 top-14 z-10 w-56 rounded border-2 border-gray-200 bg-white p-1 text-lg shadow-md">
                      <Link to={`/profiles/${currentUser.username}`}>
                        <Menu.Item
                          as="div"
                          className="rounded border-b-2 border-b-gray-200 p-4 py-2 hover:bg-cyan-100"
                        >
                          <div className="font-semibold">{`${currentUser.firstName} ${currentUser.lastName}`}</div>
                          <div className="flex items-center text-base text-gray-500">
                            <AtSymbolIcon className="h-4 w-4" />
                            {currentUser.username}
                          </div>
                        </Menu.Item>
                      </Link>

                      {/* Options */}
                      {DropdownOptions.filter(option => {
                        if (currentUser.role !== 'admin') {
                          return option.text !== 'Dashboard';
                        }
                        return true;
                      }).map(Option => (
                        <Link to={Option.url} key={Option.text}>
                          <Menu.Item
                            as="div"
                            key={Option.text}
                            className="flex items-center rounded p-4 py-2 hover:bg-cyan-100"
                          >
                            <Option.Icon className="mr-1 h-5 w-5" />
                            <span>{Option.text}</span>
                          </Menu.Item>
                        </Link>
                      ))}

                      {/* Log out button */}
                      <Menu.Item
                        as="div"
                        className="flex items-center rounded border-t-2 border-t-gray-200 p-4 py-2 hover:cursor-pointer hover:bg-cyan-100"
                        onClick={handleLogout}
                      >
                        <ArrowLeftOnRectangleIcon className="mr-1 h-5 w-5" />
                        <span>Log out</span>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            ) : (
              <div>
                <Link
                  to="/register"
                  className="rounded bg-black p-2 px-4 text-xl font-semibold text-gray-100 sm:hidden"
                >
                  Join us
                </Link>
                <div className="hidden gap-2 text-xl font-semibold text-gray-800 sm:flex">
                  <Link to="/login">
                    <span className="rounded p-2 px-4 underline hover:underline-offset-8">
                      Sign in
                    </span>
                  </Link>
                  <Link to="/register">
                    <span className="rounded bg-black p-2 px-4 text-gray-100">
                      Sign up
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
