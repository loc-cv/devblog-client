import { zodResolver } from '@hookform/resolvers/zod';
import { usersApiSlice } from 'features/users/usersApiSlice';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Location } from 'react-router-dom';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useLoginMutation } from '../authApiSlice';

const loginFormSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Invalid email address' }),

  password: z
    .string({ required_error: 'Password is required' })
    .min(1, { message: 'Password is required' }),
});

export type LoginFormInput = z.infer<typeof loginFormSchema>;

export const LoginPage = () => {
  const methods = useForm<LoginFormInput>({
    resolver: zodResolver(loginFormSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const [errorMessage, setErrorMessage] = useState('');

  const [login, { isLoading }] = useLoginMutation();

  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => {
    const state = location.state as { from: Location };
    if (state && state.from.pathname) {
      return state.from.pathname;
    }
    return '/';
  }, [location]);

  const onSubmit = async (data: LoginFormInput) => {
    try {
      await login(data).unwrap();
      reset();
      navigate(from);
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
        Log in to your DevBlog account
      </h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        {errorMessage && (
          <p className="rounded bg-red-300 p-2 px-4 text-base text-gray-900">
            {errorMessage}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-gray-800">
            Email
          </label>
          <input
            type="text"
            id="email"
            {...register('email')}
            className={`rounded p-2 ${
              (isLoading || isSubmitting) && 'bg-gray-100'
            }`}
            disabled={isLoading || isSubmitting}
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
            className={`rounded p-2 ${
              (isLoading || isSubmitting) && 'bg-gray-100'
            }`}
            disabled={isLoading || isSubmitting}
          />
          <p className="text-sm text-red-500">{errors.password?.message}</p>
        </div>

        <input
          type="submit"
          value={isLoading || isSubmitting ? 'Loading...' : 'Login'}
          disabled={isLoading || isSubmitting}
          className={`w-full rounded bg-black p-2 px-4 text-lg font-medium text-gray-100 ${
            (isLoading || isSubmitting) && 'bg-gray-600'
          }`}
        />

        <p className="text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-medium underline underline-offset-4 hover:underline-offset-8"
          >
            Create your account
          </Link>
        </p>
      </form>
    </main>
  );
};
