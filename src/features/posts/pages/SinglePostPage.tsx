import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { Link, useParams } from 'react-router-dom';
import { EditButton } from '../components/EditButton';
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
        <div className="flex items-center gap-2">
          <div>
            <img
              src={post.author.profilePhoto}
              alt="Author"
              className="h-12 w-12 rounded"
            />
          </div>
          <div>
            <Link to={`/profiles/${post.author.username}`} target="_blank">
              <p>
                {post.author.firstName} {post.author.lastName}
              </p>
            </Link>
            <div>{dayjs(post.updatedAt).calendar()}</div>
          </div>
        </div>

        {/* Post title */}
        <h1>{post.title}</h1>

        {/* Post tags */}
        <div className="flex gap-3">
          {post.tags.map(tag => (
            <span key={tag.name}>{tag.name}</span>
          ))}
        </div>

        {/* Post view count */}
        <p>Views: {post.viewCount}</p>

        {/* Post summary */}
        <p>{post.summary}</p>

        {/* Post content */}
        <div className="ql-snow">
          <div
            className="ql-editor p-0"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
        </div>

        {/* Likes/Dislikes/Save */}
        <div className="flex gap-3">
          <Reactions post={post} />
          <SaveButton postId={post._id} />
          <EditButton post={post} />
        </div>
      </main>
    );
  }

  return null;
};
