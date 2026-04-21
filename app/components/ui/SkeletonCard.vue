<template>
  <div class="skeleton-card">
    <div class="skeleton-image skeleton-shimmer"></div>
    <div class="skeleton-body">
      <div class="skeleton-badges">
        <div class="skeleton-badge skeleton-shimmer"></div>
        <div class="skeleton-badge-sm skeleton-shimmer"></div>
      </div>
      <div class="skeleton-title skeleton-shimmer"></div>
      <div class="skeleton-text skeleton-shimmer"></div>
      <div class="skeleton-text-short skeleton-shimmer"></div>
      <div class="skeleton-footer">
        <div class="skeleton-footer-left">
          <div class="skeleton-avatar skeleton-shimmer"></div>
          <div class="skeleton-meta">
            <div class="skeleton-meta-name skeleton-shimmer"></div>
            <div class="skeleton-meta-loc skeleton-shimmer"></div>
          </div>
        </div>
        <div class="skeleton-date skeleton-shimmer"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(229, 231, 235, 0.5);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.skeleton-image {
  width: 100%;
  height: 180px;
  background-color: #f3f4f6;
}

.skeleton-body {
  padding: 1.25rem;
}

.skeleton-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.skeleton-badge {
  width: 4.5rem;
  height: 1.5rem;
  border-radius: 6px;
  background-color: #f3f4f6;
}

.skeleton-badge-sm {
  width: 4rem;
  height: 1.5rem;
  border-radius: 9999px;
  background-color: #f3f4f6;
}

.skeleton-title {
  width: 80%;
  height: 1.25rem;
  border-radius: 6px;
  background-color: #f3f4f6;
  margin-bottom: 0.5rem;
}

.skeleton-text {
  width: 100%;
  height: 0.875rem;
  border-radius: 4px;
  background-color: #f3f4f6;
  margin-bottom: 0.375rem;
}

.skeleton-text-short {
  width: 65%;
  height: 0.875rem;
  border-radius: 4px;
  background-color: #f3f4f6;
  margin-bottom: 1rem;
}

.skeleton-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}

.skeleton-footer-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skeleton-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: #f3f4f6;
}

.skeleton-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.skeleton-meta-name {
  width: 5rem;
  height: 0.625rem;
  border-radius: 4px;
  background-color: #f3f4f6;
}

.skeleton-meta-loc {
  width: 3.5rem;
  height: 0.625rem;
  border-radius: 4px;
  background-color: #f3f4f6;
}

.skeleton-date {
  width: 3rem;
  height: 0.625rem;
  border-radius: 4px;
  background-color: #f3f4f6;
}

/* Shimmer animation */
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
    rgba(255, 255, 255, 0.5) 50%,
    transparent 100%
  );
  animation: shimmer 1.8s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
</style>
