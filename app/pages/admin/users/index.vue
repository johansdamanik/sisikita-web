<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">Users</h1>
        <p class="text-neutral-500 mt-1">Manage platform users, roles, and access.</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <!-- Search/Filter Bar -->
      <div class="p-4 border-b border-neutral-200 flex gap-4">
        <div class="relative flex-1 max-w-md">
          <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size="18" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or email..."
            class="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            @keyup.enter="fetchUsers(1)"
          />
        </div>
        <button @click="fetchUsers(1)" class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium transition-colors">
          Search
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th class="px-6 py-4 font-medium">Name</th>
              <th class="px-6 py-4 font-medium">Email</th>
              <th class="px-6 py-4 font-medium">Role</th>
              <th class="px-6 py-4 font-medium">Status</th>
              <th class="px-6 py-4 font-medium">Joined</th>
              <th class="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="6" class="px-6 py-8 text-center text-neutral-500">
                <Icon name="lucide:loader-2" class="animate-spin inline-block mr-2" /> Loading users...
              </td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-neutral-500">No users found.</td>
            </tr>
            <tr v-else v-for="user in users" :key="user.id" class="border-b border-neutral-100 hover:bg-neutral-50">
              <td class="px-6 py-4 font-medium text-neutral-900">{{ user.name || 'Anonymous' }}</td>
              <td class="px-6 py-4 text-neutral-500">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-700'
                ]">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  user.isBanned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                ]">
                  {{ user.isBanned ? 'Banned' : 'Active' }}
                </span>
              </td>
              <td class="px-6 py-4 text-neutral-500">{{ String(user.createdAt).split('T')[0] }}</td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="toggleBan(user.id)" class="p-1.5 text-neutral-500 hover:bg-neutral-200 rounded-md transition-colors" :title="user.isBanned ? 'Unban User' : 'Ban User'">
                     <Icon :name="user.isBanned ? 'lucide:user-check' : 'lucide:user-x'" size="18" :class="user.isBanned ? 'text-green-600' : 'text-red-600'" />
                  </button>
                  <button @click="toggleRole(user.id, user.role)" class="p-1.5 text-neutral-500 hover:bg-neutral-200 rounded-md transition-colors" title="Toggle Role">
                     <Icon name="lucide:shield" size="18" :class="user.role === 'ADMIN' ? 'text-purple-600' : ''" />
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
          <button @click="fetchUsers(meta.page - 1)" :disabled="meta.page === 1" class="px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
          <button @click="fetchUsers(meta.page + 1)" :disabled="meta.page === meta.totalPages" class="px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
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

const users = ref<any[]>([])
const meta = ref<any>(null)
const isLoading = ref(true)
const searchQuery = ref('')

const fetchUsers = async (page = 1) => {
  isLoading.value = true
  try {
    const q = new URLSearchParams()
    q.set('page', page.toString())
    if (searchQuery.value) q.set('search', searchQuery.value)
    
    const res = await apiFetch<any>(`/api/admin/users?${q.toString()}`)
    users.value = res.data
    meta.value = res.meta
  } catch (err) {
    showError('Gagal memuat users')
  } finally {
    isLoading.value = false
  }
}

const toggleBan = async (id: string) => {
  if (!confirm('Ubah status ban user ini?')) return
  try {
    await apiFetch(`/api/admin/users/${id}/ban`, { method: 'PATCH' })
    showSuccess('Status berhasil diubah')
    fetchUsers(meta.value?.page || 1)
  } catch (err) {
    showError('Gagal merubah status')
  }
}

const toggleRole = async (id: string, currentRole: string) => {
  const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
  if (!confirm(`Ubah role user menjadi ${newRole}?`)) return
  try {
    await apiFetch(`/api/admin/users/${id}/role`, { 
      method: 'PATCH',
      body: { role: newRole }
    })
    showSuccess(`Role berhasil diubah menjadi ${newRole}`)
    fetchUsers(meta.value?.page || 1)
  } catch (err) {
    showError('Gagal mengubah role')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
