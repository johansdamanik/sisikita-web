<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-neutral-900">Dashboard</h1>
      <p class="text-neutral-500 mt-1">Platform overview and statistics.</p>
    </div>

    <!-- Stats Grid -->
    <div v-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Icon name="lucide:users" size="20" />
          </div>
          <h3 class="text-sm font-medium text-neutral-500">Total Users</h3>
        </div>
        <p class="text-2xl font-bold text-neutral-900">{{ stats.totalUsers }}</p>
        <p class="text-xs text-green-600 mt-1">
          +{{ stats.newUsersThisWeek }} minggu ini
        </p>
      </div>

      <div class="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <Icon name="lucide:database" size="20" />
          </div>
          <h3 class="text-sm font-medium text-neutral-500">Total Posts</h3>
        </div>
        <p class="text-2xl font-bold text-neutral-900">{{ stats.totalPosts }}</p>
        <p class="text-xs text-green-600 mt-1">
          +{{ stats.newPostsThisWeek }} minggu ini
        </p>
      </div>

      <div class="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <Icon name="lucide:check-circle" size="20" />
          </div>
          <h3 class="text-sm font-medium text-neutral-500">Active Posts</h3>
        </div>
        <p class="text-2xl font-bold text-neutral-900">{{ stats.activePosts }}</p>
        <p class="text-xs text-neutral-500 mt-1">
          {{ stats.completedPosts }} completed
        </p>
      </div>

      <div class="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
            <Icon name="lucide:bell" size="20" />
          </div>
          <h3 class="text-sm font-medium text-neutral-500">Notifications</h3>
        </div>
        <p class="text-2xl font-bold text-neutral-900">{{ stats.totalNotifications }}</p>
        <p class="text-xs text-neutral-500 mt-1">Total sent notifications</p>
      </div>
    </div>
    
    <div v-else-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="bg-white h-32 rounded-xl border border-neutral-200 animate-pulse"></div>
    </div>

    <!-- Future Charts -->
    <div class="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm mt-6">
      <h3 class="font-semibold text-neutral-900 mb-4">Aktivitas Terbaru</h3>
      <div class="text-center py-12 text-neutral-500">
        <Icon name="lucide:bar-chart-3" size="48" class="mx-auto text-neutral-300 mb-4" />
        <p>Grafik aktivitas akan ditampilkan di sini (Phase 3).</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { apiFetch } = useApi()
const isLoading = ref(true)
const stats = ref<any>(null)

onMounted(async () => {
  try {
    stats.value = await apiFetch('/api/v1/admin/stats')
  } catch (err) {
    console.error('Failed to load stats', err)
  } finally {
    isLoading.value = false
  }
})
</script>
