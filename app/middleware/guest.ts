import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (import.meta.client) {
    authStore.restoreAuth()
  }

  if (authStore.isAuthenticated) {
    return navigateTo('/explore')
  }
})
