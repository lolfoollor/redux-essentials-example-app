import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useNavigate, useParams } from 'react-router-dom'
import PostNotFound from './PostNotFound'
import { FormEvent } from 'react'
import { useEditPostMutation, useGetPostQuery } from '../api/apiSlice'

interface EditPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement
  postContent: HTMLTextAreaElement
}

interface EditPostFormElements extends HTMLFormElement {
  readonly elements: EditPostFormFields
}

const EditPostForm = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { data: post } = useGetPostQuery(postId!)
  const [updatePost, { isLoading }] = useEditPostMutation()

  if (!post) {
    return <PostNotFound />
  }

  const onSavePostClicked = async (e: FormEvent<EditPostFormElements>) => {
    e.preventDefault()

    const { elements } = e.currentTarget
    const title = elements.postTitle.value
    const content = elements.postContent.value
    const updatedDate = new Date().toISOString()

    if (title && content) {
      await updatePost({ id: post.id, title, content, date: updatedDate })
      navigate(`/posts/${postId}`)
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form onSubmit={onSavePostClicked}>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          defaultValue={post.title}
          required
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          defaultValue={post.content}
          required
        />

        <button>Save Post</button>
      </form>
    </section>
  )
}

export default EditPostForm
