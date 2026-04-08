<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-neutral-50">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2 mb-6">
          <Icon name="lucide:handshake" class="text-3xl text-primary" />
          <span class="text-2xl font-bold text-primary">SisiKita</span>
        </NuxtLink>
        <h1 class="text-2xl font-bold text-neutral-900 mb-2">Masuk ke Akunmu</h1>
        <p class="text-neutral-700">Belum punya akun? <NuxtLink to="/register" class="text-primary font-semibold hover:underline">Daftar</NuxtLink></p>
      </div>

      <form @submit.prevent="handleLogin" class="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-200/50 p-8">
        <!-- Error Message -->
        <div v-if="error" class="bg-error/10 text-error text-sm rounded-xl px-4 py-3 mb-6">
          {{ error }}
        </div>

        <div class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-neutral-900 mb-1.5">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="nama@email.com"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-neutral-900 mb-1.5">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="Minimal 8 karakter"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full mt-6 bg-primary text-white py-3.5 rounded-xl font-semibold text-base hover:bg-primary-dark transition-colors btn-press disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading" class="inline-flex items-center gap-2">
            <Icon name="heroicons:arrow-path-20-solid" class="animate-spin" size="18" />
            Memproses...
          </span>
          <span v-else>Masuk</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'guest',
})

useSeoMeta({ title: 'Login — SisiKita' })

const authStore = useAuthStore()
const isLoading = computed(() => authStore.isLoading)
const error = ref('')

const form = reactive({
  email: '',
  password: '',
})

async function handleLogin() {
  error.value = ''
  try {
    const data = await authStore.login(form.email, form.password)
    if (data.user.isProfileComplete) {
      await navigateTo('/explore')
    } else {
      await navigateTo('/profile/setup')
    }
  } catch (e: any) {
    error.value = e?.data?.message || 'Email atau password salah'
  }
}
</script>
