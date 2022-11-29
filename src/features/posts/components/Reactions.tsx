import { IPost } from 'features/api/interfaces';
import { usersApiSlice } from 'features/users/usersApiSlice';
import { Fragment } from 'react';
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
    <Fragment>
      <button {...(currentUser && { onClick: handleToggleLike })}>
        Likes: {post.likes.length}
      </button>
      <button {...(currentUser && { onClick: handleToggleDislike })}>
        Dislikes: {post.dislikes.length}
      </button>
    </Fragment>
  );
};
