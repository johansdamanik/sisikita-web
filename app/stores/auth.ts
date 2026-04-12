import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name?: string
  isProfileComplete?: boolean
  role?: 'USER' | 'ADMIN'
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    refreshToken: null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async register(email: string, password: string, confirmPassword: string) {
      this.isLoading = true
      try {
        const { apiFetch } = useApi()
        const data = await apiFetch<any>('/api/auth/register', {
          method: 'POST',
          body: { email, password, confirmPassword },
        })
        this.token = data.accessToken
        this.refreshToken = data.refreshToken
        this.user = data.user
        this.persistAuth()
        return data
      } finally {
        this.isLoading = false
      }
    },

    async login(email: string, password: string) {
      this.isLoading = true
      try {
        const { apiFetch } = useApi()
        const data = await apiFetch<any>('/api/auth/login', {
          method: 'POST',
          body: { email, password },
        })
        this.token = data.accessToken
        this.refreshToken = data.refreshToken
        this.user = data.user
        this.persistAuth()
        return data
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.refreshToken = null
      if (import.meta.client) {
        localStorage.removeItem('sisikita_auth')
      }
    },

    persistAuth() {
      if (import.meta.client) {
        localStorage.setItem(
          'sisikita_auth',
          JSON.stringify({
            user: this.user,
            token: this.token,
            refreshToken: this.refreshToken,
          }),
        )
      }
    },

    restoreAuth() {
      if (import.meta.client) {
        const stored = localStorage.getItem('sisikita_auth')
        if (stored) {
          const data = JSON.parse(stored)
          this.user = data.user
          this.token = data.token
          this.refreshToken = data.refreshToken
        }
      }
    },
  },
})
