import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useNavigate, useParams } from 'react-router-dom'
import PostNotFound from './PostNotFound'
import { FormEvent } from 'react'
import { postUpdated, selectPostById } from './postsSlice'

interface EditPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
}

interface EditPostFormElements extends HTMLFormElement {
  readonly elements: EditPostFormFields
}

const EditPostForm = () => {
  const { postId } = useParams()
  const post = useAppSelector((state) => selectPostById(state, postId!))
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  if (!post) {
    return <PostNotFound />
  }

  const onSavePostClicked = (e: FormEvent<EditPostFormElements>) => {
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value
    const updatedDate = new Date().toISOString()

    if (title && content) {
      dispatch(postUpdated({ id: post.id, title, content, date: updatedDate }))
      navigate(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form onSubmit={onSavePostClicked}>
        <label htmlFor="postTitle">Post Title:</label>
        <input type="text" id="postTitle" name="postTitle" defaultValue={post.title} required />
        <label htmlFor="postContent">Content:</label>
        <textarea id="postContent" name="postContent" defaultValue={post.content} required />

        <button>Save Post</button>
      </form>
    </section>
  )
}

export default EditPostForm
