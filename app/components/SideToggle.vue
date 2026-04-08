<template>
  <div class="flex items-center gap-4">
    <!-- Left -->
    <button 
      type="button"
      class="flex-1 flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all duration-200"
      :class="[
        modelValue === 'LEFT' 
          ? 'border-[var(--color-side-left)] bg-[color-mix(in_srgb,var(--color-side-left)_10%,white)] shadow-md' 
          : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
      ]"
      @click="$emit('update:modelValue', 'LEFT')"
    >
      <Icon name="lucide:arrow-left-square" class="text-3xl mb-2" :class="modelValue === 'LEFT' ? 'text-[var(--color-side-left)]' : 'text-neutral-400'" />
      <span class="font-bold" :class="modelValue === 'LEFT' ? 'text-[var(--color-side-left)]' : 'text-neutral-500'">Sisi Kiri</span>
    </button>

    <!-- Right -->
    <button 
      type="button"
      class="flex-1 flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all duration-200"
      :class="[
        modelValue === 'RIGHT' 
          ? 'border-[var(--color-side-right)] bg-[color-mix(in_srgb,var(--color-side-right)_10%,white)] shadow-md' 
          : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
      ]"
      @click="$emit('update:modelValue', 'RIGHT')"
    >
      <Icon name="lucide:arrow-right-square" class="text-3xl mb-2" :class="modelValue === 'RIGHT' ? 'text-[var(--color-side-right)]' : 'text-neutral-400'" />
      <span class="font-bold" :class="modelValue === 'RIGHT' ? 'text-[var(--color-side-right)]' : 'text-neutral-500'">Sisi Kanan</span>
    </button>
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
