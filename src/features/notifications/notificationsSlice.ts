import { AppThunk, RootState } from '@/app/store'
import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit'
import { forceGenerateNotifications } from '@/api/server'
import {
  matchNotificationsReceived,
  notificationApiSlice,
  selectNotificationsResult,
} from './notificationsApiSlice'

export interface ServerNotification {
  id: string
  date: string
  message: string
  user: string
}

export interface NotificationMetadata {
  id: string
  read: boolean
  isNew: boolean
}

const emptyNotifications: ServerNotification[] = []
const selectNotificationsData = createSelector(
  selectNotificationsResult,
  (notificationsResult) => notificationsResult.data ?? emptyNotifications,
)

export const fetchNotificationsWebsocket =
  (): AppThunk => (dispatch, getState) => {
    const allNotifications = selectNotificationsData(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification?.date ?? ''

    forceGenerateNotifications(latestTimestamp)
  }

const metadataAdapter = createEntityAdapter<NotificationMetadata>()
const initialState = metadataAdapter.getInitialState()

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead: (state) => {
      Object.values(state.entities).forEach((metadata) => {
        metadata.read = true
      })
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(matchNotificationsReceived, (state, action) => {
      const notificationsMetaData: NotificationMetadata[] = action.payload.map(
        (notification) => ({
          id: notification.id,
          read: false,
          isNew: true,
        }),
      )

      Object.values(state.entities).forEach((metadata) => {
        metadata.isNew = !metadata.read
      })

      metadataAdapter.upsertMany(state, notificationsMetaData)
    })
  },
})

export const { allNotificationsRead } = notificationsSlice.actions
export default notificationsSlice.reducer

export const {
  selectAll: selectAllNotificationsMetadata,
  selectEntities: selectMetadataEntities,
} = metadataAdapter.getSelectors((state: RootState) => state.notifications)

export const selectUnreadNotificationsCount = (state: RootState) => {
  const allMetadata = selectAllNotificationsMetadata(state)
  const unreadNotifications = allMetadata.filter((metadata) => !metadata.read)
  return unreadNotifications.length
}
