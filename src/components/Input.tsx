import { useFormContext } from 'react-hook-form';

type InputProps = {
  label?: string;
  type: React.HTMLInputTypeAttribute;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string | number;
};

export const Input = ({
  label,
  type,
  name,
  placeholder,
  disabled,
  value,
}: InputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<any>();

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-gray-800">
          {label}
        </label>
      )}
      <input
        {...(value && { value })}
        type={type}
        id={name}
        {...register(name)}
        {...(disabled && { disabled })}
        {...(placeholder && { placeholder })}
        className={`rounded p-2 ${disabled && 'bg-gray-100'}`}
      />
      <p className="text-sm text-red-500">
        {errors[name]?.message as unknown as string}
      </p>
    </div>
  );
};
