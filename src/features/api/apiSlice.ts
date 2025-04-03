import {
  NewPost,
  Post,
  PostUpdate,
  ReactionName,
} from '@/features/posts/postsSlice'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_API_URL, POST_API_URL, REACTION_API_URL } from './apiRoutes'

const POST_TAG = 'Post'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL }),
  tagTypes: [POST_TAG],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => POST_API_URL,
      providesTags: (result = [], error, arg) => [
        POST_TAG,
        ...result.map(({ id }) => ({ type: POST_TAG, id }) as const),
      ],
    }),
    getPost: builder.query<Post, string>({
      query: (postId) => `${POST_API_URL}/${postId}`,
      providesTags: (result, error, arg) => [{ type: POST_TAG, id: arg }],
    }),
    addNewPost: builder.mutation<Post, NewPost>({
      query: (initialPost) => ({
        url: POST_API_URL,
        method: 'POST',
        body: initialPost,
      }),
      invalidatesTags: [POST_TAG],
    }),
    editPost: builder.mutation<Post, PostUpdate>({
      query: (updatedPost) => ({
        url: `${POST_API_URL}/${updatedPost.id}`,
        method: 'PATCH',
        body: updatedPost,
      }),
      invalidatesTags: (result, error, arg) => [{ type: POST_TAG, id: arg.id }],
    }),
    addReaction: builder.mutation<
      Post,
      { postId: string; reaction: ReactionName }
    >({
      query: ({ postId, reaction }) => ({
        url: `${POST_API_URL}/${postId}${REACTION_API_URL}`,
        method: 'POST',
        body: { reaction },
      }),
      async onQueryStarted({ postId, reaction }, lifecycleApi) {
        const getPostsPatchResult = lifecycleApi.dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            const post = draft.find((post) => post.id === postId)
            if (post) {
              post.reactions[reaction]++
            }
          }),
        )
        const getPostPatchResult = lifecycleApi.dispatch(
          apiSlice.util.updateQueryData('getPost', postId, (draft) => {
            draft.reactions[reaction]++
          }),
        )

        try {
          await lifecycleApi.queryFulfilled
        } catch {
          getPostsPatchResult.undo()
          getPostPatchResult.undo()
        }
      },
    }),
  }),
})

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useAddNewPostMutation,
  useEditPostMutation,
  useAddReactionMutation,
} = apiSlice
