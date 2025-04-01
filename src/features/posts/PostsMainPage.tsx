import PostList from './PostList'
import { AddPostForm } from './AddPostForm'

export function PostsMainPage() {
  return (
    <div>
      <AddPostForm />
      <PostList />
    </div>
  )
}
