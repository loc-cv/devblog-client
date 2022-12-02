import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'components/Button';
import { Input } from 'components/Input';
import { usersApiSlice } from 'features/users/usersApiSlice';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useRegisterMutation } from '../authApiSlice';

const registerFormSchema = z
  .object({
    firstName: z
      .string({ required_error: 'First name is required' })
      .trim()
      .min(1, { message: 'First name is required' })
      .max(30, { message: 'First name character limit is 30 characters' }),

    lastName: z
      .string({ required_error: 'Last name is required' })
      .trim()
      .min(1, { message: 'Last name is required' })
      .max(30, { message: 'Last name character limit is 30 characters' }),

    email: z
      .string({ required_error: 'Email address is required' })
      .min(1, { message: 'Email address is required' })
      .email({ message: 'Invalid email address' }),

    password: z
      .string({ required_error: 'Password is required' })
      .min(1, { message: 'Password is required' })
      .regex(
        // https://stackoverflow.com/a/21456918
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            'Password must contain at least eight characters, including at least one uppercase letter, one lowercase letter, one number and one special character.',
        },
      ),

    passwordConfirm: z
      .string({ required_error: 'Please confirm your password' })
      .min(1, { message: 'Please confirm your password' }),
  })
  .required()
  .refine(data => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Password confirmation does not match.',
  });

export type RegisterFormInput = z.infer<typeof registerFormSchema>;

export const RegisterPage = () => {
  const methods = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [registerUser, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: RegisterFormInput) => {
    try {
      await registerUser(data).unwrap();
      reset();
      navigate('/');
    } catch (error: any) {
      setErrorMessage(error.data?.message || 'Something went wrong');
    }
  };

  const { data: currentUser, isFetching } =
    usersApiSlice.endpoints.getCurrentUser.useQueryState();

  if (isFetching) {
    // TODO: replace with some placeholder/spinner component
    return null;
  }

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-10">
      <h1 className="text-center text-xl font-bold text-gray-800">
        Create new account
      </h1>

      <FormProvider {...methods}>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          {errorMessage && (
            <p className="rounded bg-red-300 p-2 px-4 text-base text-gray-900">
              {errorMessage}
            </p>
          )}

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
            label="Email"
            type="text"
            name="email"
            disabled={isLoading || isSubmitting}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            disabled={isLoading || isSubmitting}
          />

          <Input
            label="Confirm password"
            type="password"
            name="passwordConfirm"
            disabled={isLoading || isSubmitting}
          />

          <Button
            type="submit"
            disabled={isLoading || isSubmitting}
            loading={isSubmitting || isLoading}
          >
            Register
          </Button>

          <p className="text-center text-gray-600">
            Already registered?{' '}
            <Link
              to="/login"
              className="font-medium underline underline-offset-4 hover:underline-offset-8"
            >
              Log into your account
            </Link>
          </p>
        </form>
      </FormProvider>
    </main>
  );
};
