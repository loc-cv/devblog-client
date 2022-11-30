import { PencilSquareIcon } from '@heroicons/react/20/solid';
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
            <button className="flex gap-1 rounded bg-gray-100 p-1 px-2 text-gray-800 hover:bg-gray-200">
              <PencilSquareIcon className="w-4" />
              <span className="text-sm">Edit</span>
            </button>
          </Link>
        </Fragment>
      );
    }
  }

  return null;
};
