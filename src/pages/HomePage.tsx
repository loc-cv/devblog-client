import { Spinner } from 'components/Spinner';
import { PostList } from 'features/posts/components/PostList';
import { useGetPostsQuery } from 'features/posts/postsApiSlice';
import { Fragment, useEffect, useState } from 'react';
import { FaceFrownIcon } from '@heroicons/react/20/solid';
import InfiniteScroll from 'react-infinite-scroll-component';

// {/* <p className="mt-6 text-center text-2xl">Loading more posts...</p> */}
export const HomePage = () => {
  const [page, setPage] = useState(1);

  const {
    data: postsQueryResult,
    isLoading,
    error,
  } = useGetPostsQuery({ page }, { refetchOnMountOrArgChange: true });

  const [posts, setPosts] = useState(postsQueryResult?.data || []);

  useEffect(() => {
    if (postsQueryResult) {
      if (page === 1) {
        if (posts.length !== 0) return;
      }
      setPosts([...posts, ...postsQueryResult.data]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postsQueryResult]);

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
      return (
        <InfiniteScroll
          style={{ overflow: 'hidden' }}
          next={() => setPage(prevPage => prevPage + 1)}
          hasMore={postsQueryResult.data.length > 0}
          dataLength={posts.length}
          loader={
            <div className="mt-4">
              <Spinner className="mx-auto h-12 w-12" />
            </div>
          }
          endMessage={
            <p className="mt-8 text-center text-2xl font-medium">
              Yay! You have seen it all!
            </p>
          }
        >
          {<PostList posts={posts} />}
        </InfiniteScroll>
      );
    }
    return null;
  };

  return (
    <Fragment>
      <div className="mb-10">
        <h1 className="mb-4 text-4xl font-bold text-gray-800 md:text-5xl">
          Latest
        </h1>
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
