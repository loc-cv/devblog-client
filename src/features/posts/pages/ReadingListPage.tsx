import { usersApiSlice } from 'features/users/usersApiSlice';
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
      return <p>Loading...</p>;
    }
    if (error) {
      if ('status' in error) {
        const data = error.data as { message?: string };
        return (
          <p>{data?.message || 'Something went wrong loading posts :('}</p>
        );
      }
      return <p>Something went wrong loading posts :(</p>;
    }
    if (postsQueryResult) {
      if (postsQueryResult.data.length === 0) {
        return (
          <p>
            There&apos;s nothing here. Start your{' '}
            <Link to="/">reading journey</Link>
          </p>
        );
      }
      return <PostList posts={postsQueryResult.data} />;
    }
    return null;
  };

  return (
    <main>
      <h1 className="py-10 text-4xl font-bold">Your reading list</h1>
      <section>{renderPostList()}</section>
    </main>
  );
};
