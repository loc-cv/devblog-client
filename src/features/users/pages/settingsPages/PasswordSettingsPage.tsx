import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useUpdateCurrentUserPasswordMutation } from 'features/users/usersApiSlice';
import { toast } from 'react-toastify';

const updatePasswordFormSchema = z
  .object({
    currentPassword: z
      .string({
        invalid_type_error: 'Current password must be a string',
        required_error: 'Current password is required',
      })
      .min(1, { message: 'Current password is required' }),

    newPassword: z
      .string({
        invalid_type_error: 'New password must be a string',
        required_error: 'Please enter your new password',
      })
      .min(1, { message: 'Please enter your new password' })
      .regex(
        // https://stackoverflow.com/a/21456918
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            'Password must contain at least eight characters, including at least one uppercase letter, one lowercase letter, one number and one special character.',
        },
      ),

    newPasswordConfirm: z
      .string({
        invalid_type_error: 'Password must be a string.',
        required_error: 'Please confirm your password',
      })
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine(data => data.newPassword === data.newPasswordConfirm, {
    path: ['newPasswordConfirm'],
    message: 'Password confirmation does not match',
  });

export type UpdatePasswordFormInput = z.infer<typeof updatePasswordFormSchema>;

export const PasswordPage = () => {
  const methods = useForm<UpdatePasswordFormInput>({
    resolver: zodResolver(updatePasswordFormSchema),
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [updateCurrentUserPassword, { isLoading }] =
    useUpdateCurrentUserPasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: UpdatePasswordFormInput) => {
    try {
      await updateCurrentUserPassword(data).unwrap();
      setErrorMessage('');
      reset();
      toast.success('Your password has been successfully updated');
    } catch (error: any) {
      setErrorMessage(error.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errorMessage && <p>{errorMessage}</p>}

      <div className="flex flex-col">
        <label htmlFor="currentPassword">Current password</label>
        <input
          type="password"
          id="currentPassword"
          {...register('currentPassword')}
          disabled={isLoading || isSubmitting}
        />
        <p>{errors.currentPassword?.message}</p>
      </div>

      <div className="flex flex-col">
        <label htmlFor="newPassword">New password</label>
        <input
          type="password"
          id="newPassword"
          {...register('newPassword')}
          disabled={isLoading || isSubmitting}
        />
        <p>{errors.newPassword?.message}</p>
      </div>

      <div className="flex flex-col">
        <label htmlFor="newPasswordConfirm">Confirm new password</label>
        <input
          type="password"
          id="newPasswordConfirm"
          {...register('newPasswordConfirm')}
          disabled={isLoading || isSubmitting}
        />
        <p>{errors.newPasswordConfirm?.message}</p>
      </div>

      <input
        type="submit"
        value={isLoading || isSubmitting ? 'Updating...' : 'Update password'}
        disabled={isLoading || isSubmitting}
      />
    </form>
  );
};
