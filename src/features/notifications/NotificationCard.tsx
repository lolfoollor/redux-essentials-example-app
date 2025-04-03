import { NotificationMetadata, ServerNotification } from './notificationsSlice'
import PostAuthor from '../posts/PostAuthor'
import { TimeAgo } from '../posts/TimeAgo'
import classNames from 'classnames'

interface NotificationCardProps {
  notification: ServerNotification
  isNew: boolean
}

const NotificationCard = ({ notification, isNew }: NotificationCardProps) => {
  const notificationClassName = classNames('notification', {
    new: isNew,
  })

  return (
    <div className={notificationClassName}>
      <div>
        <b>
          <PostAuthor userId={notification.user} showPrefix={false} />
        </b>{' '}
        {notification.message}
      </div>
      <TimeAgo timestamp={notification.date} />
    </div>
  )
}

export default NotificationCard
