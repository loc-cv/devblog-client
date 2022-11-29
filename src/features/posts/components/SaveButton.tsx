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
    if (currentUser.savedPosts.includes(postId)) {
      return <button onClick={handleUnsave}>Unsave</button>;
    }
    return <button onClick={handleSave}>Save</button>;
  }

  return null;
};
