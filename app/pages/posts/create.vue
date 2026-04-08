<template>
  <div class="min-h-screen bg-neutral-50 pb-20">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div class="mb-8 flex items-center gap-4">
        <NuxtLink to="/profile" class="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors">
          <Icon name="lucide:arrow-left" />
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Buat Post Baru</h1>
          <p class="text-neutral-500 text-sm">Tambahkan barang satu sisi Anda ke dalam SisiKita.</p>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-[var(--shadow-card)] border border-neutral-200/50 overflow-hidden">
        
        <form @submit.prevent="handleSubmit" class="p-6 sm:p-8 space-y-8">
          
          <!-- Tipe Post -->
          <section>
            <h2 class="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">1. Tujuan Anda</h2>
            <PostTypePicker v-model="form.type" />
          </section>

          <hr class="border-neutral-100" />

          <!-- Barang & Spesifikasi -->
          <section>
            <h2 class="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">2. Spesifikasi Barang</h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-semibold text-neutral-900 mb-2">Kategori <span class="text-error">*</span></label>
                <select 
                  v-model="form.categoryId" 
                  required
                  class="w-full px-4 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  @change="handleCategoryChange"
                >
                  <option value="" disabled>Pilih Kategori</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-neutral-900 mb-2">Ukuran <span class="text-error">*</span></label>
                <input 
                  v-model="form.size" 
                  type="text" 
                  required
                  placeholder="Misal: 42, M, XL"
                  class="w-full px-4 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                
                <!-- Quick Suggestion dari Size Profile -->
                <div v-if="suggestedSize" class="mt-2 flex items-center gap-2">
                  <span class="text-xs text-neutral-500">Saran dari profil Anda:</span>
                  <button type="button" @click="form.size = suggestedSize.size" class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-semibold hover:bg-primary/20">
                    Gunakan Size {{ suggestedSize.size }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Side Toggle -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-neutral-900 mb-2">Bagian Sisi yang Ditawarkan/Dicari <span class="text-error">*</span></label>
              <SideToggle v-model="form.side" />
            </div>

          </section>

          <hr class="border-neutral-100" />

          <!-- Detail Post -->
          <section>
            <h2 class="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">3. Detail Informasi</h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-neutral-900 mb-2">Judul Post <span class="text-error">*</span></label>
                <input 
                  v-model="form.title" 
                  type="text" 
                  required
                  placeholder="Misal: Cari sepatu Nike Air Max sebelah kiri"
                  class="w-full px-4 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-neutral-900 mb-2">Deskripsi (Opsional)</label>
                <textarea 
                  v-model="form.description" 
                  rows="4"
                  placeholder="Ceritakan detail barang, kondisi, atau lokasi COD yang ideal..."
                  class="w-full px-4 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-neutral-900 mb-2">Kota / Lokasi <span class="text-error">*</span></label>
                  <input 
                    v-model="form.city" 
                    type="text" 
                    required
                    placeholder="Kota asal Anda"
                    class="w-full px-4 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-neutral-900 mb-2">URL Gambar (Opsional)</label>
                  <input 
                    v-model="form.imageUrl" 
                    type="url" 
                    placeholder="https://..."
                    class="w-full px-4 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          <!-- Submit -->
          <div class="pt-6 border-t border-neutral-100 flex justify-end gap-4">
            <button 
              type="button" 
              @click="router.back()"
              class="px-6 py-3.5 rounded-xl font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
              :disabled="isLoading"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="px-8 py-3.5 rounded-xl font-semibold text-white bg-primary hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 btn-press flex items-center justify-center gap-2"
              :disabled="isLoading"
            >
              <Icon v-if="isLoading" name="lucide:loader-2" class="animate-spin" />
              <Icon v-else name="lucide:send" />
              {{ isLoading ? 'Memproses...' : 'Publish Post' }}
            </button>
          </div>

        </form>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCategoryStore } from '~/stores/category'
import { usePostStore } from '~/stores/post'
import { useUserStore } from '~/stores/user'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Buat Post Baru — SisiKita' })

const router = useRouter()
const categoryStore = useCategoryStore()
const postStore = usePostStore()
const userStore = useUserStore()

const isLoading = ref(false)

const form = reactive({
  type: 'CARI_PARTNER', // CARI_PARTNER or SHARING
  categoryId: '',
  side: 'LEFT',
  size: '',
  title: '',
  description: '',
  city: '',
  imageUrl: ''
})

const categories = computed(() => categoryStore.categories)
const sizeProfiles = computed(() => userStore.sizeProfiles)
const profile = computed(() => userStore.profile)

// Auto-suggest size based on category selection
const suggestedSize = computed(() => {
  if (!form.categoryId || sizeProfiles.value.length === 0) return null
  return sizeProfiles.value.find(sp => sp.categoryId === form.categoryId)
})

onMounted(async () => {
  if (categories.value.length === 0) {
    await categoryStore.fetchCategories()
  }
  if (!profile.value) {
    await userStore.fetchProfile()
  }
  
  // Auto-fill city
  if (profile.value?.city) {
    form.city = profile.value.city
  }
})

function handleCategoryChange() {
  if (suggestedSize.value && !form.size) {
    form.size = suggestedSize.value.size
  }
}

async function handleSubmit() {
  if (!form.categoryId || !form.size || !form.title || !form.city) return
  
  isLoading.value = true
  try {
    const newPost = await postStore.createPost({
      ...form,
      imageUrl: form.imageUrl || undefined // Don't send empty strings if optional
    })
    
    // Redirect to success/detail page
    router.push(`/posts/${newPost.slug}`)
  } catch (error: any) {
    alert(error?.data?.message || 'Terjadi kesalahan saat membuat post')
  } finally {
    isLoading.value = false
  }
}
</script>
