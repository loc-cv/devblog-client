import { zodResolver } from '@hookform/resolvers/zod';
import { IPost } from 'features/api/interfaces';
import { TagsSelect } from 'features/tags/components/TagsSelect';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
import {
  useCreateNewPostMutation,
  useUpdatePostMutation,
} from '../postsApiSlice';
import { Editor } from './quillEditor/Editor';

const postInputSchema = z.object({
  title: z
    .string({
      invalid_type_error: 'Post title must be a string',
      required_error: 'Post title is required',
    })
    .trim()
    .min(1, { message: 'Post title is required' })
    .max(100, { message: 'Post title character limit is 100 characters' }),

  summary: z
    .string({
      invalid_type_error: 'Post summary must be a string',
      required_error: 'Post summary is required',
    })
    .trim()
    .min(1, { message: 'Post summary is required' })
    .max(200, { message: 'Post summary character limit is 200 characters' }),

  content: z
    .string({
      invalid_type_error: 'Post content must be a string',
      required_error: 'Post content is required',
    })
    .trim()
    .min(1, { message: 'Post content is required' })
    .refine(val => !val.startsWith('<p><br></p>'), {
      message: 'Post content is required',
    }),

  tags: z
    .array(z.string(), {
      required_error: 'Post tags are required',
      invalid_type_error: 'Post tags must be an array of strings',
    })
    .min(1, { message: 'Please provide at least 1 tag' })
    .max(4, { message: 'Please provide up to 4 tags' }),
});

export type PostInput = z.input<typeof postInputSchema>;

type PostFormProps = {
  post?: IPost;
};

export const PostForm = ({ post }: PostFormProps) => {
  const methods = useForm<PostInput>({
    resolver: zodResolver(postInputSchema),
    defaultValues: {
      title: post?.title || '',
      tags: post ? post.tags.map(tag => tag.name) : [],
      summary: post?.summary || '',
      content: post?.content || '',
    },
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [createNewPost, { isLoading: isNewPostLoading }] =
    useCreateNewPostMutation();
  const [updatePost, { isLoading: isUpdatePostLoading }] =
    useUpdatePostMutation();
  const isLoading = post ? isUpdatePostLoading : isNewPostLoading;

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: PostInput) => {
    try {
      let res;
      if (!post) {
        res = await createNewPost(data).unwrap();
      } else {
        res = await updatePost({ id: post._id, data }).unwrap();
      }
      reset();
      toast.success('Your post has been successfully published');
      const returnedPostId = res.data?.post?.id;
      if (returnedPostId) {
        navigate(`/posts/${returnedPostId}`);
      } else {
        navigate('/posts');
      }
    } catch (error: any) {
      setErrorMessage(error.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errorMessage && <p>{errorMessage}</p>}

      {/* Post title input */}
      <div className="mb-6 flex flex-col text-gray-700">
        <label
          htmlFor="title"
          className="mb-1 text-base font-medium md:text-xl"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          {...register('title')}
          disabled={isLoading || isSubmitting}
          placeholder="An Awesome Post Is Coming"
          className="rounded p-2 px-4 text-base font-bold placeholder:text-gray-400 md:text-2xl"
        />
        <p className="mt-1 text-sm text-red-500">{errors.title?.message}</p>
      </div>

      {/* Post tags input */}
      <div className="mb-6">
        <Controller
          name="tags"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <TagsSelect
                value={value}
                onChange={onChange}
                disabled={isLoading || isSubmitting}
              />
            );
          }}
        />
        <p className="mt-1 text-sm text-red-500">{errors.tags?.message}</p>
      </div>

      {/* Post summary input */}
      <div className="mb-8 flex flex-col text-gray-700">
        <label htmlFor="summary" className="mb-1 text-base font-medium">
          Summary
        </label>
        <textarea
          id="summary"
          {...register('summary')}
          disabled={isLoading || isSubmitting}
          placeholder="This post is gonna be awesome"
          className="min-h-[100px] rounded p-2 px-4 placeholder:text-gray-400"
        />
        <p className="mt-1 text-sm text-red-500">{errors.summary?.message}</p>
      </div>

      {/* Post content input */}
      <div className="mb-8">
        <Controller
          name="content"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Editor
                onChange={onChange}
                value={value}
                disabled={isLoading || isSubmitting}
              />
            );
          }}
        />
        <p className="mt-1 text-sm text-red-500">{errors.content?.message}</p>
      </div>

      {/* Submit button */}
      <input
        className={`rounded p-2 px-4 font-semibold text-gray-100 hover:cursor-pointer hover:bg-gray-700 ${
          isLoading || isSubmitting ? 'bg-gray-700' : 'bg-black'
        }`}
        type="submit"
        value={isLoading || isSubmitting ? 'Loading...' : 'Save / Publish'}
        disabled={isLoading || isSubmitting}
      />
    </form>
  );
};
