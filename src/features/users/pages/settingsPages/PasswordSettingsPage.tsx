import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useUpdateCurrentUserPasswordMutation } from 'features/users/usersApiSlice';
import { toast } from 'react-toastify';
import { Input } from 'components/Input';
import { Button } from 'components/Button';

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
    handleSubmit,
    reset,
    formState: { isSubmitting },
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
    <div>
      <h2 className="mb-4 text-3xl font-bold text-gray-700">Change password</h2>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-w-md flex-col gap-3"
        >
          {errorMessage && <p>{errorMessage}</p>}

          <Input
            label="Current password"
            type="password"
            name="password"
            disabled={isLoading || isSubmitting}
          />

          <Input
            label="New password"
            type="password"
            name="newPassword"
            disabled={isLoading || isSubmitting}
          />

          <Input
            label="Confirm new password"
            type="password"
            name="newPasswordConfirm"
            disabled={isLoading || isSubmitting}
          />

          <Button
            type="submit"
            loading={isSubmitting || isLoading}
            disabled={isSubmitting || isLoading}
          >
            Update password
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};
