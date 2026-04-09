<template>
  <NuxtLink :to="`/posts/${post.slug}`" class="block bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-200/50 overflow-hidden card-hover group relative">
    <div class="h-48 bg-neutral-100 flex items-center justify-center relative">
      <NuxtImg
        v-if="post.imageUrl && !imageError"
        :src="post.imageUrl"
        :alt="post.title"
        class="w-full h-full object-cover"
        loading="lazy"
        @error="imageError = true"
      />
      <div v-else class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-white text-primary rounded-t-2xl">
        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100">
          <Icon :name="post.category?.icon || 'lucide:package'" class="text-4xl text-primary" />
        </div>
      </div>
      
      <!-- Badges -->
      <div class="absolute top-3 left-3 flex gap-2">
        <div class="bg-white/90 backdrop-blur-sm text-neutral-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
          {{ post.category?.name }}
        </div>
      </div>
      
      <div class="absolute top-3 right-3">
        <div :class="[
          'text-xs font-bold px-2.5 py-1 rounded-full shadow-sm',
          post.side === 'LEFT' ? 'badge-left' : post.side === 'RIGHT' ? 'badge-right' : 'bg-neutral-800 text-white'
        ]">
          {{ sideLabel(post.side) }} • {{ post.size }}
        </div>
      </div>
    </div>
    
    <div class="p-5">
      <h3 class="text-lg font-semibold text-neutral-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
        {{ post.title }}
      </h3>
      <p class="text-neutral-500 text-sm mb-4 line-clamp-2">
        {{ post.description || 'Tidak ada deskripsi.' }}
      </p>
      
      <div class="flex items-center justify-between pt-4 border-t border-neutral-100">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 overflow-hidden shrink-0">
            <template v-if="post.user?.avatarUrl">
               <NuxtImg :src="post.user.avatarUrl" :alt="post.user.name" class="w-full h-full object-cover" />
            </template>
            <template v-else>
               <Icon name="lucide:user" size="16" />
            </template>
          </div>
          <div class="text-xs">
            <p class="font-semibold text-neutral-900 line-clamp-1">{{ post.user?.name || 'Misterius' }}</p>
            <p class="text-neutral-500 line-clamp-1">{{ post.city }}</p>
          </div>
        </div>
        <div class="text-xs font-medium text-neutral-400">
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
