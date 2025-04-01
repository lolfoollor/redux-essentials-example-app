import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { allNotificationsRead, selectAllNotifications } from './notificationsSlice'
import NotificationCard from './NotificationCard'
import { useLayoutEffect } from 'react'

const NotificationList = () => {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector(selectAllNotifications)

  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  }, [])

  const renderedNotifications = notifications.map((notification) => (
    <NotificationCard key={notification.id} notification={notification} />
  ))

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}

export default NotificationList
