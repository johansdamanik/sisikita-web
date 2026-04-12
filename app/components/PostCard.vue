<template>
  <NuxtLink :to="`/posts/${post.slug}`" class="block bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-200/50 overflow-hidden card-hover group relative">
    <div class="h-32 sm:h-48 bg-neutral-100 flex items-center justify-center relative">
      <NuxtImg
        v-if="post.imageUrl && !imageError"
        :src="post.imageUrl"
        :alt="post.title"
        class="w-full h-full object-cover"
        loading="lazy"
        @error="imageError = true"
      />
      <div v-else class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-white text-primary rounded-t-2xl">
        <div class="w-12 h-12 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100">
          <Icon :name="post.category?.icon || 'lucide:package'" class="text-2xl sm:text-4xl text-primary" />
        </div>
      </div>
      
      <!-- Badges -->
      <div class="absolute top-2 left-2 sm:top-3 sm:left-3 flex gap-2">
        <div class="bg-white/90 backdrop-blur-sm text-neutral-800 text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm">
          {{ post.category?.name }}
        </div>
      </div>
      
      <div class="absolute top-2 right-2 sm:top-3 sm:right-3">
        <div :class="[
          'text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm',
          post.side === 'LEFT' ? 'badge-left' : post.side === 'RIGHT' ? 'badge-right' : 'bg-neutral-800 text-white'
        ]">
          {{ sideLabel(post.side) }} • {{ post.size }}
        </div>
      </div>
    </div>
    
    <div class="p-3 sm:p-5">
      <h3 class="text-sm sm:text-lg font-semibold text-neutral-900 mb-1 line-clamp-2 sm:line-clamp-1 group-hover:text-primary transition-colors leading-tight">
        {{ post.title }}
      </h3>
      <p class="text-neutral-500 text-[10px] sm:text-sm mb-2 sm:mb-4 line-clamp-2 leading-snug">
        {{ post.description || 'Tidak ada deskripsi.' }}
      </p>
      
      <div class="flex items-center justify-between pt-3 sm:pt-4 border-t border-neutral-100">
        <div class="flex items-center gap-1.5 sm:gap-2 overflow-hidden">
          <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 overflow-hidden shrink-0">
            <template v-if="post.user?.avatarUrl">
               <NuxtImg :src="post.user.avatarUrl" :alt="post.user.name" class="w-full h-full object-cover" />
            </template>
            <template v-else>
               <Icon name="lucide:user" class="w-3 h-3 sm:w-4 sm:h-4 text-neutral-400" />
            </template>
          </div>
          <div class="text-[9px] sm:text-xs overflow-hidden">
            <p class="font-semibold text-neutral-900 line-clamp-1 leading-none mb-0.5">{{ post.user?.name || 'Misterius' }}</p>
            <p class="text-neutral-500 line-clamp-1 leading-none">{{ post.city }}</p>
          </div>
        </div>
        <div class="text-[9px] sm:text-xs font-medium text-neutral-400 shrink-0 ml-1">
          {{ formatDate(post.createdAt) }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const imageError = ref(false)

interface Post {
  id: string
  title: string
  slug: string
  type: string
  side: string
  size: string
  description: string | null
  imageUrl: string | null
  city: string
  status: string
  createdAt: string
  category: { id: string; name: string; slug: string; icon: string }
  user: { id: string; name: string; city: string; avatarUrl: string | null; phone?: string }
}

defineProps<{
  post: Post
}>()

function sideLabel(side: string) {
  if (side === 'LEFT') return 'Kiri'
  if (side === 'RIGHT') return 'Kanan'
  return 'Keduanya'
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Hari ini'
  if (diffDays === 1) return 'Kemarin'
  if (diffDays < 7) return `${diffDays}h yang lalu`
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}
</script>
