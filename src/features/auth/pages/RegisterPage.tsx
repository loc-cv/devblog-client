import { zodResolver } from '@hookform/resolvers/zod';
import { usersApiSlice } from 'features/users/usersApiSlice';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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
    return <p>Loading...</p>;
  }

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-10">
      <h1 className="text-center text-xl font-bold text-gray-800">
        Create new account
      </h1>
      <form
        className="flex flex-col gap-3 px-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {errorMessage && (
          <p className="rounded bg-red-300 p-2 px-4 text-base text-gray-900">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-between">
          <div className="flex max-w-[49%] flex-col">
            <label htmlFor="firstName" className="text-gray-800">
              First name
            </label>
            <input
              type="text"
              id="firstName"
              {...register('firstName')}
              disabled={isLoading || isSubmitting}
              className={`rounded p-2 ${
                (isLoading || isSubmitting) && 'bg-gray-100'
              }`}
            />
            <p className="text-sm text-red-500">{errors.firstName?.message}</p>
          </div>

          <div className="flex max-w-[49%] flex-col">
            <label htmlFor="lastName" className="text-gray-800">
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              {...register('lastName')}
              disabled={isLoading || isSubmitting}
              className={`rounded p-2 ${
                (isLoading || isSubmitting) && 'bg-gray-100'
              }`}
            />
            <p className="text-sm text-red-500">{errors.lastName?.message}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-gray-800">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            disabled={isLoading || isSubmitting}
            className={`rounded p-2 ${
              (isLoading || isSubmitting) && 'bg-gray-100'
            }`}
          />
          <p className="text-sm text-red-500">{errors.email?.message}</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-gray-800">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register('password')}
            disabled={isLoading || isSubmitting}
            className={`rounded p-2 ${
              (isLoading || isSubmitting) && 'bg-gray-100'
            }`}
          />
          <p className="text-sm text-red-500">{errors.password?.message}</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="passwordConfirm" className="text-gray-800">
            Confirm password
          </label>
          <input
            type="password"
            id="passwordConfirm"
            {...register('passwordConfirm')}
            disabled={isLoading || isSubmitting}
            className={`rounded p-2 ${
              (isLoading || isSubmitting) && 'bg-gray-100'
            }`}
          />
          <p className="text-sm text-red-500">
            {errors.passwordConfirm?.message}
          </p>
        </div>

        <input
          type="submit"
          value={isLoading || isSubmitting ? 'Loading...' : 'Register'}
          disabled={isLoading || isSubmitting}
          className={`w-full rounded bg-black p-2 px-4 text-lg font-medium text-gray-100 ${
            (isLoading || isSubmitting) && 'bg-gray-600'
          }`}
        />

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
    </main>
  );
};
