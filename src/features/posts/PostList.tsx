import { Spinner } from '@/components/Spinner'
import PostExcerpt from './PostExcerpt'
import { useGetPostsQuery } from '@/features/api/apiSlice'
import { useMemo } from 'react'
import PostContainerCard from './PostContainerCard'

const PostList = () => {
  const {
    data: posts = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetPostsQuery()

  const sortedPosts = useMemo(() => {
    const sortedPosts = [...posts]
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])

  if (isLoading) {
    return <Spinner text="Loading..." />
  }

  if (isSuccess && posts.length === 0) {
    return <div>No posts available.</div>
  }

  if (isError) {
    return <div>{error.toString()}</div>
  }

  const renderedPosts =
    posts?.length !== 0 ? (
      <PostContainerCard isFetching={isFetching}>
        {sortedPosts.map((post) => (
          <PostExcerpt post={post} key={post.id} />
        ))}
      </PostContainerCard>
    ) : null

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      <button onClick={refetch}>Refetch Posts</button>
      {renderedPosts}
    </section>
  )
}

export default PostList
