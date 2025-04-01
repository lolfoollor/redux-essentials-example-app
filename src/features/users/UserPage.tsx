import { useAppSelector } from '@/app/hooks'
import { Link, useParams } from 'react-router-dom'
import { selectUserById } from './usersSlice'
import { selectPostsByUser } from '../posts/postsSlice'
import UserNotFound from './UserNotFound'

const UserPage = () => {
  const { userId } = useParams()
  const user = useAppSelector((state) => selectUserById(state, userId!))
  const postsForUser = useAppSelector((state) => selectPostsByUser(state, userId!))

  if (!user) {
    return <UserNotFound />
  }

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>
      <ul>{postTitles}</ul>
    </section>
  )
}

export default UserPage
