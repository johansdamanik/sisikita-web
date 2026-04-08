<template>
  <div class="min-h-screen flex flex-col bg-neutral-50">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

// Restore auth state on app init
const authStore = useAuthStore()
if (import.meta.client) {
  authStore.restoreAuth()
}
</script>
