import { FaceFrownIcon } from '@heroicons/react/20/solid';
import { Spinner } from 'components/Spinner';
import { usersApiSlice } from 'features/users/usersApiSlice';
import { Fragment, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { PostList } from '../components/PostList';
import { useGetPostsQuery } from '../postsApiSlice';

export const ReadingListPage = () => {
  const [page, setPage] = useState(1);

  const { data: currentUser, isFetching } =
    usersApiSlice.endpoints.getCurrentUser.useQueryState();

  const {
    data: postsQueryResult,
    isLoading,
    error,
  } = useGetPostsQuery({
    page,
    savedby: currentUser?.username,
  });

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
          <h2 className="mb-3 text-3xl font-bold md:text-4xl">Oh no ...</h2>
          <p className="text-xl font-medium leading-10 text-gray-700 md:text-2xl">
            Something went wrong when loading posts{' '}
            <FaceFrownIcon className="-mt-2 inline w-10" />
          </p>
        </div>
      );
    }
    if (postsQueryResult) {
      if (posts.length === 0) {
        return (
          <div className="mt-24 text-center text-2xl font-medium text-gray-700">
            <p className="mb-2 text-xl md:text-2xl">
              There&apos;s nothing here
            </p>
            <Link to="/">
              <p className="text-2xl font-bold underline decoration-2 underline-offset-8 hover:underline-offset-[12px] md:text-3xl">
                Let&apos;s start your reading journey
              </p>
            </Link>
          </div>
        );
      }
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
          endMessage={null}
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
        <h1 className="text-4xl font-bold text-gray-800 md:text-5xl">
          Your reading list
        </h1>
      </div>
      <main>{renderPostList()}</main>
    </Fragment>
  );
};
