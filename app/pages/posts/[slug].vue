<template>
  <div class="min-h-screen bg-neutral-50 pb-20">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Loading State -->
      <div v-if="isLoading && !post" class="py-20 flex justify-center">
        <Icon name="lucide:loader-2" class="animate-spin text-4xl text-primary" />
      </div>

      <!-- Post Content -->
      <div v-else-if="post">
        
        <!-- Breadcrumb / Back -->
        <NuxtLink to="/explore" class="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-6 font-medium transition-colors">
          <Icon name="lucide:arrow-left" /> Kembali ke Explore
        </NuxtLink>

        <div class="bg-white rounded-3xl shadow-[var(--shadow-card)] border border-neutral-200/50 overflow-hidden flex flex-col md:flex-row">
          
          <!-- Image Section -->
          <div class="w-full md:w-5/12 relative flex shrink-0 border-b md:border-b-0 md:border-r border-neutral-100 bg-neutral-50 min-h-[350px]">
            <NuxtImg 
              v-if="post.imageUrl"
              :src="post.imageUrl" 
              :alt="post.title"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div v-else class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-white p-8 text-center text-primary">
              <div class="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100 mb-4">
                <Icon :name="post.category?.icon || 'lucide:package'" class="text-6xl text-primary" />
              </div>
              <span class="text-xs font-bold text-neutral-400 uppercase tracking-widest">{{ post.category?.name || 'Tidak Ada Gambar' }}</span>
            </div>
            
            <div class="absolute top-4 left-4">
              <div 
                class="px-3 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-md flex items-center gap-1.5"
                :class="post.type === 'CARI_PARTNER' ? 'bg-white/90 text-neutral-900' : 'bg-primary/90 text-white'"
              >
                <Icon :name="post.type === 'CARI_PARTNER' ? 'lucide:search' : 'lucide:gift'" size="14" />
                {{ post.type === 'CARI_PARTNER' ? 'Mencari Pasangan' : 'Berbagi Barang' }}
              </div>
            </div>

            <div v-if="post.status !== 'ACTIVE'" class="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center">
              <div class="bg-white px-6 py-3 rounded-2xl shadow-xl transform -rotate-12">
                <span class="text-2xl font-black text-neutral-800 tracking-widest uppercase">TERSELESAIKAN</span>
              </div>
            </div>
          </div>

          <!-- Content Section -->
          <div class="w-full md:w-7/12 p-6 md:p-10 flex flex-col">
            
            <div class="flex flex-wrap items-center gap-2 mb-4">
              <span class="bg-neutral-100 text-neutral-700 text-xs font-bold px-3 py-1 rounded-full border border-neutral-200">
                {{ post.category?.name }}
              </span>
              <span :class="['text-xs font-bold px-3 py-1 rounded-full', post.side === 'LEFT' ? 'badge-left' : 'badge-right']">
                {{ post.side === 'LEFT' ? 'Sisi Kiri' : 'Sisi Kanan' }}
              </span>
              <span class="bg-secondary/10 text-secondary-dark text-xs font-bold px-3 py-1 rounded-full border border-secondary/20 flex items-center gap-1">
                <Icon name="lucide:ruler" size="14" /> {{ post.size }}
              </span>
            </div>

            <h1 class="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-4 leading-tight tracking-tight">
              {{ post.title }}
            </h1>
            
            <div class="flex items-center text-sm font-medium text-neutral-500 mb-8 gap-6">
              <span class="flex items-center gap-2"><Icon name="lucide:map-pin" size="18"/> {{ post.city }}</span>
              <span class="flex items-center gap-2"><Icon name="lucide:calendar" size="18"/> {{ formatDate(post.createdAt) }}</span>
            </div>

            <div class="prose prose-sm text-neutral-700 mb-8 max-w-none">
              <p class="whitespace-pre-wrap leading-relaxed text-base">{{ post.description || 'Tidak ada deskripsi tambahan yang diberikan.' }}</p>
            </div>

            <div class="mt-auto pt-8 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <!-- User Profile -->
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                  <NuxtImg v-if="post.user?.avatarUrl" :src="post.user.avatarUrl" :alt="post.user.name" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-neutral-400">
                    <Icon name="lucide:user" size="28" />
                  </div>
                </div>
                <div>
                  <p class="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-1">DIPOSTING OLEH</p>
                  <p class="font-bold text-neutral-900 text-base leading-none">{{ post.user?.name || 'User SisiKita' }}</p>
                </div>
              </div>

              <!-- Actions -->
              <div class="w-full sm:w-auto">
                <div v-if="isOwner" class="flex gap-2">
                  <button v-if="post.status === 'ACTIVE'" @click="handleComplete" class="flex-1 sm:flex-none justify-center bg-primary/10 text-primary hover:bg-primary/20 px-5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm">
                    <Icon name="lucide:check-circle-2" size="20" /> Selesai
                  </button>
                  <button @click="handleDelete" class="bg-error/10 text-error hover:bg-error/20 px-4 py-3 rounded-xl flex items-center justify-center transition-colors shadow-sm">
                    <Icon name="lucide:trash-2" size="20" />
                  </button>
                </div>
                <div v-else>
                  <button @click="handleHubungi" class="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-3.5 rounded-xl font-extrabold text-base transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 btn-press">
                    <Icon name="lucide:message-circle" size="20" /> Hubungi via WhatsApp
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        <!-- Matches Suggestion Section via matching algorithm (if owner) -->
        <div v-if="isOwner && post.status === 'ACTIVE'" class="mt-8 bg-white rounded-3xl p-6 sm:p-8 shadow-[var(--shadow-card)] border border-neutral-200/50">
          <div class="flex items-center justify-between xl:flex-row flex-col gap-4 mb-6">
            <div>
              <h2 class="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <Icon name="lucide:sparkles" class="text-accent" /> Partner yang Cocok
              </h2>
              <p class="text-neutral-500 text-sm">Sistem menemukan beberapa post yang memiliki kriteria berlawanan dengan Anda.</p>
            </div>
            <NuxtLink to="/matches" class="text-primary font-semibold hover:underline bg-primary/10 px-4 py-2 rounded-xl text-sm justify-center text-center w-full xl:w-auto">
              Lihat di Daftar Matches Anda
            </NuxtLink>
          </div>
        </div>

      </div>

      <div v-else class="py-20 text-center">
        <Icon name="lucide:file-question" class="text-6xl text-neutral-300 mx-auto mb-4" />
        <h2 class="text-xl font-bold text-neutral-900 mb-2">Post Tidak Ditemukan</h2>
        <p class="text-neutral-500 mb-6">Mungkin URL salah, atau post sudah dihapus pemiliknya.</p>
        <NuxtLink to="/explore" class="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors">
          Kembali ke Explore
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { usePostStore } from '~/stores/post'
import { useWhatsApp } from '~/composables/useWhatsApp'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const authStore = useAuthStore()
const { generateMessage, openWhatsApp } = useWhatsApp()

