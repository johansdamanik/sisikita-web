import { defineStore } from 'pinia'

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  data: Record<string, any> | null
  isRead: boolean
  createdAt: string
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[],
    unreadCount: 0,
    isLoading: false,
    intervalId: null as any,
  }),

  getters: {
    hasUnread: (state) => state.unreadCount > 0,
  },

  actions: {
    async fetchNotifications() {
      this.isLoading = true
      try {
        const { apiFetch } = useApi()
        this.notifications = await apiFetch<Notification[]>('/api/notifications')
      } catch (error) {
        console.error('Failed to fetch notifications', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchUnreadCount() {
      try {
        const { apiFetch } = useApi()
        const { count } = await apiFetch<{ count: number }>('/api/notifications/unread-count')
        this.unreadCount = count
      } catch (error) {
        console.error('Failed to fetch unread count', error)
      }
    },

    async markAsRead(id: string) {
      try {
        const { apiFetch } = useApi()
        await apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
        
        // Optimistic update
        const notif = this.notifications.find((n) => n.id === id)
        if (notif && !notif.isRead) {
          notif.isRead = true
          this.unreadCount = Math.max(0, this.unreadCount - 1)
        }
      } catch (error) {
        console.error('Failed to mark notification as read', error)
      }
    },

    async markAllAsRead() {
      try {
        const { apiFetch } = useApi()
        await apiFetch('/api/notifications/read-all', { method: 'PATCH' })
        
        // Optimistic update
        this.notifications.forEach((n) => (n.isRead = true))
        this.unreadCount = 0
      } catch (error) {
        console.error('Failed to mark all as read', error)
      }
    },

    startPolling() {
      if (this.intervalId) return
      // Fetch immediately
      this.fetchUnreadCount()
      // Poll every 30 seconds
      if (import.meta.client) {
        this.intervalId = setInterval(() => {
          this.fetchUnreadCount()
        }, 30000)
      }
    },

    stopPolling() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
    },
  },
})
