import { zodResolver } from '@hookform/resolvers/zod';
import { ITag } from 'features/api/interfaces';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useCreateNewTagMutation, useUpdateTagMutation } from '../tagsApiSlice';

const tagInputSchema = z.object({
  name: z
    .string({ required_error: 'Tag name is required' })
    .trim()
    .min(1, { message: 'Tag name is required' })
    .max(10, { message: 'Tag name character limit is 10 characters' }),

  description: z
    .string({ required_error: 'Tag description is required' })
    .trim()
    .min(1, { message: 'Tag description is required' })
    .max(100, { message: 'Tag description limit is 100 character' }),
});

export type TagInput = z.infer<typeof tagInputSchema>;

type TagFormProps = {
  tag?: ITag;
};

export const TagForm = ({ tag }: TagFormProps) => {
  const methods = useForm<TagInput>({
    resolver: zodResolver(tagInputSchema),
    defaultValues: {
      name: tag?.name || '',
      description: tag?.description || '',
    },
  });

  const [createNewTag, { isLoading: isNewTagLoading }] =
    useCreateNewTagMutation();
  const [updateTag, { isLoading: isUpdateTagLoading }] = useUpdateTagMutation();
  const isLoading = tag ? isUpdateTagLoading : isNewTagLoading;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: TagInput) => {
    try {
      let res;
      if (!tag) {
        res = await createNewTag(data).unwrap();
      } else {
        res = await updateTag({ name: tag.name, data }).unwrap();
      }
      reset();
      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Tag name input */}
      <div className="flex flex-col">
        <label htmlFor="name">Tag name</label>
        <input
          type="text"
          id="title"
          {...register('name')}
          disabled={isLoading || isSubmitting}
        />
        <p>{errors.name?.message}</p>
      </div>

      {/* Tag description input */}
      <div className="flex flex-col">
        <label htmlFor="description">Tag description</label>
        <textarea
          id="description"
          {...register('description')}
          disabled={isLoading || isSubmitting}
        />
        <p>{errors.description?.message}</p>
      </div>

      {/* Submit button */}
      <input
        type="submit"
        value={isLoading || isSubmitting ? 'Loading...' : 'Save tag'}
        disabled={isLoading || isSubmitting}
      />
    </form>
  );
};
