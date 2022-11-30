import { BookmarkIcon, BookmarkSlashIcon } from '@heroicons/react/20/solid';
import {
  useAddPostToSavedListMutation,
  useRemovePostFromSavedListMutation,
  usersApiSlice,
} from 'features/users/usersApiSlice';
import { toast } from 'react-toastify';

type SaveButtonProps = {
  postId: string;
};

export const SaveButton = ({ postId }: SaveButtonProps) => {
  const { data: currentUser } =
    usersApiSlice.endpoints.getCurrentUser.useQueryState();

  const [addPostToSaveList] = useAddPostToSavedListMutation();
  const [removePostFromSavedList] = useRemovePostFromSavedListMutation();

  const handleSave = async () => {
    try {
      await addPostToSaveList(postId).unwrap();
      toast.success('Post added to your reading list');
    } catch (error: any) {
      toast.error(error.data?.message || 'Something went wrong saving post');
    }
  };

  const handleUnsave = async () => {
    try {
      await removePostFromSavedList(postId).unwrap();
      toast.success('Post removed from your reading list');
    } catch (error: any) {
      toast.error(error.data?.message || 'Something went wrong removing post');
    }
  };

  if (currentUser) {
    const isSaved = currentUser.savedPosts.includes(postId);
    return (
      <button
        onClick={isSaved ? handleUnsave : handleSave}
        className="rounded bg-gray-100 p-1 px-2 hover:bg-gray-200"
      >
        <span className="flex gap-1 text-gray-800">
          {isSaved ? (
            <BookmarkSlashIcon className="w-4" />
          ) : (
            <BookmarkIcon className="w-4" />
          )}
          <span className="text-sm">{isSaved ? 'Unsave' : 'Save'}</span>
        </span>
      </button>
    );
  }

  return null;
};
