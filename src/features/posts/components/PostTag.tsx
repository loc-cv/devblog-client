type PostTagProps = {
  name: string;
};

export const PostTag = ({ name }: PostTagProps) => {
  return (
    <span className="rounded bg-blue-200 p-1 px-2 text-xs font-medium hover:bg-blue-400">
      {name.toUpperCase()}
    </span>
  );
};
