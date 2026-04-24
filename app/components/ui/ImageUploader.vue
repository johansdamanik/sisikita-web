<template>
  <div class="image-uploader">
    <input
      type="file"
      ref="fileInput"
      class="hidden"
      accept="image/jpeg, image/png, image/webp"
      @change="handleFileChange"
    />

    <div
      v-if="!modelValue && !isUploading"
      class="upload-area"
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      :class="{ 'border-primary bg-primary/5': isDragging }"
    >
      <div class="upload-content">
        <div class="upload-icon">
          <Icon name="lucide:image-plus" size="32" class="text-neutral-400" />
        </div>
        <p class="font-semibold text-neutral-700 text-sm">Klik atau Seret Gambar ke Sini</p>
        <p class="text-xs text-neutral-400 mt-1">Maks. 5MB (JPG, PNG, WEBP)</p>
      </div>
    </div>

    <!-- Uploading State -->
    <div v-else-if="isUploading" class="upload-progress-area">
      <div class="flex flex-col items-center gap-3">
        <Icon name="lucide:loader-2" size="32" class="text-primary animate-spin" />
        <p class="text-sm font-semibold text-neutral-600">Mengunggah...</p>
        <!-- Simple progress bar -->
        <div class="w-full max-w-[200px] h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div class="h-full bg-primary animate-pulse w-full"></div>
        </div>
      </div>
    </div>

    <!-- Preview State -->
    <div v-else-if="modelValue" class="upload-preview relative group">
      <NuxtImg :src="modelValue" alt="Preview" class="w-full h-full object-cover rounded-xl" />
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
        <button
          type="button"
          @click="triggerFileInput"
          class="w-10 h-10 bg-white text-neutral-800 rounded-full flex items-center justify-center shadow-lg hover:bg-neutral-100 transition-colors"
          title="Ganti Gambar"
        >
          <Icon name="lucide:refresh-cw" size="18" />
        </button>
        <button
          type="button"
          @click="removeImage"
          class="w-10 h-10 bg-error text-white rounded-full flex items-center justify-center shadow-lg hover:bg-error/90 transition-colors"
          title="Hapus Gambar"
        >
          <Icon name="lucide:trash-2" size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  folder: {
    type: String,
    default: '/sisikita',
  },
})

const emit = defineEmits(['update:modelValue'])

const { showError } = useToast()
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (file) {
      await processFile(file)
    }
    // Reset input
    target.value = ''
  }
}

async function handleDrop(event: DragEvent) {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0]
    if (file) {
      await processFile(file)
    }
  }
}

async function processFile(file: File) {
  // Validate file
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    showError('Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    showError('Ukuran file maksimal 5MB.')
    return
  }

  isUploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)
    // Optional: send folder info if needed by backend, 
    // but the backend controller is currently not extracting folder from body in standard way.
    // It's using default '/sisikita' in service. Let's just upload.

    const { apiFetch } = useApi()
    const response = await apiFetch<{ url: string; fileId: string }>('/api/v1/uploads/image', {
      method: 'POST',
      body: formData,
    })

    emit('update:modelValue', response.url)
  } catch (error: any) {
    // API catch block will automatically show toast thanks to our previous work :)
    console.error('Upload error', error)
  } finally {
    isUploading.value = false
  }
}

function removeImage() {
  emit('update:modelValue', '')
}
</script>

<style scoped>
.upload-area {
  border: 2px dashed var(--color-neutral-200);
  border-radius: 1rem;
  background-color: var(--color-neutral-50);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: var(--color-primary-light);
  background-color: color-mix(in srgb, var(--color-primary) 5%, transparent);
}

.upload-content {
  text-align: center;
  padding: 1.5rem;
}

.upload-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
  box-shadow: var(--shadow-card);
}

.upload-progress-area {
  border: 2px solid var(--color-neutral-200);
  border-radius: 1rem;
  background-color: white;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-preview {
  width: 100%;
  height: 240px;
  border-radius: 1rem;
  border: 1px solid var(--color-neutral-200);
  background-color: var(--color-neutral-100);
}
</style>
