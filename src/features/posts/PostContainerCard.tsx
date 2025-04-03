import classNames from 'classnames'
import { ReactNode } from 'react'

interface PostContainerCardProps {
  isFetching: boolean
  children: ReactNode
}

const PostContainerCard = ({
  isFetching,
  children,
}: PostContainerCardProps) => {
  const containerClassname = classNames('posts-container', {
    disabled: isFetching,
  })

  return <div className={containerClassname}>{children}</div>
}

export default PostContainerCard
