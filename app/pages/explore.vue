<template>
  <div class="min-h-screen bg-neutral-50 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900 mb-2">Explore Listing</h1>
        <p class="text-neutral-600">Temukan barang satu sisi yang sedang dicari atau ditawarkan.</p>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-200/50 p-4 sm:p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4 items-end">
          
          <div class="w-full md:w-1/4">
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Kategori</label>
            <div class="relative">
              <Icon name="lucide:layout-grid" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <select 
                v-model="filters.category" 
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none cursor-pointer transition-all"
                @change="applyFilters"
              >
                <option value="">Semua Kategori</option>
                <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">{{ cat.name }}</option>
              </select>
            </div>
          </div>

          <div class="w-full md:w-1/5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Sisi</label>
            <div class="relative">
              <Icon name="lucide:arrow-left-right" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <select 
                v-model="filters.side" 
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none cursor-pointer transition-all"
                @change="applyFilters"
              >
                <option value="">Semua Sisi</option>
                <option value="LEFT">Kiri Saja</option>
                <option value="RIGHT">Kanan Saja</option>
              </select>
            </div>
          </div>

          <div class="w-full md:w-1/5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Ukuran</label>
            <div class="relative">
              <Icon name="lucide:ruler" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                v-model="filters.size"
                type="text"
                placeholder="Misal: 42" 
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                @keyup.enter="applyFilters"
                @input="debouncedApply"
              />
            </div>
          </div>

          <div class="w-full md:w-1/5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Kota</label>
            <div class="relative">
              <Icon name="lucide:map-pin" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                v-model="filters.city"
                type="text"
                placeholder="Cari kota..."
                list="city-suggestions"
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                @keyup.enter="applyFilters"
                @input="debouncedApply"
              />
              <datalist id="city-suggestions">
                <option v-for="c in cities" :key="c" :value="c" />
              </datalist>
            </div>
          </div>

          <div class="w-full md:w-auto">
            <button 
              @click="applyFilters"
              class="w-full md:w-auto bg-neutral-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-neutral-800 transition-colors btn-press flex items-center justify-center gap-2"
            >
              <Icon name="lucide:search" size="18" />
              Cari
            </button>
          </div>
        </div>
        
        <!-- Active Pill Filters -->
        <div v-if="hasActiveFilter" class="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-neutral-100">
          <span class="text-xs text-neutral-500 mr-1">Filter Aktif:</span>
          <button v-if="filters.category" @click="clearFilter('category')" class="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold hover:bg-primary/20 transition-colors">
            {{ getCategoryName(filters.category) }} <Icon name="lucide:x" size="14" />
          </button>
          <button v-if="filters.side" @click="clearFilter('side')" class="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold hover:bg-primary/20 transition-colors">
            Sisi {{ filters.side === 'LEFT' ? 'Kiri' : 'Kanan' }} <Icon name="lucide:x" size="14" />
          </button>
          <button v-if="filters.size" @click="clearFilter('size')" class="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold hover:bg-primary/20 transition-colors">
            Ukuran: {{ filters.size }} <Icon name="lucide:x" size="14" />
          </button>
          <button v-if="filters.city" @click="clearFilter('city')" class="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold hover:bg-primary/20 transition-colors">
            Kota: {{ filters.city }} <Icon name="lucide:x" size="14" />
          </button>
          <button @click="resetFilters" class="text-xs text-neutral-400 hover:text-neutral-700 underline underline-offset-2 ml-2">Reset Semua</button>
        </div>
      </div>

      <!-- Results count -->
      <div v-if="!isLoading && meta" class="mb-4 text-sm text-neutral-500 font-medium">
        Menampilkan {{ posts.length }} dari {{ meta.total }} listing
      </div>

      <div id="feed-section" class="scroll-mt-24">
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <UiSkeletonCard v-for="i in 8" :key="i" />
        </div>

      <div v-else-if="posts.length === 0">
        <UiEmptyState
          icon="lucide:search-x"
          title="Tidak Ada Hasil"
          description="Kami tidak menemukan barang yang sesuai dengan filter pencarian Anda saat ini."
          :cta-text="hasActiveFilter ? 'Hapus Filter Pencarian' : ''"
          @action="resetFilters"
        />
      </div>

      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <PostCard v-for="post in posts" :key="post.id" :post="post" />
        </div>

        <!-- Pagination -->
        <div v-if="meta && meta.totalPages > 1" class="mt-12 flex justify-center items-center gap-2">
          <button 
            @click="changePage(meta.page - 1)" 
            :disabled="meta.page === 1"
            class="w-10 h-10 rounded-full flex items-center justify-center border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="lucide:chevron-left" />
          </button>
          
          <div class="flex gap-1">
            <template v-for="p in paginationPages" :key="p">
              <span v-if="p === '...'" class="w-10 h-10 flex items-center justify-center text-neutral-400 text-sm">...</span>
              <button 
                v-else
                @click="changePage(p as number)"
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  meta.page === p ? 'bg-primary text-white shadow-md' : 'text-neutral-600 hover:bg-neutral-100'
                ]"
              >
                {{ p }}
              </button>
            </template>
          </div>
          
          <button 
            @click="changePage(meta.page + 1)" 
            :disabled="meta.page === meta.totalPages"
            class="w-10 h-10 rounded-full flex items-center justify-center border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="lucide:chevron-right" />
          </button>
        </div>
      </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from '~/stores/category'
