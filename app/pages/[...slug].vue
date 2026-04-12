<template>
  <div></div>
</template>

<script setup lang="ts">
// Catch-all route to prevent Vue Router console warnings for missing routes,
// and gracefully trigger Nuxt's global error page.
throw createError({
  statusCode: 404,
  statusMessage: 'Page Not Found',
  message: 'Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.',
  fatal: true
})
</script>
