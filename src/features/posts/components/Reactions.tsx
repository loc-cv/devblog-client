import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/20/solid';
import { IPost } from 'features/api/interfaces';
import { usersApiSlice } from 'features/users/usersApiSlice';
import { toast } from 'react-toastify';
import {
  useToggleDislikePostMutation,
  useToggleLikePostMutation,
} from '../postsApiSlice';

type ReactionsProps = {
  post: IPost;
};

export const Reactions = ({ post }: ReactionsProps) => {
  const [toggleLike] = useToggleLikePostMutation();
  const [toggleDislike] = useToggleDislikePostMutation();
  const { data: currentUser } =
    usersApiSlice.endpoints.getCurrentUser.useQueryState();

  const handleToggleLike = async () => {
    try {
      await toggleLike(post._id).unwrap();
    } catch (error: any) {
      toast.error(error.data?.message || 'Something went wrong');
    }
  };

  const handleToggleDislike = async () => {
    try {
      await toggleDislike(post._id).unwrap();
    } catch (error: any) {
      toast.error(error.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex gap-5">
      <button
        {...(currentUser && { onClick: handleToggleLike })}
        className="flex gap-1 rounded text-gray-700 hover:text-gray-900"
      >
        <HandThumbUpIcon className="-mt-1 w-6" />
        <span className="">{post.likes.length}</span>
      </button>
      <button
        {...(currentUser && { onClick: handleToggleDislike })}
        className="flex gap-1 rounded text-gray-700 hover:text-gray-900"
      >
        <HandThumbDownIcon className="-mt-1 w-6" />
        <span className="">{post.dislikes.length}</span>
      </button>
    </div>
  );
};
