import { FaceFrownIcon } from '@heroicons/react/20/solid';
import { Spinner } from 'components/Spinner';
import { PostList } from 'features/posts/components/PostList';
import { useGetPostsQuery } from 'features/posts/postsApiSlice';
import { useGetSingleUserQuery } from 'features/users/usersApiSlice';
import { Fragment } from 'react';
import { useParams } from 'react-router-dom';

type Params = {
  username: string;
};

export const ProfilePage = () => {
  const { username } = useParams<keyof Params>() as Params;

  const {
    data: user,
    isFetching: isFetchingUser,
    error: userError,
  } = useGetSingleUserQuery(username);

  const {
    data: postsQueryResult,
    isLoading: isLoadingPosts,
    error: postsError,
  } = useGetPostsQuery({ author: user?.username });

  const renderPostList = () => {
    if (isLoadingPosts) {
      // TODO: replace with some placeholder component
      return null;
    }
    if (postsError) {
      return (
        <div className="mt-24 text-center">
          <h2 className="mb-3 text-4xl font-bold">Oh no ...</h2>
          <p className="text-2xl font-medium leading-10 text-gray-700">
            Something went wrong when loading posts{' '}
            <FaceFrownIcon className="-mt-2 inline w-10" />
          </p>
        </div>
      );
    }
    if (postsQueryResult) {
      return <PostList posts={postsQueryResult.data} />;
    }
    return null;
  };

  if (isFetchingUser) {
    return (
      <div className="mt-40 flex items-center justify-center">
        <Spinner className="h-20 w-20" />
      </div>
    );
  }

  if (userError) {
    return (
      <div className="mt-40 text-center">
        <h2 className="mb-3 text-4xl font-bold">Oh no ...</h2>
        <p className="text-2xl font-medium leading-10 text-gray-700">
          Something went wrong when loading user information{' '}
          <FaceFrownIcon className="-mt-2 inline w-10" />
        </p>
      </div>
    );
  }

  if (user) {
    return (
      <Fragment>
        {/* User info */}
        <section className="">
          <div className="flex items-center gap-3 md:gap-4">
            {/* User profile photo */}
            <img
              src={user?.profilePhoto}
              alt="User"
              className="h-20 w-20 rounded-full md:h-28 md:w-28"
            />

            {/* User's name and email */}
            <div className="flex h-full flex-col justify-center">
              <span className="text-lg font-bold text-gray-800 md:text-3xl">
                {user.firstName} {user.lastName}
              </span>
              <span className="-mt-1 text-sm text-gray-600 md:mt-0 md:text-base">
                @{user.username}
              </span>
              <span className="mt-1 text-base font-medium italic text-gray-700 md:text-lg">
                {user.email}
              </span>
            </div>
          </div>

          {/* User bio */}
          {user.bio && (
            <p className="mt-10 px-2 text-center">
              <span className="px-4 text-lg italic text-gray-700">
                {user.bio}
              </span>
            </p>
          )}
        </section>

        <section className="mt-10 border-t-2 border-t-gray-200 pt-10">
          <div className="mb-10 text-right text-lg font-medium italic text-gray-800">
            Posts published: <span className="font-bold">{user.postCount}</span>
          </div>
          {renderPostList()}
        </section>
      </Fragment>
    );
  }

  return null;
};
