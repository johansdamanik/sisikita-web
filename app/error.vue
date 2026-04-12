<template>
  <div class="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
    <div class="max-w-lg w-full text-center">
      <!-- 404 -->
      <template v-if="error?.statusCode == 404">
        <div class="w-28 h-28 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <Icon name="lucide:search-x" size="56" class="text-primary" />
        </div>
        <h1 class="text-5xl font-extrabold text-neutral-900 mb-3">404</h1>
        <h2 class="text-xl font-bold text-neutral-700 mb-4">Halaman Tidak Ditemukan</h2>
        <p class="text-neutral-500 mb-8 leading-relaxed">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
      </template>

      <!-- 500 or other -->
      <template v-else>
        <div class="w-28 h-28 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <Icon name="lucide:alert-triangle" size="56" class="text-error" />
        </div>
        <h1 class="text-5xl font-extrabold text-neutral-900 mb-3">{{ error?.statusCode || 'Error' }}</h1>
        <h2 class="text-xl font-bold text-neutral-700 mb-4">Terjadi Kesalahan</h2>
        <p class="text-neutral-500 mb-2 leading-relaxed">
          Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi nanti.
        </p>
        <div class="bg-red-50 text-red-800 p-4 rounded-xl text-left text-sm mb-8 overflow-auto max-w-full">
          <strong>{{ error?.message }}</strong>
          <pre class="mt-2 text-xs truncate">{{ error?.stack }}</pre>
        </div>
      </template>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          @click="handleError"
          class="w-full sm:w-auto bg-primary text-white px-8 py-3.5 rounded-full font-semibold text-base hover:bg-primary-dark transition-all btn-press shadow-lg shadow-primary/25"
        >
          Kembali ke Home
        </button>
        <button
          @click="clearError({ redirect: '/' })"
          class="w-full sm:w-auto bg-white text-neutral-700 px-8 py-3.5 rounded-full font-semibold text-base hover:bg-neutral-100 transition-all border border-neutral-200"
        >
          Coba Lagi
        </button>
      </div>

      <!-- Decorative background -->
      <div class="absolute top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-10 -right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const handleError = () => clearError({ redirect: '/' })
</script>
