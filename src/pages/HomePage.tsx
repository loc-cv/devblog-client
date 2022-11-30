import { Spinner } from 'components/Spinner';
import { PostList } from 'features/posts/components/PostList';
import { useGetPostsQuery } from 'features/posts/postsApiSlice';
import { Fragment } from 'react';
import { FaceFrownIcon } from '@heroicons/react/20/solid';

export const HomePage = () => {
  const {
    data: postsQueryResult,
    isLoading,
    error,
  } = useGetPostsQuery({}, { refetchOnMountOrArgChange: true });

  const renderPostList = () => {
    if (isLoading) {
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
      return <PostList posts={postsQueryResult.data} />;
    }
    return null;
  };

  return (
    <Fragment>
      <div className="mb-10">
        <h1 className="mb-4 text-5xl font-bold text-gray-800">Latest</h1>
        <p className="text-base text-gray-600">
          A blog website created with{' '}
          <strong className="font-bold">React.js</strong> and{' '}
          <strong className="font-bold">Tailwind.css</strong>
        </p>
      </div>
      <main>{renderPostList()}</main>
    </Fragment>
  );
};
