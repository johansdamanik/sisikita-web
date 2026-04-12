<template>
  <div class="flex flex-col gap-2">
    <div class="w-full h-32 sm:h-48 bg-neutral-200 rounded-2xl skeleton-shimmer"></div>
    <div class="w-3/4 h-4 sm:h-5 bg-neutral-200 rounded-lg mt-1 skeleton-shimmer"></div>
    <div class="w-1/2 h-3 sm:h-4 bg-neutral-200 rounded-md skeleton-shimmer"></div>
  </div>
</template>

<style scoped>
.skeleton-shimmer {
  position: relative;
  overflow: hidden;
}
.skeleton-shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite ease-in-out;
}
@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
</style>
