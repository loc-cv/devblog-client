import { FaceFrownIcon } from '@heroicons/react/20/solid';
import { useAppSelector } from 'app/hooks';
import { Spinner } from 'components/Spinner';
import { IListResponse, IPost } from 'features/api/interfaces';
import { usersApiSlice } from 'features/users/usersApiSlice';
import { Fragment, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { PostList } from '../components/PostList';
import { SearchPostsForm } from '../components/SearchPostsForm';
import { useGetPostsQuery } from '../postsApiSlice';
import { selectSearchString } from '../postsSlice';

export const ReadingListPage = () => {
  const [localPage, setLocalPage] = useState(1);
  const searchString = useAppSelector(selectSearchString);

  const { data: currentUser, isFetching } =
    usersApiSlice.endpoints.getCurrentUser.useQueryState();

  const {
    data: postsQueryResult,
    isLoading,
    error,
  } = useGetPostsQuery({
    page: localPage,
    savedby: currentUser?.username,
    search: searchString,
  });

  const {
    page: remotePage,
    data: fetchedPosts,
    totalPages,
    total,
  } = (postsQueryResult as IListResponse<IPost>) || {};

  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    setPosts([]);
    setLocalPage(1);
  }, [searchString]);

  useEffect(() => {
    if (fetchedPosts && fetchedPosts.length && fetchedPosts.length > 0) {
      if (localPage === 1) {
        setPosts(fetchedPosts);
      } else if (localPage === remotePage) {
        setPosts(posts => [...posts, ...fetchedPosts]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedPosts]);

  useEffect(() => {
    if (postsQueryResult) {
      if (localPage === 1) {
        if (posts.length !== 0) return;
      }
      setPosts([...posts, ...postsQueryResult.data]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postsQueryResult]);

  const loader = (
    <div className="mt-32 flex items-center justify-center">
      <Spinner className="h-20 w-20" />
    </div>
  );

  const renderPostList = () => {
    if (isLoading || isFetching) {
      return loader;
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
      if (total === 0) {
        return (
          <div className="mt-24 text-center text-2xl font-medium text-gray-700">
            <p className="mb-4 text-2xl md:text-4xl">
              There&apos;s nothing here :(
            </p>
            {searchString === '' && (
              <Link to="/">
                <p className="text-2xl font-bold underline decoration-2 underline-offset-8 hover:underline-offset-[12px] md:text-3xl">
                  Let&apos;s start your reading journey
                </p>
              </Link>
            )}
          </div>
        );
      }
      return (
        <InfiniteScroll
          style={{ overflow: 'hidden' }}
          next={() => setLocalPage(prevPage => prevPage + 1)}
          hasMore={totalPages > localPage}
          dataLength={posts.length}
          loader={loader}
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
      <section className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 md:text-5xl">
          Your reading list
        </h1>
      </section>
      <SearchPostsForm />
      <main className="mt-6">{renderPostList()}</main>
    </Fragment>
  );
};
