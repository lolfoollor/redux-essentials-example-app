import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectCurrentUser } from '@/features/users/usersSlice'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { UserIcon } from './UserIcon'
import { logout } from '@/features/auth/authSlice'
import {
  fetchNotificationsWebsocket,
  selectUnreadNotificationsCount,
} from '@/features/notifications/notificationsSlice'
import { useGetNotificationsQuery } from '@/features/notifications/notificationsApiSlice'

export const Navbar = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)
  const numUnreadNotifications = useAppSelector(selectUnreadNotificationsCount)
  useGetNotificationsQuery()

  const isLoggedIn = !!user

  let navContent: ReactNode = null

  if (isLoggedIn) {
    const onLogoutClicked = () => {
      dispatch(logout())
    }

    const fetchNewNotifications = () => {
      dispatch(fetchNotificationsWebsocket())
    }

    const unreadNotificationsBadge = numUnreadNotifications > 0 && (
      <span className="badge">{numUnreadNotifications}</span>
    )

    navContent = (
      <div className="navContent">
        <div className="navLinks">
          <Link to="/posts">Posts</Link>
          <Link to="/users">Users</Link>
          <Link to="/notifications">
            Notifications {unreadNotificationsBadge}
          </Link>
          <button className="button small" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
        </div>
        <div className="userDetails">
          <UserIcon size={32} />
          {user.name}
          <button className="button small" onClick={onLogoutClicked}>
            Log Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>
        {navContent}
      </section>
    </nav>
  )
}
