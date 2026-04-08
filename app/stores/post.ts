import { defineStore } from 'pinia'

interface Post {
  id: string
  title: string
  slug: string
  type: string
  side: string
  size: string
  description: string | null
  imageUrl: string | null
  city: string
  status: string
  createdAt: string
  category: { id: string; name: string; slug: string; icon: string }
  user: { id: string; name: string; city: string; avatarUrl: string | null; phone?: string }
}

interface PostMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [] as Post[],
    currentPost: null as Post | null,
    myPosts: [] as Post[],
    meta: null as PostMeta | null,
    isLoading: false,
  }),

  actions: {
    async fetchPosts(filters: Record<string, any> = {}) {
      this.isLoading = true
      try {
        const { apiFetch } = useApi()
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            params.set(key, String(val))
          }
        })
        const result = await apiFetch<{ data: Post[]; meta: PostMeta }>(
          `/api/posts?${params.toString()}`,
        )
        this.posts = result.data
        this.meta = result.meta
      } finally {
        this.isLoading = false
      }
    },

    async fetchPostBySlug(slug: string) {
      this.isLoading = true
      try {
        const { apiFetch } = useApi()
        this.currentPost = await apiFetch<Post>(`/api/posts/${slug}`)
      } finally {
        this.isLoading = false
      }
    },

    async fetchMyPosts() {
      this.isLoading = true
      try {
        const { apiFetch } = useApi()
        this.myPosts = await apiFetch<Post[]>('/api/posts/me')
      } finally {
        this.isLoading = false
      }
    },

    async createPost(data: Record<string, any>) {
      const { apiFetch } = useApi()
      const post = await apiFetch<Post>('/api/posts', {
        method: 'POST',
        body: data,
      })
      return post
    },

    async completePost(id: string) {
      const { apiFetch } = useApi()
      await apiFetch(`/api/posts/${id}/complete`, { method: 'PATCH' })
      await this.fetchMyPosts()
    },

    async deletePost(id: string) {
      const { apiFetch } = useApi()
      await apiFetch(`/api/posts/${id}`, { method: 'DELETE' })
      await this.fetchMyPosts()
    },
  },
})
