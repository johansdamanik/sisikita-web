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
          
          <div class="w-full md:w-1/3">
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Kategori</label>
            <div class="relative">
              <Icon name="lucide:layout-grid" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <select 
                v-model="filters.category" 
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none cursor-pointer transition-all"
              >
                <option value="">Semua Kategori</option>
                <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">{{ cat.name }}</option>
              </select>
            </div>
          </div>

          <div class="w-full md:w-1/4">
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Sisi</label>
            <div class="relative">
              <Icon name="lucide:arrow-left-right" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <select 
                v-model="filters.side" 
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none cursor-pointer transition-all"
              >
                <option value="">Semua Sisi</option>
                <option value="LEFT">Kiri Saja</option>
                <option value="RIGHT">Kanan Saja</option>
              </select>
            </div>
          </div>

          <div class="w-full md:w-1/4">
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Ukuran</label>
            <div class="relative">
              <Icon name="lucide:ruler" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                v-model="filters.size"
                type="text"
                placeholder="Cari ukuran (misal: 42)" 
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                @keyup.enter="applyFilters"
              />
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
          <button @click="resetFilters" class="text-xs text-neutral-400 hover:text-neutral-700 underline underline-offset-2 ml-2">Reset Semua</button>
        </div>
      </div>

      <!-- Feed Grid -->
      <div id="feed-section" class="scroll-mt-24">
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="bg-white rounded-2xl h-80 shadow-sm border border-neutral-200/50 p-4">
          <div class="h-40 skeleton rounded-xl mb-4"></div>
          <div class="h-5 skeleton w-2/3 mb-2"></div>
          <div class="h-4 skeleton w-full mb-4"></div>
          <div class="flex items-center gap-2 mt-auto">
            <div class="w-8 h-8 skeleton rounded-full"></div>
            <div class="h-4 skeleton w-1/3"></div>
          </div>
        </div>
      </div>

      <div v-else-if="posts.length === 0" class="text-center py-20 bg-white rounded-2xl border border-neutral-200/50 shadow-sm">
        <div class="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
          <Icon name="lucide:search-x" size="32" />
        </div>
        <h3 class="text-lg font-semibold text-neutral-900 mb-2">Tidak Ada Hasil</h3>
        <p class="text-neutral-500 max-w-sm mx-auto">Kami tidak menemukan barang yang sesuai dengan filter pencarian Anda saat ini.</p>
        <button v-if="hasActiveFilter" @click="resetFilters" class="mt-6 bg-white border border-neutral-300 text-neutral-700 px-6 py-2.5 rounded-full font-medium hover:bg-neutral-50 transition-colors">
          Hapus Filter Pencarian
        </button>
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
            <button 
              v-for="p in meta.totalPages" :key="p"
              @click="changePage(p)"
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                meta.page === p ? 'bg-primary text-white shadow-md' : 'text-neutral-600 hover:bg-neutral-100'
              ]"
            >
              {{ p }}
            </button>
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

// Sync filters with URL query properly
const filters = reactive({
  category: (route.query.category as string) || '',
  side: (route.query.side as string) || '',
  size: (route.query.size as string) || '',
  page: Number(route.query.page) || 1,
})

const isLoading = computed(() => postStore.isLoading)
const posts = computed(() => postStore.posts)
const meta = computed(() => postStore.meta)
const categories = computed(() => categoryStore.categories)

const hasActiveFilter = computed(() => {
  return !!filters.category || !!filters.side || !!filters.size
})

// Initialize
onMounted(async () => {
  if (categories.value.length === 0) {
    categoryStore.fetchCategories()
  }
  
  // Convert category slug from URL to categoryId if needed (URL usually has slug for SEO, but our stores might use IDs. Let's assume URL query 'category' can be either ID or slug. Our API searches by categoryId. Oh wait, backend Prisma expects categoryId string).
  // Actually, our API /api/posts uses ?category=SLUG or ?categoryId=UUID.
  // In posts.service.ts backend, if 'category' is passed, it matches slug. If it's a UUID, we have to match exactly. Backend `findAll` has `if (filters.category) { AND.push(category: { slug: ... }) }`.
  // Wait, the select box v-model bound to category.id!
  // I should ensure the backend supports filtering by category slug or ID properly.
  // Let's pass the value exactly.
  
  await fetchPosts()
})

function getCategoryName(idOuSlug: string) {
  const cat = categories.value.find(c => c.id === idOuSlug || c.slug === idOuSlug)
  return cat ? cat.name : 'Kategori'
}

async function fetchPosts() {
  const queryToApi: any = {}
  
  if (filters.category) queryToApi.category = filters.category
  if (filters.side) queryToApi.side = filters.side
  if (filters.size) queryToApi.size = filters.size
  if (filters.page > 1) queryToApi.page = filters.page

  // Update URL internally
  router.replace({ path: '/explore', query: { ...filters } })

  await postStore.fetchPosts(queryToApi)
}

function applyFilters() {
  filters.page = 1
  fetchPosts()
}

function clearFilter(key: 'category' | 'side' | 'size') {
  filters[key] = ''
  applyFilters()
}

function resetFilters() {
  filters.category = ''
  filters.side = ''
  filters.size = ''
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
