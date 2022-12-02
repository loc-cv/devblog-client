import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'components/Button';
import { Input } from 'components/Input';
import {
  usersApiSlice,
  useUpdateCurrentUserMutation,
} from 'features/users/usersApiSlice';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

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
    <div>
      <h2 className="mb-4 text-3xl font-bold text-gray-700">Public profile</h2>
      <FormProvider {...methods}>
        <form
          className="flex max-w-md flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          {errorMessage && <p>{errorMessage}</p>}

          <Input
            label="Email"
            type="text"
            name="email"
            disabled
            value={currentUser?.email}
          />

          <div className="flex justify-between sm:gap-2">
            <div className="w-[49%]">
              <Input
                label="First name"
                type="text"
                name="firstName"
                disabled={isLoading || isSubmitting}
              />
            </div>

            <div className="w-[49%]">
              <Input
                label="Last name"
                type="text"
                name="lastName"
                disabled={isLoading || isSubmitting}
              />
            </div>
          </div>

          <Input
            label="Username"
            type="text"
            name="username"
            disabled={isLoading || isSubmitting}
          />

          <div className="flex flex-col">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              placeholder="Write something about you"
              {...register('bio')}
              disabled={isLoading || isSubmitting}
              className={`rounded p-2 ${
                (isSubmitting || isLoading) && 'bg-gray-100'
              }`}
            />
            <p className="text-sm text-red-500">{errors.bio?.message}</p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || isSubmitting}
            loading={isSubmitting || isLoading}
          >
            Save
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};
