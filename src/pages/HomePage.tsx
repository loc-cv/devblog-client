import { FaceFrownIcon } from '@heroicons/react/20/solid';
import { useAppSelector } from 'app/hooks';
import { Spinner } from 'components/Spinner';
import { IListResponse, IPost } from 'features/api/interfaces';
import { PostList } from 'features/posts/components/PostList';
import { SearchPostsForm } from 'features/posts/components/SearchPostsForm';
import { useGetPostsQuery } from 'features/posts/postsApiSlice';
import { selectSearchString } from 'features/posts/postsSlice';
import { Fragment, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

export const HomePage = () => {
  const [localPage, setLocalPage] = useState(1);
  const searchString = useAppSelector(selectSearchString);

  const {
    data: postsQueryResult,
    isLoading,
    error,
  } = useGetPostsQuery(
    { page: localPage, search: searchString },
    { refetchOnMountOrArgChange: false },
  );

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

  const loader = (
    <div className="mt-32 flex items-center justify-center">
      <Spinner className="h-20 w-20" />
    </div>
  );

  const renderPostList = () => {
    if (isLoading) {
      return loader;
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
      if (total === 0) {
        return (
          <div className="mt-32 text-center font-medium text-gray-700">
            <p className="text-2xl md:text-4xl">There&apos;s nothing here :(</p>
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
          // endMessage={
          //   <p className="mt-8 text-center text-2xl font-medium">
          //     Hmm... Seems like there&apos;s nothing more...
          //   </p>
          // }
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
        <h1 className="mb-4 text-4xl font-bold text-gray-800 md:text-5xl">
          Latest
        </h1>
        <p className="text-base text-gray-600">
          A blog website created with{' '}
          <strong className="font-bold">React.js</strong> and{' '}
          <strong className="font-bold">Tailwind.css</strong>
        </p>
      </section>
      <SearchPostsForm />
      <main className="mt-6">{renderPostList()}</main>
    </Fragment>
  );
};
