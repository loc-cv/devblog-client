import { zodResolver } from '@hookform/resolvers/zod';
import { usersApiSlice } from 'features/users/usersApiSlice';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import type { Location } from 'react-router-dom';
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

const LoginPage = () => {
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

  const [login, { isLoading, isSuccess }] = useLoginMutation();

  const onSubmit = async (data: LoginFormInput) => {
    try {
      await login(data).unwrap();
    } catch (error: any) {
      setErrorMessage(error.data?.message);
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => {
    const state = location.state as { from: Location };
    if (state && state.from.pathname) {
      return state.from.pathname;
    }
    return '/';
  }, [location]);

  useEffect(() => {
    if (isSuccess) {
      reset();
      navigate(from);
    }
  }, [from, isSuccess, navigate, reset]);

  const { data: currentUser, isFetching } =
    usersApiSlice.endpoints.getCurrentUser.useQueryState();

  if (isFetching) {
    return <p>Loading...</p>;
  }

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <form
      className="flex max-w-md flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      {errorMessage && <p>{errorMessage}</p>}

      <div className="flex flex-col">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          {...register('email')}
          disabled={isLoading || isSubmitting}
        />
        <p>{errors.email?.message}</p>
      </div>

      <div className="flex flex-col">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          {...register('password')}
          disabled={isLoading || isSubmitting}
        />
        <p>{errors.password?.message}</p>
      </div>

      <input
        type="submit"
        value={isLoading || isSubmitting ? 'Loading...' : 'Login'}
        disabled={isLoading || isSubmitting}
      />

      <p>
        Don&apos;t have an account?{' '}
        <Link to="/register">Create your account</Link>
      </p>
    </form>
  );
};

export default LoginPage;
