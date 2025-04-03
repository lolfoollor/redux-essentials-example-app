import { createAction, isAnyOf } from '@reduxjs/toolkit'
import { NOTIFICATION_API_URL } from '../api/apiRoutes'
import { apiSlice } from '../api/apiSlice'
import { ServerNotification } from './notificationsSlice'

const notificationsReceived = createAction<ServerNotification[]>(
  'notifications/notificationsReceived',
)
const WEB_SOCKET_LINK = 'ws://localhost'

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<ServerNotification[], void>({
      query: () => NOTIFICATION_API_URL,
      async onCacheEntryAdded(arg, lifecycleApi) {
        const ws = new WebSocket(WEB_SOCKET_LINK)
        try {
          await lifecycleApi.cacheDataLoaded

          const listener = (event: MessageEvent<string>) => {
            const message: {
              type: 'notifications'
              payload: ServerNotification[]
            } = JSON.parse(event.data)

            switch (message.type) {
              case 'notifications': {
                lifecycleApi.updateCachedData((draft) => {
                  draft.push(...message.payload)
                  draft.sort((a, b) => b.date.localeCompare(a.date))
                })
                lifecycleApi.dispatch(notificationsReceived(message.payload))
                break
              }
              default:
                break
            }
          }

          ws.addEventListener('message', listener)
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }

        await lifecycleApi.cacheEntryRemoved
        ws.close()
      },
    }),
  }),
})

export const { useGetNotificationsQuery } = notificationApiSlice
export const selectNotificationsResult =
  notificationApiSlice.endpoints.getNotifications.select()

export const matchNotificationsReceived = isAnyOf(
  notificationsReceived,
  notificationApiSlice.endpoints.getNotifications.matchFulfilled,
)
