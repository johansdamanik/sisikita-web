/**
 * Toast notification composable for SisiKita.
 * Provides a global queue of toast messages with auto-dismiss.
 */

interface Toast {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
  duration: number
}

const toasts = ref<Toast[]>([])
let nextId = 0

export const useToast = () => {
  function addToast(type: Toast['type'], message: string, duration = 3000) {
    const id = nextId++
    toasts.value.push({ id, type, message, duration })

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  function removeToast(id: number) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function showSuccess(message: string) {
    addToast('success', message)
  }

  function showError(message: string) {
    addToast('error', message, 4000)
  }

  function showInfo(message: string) {
    addToast('info', message)
  }

  return {
    toasts: readonly(toasts),
    showSuccess,
    showError,
    showInfo,
    removeToast,
  }
}
