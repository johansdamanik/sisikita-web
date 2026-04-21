<template>
  <div class="empty-state">
    <div class="empty-icon-wrap">
      <Icon :name="icon" :size="iconSize" class="text-inherit" />
    </div>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-desc">{{ description }}</p>
    <NuxtLink v-if="ctaText && ctaLink" :to="ctaLink" class="empty-cta btn-press">
      <Icon v-if="ctaIcon" :name="ctaIcon" size="18" />
      {{ ctaText }}
    </NuxtLink>
    <button v-else-if="ctaText" @click="$emit('action')" class="empty-cta btn-press">
      <Icon v-if="ctaIcon" :name="ctaIcon" size="18" />
      {{ ctaText }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  icon: { type: String, default: 'lucide:inbox' },
  iconSize: { type: [String, Number], default: 48 },
  title: { type: String, required: true },
  description: { type: String, required: true },
  ctaText: { type: String, default: '' },
  ctaLink: { type: String, default: '' },
  ctaIcon: { type: String, default: '' },
})

defineEmits(['action'])
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 1.5rem;
  border: 1px solid rgba(229, 231, 235, 0.5);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.empty-icon-wrap {
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 9999px;
  background: var(--color-neutral-100);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: var(--color-neutral-400);
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 0.5rem;
}

.empty-desc {
  color: var(--color-neutral-700);
  max-width: 24rem;
  margin: 0 auto 1.5rem;
  font-size: 0.9375rem;
  line-height: 1.6;
}

.empty-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-primary);
  color: white;
  padding: 0.75rem 1.75rem;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 0.9375rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(42, 157, 143, 0.25);
}

.empty-cta:hover {
  background: var(--color-primary-dark);
}
</style>