import { usePostStore } from '~/stores/post'

useSeoMeta({ title: 'Explore — SisiKita' })

const categoryStore = useCategoryStore()
const postStore = usePostStore()

const route = useRoute()
const router = useRouter()

// Cities for autocomplete
const cities = ref<string[]>([])

// Sync filters with URL query properly
const filters = reactive({
  category: (route.query.category as string) || '',
  side: (route.query.side as string) || '',
  size: (route.query.size as string) || '',
  city: (route.query.city as string) || '',
  page: Number(route.query.page) || 1,
})

const isLoading = computed(() => postStore.isLoading)
const posts = computed(() => postStore.posts)
const meta = computed(() => postStore.meta)
const categories = computed(() => categoryStore.categories)

const hasActiveFilter = computed(() => {
  return !!filters.category || !!filters.side || !!filters.size || !!filters.city
})

// Smart pagination: show ellipsis for many pages
const paginationPages = computed(() => {
  if (!meta.value) return []
  const total = meta.value.totalPages
  const current = meta.value.page
  
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  
  const pages: (number | string)[] = [1]
  if (current > 3) pages.push('...')
  
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  
  for (let i = start; i <= end; i++) pages.push(i)
  
  if (current < total - 2) pages.push('...')
  pages.push(total)
  
  return pages
})

// Debounce for text inputs
let debounceTimer: ReturnType<typeof setTimeout> | null = null
function debouncedApply() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    applyFilters()
  }, 400)
}

// Initialize
onMounted(async () => {
  if (categories.value.length === 0) {
    categoryStore.fetchCategories()
  }
  
  // Fetch cities for autocomplete
  try {
    const { apiFetch } = useApi()
    cities.value = await apiFetch<string[]>('/api/posts/cities')
  } catch { /* ignore */ }
  
  await fetchPosts()
})

function getCategoryName(slug: string) {
  const cat = categories.value.find(c => c.id === slug || c.slug === slug)
  return cat ? cat.name : 'Kategori'
}

async function fetchPosts() {
  const queryToApi: any = {}
  
  if (filters.category) queryToApi.category = filters.category
  if (filters.side) queryToApi.side = filters.side
  if (filters.size) queryToApi.size = filters.size
  if (filters.city) queryToApi.city = filters.city
  if (filters.page > 1) queryToApi.page = filters.page

  // Update URL internally
  router.replace({ path: '/explore', query: queryToApi })

  await postStore.fetchPosts(queryToApi)
}

function applyFilters() {
  filters.page = 1
  fetchPosts()
}

function clearFilter(key: 'category' | 'side' | 'size' | 'city') {
  filters[key] = ''
  applyFilters()
}

function resetFilters() {
  filters.category = ''
  filters.side = ''
  filters.size = ''
  filters.city = ''
  applyFilters()
}

function changePage(p: number) {
  filters.page = p
  fetchPosts()
  if (import.meta.client) {
    document.getElementById('feed-section')?.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
