<template>
  <div class="min-h-screen bg-neutral-50 pb-20">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-neutral-900 mb-2 tracking-tight">Daftar Matches Anda</h1>
        <p class="text-neutral-600">Sistem pintar secara otomatis melihat kriteria barang Anda (Sisi & Ukuran) dan mencocokkannya dengan tawaran pengguna lain.</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="py-20 flex flex-col items-center justify-center">
        <Icon name="lucide:loader-2" class="animate-spin text-5xl text-primary mb-4" />
        <p class="text-neutral-500 font-medium animate-pulse">Sedang mencari kecocokan sempurna...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="matchGroups.length === 0" class="bg-white rounded-3xl p-10 border border-neutral-200/50 shadow-sm text-center py-20">
        <div class="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-300">
          <Icon name="lucide:search-x" size="48" />
        </div>
        <h2 class="text-2xl font-bold text-neutral-900 mb-2">Belum ada Post Aktif</h2>
        <p class="text-neutral-500 max-w-sm mx-auto mb-8">Anda perlu membuat Post terlebih dahulu agar sistem dapat mencarikan pasangan barang untuk Anda.</p>
        <NuxtLink to="/posts/create" class="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-lg shadow-primary/20 btn-press">
          <Icon name="lucide:plus" /> Buat Post Sekarang
        </NuxtLink>
      </div>

      <!-- Match Results -->
      <div v-else class="space-y-12">

        <!-- Check if literally 0 matches across all posts -->
        <div v-if="totalMatches === 0" class="bg-white rounded-3xl p-10 border border-neutral-200/50 shadow-sm text-center py-20">
          <div class="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <Icon name="lucide:radar" size="48" />
          </div>
          <h2 class="text-2xl font-bold text-neutral-900 mb-2">Sistem Terus Mencari...</h2>
          <p class="text-neutral-500 max-w-md mx-auto">Postingan Anda sudah aktif, namun kami belum menemukan pengguna lain dengan kategori dan sisi yang pas. Kami akan terus memantaunya!</p>
        </div>

        <div v-else v-for="group in matchGroups" :key="group.userPost.id">
          
          <!-- Only show group if it has matches -->
          <div v-if="group.matchCount > 0" class="relative">
            <!-- Group Header -->
            <div class="flex items-center gap-4 mb-6 sticky top-20 z-10 bg-neutral-50 py-4 shadow-sm px-4 rounded-xl border border-neutral-200/60 backdrop-blur-md bg-white/80">
              <div class="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <Icon name="lucide:box" size="24" />
              </div>
              <div class="flex-1">
                <p class="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">HASIL MATCH UNTUK POST ANDA:</p>
                <NuxtLink :to="`/posts/${group.userPost.slug}`" class="text-lg font-bold text-neutral-900 hover:text-primary transition-colors line-clamp-1">
                  {{ group.userPost.title }}
                </NuxtLink>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs font-bold text-neutral-600 bg-neutral-200 px-2 py-0.5 rounded">{{ group.userPost.category }}</span>
                  <span class="text-xs font-semibold text-neutral-500">• Sisi {{ group.userPost.side === 'LEFT' ? 'Kiri' : 'Kanan' }}</span>
                  <span class="text-xs font-semibold text-neutral-500">• Ukuran {{ group.userPost.size }}</span>
                </div>
              </div>
              <div class="text-right shrink-0 bg-primary text-white rounded-xl px-4 py-2 shadow-sm font-bold flex items-center justify-center flex-col min-w-[4rem]">
                <span class="text-xl leading-none">{{ group.matchCount }}</span>
                <span class="text-[10px] uppercase tracking-wider font-semibold opacity-90 mt-1">Match</span>
              </div>
            </div>

            <!-- Matches List Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MatchCard 
                v-for="match in group.matches" 
                :key="match.partnerPost.id" 
                :match="match" 
                :userPost="group.userPost" 
              />
            </div>
            
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useMatchStore } from '~/stores/match'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Matches Anda — SisiKita' })

const matchStore = useMatchStore()

const isLoading = computed(() => matchStore.isLoading)
const matchGroups = computed(() => matchStore.matchGroups)
const totalMatches = computed(() => matchStore.totalMatches)

onMounted(() => {
  matchStore.fetchMatches()
})
</script>
