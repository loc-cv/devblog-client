type SpinnerProps = {
  className?: string;
};

export const Spinner = ({ className }: SpinnerProps) => {
  return <div className={`sk-plane ${className}`}></div>;
};
