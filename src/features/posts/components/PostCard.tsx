import { IPost } from 'features/api/interfaces';
import { Link } from 'react-router-dom';
import { EditButton } from './EditButton';
import { PostTag } from './PostTag';
import { SaveButton } from './SaveButton';

type PostCardProps = {
  post: IPost;
};

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <article
      key={post._id}
      className="border-t-2 border-t-gray-200 py-10 lg:flex lg:justify-between"
    >
      <div className="mb-5 flex items-center justify-between lg:w-52 lg:items-start">
        {/* Post updated at */}
        <div className="text-base text-gray-600 lg:text-lg">
          {post.updatedAt}
        </div>

        {/* Likes/Dislikes/Save/Edit */}
        <div className="flex gap-1 lg:hidden">
          <SaveButton postId={post._id} />
          <EditButton post={post} />
        </div>
      </div>

      <div className="lg:w-[60%]">
        <div className="mb-2 flex items-baseline justify-between lg:mb-4">
          {/* Post author */}
          <div className="flex items-center gap-1">
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

          {/* Likes/Dislikes/Save/Edit */}
          <div className="hidden lg:flex lg:gap-1">
            <SaveButton postId={post._id} />
            <EditButton post={post} />
          </div>
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
            <PostTag name={tag.name} key={tag.name} />
          ))}
        </div>

        {/* Post summary */}
        <p className="text-base text-gray-700">{post.summary}</p>
      </div>
    </article>
  );
};
