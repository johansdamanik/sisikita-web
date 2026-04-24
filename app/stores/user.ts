import { defineStore } from 'pinia'

interface UserProfile {
  id: string
  email: string
  name: string | null
  phone: string | null
  city: string | null
  address: string | null
  needType: string | null
  primarySide: string
  avatarUrl: string | null
  isProfileComplete: boolean
  sizeProfiles: SizeProfile[]
}

interface SizeProfile {
  id: string
  categoryId: string
  size: string
  sizeDetail: string | null
  category: {
    id: string
    name: string
    slug: string
    icon: string
  }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as UserProfile | null,
    isLoading: false,
  }),

  getters: {
    isProfileComplete: (state) => state.profile?.isProfileComplete ?? false,
    sizeProfiles: (state) => state.profile?.sizeProfiles ?? [],
  },

  actions: {
    async fetchProfile() {
      this.isLoading = true
      try {
        const { apiFetch } = useApi()
        this.profile = await apiFetch<UserProfile>('/api/v1/users/me')
      } finally {
        this.isLoading = false
      }
    },

    async updateProfile(data: Record<string, any>) {
      const { apiFetch } = useApi()
      this.profile = await apiFetch<UserProfile>('/api/v1/users/me', {
        method: 'PATCH',
        body: data,
      })
      return this.profile
    },

    async addSizeProfile(data: { categoryId: string; size: string; sizeDetail?: string }) {
      const { apiFetch } = useApi()
      const sizeProfile = await apiFetch<SizeProfile>('/api/v1/size-profiles', {
        method: 'POST',
        body: data,
      })
      // Re-fetch profile to get updated size profiles
      await this.fetchProfile()
      return sizeProfile
    },

    async deleteSizeProfile(id: string) {
      const { apiFetch } = useApi()
      await apiFetch(`/api/v1/size-profiles/${id}`, { method: 'DELETE' })
      await this.fetchProfile()
    },
  },
})
