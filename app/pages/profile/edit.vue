<template>
  <div class="min-h-screen bg-neutral-50 pb-20">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <NuxtLink to="/profile" class="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-6 font-medium transition-colors">
        <Icon name="lucide:arrow-left" /> Kembali ke Profil
      </NuxtLink>

      <div class="bg-white rounded-3xl shadow-[var(--shadow-card)] border border-neutral-200/50 p-6 sm:p-10">
        <h1 class="text-3xl font-extrabold text-neutral-900 mb-8 tracking-tight">Edit Data Diri</h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-neutral-900 mb-2">Nama Lengkap <span class="text-error">*</span></label>
              <input 
                v-model="form.name" 
                type="text" 
                required
                class="w-full px-4 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-neutral-900 mb-2">Platform Chat (WhatsApp) <span class="text-error">*</span></label>
              <input 
                v-model="form.phone" 
                type="tel" 
                required
                placeholder="0812xxxx (Gunakan angka)"
                class="w-full px-4 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-neutral-900 mb-2">Kota / Lokasi <span class="text-error">*</span></label>
            <input 
              v-model="form.city" 
              type="text" 
              required
              class="w-full px-4 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-neutral-900 mb-2">Alamat Lengkap (Opsional)</label>
            <textarea 
              v-model="form.address" 
              rows="3"
              class="w-full px-4 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-neutral-900 mb-2">Kebutuhan Utama</label>
              <select 
                v-model="form.needType"
                class="w-full px-4 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              >
                <option value="" disabled>Pilih kebutuhan</option>
                <option value="AMPUTEE">Amputasi (Cari satu saja)</option>
                <option value="SIZE_DIFFERENCE">Ukuran Berbeda</option>
                <option value="OTHER">Lainnya...</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-neutral-900 mb-2">Sisi Utama Anda</label>
              <select 
                v-model="form.primarySide"
                class="w-full px-4 py-3.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              >
                <option value="LEFT">Selalu Kiri</option>
                <option value="RIGHT">Selalu Kanan</option>
                <option value="BOTH">Bisa Keduanya</option>
              </select>
            </div>
          </div>

          <div class="pt-6 border-t border-neutral-100 flex justify-end gap-4 mt-8">
            <NuxtLink to="/profile" class="px-6 py-3.5 rounded-xl font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors">
              Batal
            </NuxtLink>
            <button 
              type="submit" 
              class="px-8 py-3.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 btn-press"
              :disabled="isSubmitting"
            >
              <Icon v-if="isSubmitting" name="lucide:loader-2" class="animate-spin" />
              <Icon v-else name="lucide:save" size="20" />
              Simpan Perubahan
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Edit Profil — SisiKita' })

const router = useRouter()
const userStore = useUserStore()

const isSubmitting = ref(false)

const form = reactive({
  name: '',
  phone: '',
  city: '',
  address: '',
  needType: 'OTHER',
  primarySide: 'LEFT'
})

onMounted(async () => {
  if (!userStore.profile) {
    await userStore.fetchProfile()
  }
  
  const p = userStore.profile
  if (p) {
    form.name = p.name || ''
    form.phone = p.phone || ''
    form.city = p.city || ''
    form.address = p.address || ''
    form.needType = p.needType || 'OTHER'
    form.primarySide = p.primarySide || 'LEFT'
  }
})

async function handleSubmit() {
  isSubmitting.value = true
  try {
    const payload: Record<string, string> = {
      name: form.name,
      phone: form.phone,
      city: form.city,
      primarySide: form.primarySide
    }
    if (form.address) payload.address = form.address
    if (form.needType) payload.needType = form.needType

    await userStore.updateProfile(payload)
    router.push('/profile')
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal menyimpan profil')
  } finally {
    isSubmitting.value = false
  }
}
</script>
