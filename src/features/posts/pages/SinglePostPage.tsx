import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { Link, useParams } from 'react-router-dom';
import { EditButton } from '../components/EditButton';
import { PostTag } from '../components/PostTag';
import { Reactions } from '../components/Reactions';
import { SaveButton } from '../components/SaveButton';
import { useGetSinglePostQuery } from '../postsApiSlice';

dayjs.extend(calendar);

type Params = {
  postId: string;
};

export const SinglePostPage = () => {
  const { postId } = useParams<keyof Params>() as Params;
  const { data: post, isLoading, error } = useGetSinglePostQuery(postId);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    if ('status' in error && error.status === 404) {
      return <p>There nothing here</p>;
    }
    return <p>Something went wrong</p>;
  }

  if (post) {
    return (
      <main>
        {/* Author and post update */}
        <div className="mb-5 flex items-center gap-3">
          <div>
            <img
              src={post.author.profilePhoto}
              alt="Author"
              className="h-12 w-12 rounded-full"
            />
          </div>
          <div>
            <Link to={`/profiles/${post.author.username}`} target="_blank">
              <p className="text-base font-bold text-gray-800 hover:text-black">
                {post.author.firstName} {post.author.lastName}
              </p>
            </Link>
            <div className="text-sm text-gray-600">
              {dayjs(post.updatedAt).calendar()}
            </div>
          </div>
        </div>

        {/* Post title */}
        <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
          {post.title}
        </h1>

        {/* Post tags */}
        <div className="mb-10 flex gap-1 border-b-2 border-b-gray-200 pb-10">
          {post.tags.map(tag => (
            <PostTag key={tag.name} name={tag.name} />
          ))}
        </div>

        {/* Post view count */}
        {/* <p>Views: {post.viewCount}</p> */}

        {/* Post summary */}
        <p className="mb-8 text-lg text-gray-700">{post.summary}</p>

        {/* Post content */}
        <div className="ql-snow mb-16">
          <div
            className="ql-editor p-0"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
        </div>

        {/* Likes/Dislikes/Save */}
        <div className="flex items-center justify-between">
          <Reactions post={post} />
          <div className="-mt-2 flex gap-2">
            <SaveButton postId={post._id} />
            <EditButton post={post} />
          </div>
        </div>
      </main>
    );
  }

  return null;
};
