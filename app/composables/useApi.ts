/**
 * Composable for making API calls to the SisiKita backend.
 * Auto-attaches JWT token and handles token refresh on 401.
 */
import { useAuthStore } from '~/stores/auth'

export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

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
    async onResponseError({ response }) {
      if (response.status === 401) {
        // Try to refresh token, or logout
        authStore.logout()
        await navigateTo('/login')
      }
    },
  })

  return { apiFetch, baseURL }
}
