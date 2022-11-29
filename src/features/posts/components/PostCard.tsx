import { IPost } from 'features/api/interfaces';
import { Link } from 'react-router-dom';
import { EditButton } from './EditButton';
import { SaveButton } from './SaveButton';

type PostCardProps = {
  post: IPost;
};

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <article
      key={post._id}
      className="border-t-2 border-t-gray-200 py-10 md:flex md:items-start md:justify-start"
    >
      {/* Post updated at */}
      <div className="md:w-80">{post.updatedAt}</div>

      <div>
        {/* Post author */}
        <div className="flex gap-2">
          <img
            src={post.author.profilePhoto}
            alt="Author"
            className="h-6 w-6 rounded"
          />
          <Link to={`/profiles/${post.author.username}`} target="_blank">
            <p>
              {post.author.firstName} {post.author.lastName}
            </p>
          </Link>
        </div>

        {/* Post title */}
        <Link to={`/posts/${post._id}`}>
          <h2 className="text-3xl font-bold">{post.title}</h2>
        </Link>

        {/* Post tags */}
        <div className="flex gap-2">
          {post.tags.map(tag => (
            <div key={tag.name}>{tag.name}</div>
          ))}
        </div>

        {/* Post summary */}
        <p>{post.summary}</p>

        {/* Likes/Dislikes/Save/Edit */}
        <div className="flex gap-3">
          {/* <button>Likes: {post.likes.length}</button> */}
          {/* <button>Dislikes: {post.dislikes.length}</button> */}
          <SaveButton postId={post._id} />
          <EditButton post={post} />
        </div>
      </div>
    </article>
  );
};
