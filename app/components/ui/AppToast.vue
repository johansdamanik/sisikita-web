<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast-item', `toast-${toast.type}`]"
          @click="removeToast(toast.id)"
        >
          <div class="toast-icon">
            <Icon v-if="toast.type === 'success'" name="lucide:check-circle" size="20" />
            <Icon v-else-if="toast.type === 'error'" name="lucide:alert-circle" size="20" />
            <Icon v-else name="lucide:info" size="20" />
          </div>
          <p class="toast-message">{{ toast.message }}</p>
          <button class="toast-close" @click.stop="removeToast(toast.id)">
            <Icon name="lucide:x" size="16" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
  width: calc(100vw - 2rem);
  pointer-events: none;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 14px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  pointer-events: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toast-success {
  background: rgba(39, 174, 96, 0.95);
  color: white;
}

.toast-error {
  background: rgba(235, 87, 87, 0.95);
  color: white;
}

.toast-info {
  background: rgba(42, 157, 143, 0.95);
  color: white;
}

.toast-icon {
  flex-shrink: 0;
  opacity: 0.9;
}

.toast-message {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  opacity: 0.6;
  transition: opacity 0.15s;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 2px;
}

.toast-close:hover {
  opacity: 1;
}

/* Transition animations */
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.21, 1.02, 0.73, 1);
}

.toast-leave-active {
  transition: all 0.25s cubic-bezier(0.06, 0.71, 0.55, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
