<template>
  <div class="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-200/50 overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-shadow relative">
    
    <!-- Score Badge -->
    <div v-if="match.score" class="absolute top-4 right-4 z-10">
      <div 
        :class="['score-badge', scoreBadgeClass]"
        :title="`Skor: ${match.score}`"
      >
        <Icon :name="scoreBadgeIcon" size="14" />
        {{ scoreBadgeLabel }}
      </div>
    </div>

    <div class="p-6">
      
      <!-- Partner Info -->
      <div class="flex items-center gap-4 mb-5">
        <div class="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
          <NuxtImg v-if="match.partner.avatarUrl" :src="match.partner.avatarUrl" :alt="match.partner.name" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-neutral-400">
            <Icon name="lucide:user" size="24" />
          </div>
        </div>
        <div>
          <h3 class="font-bold text-neutral-900 text-lg leading-tight">{{ match.partner.name }}</h3>
          <p class="text-xs text-neutral-500 font-medium flex items-center gap-1">
            <Icon name="lucide:map-pin" size="14" /> {{ match.partner.city }}
          </p>
        </div>
      </div>

      <!-- Partner Post Details -->
      <NuxtLink :to="`/posts/${match.partnerPost.slug}`" class="block bg-neutral-50 rounded-xl p-4 border border-neutral-200 group transition-colors hover:border-primary/30 hover:bg-neutral-50/50 mb-5">
        <div class="flex items-start justify-between gap-2 mb-2">
          <p class="font-bold text-neutral-900 group-hover:text-primary transition-colors line-clamp-1">
            {{ match.partnerPost.title }}
          </p>
          <span :class="['shrink-0 text-xs font-bold px-2.5 py-1 rounded-full', match.partnerPost.side === 'LEFT' ? 'badge-left' : 'badge-right']">
            {{ match.partnerPost.side === 'LEFT' ? 'Sisi Kiri' : 'Sisi Kanan' }}
          </span>
        </div>
        
        <div class="flex items-center gap-2 text-xs font-semibold text-neutral-500">
          <span class="bg-white px-2 py-1 rounded shadow-sm border border-neutral-200">{{ match.partnerPost.category }}</span>
          <span class="bg-white px-2 py-1 rounded shadow-sm border border-neutral-200 flex items-center gap-1">
            <Icon name="lucide:ruler" size="12" /> {{ match.partnerPost.size }}
          </span>
        </div>
      </NuxtLink>

      <!-- Match Reasons -->
      <div class="space-y-2 mb-6">
        <div v-for="(reason, idx) in match.matchReasons" :key="idx" class="flex items-start gap-2.5">
          <div class="mt-0.5 bg-primary/10 text-primary w-5 h-5 rounded flex items-center justify-center shrink-0">
            <Icon :name="reason.icon || 'lucide:check'" size="12" class="font-bold" />
          </div>
          <div>
            <p class="text-xs font-bold text-neutral-700 leading-tight">{{ reason.label }}</p>
            <p class="text-xs text-neutral-500">{{ reason.detail }}</p>
          </div>
        </div>
      </div>

      <!-- Contact Action -->
      <button 
        @click="handleHubungi"
        class="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 btn-press"
      >
        <Icon name="lucide:message-circle" size="20" /> Hubungi via WhatsApp
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useWhatsApp } from '~/composables/useWhatsApp'

const props = defineProps({
  match: {
    type: Object,
    required: true
  },
  userPost: {
    type: Object,
    required: true
  }
})

const { openWhatsApp } = useWhatsApp()

const scoreBadgeLabel = computed(() => {
  const s = props.match.score || 0
  if (s > 115) return 'Sangat Cocok'
  if (s > 105) return 'Cocok'
  return 'Mungkin Cocok'
})

const scoreBadgeClass = computed(() => {
  const s = props.match.score || 0
  if (s > 115) return 'score-excellent'
  if (s > 105) return 'score-good'
  return 'score-fair'
})

const scoreBadgeIcon = computed(() => {
  const s = props.match.score || 0
  if (s > 115) return 'lucide:zap'
  if (s > 105) return 'lucide:star'
  return 'lucide:circle-dot'
})

function handleHubungi() {
  const phone = props.match.partner.phone
  if (!phone) {
    alert('Maaf, user ini tidak menyertakan nomor HP/WhatsApp.')
    return
  }

  // Pre-fill message showing how we matched
  const message = `Halo ${props.match.partner.name}, salam dari SisiKita! Saya melihat postingan Anda "${props.match.partnerPost.title}" cocok dengan barang yang saya cari/tawarkan ("${props.userPost.title}"). Kategori: ${props.match.partnerPost.category}, Ukuran: ${props.match.partnerPost.size}. Apakah barangnya masih ada?`

  openWhatsApp(phone, message)
}
</script>

<style scoped>
.score-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.025em;
  backdrop-filter: blur(8px);
}

.score-excellent {
  background: rgba(42, 157, 143, 0.15);
  color: #2A9D8F;
  box-shadow: 0 0 12px rgba(42, 157, 143, 0.2);
}

.score-good {
  background: rgba(107, 203, 119, 0.15);
  color: #27AE60;
}

.score-fair {
  background: rgba(244, 162, 97, 0.15);
  color: #F4A261;
}
</style>
