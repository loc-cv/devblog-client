import { IPost } from 'features/api/interfaces';
import { Link } from 'react-router-dom';
import { EditButton } from './EditButton';
import { SaveButton } from './SaveButton';

type PostCardProps = {
  post: IPost;
};

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <article key={post._id} className="border-t-2 border-t-gray-200 py-10">
      <div className="mb-5 flex items-center justify-between">
        {/* Post updated at */}
        <div className="text-lg text-gray-600">{post.updatedAt}</div>

        {/* Likes/Dislikes/Save/Edit */}
        <div className="flex justify-end gap-1">
          <SaveButton postId={post._id} />
          <EditButton post={post} />
        </div>
      </div>

      <div>
        {/* Post author */}
        <div className="mb-4 flex items-center gap-1">
          <img
            src={post.author.profilePhoto}
            alt="Author"
            className="h-5 w-5 rounded-full"
          />
          <Link to={`/profiles/${post.author.username}`} target="_blank">
            <p className="text-sm font-bold text-gray-800">
              {post.author.firstName} {post.author.lastName}
            </p>
          </Link>
        </div>

        {/* Post title */}
        <Link to={`/posts/${post._id}`}>
          <h2 className="mb-3 text-3xl font-bold leading-8 text-gray-800 hover:text-black">
            {post.title}
          </h2>
        </Link>

        {/* Post tags */}
        <div className="mb-4 flex gap-2">
          {post.tags.map(tag => (
            <span
              key={tag.name}
              className="rounded bg-blue-200 p-1 px-2 text-xs font-medium hover:bg-blue-400"
            >
              {tag.name.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Post summary */}
        <p className="text-base text-gray-700">{post.summary}</p>
      </div>
    </article>
  );
};
