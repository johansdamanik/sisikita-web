<template>
  <div class="grid grid-cols-2 gap-4">
    <!-- Cari Pasangan -->
    <div 
      class="border-2 rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-200"
      :class="[
        modelValue === 'CARI_PARTNER' 
          ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 scale-[1.02]' 
          : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
      ]"
      @click="$emit('update:modelValue', 'CARI_PARTNER')"
    >
      <div 
        class="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors"
        :class="modelValue === 'CARI_PARTNER' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-500'"
      >
        <Icon name="lucide:search" class="text-xl" />
      </div>
      <h3 class="font-bold text-neutral-900 mb-1" :class="{ 'text-primary': modelValue === 'CARI_PARTNER' }">
        Cari Pasangan
      </h3>
      <p class="text-xs text-neutral-500 leading-relaxed">
        Anda memiliki barang satu sisi, dan sedang mencari sisi lainnya dari pengguna lain.
      </p>
    </div>

    <!-- Berbagi Barang -->
    <div 
      class="border-2 rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-200"
      :class="[
        modelValue === 'SHARING' 
          ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 scale-[1.02]' 
          : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
      ]"
      @click="$emit('update:modelValue', 'SHARING')"
    >
      <div 
        class="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors"
        :class="modelValue === 'SHARING' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-500'"
      >
        <Icon name="lucide:gift" class="text-xl" />
      </div>
      <h3 class="font-bold text-neutral-900 mb-1" :class="{ 'text-primary': modelValue === 'SHARING' }">
        Berbagi Barang
      </h3>
      <p class="text-xs text-neutral-500 leading-relaxed">
        Anda memiliki barang satu sisi yang tidak terpakai, dan ingin memberikannya.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
