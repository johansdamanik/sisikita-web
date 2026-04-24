/**
 * Composable for making API calls to the SisiKita backend.
 * Auto-attaches JWT token and handles token refresh on 401.
 * Shows toast notification on API errors.
 */
import { useAuthStore } from '~/stores/auth'

export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const { showError } = useToast()

  const baseURL = config.public.apiBase || 'http://localhost:3001'

  const apiFetch = $fetch.create({
    baseURL,
    onRequest({ options }) {
      const token = authStore.token
      if (token) {
        options.headers = new Headers(options.headers || {})
        options.headers.set('Authorization', `Bearer ${token}`)
      }
    },
    onResponse({ response }) {
      // Unwrap standard API response wrapper if data exists
      if (response._data && response._data.data !== undefined) {
        response._data = response._data.data
      }
    },
    async onResponseError({ response }) {
      const status = response.status
      const data = response._data as any

      if (status === 401) {
        // Token expired or invalid — logout and redirect
        authStore.logout()
        await navigateTo('/login')
        return
      }

      // Show toast for other errors
      const message = data?.message || `Terjadi kesalahan (${status})`
      showError(message)
    },
  })

  return { apiFetch, baseURL }
}
