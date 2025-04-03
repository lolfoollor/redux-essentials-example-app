import { RootState } from '@/app/store'
import { selectCurrentUsername } from '../auth/authSlice'
import { apiSlice } from '../api/apiSlice'
import {
  createEntityAdapter,
  createSelector,
  EntityState,
} from '@reduxjs/toolkit'
import { USER_API_URL } from '../api/apiRoutes'

export interface User {
  id: string
  name: string
}

const usersAdapter = createEntityAdapter<User>()
const initialState = usersAdapter.getInitialState()

export const apiSliceWithUsers = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<User, string>, void>({
      query: () => USER_API_URL,
      transformResponse(res: User[]) {
        return usersAdapter.setAll(initialState, res)
      },
    }),
  }),
})

export const { useGetUsersQuery } = apiSliceWithUsers

export const selectUsersResult = apiSliceWithUsers.endpoints.getUsers.select()

export const selectUsersData = createSelector(
  selectUsersResult,
  (result) => result?.data ?? initialState,
)

export const selectCurrentUser = (state: RootState) => {
  const currentUsername = selectCurrentUsername(state)
  if (currentUsername) {
    return selectUserById(state, currentUsername)
  }
}

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors(selectUsersData)

// export default usersSlice.reducer
// export const { selectAll: selectAllUsers, selectById: selectUserById } =
//   usersAdapter.getSelectors((state: RootState) => state.users)
// export const selectCurrentUser = (state: RootState) => {
//   const currentUsername = selectCurrentUsername(state)
//   if (!currentUsername) return
//   return selectUserById(state, currentUsername)
// }
