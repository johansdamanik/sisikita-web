<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-neutral-900">Categories</h1>
        <p class="text-neutral-500 mt-1">Manage system categories for size profiling and post classification.</p>
      </div>
      <button @click="openCreateModal" class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
        <Icon name="lucide:plus" size="18" />
        Tambah Kategori
      </button>
    </div>

    <div class="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th class="px-6 py-4 font-medium">Icon / Nama</th>
              <th class="px-6 py-4 font-medium">Slug</th>
              <th class="px-6 py-4 font-medium">Status</th>
              <th class="px-6 py-4 font-medium">Active Posts</th>
              <th class="px-6 py-4 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="5" class="px-6 py-8 text-center text-neutral-500">
                <Icon name="lucide:loader-2" class="animate-spin inline-block mr-2" /> Loading categories...
              </td>
            </tr>
            <tr v-else-if="categories.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-neutral-500">No categories found.</td>
            </tr>
            <tr v-else v-for="cat in categories" :key="cat.id" class="border-b border-neutral-100 hover:bg-neutral-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center text-neutral-600">
                    <Icon :name="cat.icon || 'lucide:folder'" size="16" />
                  </div>
                  <div>
                    <div class="font-medium text-neutral-900">{{ cat.name }}</div>
                    <div class="text-xs text-neutral-500 truncate max-w-[200px]">{{ cat.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-neutral-500 font-mono text-xs">{{ cat.slug }}</td>
              <td class="px-6 py-4">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  cat.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-700'
                ]">
                  {{ cat.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 font-medium text-neutral-700">
                {{ cat._count?.posts || 0 }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="toggleActive(cat.id)" class="p-1.5 text-neutral-500 hover:bg-neutral-200 rounded-md transition-colors" :title="cat.isActive ? 'Nonaktifkan' : 'Aktifkan'">
                     <Icon :name="cat.isActive ? 'lucide:eye-off' : 'lucide:eye'" size="18" />
                  </button>
                  <button @click="openEditModal(cat)" class="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                     <Icon name="lucide:edit" size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { apiFetch } = useApi()
const { showSuccess, showError, showInfo } = useToast()

const categories = ref<any[]>([])
const isLoading = ref(true)

const fetchCategories = async () => {
  isLoading.value = true
  try {
    categories.value = await apiFetch<any[]>('/api/v1/admin/categories')
  } catch (err) {
    showError('Gagal memuat kategori')
  } finally {
    isLoading.value = false
  }
}

const toggleActive = async (id: string) => {
  if (!confirm('Ubah status kategori ini?')) return
  try {
    await apiFetch(`/api/v1/admin/categories/${id}/toggle`, { method: 'PATCH' })
    showSuccess('Status berhasil diubah')
    fetchCategories()
  } catch (err) {
    showError('Gagal merubah status')
  }
}

const openCreateModal = () => {
  showInfo('Fitur create belum diimplementasikan di UI')
}

const openEditModal = (cat: any) => {
  showInfo('Fitur edit belum diimplementasikan di UI')
}

onMounted(() => {
  fetchCategories()
})
</script>