const slug = route.params.slug as string
const post = computed(() => postStore.currentPost)
const isLoading = computed(() => postStore.isLoading)

const isOwner = computed(() => {
  if (!authStore.isAuthenticated || !post.value || !authStore.user) return false
  return post.value.user?.id === authStore.user.id
})

onMounted(async () => {
  if (slug) {
    try {
      await postStore.fetchPostBySlug(slug)
      if (post.value) {
        useSeoMeta({ title: `${post.value.title} — SisiKita` })
      }
    } catch (e) {
      // 404 or others handled natively via v-else-if
    }
  }
})

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function handleComplete() {
  if (!post.value) return
  const confirm = window.confirm('Tandai post ini sebagai selesai/terpenuhi? Post akan menghilang dari explore.')
  if (confirm) {
    await postStore.completePost(post.value.id)
    post.value.status = 'COMPLETED' // optimistic update
  }
}

async function handleDelete() {
  if (!post.value) return
  const confirm = window.confirm('Apakah Anda yakin ingin menghapus post ini?')
  if (confirm) {
    await postStore.deletePost(post.value.id)
    router.push('/explore')
  }
}

function handleHubungi() {
  if (!post.value || !post.value.user) return
  
  if (!authStore.isAuthenticated) {
    alert('Silakan login terlebih dahulu untuk menghubungi pemilik barang.')
    router.push(`/login?redirect=/posts/${slug}`)
    return
  }

  // Generate a basic message since we are the requester
  const message = `Halo ${post.value.user.name}, saya tertarik dengan post Anda di SisiKita: "${post.value.title}". Apakah barangnya masih ada?`
  
  const phone = post.value.user.phone || ''
  if (!phone) {
    alert('Maaf, user ini tidak menyertakan nomor HP/WhatsApp.')
    return
  }

  openWhatsApp(phone, message)
}
</script>
