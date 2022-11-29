import { IPost } from 'features/api/interfaces';
import { Fragment } from 'react';
import { PostCard } from './PostCard';

type PostListProps = {
  posts: IPost[];
};

export const PostList = ({ posts }: PostListProps) => {
  return (
    <Fragment>
      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </Fragment>
  );
};
