import { defineStore } from 'pinia'

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
}

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as Category[],
    isLoading: false,
  }),

  getters: {
    getCategoryById: (state) => (id: string) =>
      state.categories.find((c) => c.id === id),
    getCategoryBySlug: (state) => (slug: string) =>
      state.categories.find((c) => c.slug === slug),
  },

  actions: {
    async fetchCategories() {
      if (this.categories.length > 0) return // cache
      this.isLoading = true
      try {
        const { apiFetch } = useApi()
        this.categories = await apiFetch<Category[]>('/api/categories')
      } finally {
        this.isLoading = false
      }
    },
  },
})
