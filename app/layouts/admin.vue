<template>
  <div class="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
    <!-- Admin Sidebar (Desktop) -->
    <aside class="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200 shrink-0">
      <div class="h-16 flex items-center px-6 border-b border-neutral-200">
        <NuxtLink to="/admin" class="flex items-center gap-2">
          <Icon name="lucide:handshake" class="text-xl text-primary" />
          <span class="text-lg font-bold text-neutral-900">SisiKita Admin</span>
        </NuxtLink>
      </div>
      <div class="flex-1 overflow-y-auto py-4">
        <nav class="space-y-1 px-3">
          <NuxtLink to="/admin" class="admin-nav-link" active-class="admin-nav-active" exact>
            <Icon name="lucide:layout-dashboard" size="18" />
            Dashboard
          </NuxtLink>
          <NuxtLink to="/admin/users" class="admin-nav-link" active-class="admin-nav-active">
            <Icon name="lucide:users" size="18" />
            Users
          </NuxtLink>
          <NuxtLink to="/admin/posts" class="admin-nav-link" active-class="admin-nav-active">
            <Icon name="lucide:database" size="18" />
            Posts
          </NuxtLink>
          <NuxtLink to="/admin/categories" class="admin-nav-link" active-class="admin-nav-active">
            <Icon name="lucide:tags" size="18" />
            Categories
          </NuxtLink>
        </nav>
      </div>
      <div class="p-4 border-t border-neutral-200">
        <NuxtLink to="/" class="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-4 px-2">
          <Icon name="lucide:arrow-left" size="16" />
          Kembali ke App
        </NuxtLink>
        <button @click="handleLogout" class="w-full flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 btn-press">
          <Icon name="lucide:log-out" size="16" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Content Area -->
    <main class="flex-1 flex flex-col min-w-0 max-h-screen">
      <!-- Mobile Header -->
      <header class="md:hidden h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-4 shrink-0">
         <span class="font-semibold text-neutral-900">Admin Area</span>
         <NuxtLink to="/" class="text-neutral-500"><Icon name="lucide:x" size="20" /></NuxtLink>
      </header>
      
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <slot />
      </div>
    </main>
    <UiAppToast />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  navigateTo('/login')
}
</script>

<style scoped>
.admin-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #525252;
  transition: all 0.15s ease;
}
.admin-nav-link:hover {
  background-color: #fafafa;
  color: #171717;
}
.admin-nav-active {
  background-color: rgba(255, 107, 107, 0.1);
  color: #FF6B6B;
}
.admin-nav-active:hover {
  background-color: rgba(255, 107, 107, 0.1);
  color: #FF6B6B;
}
</style>
