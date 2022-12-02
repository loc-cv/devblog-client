import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'components/Button';
import { Input } from 'components/Input';
import { usersApiSlice } from 'features/users/usersApiSlice';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
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
    handleSubmit,
    reset,
    formState: { isSubmitting },
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
    // TODO: replace with some placeholder/spinner component
    return null;
  }

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-10">
      <h1 className="text-center text-xl font-bold text-gray-800">
        Log in to your DevBlog account
      </h1>

      <FormProvider {...methods}>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          {errorMessage && (
            <p className="rounded bg-red-300 p-2 px-4 text-base text-gray-900">
              {errorMessage}
            </p>
          )}

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

          <Button
            type="submit"
            disabled={isLoading || isSubmitting}
            loading={isSubmitting || isLoading}
          >
            Register
          </Button>

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
      </FormProvider>
    </main>
  );
};
