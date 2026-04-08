<template>
  <div class="max-w-2xl mx-auto px-4 py-8 sm:py-12">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-neutral-900 mb-2">Lengkapi Profilmu</h1>
      <p class="text-neutral-700">
        {{ currentStep === 1 ? 'Langkah 1 dari 2 — Data Diri' : 'Langkah 2 dari 2 — Ukuran' }}
      </p>
      <!-- Progress bar -->
      <div class="flex gap-2 mt-4 max-w-xs mx-auto">
        <div class="h-1.5 flex-1 rounded-full" :class="currentStep >= 1 ? 'bg-primary' : 'bg-neutral-200'"></div>
        <div class="h-1.5 flex-1 rounded-full" :class="currentStep >= 2 ? 'bg-primary' : 'bg-neutral-200'"></div>
      </div>
    </div>

    <!-- Step 1: Personal Info -->
    <form v-if="currentStep === 1" @submit.prevent="saveStep1" class="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-200/50 p-6 sm:p-8">
      <div class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-neutral-900 mb-1.5">Nama Lengkap *</label>
          <input v-model="profileForm.name" type="text" required placeholder="Masukkan nama lengkap" class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-900 mb-1.5">Nomor WhatsApp *</label>
          <input v-model="profileForm.phone" type="tel" required placeholder="08xxxxxxxxxx" class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-900 mb-1.5">Kota *</label>
          <input v-model="profileForm.city" type="text" required placeholder="Contoh: Jakarta" class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-900 mb-1.5">Alamat (opsional)</label>
          <input v-model="profileForm.address" type="text" placeholder="Alamat lengkap" class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-900 mb-1.5">Sisi Utama *</label>
          <div class="grid grid-cols-3 gap-3">
            <button type="button" v-for="option in sideOptions" :key="option.value" @click="profileForm.primarySide = option.value"
              :class="[
                'py-3 rounded-xl border-2 text-center font-medium transition-all text-sm',
                profileForm.primarySide === option.value ? 'border-primary bg-primary/5 text-primary' : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
              ]"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-900 mb-1.5">Jenis Kebutuhan (opsional)</label>
          <select v-model="profileForm.needType" class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all">
            <option value="">— Pilih —</option>
            <option value="AMPUTEE">Amputasi</option>
            <option value="SIZE_DIFFERENCE">Perbedaan Ukuran</option>
            <option value="OTHER">Lainnya</option>
          </select>
        </div>
      </div>
      <button type="submit" :disabled="isLoading" class="w-full mt-6 bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary-dark transition-colors btn-press disabled:opacity-50">
        Lanjut →
      </button>
    </form>

    <!-- Step 2: Size Profile -->
    <div v-if="currentStep === 2" class="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-neutral-200/50 p-6 sm:p-8">
      <h3 class="text-lg font-semibold text-neutral-900 mb-4">Tambahkan Ukuranmu</h3>
      <p class="text-neutral-700 text-sm mb-6">Minimal 1 ukuran agar sistem bisa mencocokkan.</p>

      <!-- Added Size Profiles -->
      <div v-if="addedSizes.length > 0" class="space-y-3 mb-6">
        <div v-for="sp in addedSizes" :key="sp.id" class="flex items-center justify-between bg-neutral-50 rounded-xl px-4 py-3 border border-neutral-200">
          <div>
            <Icon v-if="sp.category?.icon" :name="sp.category?.icon" class="text-lg mr-2" />
            <span class="font-medium text-neutral-900">{{ sp.category?.name }}</span>
            <span class="text-neutral-700 ml-2">— Ukuran {{ sp.size }}</span>
            <span v-if="sp.sizeDetail" class="text-neutral-400 text-sm"> ({{ sp.sizeDetail }})</span>
          </div>
          <button @click="removeSizeProfile(sp.id)" class="text-error hover:text-error/80 transition-colors">
            <Icon name="heroicons:x-mark-20-solid" size="20" />
          </button>
        </div>
      </div>

      <!-- Add New Size Profile Form -->
      <form @submit.prevent="addSizeProfile" class="space-y-4 border-t border-neutral-200 pt-6">
        <div>
          <label class="block text-sm font-medium text-neutral-900 mb-1.5">Kategori *</label>
          <select v-model="sizeForm.categoryId" required class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all">
            <option value="">— Pilih Kategori —</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-neutral-900 mb-1.5">Ukuran *</label>
            <input v-model="sizeForm.size" type="text" required placeholder="42, M, L" class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-900 mb-1.5">Detail (opsional)</label>
            <input v-model="sizeForm.sizeDetail" type="text" placeholder="27cm" class="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          </div>
        </div>
        <button type="submit" :disabled="isLoading" class="w-full bg-neutral-900 text-white py-3 rounded-xl font-semibold hover:bg-neutral-800 transition-colors btn-press disabled:opacity-50">
          + Tambah Ukuran
        </button>
      </form>

      <button @click="finishSetup" :disabled="addedSizes.length === 0" class="w-full mt-6 bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary-dark transition-colors btn-press disabled:opacity-50 disabled:cursor-not-allowed">
        Selesai & Mulai Explore 🚀
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from '~/stores/category'
import { useUserStore } from '~/stores/user'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Setup Profil — SisiKita' })

const userStore = useUserStore()
const categoryStore = useCategoryStore()
const isLoading = ref(false)
const currentStep = ref(1)

await categoryStore.fetchCategories()
const categories = computed(() => categoryStore.categories)

const sideOptions = [
  { value: 'LEFT', label: 'Kiri' },
  { value: 'RIGHT', label: 'Kanan' },
  { value: 'BOTH', label: 'Keduanya' },
]

const profileForm = reactive({
  name: '',
  phone: '',
  city: '',
  address: '',
  primarySide: 'BOTH',
  needType: '',
})

const sizeForm = reactive({
  categoryId: '',
  size: '',
  sizeDetail: '',
})

const addedSizes = ref<any[]>([])

async function saveStep1() {
  isLoading.value = true
  try {
    const data: any = { ...profileForm }
    if (!data.needType) delete data.needType
    if (!data.address) delete data.address
    await userStore.updateProfile(data)
    currentStep.value = 2
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal menyimpan profil')
  } finally {
    isLoading.value = false
  }
}

async function addSizeProfile() {
  isLoading.value = true
  try {
    const data: any = { ...sizeForm }
    if (!data.sizeDetail) delete data.sizeDetail
    const result = await userStore.addSizeProfile(data)
    addedSizes.value.push(result)
    sizeForm.categoryId = ''
    sizeForm.size = ''
    sizeForm.sizeDetail = ''
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal menambahkan ukuran')
  } finally {
    isLoading.value = false
  }
}

async function removeSizeProfile(id: string) {
  await userStore.deleteSizeProfile(id)
  addedSizes.value = addedSizes.value.filter(s => s.id !== id)
}

async function finishSetup() {
  await navigateTo('/explore')
}
</script>
