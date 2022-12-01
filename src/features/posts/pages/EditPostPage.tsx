import { FaceFrownIcon } from '@heroicons/react/20/solid';
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
    // TODO: replace with some placeholder component
    return null;
  }

  if (error) {
    return (
      <div className="mt-40 text-center">
        <h2 className="mb-3 text-3xl font-bold md:text-4xl">Oh no ...</h2>
        <p className="text-xl font-medium leading-10 text-gray-700 md:text-2xl">
          Seems like there&apos;s nothing here
          <FaceFrownIcon className="-mt-2 inline w-10" />
        </p>
      </div>
    );
  }

  if (post) {
    return <PostForm post={post} />;
  }

  return null;
};
