import { defineStore } from 'pinia'

interface MatchGroup {
  userPost: {
    id: string
    title: string
    slug: string
    category: string
    side: string
    size: string
    type: string
    city: string
  }
  matches: MatchResult[]
  matchCount: number
}

interface MatchResult {
  partnerPost: {
    id: string
    title: string
    slug: string
    category: string
    side: string
    size: string
    type: string
    city: string
    description: string | null
    imageUrl: string | null
    createdAt: string
  }
  partner: {
    id: string
    name: string
    city: string
    phone: string
    avatarUrl: string | null
  }
  matchReasons: {
    label: string
    detail: string
    icon: string
  }[]
}

export const useMatchStore = defineStore('match', {
  state: () => ({
    matchGroups: [] as MatchGroup[],
    isLoading: false,
  }),

  getters: {
    totalMatches: (state) =>
      state.matchGroups.reduce((sum, g) => sum + g.matchCount, 0),
  },

  actions: {
    async fetchMatches() {
      this.isLoading = true
      try {
        const { apiFetch } = useApi()
        this.matchGroups = await apiFetch<MatchGroup[]>('/api/matches')
      } finally {
        this.isLoading = false
      }
    },
  },
})
