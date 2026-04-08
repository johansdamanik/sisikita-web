<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-white to-neutral-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div class="text-center max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Icon name="lucide:handshake" />
            <span>Platform Pertama di Indonesia</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-6">
            Temukan <span class="text-primary">Partner</span> untuk
            <br class="hidden sm:block" />
            Barang Satu Sisi
          </h1>

          <p class="text-lg sm:text-xl text-neutral-700 mb-10 max-w-2xl mx-auto leading-relaxed">
            Butuh sepatu kanan saja? Sarung tangan kiri saja? SisiKita mencocokkan kamu dengan orang yang butuh sisi berlawanan.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NuxtLink
              to="/register"
              class="w-full sm:w-auto bg-primary text-white px-8 py-3.5 rounded-full font-semibold text-lg hover:bg-primary-dark transition-all btn-press shadow-lg shadow-primary/25"
            >
              Mulai Sekarang
            </NuxtLink>
            <NuxtLink
              to="/explore"
              class="w-full sm:w-auto bg-white text-neutral-700 px-8 py-3.5 rounded-full font-semibold text-lg hover:bg-neutral-100 transition-all border border-neutral-200"
            >
              Lihat Listing →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Background decoration -->
      <div class="absolute top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 -right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
    </section>

    <!-- How It Works -->
    <section class="py-16 sm:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">Bagaimana Cara Kerjanya?</h2>
          <p class="text-neutral-700 text-lg">4 langkah mudah untuk menemukan partner</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(step, i) in steps" :key="i" class="text-center group">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
              <Icon :name="step.icon" class="text-3xl text-primary" />
            </div>
            <div class="text-sm font-bold text-primary mb-2">Langkah {{ i + 1 }}</div>
            <h3 class="text-lg font-semibold text-neutral-900 mb-2">{{ step.title }}</h3>
            <p class="text-neutral-700 text-sm leading-relaxed">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-16 sm:py-24 bg-neutral-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <h2 class="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">Kategori</h2>
          <p class="text-neutral-700 text-lg">Temukan partner berdasarkan jenis barang</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <NuxtLink
            v-for="cat in categories"
            :key="cat.slug"
            :to="`/explore?category=${cat.slug}`"
            class="bg-white rounded-2xl p-8 text-center shadow-[var(--shadow-card)] card-hover border border-neutral-200/50"
          >
            <Icon v-if="cat.icon" :name="cat.icon" class="text-5xl mb-4 text-primary mx-auto" />
            <h3 class="text-lg font-semibold text-neutral-900 mb-1">{{ cat.name }}</h3>
            <p class="text-neutral-700 text-sm">{{ cat.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Bottom -->
    <section class="py-16 sm:py-24 bg-gradient-to-r from-primary to-primary-dark">
      <div class="max-w-3xl mx-auto px-4 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
          Siap Menemukan Partner?
        </h2>
        <p class="text-white/80 text-lg mb-8">
          Bergabung dengan komunitas SisiKita dan temukan partner yang cocok untuk kebutuhanmu.
        </p>
        <NuxtLink
          to="/register"
          class="inline-block bg-white text-primary px-8 py-3.5 rounded-full font-semibold text-lg hover:bg-neutral-100 transition-all btn-press"
        >
          Daftar Gratis Sekarang
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from '~/stores/category'

useSeoMeta({
  title: 'SisiKita — Temukan Partner untuk Barang Satu Sisi',
  ogTitle: 'SisiKita — Temukan Partner untuk Barang Satu Sisi',
  description: 'Platform komunitas untuk mencocokkan kebutuhan barang satu sisi (kiri/kanan) seperti sepatu, sarung tangan, dan lainnya. Temukan partner yang cocok!',
  ogDescription: 'Platform match kebutuhan barang satu sisi. Temukan partner yang cocok!',
})

const categoryStore = useCategoryStore()
await categoryStore.fetchCategories()
const categories = computed(() => categoryStore.categories)

const steps = [
  {
    icon: 'lucide:notepad-text',
    title: 'Daftar & Isi Profil',
    description: 'Buat akun, isi data diri, dan tambahkan ukuranmu.',
  },
  {
    icon: 'lucide:package',
    title: 'Buat Post',
    description: 'Posting kebutuhanmu — cari partner beli atau berbagi barang.',
  },
  {
    icon: 'lucide:search',
    title: 'Temukan Match',
    description: 'Sistem otomatis mencocokkan dengan partner sisi berlawanan.',
  },
  {
    icon: 'lucide:message-circle',
    title: 'Hubungi via WhatsApp',
    description: 'Langsung koordinasi dengan partner lewat WhatsApp.',
  },
]
</script>
