import React from 'react';

type ButtonProps = {
  type: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading: boolean;
  children: React.ReactNode;
};

export const Button = ({ type, disabled, children, loading }: ButtonProps) => {
  return (
    <button
      type={type}
      {...(disabled && { disabled })}
      className={`w-full rounded bg-black p-2 px-4 text-lg font-medium text-gray-100 ${
        (disabled || loading) && 'bg-gray-600'
      }`}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
