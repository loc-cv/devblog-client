import { PostList } from 'features/posts/components/PostList';
import { useGetPostsQuery } from 'features/posts/postsApiSlice';
import { Fragment } from 'react';

export const HomePage = () => {
  const {
    data: postsQueryResult,
    isLoading,
    error,
  } = useGetPostsQuery({}, { refetchOnMountOrArgChange: true });

  const renderPostList = () => {
    if (isLoading) {
      return <p>Loading...</p>;
    }
    if (error) {
      return <p>Something went wrong :(</p>;
    }
    if (postsQueryResult) {
      return <PostList posts={postsQueryResult.data} />;
    }
    return null;
  };

  return (
    <Fragment>
      <div className="mb-5">
        <h1 className="mb-4 text-7xl font-bold">Latest</h1>
        <p className="">A blog created with React.js and Tailwind.css</p>
      </div>
      <main>{renderPostList()}</main>
    </Fragment>
  );
};
