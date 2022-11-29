import { IPost } from 'features/api/interfaces';
import { usersApiSlice } from 'features/users/usersApiSlice';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

type EditButtonProps = {
  post: IPost;
};

export const EditButton = ({ post }: EditButtonProps) => {
  const { data: currentUser } =
    usersApiSlice.endpoints.getCurrentUser.useQueryState();

  if (currentUser) {
    if (post.author.username === currentUser.username) {
      return (
        <Fragment>
          <Link to={`/posts/${post._id}/edit`}>
            <button>Edit</button>
          </Link>
        </Fragment>
      );
    }
  }

  return null;
};
