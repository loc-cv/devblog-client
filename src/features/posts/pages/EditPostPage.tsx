import { useParams } from 'react-router-dom';
import { PostForm } from '../components/PostForm';
import { useGetSinglePostQuery } from '../postsApiSlice';

type Params = {
  postId: string;
};

export const EditPostPage = () => {
  const { postId } = useParams<keyof Params>() as Params;
  const { data: post, isLoading, error } = useGetSinglePostQuery(postId);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    if ('status' in error && error.status === 404) {
      return <p>There nothing here</p>;
    }
    return <p>Something went wrong</p>;
  }

  if (post) {
    return <PostForm post={post} />;
  }

  return null;
};
