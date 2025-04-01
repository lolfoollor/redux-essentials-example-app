import { Link } from 'react-router-dom'
import PostAuthor from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { useAppSelector } from '@/app/hooks'
import { selectPostById } from './postsSlice'

export interface PostExcerptProps {
  postId: string
}

const PostExcerpt = ({ postId }: PostExcerptProps) => {
  const post = useAppSelector((state) => selectPostById(state, postId))

  return (
    <article className="post-excerpt">
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
    </article>
  )
}

export default PostExcerpt
