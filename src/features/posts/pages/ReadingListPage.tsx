import { FaceFrownIcon } from '@heroicons/react/20/solid';
import { Spinner } from 'components/Spinner';
import { usersApiSlice } from 'features/users/usersApiSlice';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { PostList } from '../components/PostList';
import { useGetPostsQuery } from '../postsApiSlice';

export const ReadingListPage = () => {
  const { data: currentUser, isFetching } =
    usersApiSlice.endpoints.getCurrentUser.useQueryState();

  const {
    data: postsQueryResult,
    isLoading,
    error,
  } = useGetPostsQuery({
    savedby: currentUser?.username,
  });

  const renderPostList = () => {
    if (isLoading || isFetching) {
      return (
        <div className="mt-32 flex items-center justify-center">
          <Spinner className="h-20 w-20" />
        </div>
      );
    }
    if (error) {
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
      if (postsQueryResult.data.length === 0) {
        return (
          <div className="mt-24 text-center text-2xl font-medium text-gray-700">
            <p className="mb-2">There&apos;s nothing here</p>
            <Link to="/">
              <p className="text-3xl font-bold underline decoration-2 underline-offset-8 hover:underline-offset-[12px]">
                Let&apos;s start your reading journey
              </p>
            </Link>
          </div>
        );
      }
      return <PostList posts={postsQueryResult.data} />;
    }
    return null;
  };

  return (
    <Fragment>
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-gray-800">Your reading list</h1>
      </div>
      <main>{renderPostList()}</main>
    </Fragment>
  );
};
