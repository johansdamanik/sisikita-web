<template>
  <div>
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-200 shadow-[var(--shadow-navbar)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <Icon name="lucide:handshake" class="text-2xl text-primary" />
            <span class="text-xl font-bold text-primary">SisiKita</span>
          </NuxtLink>

          <!-- Desktop Nav -->
          <div class="hidden sm:flex items-center gap-6">
            <NuxtLink
              to="/explore"
              class="text-neutral-700 hover:text-primary font-medium transition-colors"
              active-class="!text-primary"
            >
              Explore
            </NuxtLink>
            <NuxtLink
              v-if="isAuthenticated"
              to="/matches"
              class="text-neutral-700 hover:text-primary font-medium transition-colors"
              active-class="!text-primary"
            >
              Matches
            </NuxtLink>
          </div>

          <!-- Auth Buttons -->
          <div class="hidden sm:flex items-center gap-3">
            <template v-if="isAuthenticated">
              <NuxtLink
                to="/posts/create"
                class="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors btn-press"
              >
                + Buat Post
              </NuxtLink>
              <NuxtLink
                to="/profile"
                class="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-200/80 transition-colors"
              >
                <Icon name="heroicons:user-20-solid" size="18" />
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink
                to="/login"
                class="text-neutral-700 hover:text-primary font-medium transition-colors"
              >
                Login
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors btn-press"
              >
                Daftar
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <main class="flex-1 pb-24 sm:pb-0">
      <slot />
    </main>

    <!-- Footer (Desktop) -->
    <footer class="hidden sm:block bg-neutral-900 text-white mt-auto">
      <div class="max-w-7xl mx-auto px-6 py-12">
        <div class="flex flex-col sm:flex-row justify-between items-start gap-8">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <Icon name="lucide:handshake" class="text-2xl text-white" />
              <span class="text-xl font-bold">SisiKita</span>
            </div>
            <p class="text-neutral-400 text-sm max-w-xs">
              Platform komunitas untuk mencocokkan kebutuhan barang satu sisi.
            </p>
          </div>
          <div class="flex gap-12">
            <div>
              <h4 class="font-semibold mb-3 text-sm uppercase tracking-wider text-neutral-400">Platform</h4>
              <div class="flex flex-col gap-2">
                <NuxtLink to="/explore" class="text-neutral-300 hover:text-white text-sm transition-colors">Explore</NuxtLink>
                <NuxtLink to="/register" class="text-neutral-300 hover:text-white text-sm transition-colors">Daftar</NuxtLink>
              </div>
            </div>
            <div>
              <h4 class="font-semibold mb-3 text-sm uppercase tracking-wider text-neutral-400">Info</h4>
              <div class="flex flex-col gap-2">
                <a href="#" class="text-neutral-300 hover:text-white text-sm transition-colors">Tentang Kami</a>
                <a href="#" class="text-neutral-300 hover:text-white text-sm transition-colors">Hubungi</a>
              </div>
            </div>
          </div>
        </div>
        <div class="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-500 text-sm">
          © {{ new Date().getFullYear() }} SisiKita. All rights reserved.
        </div>
      </div>
    </footer>

    <!-- Mobile Bottom Nav -->
    <nav class="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
      <div class="flex items-center justify-around h-16 px-2">
        <NuxtLink to="/" class="flex flex-col items-center gap-1 text-neutral-400 transition-colors" active-class="!text-primary">
          <Icon name="heroicons:home-20-solid" size="22" />
          <span class="text-[10px] font-medium">Home</span>
        </NuxtLink>
        <NuxtLink to="/explore" class="flex flex-col items-center gap-1 text-neutral-400 transition-colors" active-class="!text-primary">
          <Icon name="heroicons:magnifying-glass-20-solid" size="22" />
          <span class="text-[10px] font-medium">Explore</span>
        </NuxtLink>
        <NuxtLink
          :to="isAuthenticated ? '/posts/create' : '/login'"
          class="flex items-center justify-center w-12 h-12 -mt-4 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors btn-press"
        >
          <Icon name="heroicons:plus-20-solid" size="24" />
        </NuxtLink>
        <NuxtLink :to="isAuthenticated ? '/matches' : '/login'" class="flex flex-col items-center gap-1 text-neutral-400 transition-colors" active-class="!text-primary">
          <Icon name="heroicons:heart-20-solid" size="22" />
          <span class="text-[10px] font-medium">Matches</span>
        </NuxtLink>
        <NuxtLink :to="isAuthenticated ? '/profile' : '/login'" class="flex flex-col items-center gap-1 text-neutral-400 transition-colors" active-class="!text-primary">
          <Icon name="heroicons:user-20-solid" size="22" />
          <span class="text-[10px] font-medium">Profil</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>
