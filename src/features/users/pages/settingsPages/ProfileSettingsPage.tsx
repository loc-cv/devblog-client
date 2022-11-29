import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  usersApiSlice,
  useUpdateCurrentUserMutation,
} from 'features/users/usersApiSlice';
import { toast } from 'react-toastify';

const updateUserFormSchema = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .min(1, { message: "First name can't be empty" })
    .max(30, { message: 'First name character limit is 30 characters' }),

  lastName: z
    .string({ required_error: 'Last name is required' })
    .trim()
    .min(1, { message: "Last name can't be empty" })
    .max(30, { message: 'Last name character limit is 30 characters' }),

  bio: z
    .string()
    .trim()
    .max(150, 'Bio character limit is 150 characters')
    .optional(),

  username: z
    .string({ required_error: 'Username is required' })
    .trim()
    .min(3, { message: 'Username must have at least 3 characters' })
    .max(30, { message: 'Username character limit is 30 characters' })
    .regex(/^[a-zA-Z][a-zA-Z0-9]*$/, {
      message:
        "Username can only contain alpha numeric character, and can't start with a number",
    }),
});

export type UpdateUserFormInput = z.infer<typeof updateUserFormSchema>;

export const PublicProfilePage = () => {
  const { data: currentUser, isFetching } =
    usersApiSlice.endpoints.getCurrentUser.useQueryState();

  const methods = useForm<UpdateUserFormInput>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      username: currentUser?.username || '',
      bio: currentUser?.bio || '',
    },
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [updateCurrentUser, { isLoading }] = useUpdateCurrentUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  if (isFetching) {
    return <p>Loading...</p>;
  }

  const onSubmit = async (data: UpdateUserFormInput) => {
    try {
      await updateCurrentUser(data).unwrap();
      setErrorMessage('');
      toast.success('Your info has been successfully updated');
    } catch (error: any) {
      setErrorMessage(error.data?.message || 'Something went wrong');
    }
  };

  return (
    <form
      className="flex max-w-md flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      {errorMessage && <p>{errorMessage}</p>}

      <div className="flex flex-col">
        <label htmlFor="email">Email</label>
        <input type="text" id="email" disabled value={currentUser?.email} />
      </div>

      <div className="flex flex-col">
        <label htmlFor="firstName">First name</label>
        <input
          type="text"
          id="firstName"
          {...register('firstName')}
          disabled={isLoading || isSubmitting}
        />
        <p>{errors.firstName?.message}</p>
      </div>

      <div className="flex flex-col">
        <label htmlFor="lastName">Last name</label>
        <input
          type="text"
          id="lastName"
          {...register('lastName')}
          disabled={isLoading || isSubmitting}
        />
        <p>{errors.lastName?.message}</p>
      </div>

      <div className="flex flex-col">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          {...register('username')}
          disabled={isLoading || isSubmitting}
        />
        <p>{errors.username?.message}</p>
      </div>

      <div className="flex flex-col">
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          placeholder="Write something about you"
          {...register('bio')}
          disabled={isLoading || isSubmitting}
        />
        <p>{errors.bio?.message}</p>
      </div>

      <input
        type="submit"
        value={isLoading || isSubmitting ? 'Saving...' : 'Save'}
        disabled={isLoading || isSubmitting}
      />
    </form>
  );
};
