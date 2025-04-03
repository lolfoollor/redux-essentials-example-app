import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  allNotificationsRead,
  selectMetadataEntities,
} from './notificationsSlice'
import NotificationCard from './NotificationCard'
import { useLayoutEffect } from 'react'
import { useGetNotificationsQuery } from './notificationsApiSlice'

const NotificationList = () => {
  const dispatch = useAppDispatch()
  const { data: notifications = [] } = useGetNotificationsQuery()
  const notificationsMetadata = useAppSelector(selectMetadataEntities)

  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  }, [])

  const renderedNotifications = notifications.map((notification) => {
    const metadata = notificationsMetadata[notification.id]

    return (
      <NotificationCard
        key={notification.id}
        notification={notification}
        isNew={metadata.isNew}
      />
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}

export default NotificationList
