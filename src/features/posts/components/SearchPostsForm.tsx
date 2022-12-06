import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from 'app/hooks';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { searchStringSet } from '../postsSlice';

const searchPostsInputSchema = z.object({
  title: z
    .string({ invalid_type_error: 'Post title must be a string ' })
    .trim()
    .optional(),

  // tags: z
  //   .array(z.string(), {
  //     invalid_type_error: 'Post tags must be an array of strings ',
  //   })
  //   .optional(),
});

export type SearchPostsInput = z.infer<typeof searchPostsInputSchema>;

export const SearchPostsForm = () => {
  // const searchString = useAppSelector(selectSearchString);

  const methods = useForm<SearchPostsInput>({
    resolver: zodResolver(searchPostsInputSchema),
    // defaultValues: {
    //   title: searchString,
    // },
  });

  const { register, handleSubmit } = methods;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(searchStringSet(''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: SearchPostsInput) => {
    dispatch(searchStringSet(data.title || ''));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative inline-block w-full sm:w-[50%]">
        <input
          type="text"
          {...register('title')}
          placeholder="Search for your posts..."
          className="w-full rounded border-gray-400 p-2 px-4 placeholder:text-gray-400"
        />
        <button className="absolute right-3 h-full" type="submit">
          <MagnifyingGlassIcon className="h-5 w-5 font-bold text-gray-500" />
        </button>
      </div>
    </form>
  );
};
