import { zodResolver } from '@hookform/resolvers/zod';
import { usersApiSlice } from 'features/users/usersApiSlice';
import { useEffect, useState } from 'react';
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const [errorMessage, setErrorMessage] = useState('');

  const [registerUser, { isLoading, isSuccess }] = useRegisterMutation();

  const onSubmit = async (data: RegisterFormInput) => {
    try {
      await registerUser(data).unwrap();
    } catch (error: any) {
      setErrorMessage(error.data.message);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      reset();
      navigate('/');
    }
  }, [isSuccess, navigate, reset]);

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
        <label htmlFor="email">Email</label>
        <input
          type="email"
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

      <div className="flex flex-col">
        <label htmlFor="passwordConfirm">Confirm password</label>
        <input
          type="password"
          id="passwordConfirm"
          {...register('passwordConfirm')}
          disabled={isLoading || isSubmitting}
        />
        <p>{errors.passwordConfirm?.message}</p>
      </div>

      <input
        type="submit"
        value={isLoading || isSubmitting ? 'Loading...' : 'Register'}
        disabled={isLoading || isSubmitting}
      />

      <p>
        Already registered? <Link to="/login">Log into your account</Link>
      </p>
    </form>
  );
};
