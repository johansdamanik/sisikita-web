<template>
  <div class="min-h-screen bg-neutral-50 pb-20">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div class="mb-8 flex items-center gap-4">
        <button @click="router.back()" class="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors">
          <Icon name="lucide:arrow-left" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-neutral-900">Edit Post</h1>
          <p class="text-neutral-500 text-sm">Perbarui informasi post Anda.</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="py-20 flex justify-center">
        <Icon name="lucide:loader-2" class="animate-spin text-4xl text-primary" />
      </div>

      <div v-else-if="!post" class="py-20">
        <UiEmptyState
          icon="lucide:file-question"
          title="Post Tidak Ditemukan"
          description="Post yang ingin Anda edit tidak ditemukan atau Anda tidak memiliki akses."
          cta-text="Kembali ke Profil"
          cta-link="/profile"
        />
      </div>

      <div v-else class="bg-white rounded-3xl shadow-[var(--shadow-card)] border border-neutral-200/50 overflow-hidden">
        
        <form @submit.prevent="handleSubmit" class="p-6 sm:p-8 space-y-8">
          
          <!-- Tipe Post (read-only) -->
          <section>
            <h2 class="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Tipe Post</h2>
            <div class="inline-flex items-center gap-2 bg-neutral-100 text-neutral-600 px-4 py-2.5 rounded-xl text-sm font-semibold">
              <Icon :name="form.type === 'CARI_PARTNER' ? 'lucide:search' : 'lucide:share-2'" size="18" />
              {{ form.type === 'CARI_PARTNER' ? 'Cari Partner' : 'Sharing' }}
              <span class="text-xs text-neutral-400 ml-2">(tidak bisa diubah)</span>
            </div>
          </section>

          <hr class="border-neutral-100" />

          <!-- Spesifikasi Barang -->
          <section>
            <h2 class="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Spesifikasi Barang</h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-semibold text-neutral-900 mb-2">Kategori <span class="text-error">*</span></label>
                <select 
                  v-model="form.categoryId" 
                  required
                  class="w-full px-4 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
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
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-semibold text-neutral-900 mb-2">Bagian Sisi <span class="text-error">*</span></label>
              <SideToggle v-model="form.side" />
            </div>
          </section>

          <hr class="border-neutral-100" />

          <!-- Detail -->
          <section>
            <h2 class="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Detail Informasi</h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-neutral-900 mb-2">Judul Post <span class="text-error">*</span></label>
                <input 
                  v-model="form.title" 
                  type="text" 
                  required
                  class="w-full px-4 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-neutral-900 mb-2">Deskripsi (Opsional)</label>
                <textarea 
                  v-model="form.description" 
                  rows="4"
                  placeholder="Ceritakan detail barang..."
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
                    class="w-full px-4 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                
                <div class="sm:col-span-2">
                  <label class="block text-sm font-semibold text-neutral-900 mb-2">Foto Barang / Referensi (Opsional)</label>
                  <UiImageUploader v-model="form.imageUrl" folder="/sisikita/posts" />
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
              :disabled="isSubmitting"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="px-8 py-3.5 rounded-xl font-semibold text-white bg-primary hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 btn-press flex items-center justify-center gap-2"
              :disabled="isSubmitting"
            >
              <Icon v-if="isSubmitting" name="lucide:loader-2" class="animate-spin" />
              <Icon v-else name="lucide:save" />
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from '~/stores/category'
import { usePostStore } from '~/stores/post'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Edit Post — SisiKita' })

const router = useRouter()
const route = useRoute()
const categoryStore = useCategoryStore()
const postStore = usePostStore()
const { showSuccess } = useToast()

const postId = route.params.id as string
const loading = ref(true)
const isSubmitting = ref(false)
const post = ref<any>(null)

const form = reactive({
  type: '',
  categoryId: '',
  side: 'LEFT',
  size: '',
  title: '',
  description: '',
  city: '',
  imageUrl: '',
})

const categories = computed(() => categoryStore.categories)

onMounted(async () => {
  if (categories.value.length === 0) {
    await categoryStore.fetchCategories()
  }

  try {
    const { apiFetch } = useApi()
    // Fetch post by ID via my posts list
    await postStore.fetchMyPosts()
    const found = postStore.myPosts.find(p => p.id === postId)
    if (found) {
      post.value = found
      // Pre-fill form
      form.type = found.type
      form.categoryId = (found as any).categoryId || found.category?.id || ''
      form.side = found.side
      form.size = found.size
      form.title = found.title
      form.description = found.description || ''
      form.city = found.city
      form.imageUrl = found.imageUrl || ''
    }
  } catch {
    // handled by empty state
  } finally {
    loading.value = false
  }
})

async function handleSubmit() {
  if (!form.title || !form.size || !form.city) return

  isSubmitting.value = true
  try {
    const { apiFetch } = useApi()
    const updated = await apiFetch<any>(`/api/posts/${postId}`, {
      method: 'PATCH',
      body: {
        categoryId: form.categoryId,
        side: form.side,
        size: form.size,
        title: form.title,
        description: form.description || undefined,
        city: form.city,
        imageUrl: form.imageUrl || undefined,
      },
    })
    showSuccess('Post berhasil diperbarui!')
    router.push(`/posts/${updated.slug}`)
  } catch (error: any) {
    // Toast handled by useApi
  } finally {
    isSubmitting.value = false
  }
}
</script>
