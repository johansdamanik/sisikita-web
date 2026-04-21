<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">Posts</h1>
        <p class="text-neutral-500 mt-1">Manage all listings and posts.</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <!-- Search/Filter Bar -->
      <div class="p-4 border-b border-neutral-200 flex gap-4">
        <select v-model="statusFilter" @change="fetchPosts(1)" class="w-40 border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-primary">
          <option value="">Semua Status</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th class="px-6 py-4 font-medium">Judul</th>
              <th class="px-6 py-4 font-medium">Kategori</th>
              <th class="px-6 py-4 font-medium">Sisi / Size</th>
              <th class="px-6 py-4 font-medium">Pembuat</th>
              <th class="px-6 py-4 font-medium">Status</th>
              <th class="px-6 py-4 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="6" class="px-6 py-8 text-center text-neutral-500">
                <Icon name="lucide:loader-2" class="animate-spin inline-block mr-2" /> Loading posts...
              </td>
            </tr>
            <tr v-else-if="posts.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-neutral-500">No posts found.</td>
            </tr>
            <tr v-else v-for="post in posts" :key="post.id" class="border-b border-neutral-100 hover:bg-neutral-50">
              <td class="px-6 py-4">
                <div class="font-medium text-neutral-900">{{ post.title }}</div>
                <div class="text-xs text-neutral-500">{{ String(post.createdAt).split('T')[0] }}</div>
              </td>
              <td class="px-6 py-4 text-neutral-500">{{ post.category?.name }}</td>
              <td class="px-6 py-4 text-neutral-500">
                <div class="flex items-center gap-2">
                  <span :class="post.side === 'LEFT' ? 'text-purple-600' : 'text-green-600'" class="font-semibold">{{ post.side }}</span>
                  <span>{{ post.size }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-neutral-500">{{ post.user?.name || 'Anonymous' }}</td>
              <td class="px-6 py-4">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  post.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-700'
                ]">
                  {{ post.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink :to="`/posts/${post.slug}`" target="_blank" class="p-1.5 text-neutral-500 hover:bg-neutral-200 rounded-md transition-colors" title="Lihat Post">
                     <Icon name="lucide:external-link" size="18" />
                  </NuxtLink>
                  <button @click="deletePost(post.id)" class="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Hapus Post">
                     <Icon name="lucide:trash-2" size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="meta && meta.totalPages > 1" class="p-4 border-t border-neutral-200 flex items-center justify-between">
        <span class="text-sm text-neutral-500">Page {{ meta.page }} of {{ meta.totalPages }} (Total {{ meta.total }})</span>
        <div class="flex gap-2">
          <button @click="fetchPosts(meta.page - 1)" :disabled="meta.page === 1" class="px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
          <button @click="fetchPosts(meta.page + 1)" :disabled="meta.page === meta.totalPages" class="px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { apiFetch } = useApi()
const { showSuccess, showError, showInfo } = useToast()

const posts = ref<any[]>([])
const meta = ref<any>(null)
const isLoading = ref(true)
const statusFilter = ref('')

const fetchPosts = async (page = 1) => {
  isLoading.value = true
  try {
    const q = new URLSearchParams()
    q.set('page', page.toString())
    if (statusFilter.value) q.set('status', statusFilter.value)
    
    const res = await apiFetch<any>(`/api/admin/posts?${q.toString()}`)
    posts.value = res.data
    meta.value = res.meta
  } catch (err) {
    showError('Gagal memuat posts')
  } finally {
    isLoading.value = false
  }
}

const deletePost = async (id: string) => {
  if (!confirm('Peringatan: Post ini akan dihapus secara permanen. Lanjutkan?')) return
  try {
    await apiFetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
    showSuccess('Post berhasil dihapus')
    fetchPosts(meta.value?.page || 1)
  } catch (err) {
    showError('Gagal menghapus post')
  }
}

onMounted(() => {
  fetchPosts()
})
</script>
