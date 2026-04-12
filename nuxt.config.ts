// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2026-04-08',

  future: {
    compatibilityVersion: 4,
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'SisiKita — Temukan Partner untuk Barang Satu Sisi',
      meta: [
        { name: 'description', content: 'Platform komunitas untuk mencocokkan kebutuhan barang satu sisi (kiri/kanan) seperti sepatu, sarung tangan, dan lainnya.' },
        { name: 'theme-color', content: '#FF6B6B' },
        { property: 'og:title', content: 'SisiKita — Temukan Partner untuk Barang Satu Sisi' },
        { property: 'og:description', content: 'Platform match kebutuhan barang satu sisi. Temukan partner yang cocok!' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  },

  modules: [
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],

  pinia: {
    storesDirs: ['./app/stores/**'],
  },

  image: {
    domains: ['images.unsplash.com', 'loremflickr.com', 'picsum.photos', 'plus.unsplash.com'],
  },

  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
    ],
  },

  sitemap: {
    exclude: ['/profile/**', '/matches', '/login', '/register'],
  },

  robots: {
    disallow: ['/profile', '/matches'],
  },
})