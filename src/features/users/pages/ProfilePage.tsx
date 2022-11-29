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
      return <p>Loading...</p>;
    }
    if (postsError) {
      if ('status' in postsError) {
        const data = postsError.data as { message?: string };
        return (
          <p>{data?.message || 'Something went wrong loading posts :('}</p>
        );
      }
      return <p>Something went wrong loading posts :(</p>;
    }
    if (postsQueryResult) {
      return <PostList posts={postsQueryResult.data} />;
    }
    return null;
  };

  if (isFetchingUser) {
    return <p>Loading...</p>;
  }

  if (userError) {
    return <p>There something wrong loading user information</p>;
  }

  if (user) {
    return (
      <Fragment>
        {/* User info */}
        <section className="border-b-2 border-b-gray-400 pb-10">
          <div className="flex h-36 gap-4">
            {/* User profile photo */}
            <img
              src={user?.profilePhoto}
              alt="User"
              className="h-36 w-36 rounded"
            />

            {/* User's name and email */}
            <div className="flex h-full flex-col justify-evenly">
              <span className="text-5xl font-bold">
                {user.firstName} {user.lastName}
              </span>
              <span>@{user.username}</span>
              <span>{user.email}</span>
            </div>

            {/* User bio */}
            {user.bio && <p>{user.bio}</p>}
          </div>
        </section>
        <section>
          <div className="py-5 text-right">
            Posts published: {user.postCount}
          </div>
          {renderPostList()}
        </section>
      </Fragment>
    );
  }

  return null;
};
