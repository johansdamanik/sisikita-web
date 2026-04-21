<template>
  <div class="relative" ref="dropdownRef">
    <!-- Bell Trigger -->
    <button
      @click="toggleDropdown"
      class="relative p-2 text-neutral-500 hover:text-neutral-900 transition-colors"
      title="Notifikasi"
    >
      <Icon name="lucide:bell" size="20" />
      <!-- Unread Badge -->
      <span
        v-if="store.hasUnread"
        class="absolute top-1 right-1 flex h-2.5 w-2.5"
      >
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-error"></span>
      </span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-neutral-200/50 overflow-hidden z-50 origin-top-right transition-all animate-in fade-in slide-in-from-top-2"
    >
      <div class="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
        <h3 class="font-bold text-sm text-neutral-900">Notifikasi</h3>
        <button
          v-if="store.hasUnread"
          @click="store.markAllAsRead"
          class="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          Tandai semua dibaca
        </button>
      </div>

      <div class="max-h-[70vh] overflow-y-auto overscroll-contain">
        <div v-if="store.isLoading && store.notifications.length === 0" class="p-8 flex justify-center">
          <Icon name="lucide:loader-2" class="animate-spin text-primary" size="24" />
        </div>
        
        <div v-else-if="store.notifications.length === 0" class="p-8 text-center text-neutral-500 text-sm">
          Belum ada notifikasi
        </div>

        <div v-else class="divide-y divide-neutral-100">
          <button
            v-for="notif in store.notifications"
            :key="notif.id"
            @click="handleNotificationClick(notif)"
            :class="[
              'w-full text-left p-4 hover:bg-neutral-50 transition-colors flex gap-3 items-start',
              !notif.isRead ? 'bg-primary/5' : ''
            ]"
          >
            <!-- Icon based on type -->
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
              notif.type === 'new_match' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'
            ]">
              <Icon :name="notif.type === 'new_match' ? 'lucide:heart' : 'lucide:bell'" size="20" />
            </div>

            <div class="flex-1 min-w-0">
              <p :class="['text-sm font-semibold truncate', !notif.isRead ? 'text-neutral-900' : 'text-neutral-700']">
                {{ notif.title }}
              </p>
              <p class="text-xs text-neutral-500 mt-0.5 line-clamp-2 leading-relaxed">
                {{ notif.message }}
              </p>
              <p class="text-[10px] font-medium text-neutral-400 mt-2 uppercase tracking-wide">
                {{ new Date(notif.createdAt).toLocaleDateString() }}
              </p>
            </div>
            
            <div v-if="!notif.isRead" class="w-2 h-2 rounded-full bg-primary shrink-0 mt-2"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '~/stores/notification'
import type { Notification } from '~/stores/notification'

const store = useNotificationStore()
const router = useRouter()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    store.fetchNotifications()
  }
}

// Native click outside handler — no VueUse needed
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

async function handleNotificationClick(notif: Notification) {
  if (!notif.isRead) {
    await store.markAsRead(notif.id)
  }
  isOpen.value = false
  if (notif.type === 'new_match') {
    router.push('/matches')
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
  store.startPolling()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
  store.stopPolling()
})
</script>
