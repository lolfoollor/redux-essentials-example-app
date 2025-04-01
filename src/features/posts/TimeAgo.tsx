import { formatDistanceToNow, parseISO } from 'date-fns'

interface TimeAgoProps {
  timestamp: string
}

export const TimeAgo = ({ timestamp }: TimeAgoProps) => {
  if (!timestamp) return null

  const date = parseISO(timestamp)
  const timePeriod = formatDistanceToNow(date)
  const timeAgo = `${timePeriod} ago`

  return (
    <time dateTime={timestamp} title={timestamp}>
      &nbsp; <i>{timeAgo}</i>
    </time>
  )
}
