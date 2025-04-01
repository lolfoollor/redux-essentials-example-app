import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchPosts, selectAllPosts, selectPostIds, selectPostsError, selectPostsStatus } from './postsSlice'
import { useEffect, useMemo } from 'react'
import { Spinner } from '@/components/Spinner'
import PostExcerpt from './PostExcerpt'
import { useSelector } from 'react-redux'

const PostList = () => {
  const dispatch = useAppDispatch()
  const posts = useAppSelector(selectAllPosts)
  const postStatus = useAppSelector(selectPostsStatus)
  const postsError = useAppSelector(selectPostsError)
  const orderedPostIds = useSelector(selectPostIds)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  if (postStatus === 'pending') {
    return <Spinner text="Loading..." />
  }

  if (postStatus === 'succeeded' && posts.length === 0) {
    return <div>No posts available.</div>
  }

  if (postStatus === 'rejected') {
    return <div>{postsError}</div>
  }

  const renderedPosts =
    posts?.length !== 0 ? orderedPostIds.map((postId) => <PostExcerpt postId={postId} key={postId} />) : null

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}

export default PostList
