<template>
  <div class="min-h-screen bg-neutral-50 pb-20">
    <div class="bg-primary pt-12 pb-24 px-4">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <h1 class="text-3xl font-extrabold text-white tracking-tight">Akun Saya</h1>
        <button @click="authStore.logout()" class="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-full font-bold transition-colors text-sm backdrop-blur-md">
          Keluar
        </button>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 -mt-16">
      
      <!-- Profile Summary Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-[var(--shadow-card)] border border-neutral-200/50 mb-8 relative">
        <div class="flex flex-col sm:flex-row gap-6 relative">
          
          <div class="w-24 h-24 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 mx-auto sm:mx-0 -mt-16 sm:mt-0 shadow-lg bg-white p-1">
            <div class="w-full h-full rounded-full overflow-hidden bg-neutral-200">
              <NuxtImg v-if="profile?.avatarUrl" :src="profile.avatarUrl" :alt="profile.name" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-neutral-400 bg-neutral-100">
                <Icon name="lucide:user" size="40" />
              </div>
            </div>
          </div>

          <div class="flex-1 text-center sm:text-left">
            <h2 class="text-2xl font-bold text-neutral-900 leading-tight mb-1">{{ profile?.name || 'Misterius' }}</h2>
            <p class="text-neutral-500 font-medium mb-4">{{ profile?.email }}</p>
            
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-semibold text-neutral-600">
              <span class="flex items-center gap-1.5"><Icon name="lucide:map-pin" /> {{ profile?.city || 'Belum diisi' }}</span>
              <span class="flex items-center gap-1.5"><Icon name="lucide:phone" /> {{ profile?.phone || 'Belum diisi' }}</span>
              <span class="flex items-center gap-1.5"><Icon name="lucide:flip-horizontal" /> Kebutuhan: {{ profile?.primarySide === 'LEFT' ? 'Kiri' : profile?.primarySide === 'RIGHT' ? 'Kanan' : 'Belum diisi' }}</span>
            </div>
          </div>
          
          <div class="text-center sm:text-right mt-4 sm:mt-0">
            <NuxtLink to="/profile/edit" class="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-5 py-2.5 rounded-xl font-bold transition-colors">
              <Icon name="lucide:pencil" size="16" /> Edit Profil
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="flex items-center gap-2 mb-6 border-b border-neutral-200">
        <button 
          @click="activeTab = 'posts'" 
          :class="[
            'px-6 py-3 font-bold text-sm border-b-2 transition-colors',
            activeTab === 'posts' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700'
          ]"
        >
          Postingan Saya
        </button>
        <button 
          @click="activeTab = 'sizes'" 
          :class="[
            'px-6 py-3 font-bold text-sm border-b-2 transition-colors',
            activeTab === 'sizes' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700'
          ]"
        >
          Profil Ukuran
        </button>
      </div>

      <!-- Tab Content: Posts -->
      <div v-show="activeTab === 'posts'">
        <div class="flex items-center gap-2 mb-6">
          <button 
            @click="postStatusFilter = 'active'"
            :class="['px-4 py-2 rounded-full text-sm font-semibold transition-colors', postStatusFilter === 'active' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200']"
          >
            <Icon name="lucide:loader" size="14" class="mr-1" /> Aktif
          </button>
          <button 
            @click="postStatusFilter = 'completed'"
            :class="['px-4 py-2 rounded-full text-sm font-semibold transition-colors', postStatusFilter === 'completed' ? 'bg-neutral-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200']"
          >
            <Icon name="lucide:check-circle" size="14" class="mr-1" /> Selesai
          </button>
        </div>

        <div v-if="postStore.isLoading" class="py-12 flex justify-center">
          <Icon name="lucide:loader-2" class="animate-spin text-4xl text-primary" />
        </div>
        
        <div v-else-if="myPosts.length === 0">
           <UiEmptyState
            icon="lucide:layers"
            title="Belum Ada Postingan"
            description="Anda belum memiliki postingan dengan status ini."
            cta-text="Mulai Buat Post"
            cta-link="/posts/create"
            cta-icon="lucide:plus"
          />
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="post in myPosts" :key="post.id" class="relative group">
            <PostCard :post="post" />
            
            <!-- Actions Overlay for Active Posts -->
            <div v-if="post.status === 'ACTIVE'" class="absolute -top-3 -right-3 flex gap-1 opaque-0 group-hover:opacity-100 transition-opacity">
               <button @click="handleComplete(post.id)" title="Tandai Selesai" class="w-8 h-8 flex items-center justify-center rounded-full bg-success text-white shadow-md hover:bg-success/90 transition-colors">
                  <Icon name="lucide:check" size="14" />
               </button>
               <NuxtLink :to="`/posts/${post.id}/edit`" title="Edit Post" class="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-primary-dark transition-colors">
                  <Icon name="lucide:pencil" size="14" />
               </NuxtLink>
               <button @click="handleDelete(post.id)" title="Hapus Post" class="w-8 h-8 flex items-center justify-center rounded-full bg-error text-white shadow-md hover:bg-error/90 transition-colors">
                  <Icon name="lucide:trash-2" size="14" />
               </button>
            </div>
            <div v-else class="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-semibold">
              SELESAI
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Size Profiles -->
      <div v-show="activeTab === 'sizes'">
        <div class="bg-white border border-neutral-200/50 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-neutral-900">Profil Ukuran Saya</h3>
              <p class="text-sm text-neutral-500">Berfungsi auto-fill saat Anda membuat post baru.</p>
            </div>
            <!-- Normally a modal or toggle to add size. Since setup page handles it, we can link there. -->
            <NuxtLink to="/profile/setup?step=2" class="flex p-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-full transition-colors">
              <Icon name="lucide:plus" size="20" />
            </NuxtLink>
          </div>

          <div v-if="sizeProfiles.length === 0" class="text-center py-12 border-2 border-dashed border-neutral-200 rounded-2xl">
            <p class="text-neutral-500">Belum ada profil ukuran yang disimpan.</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="sp in sizeProfiles" :key="sp.id" class="border border-neutral-200 rounded-2xl p-4 flex items-center justify-between group hover:border-primary/50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center text-primary">
                  <Icon :name="sp.category?.icon || 'lucide:ruler'" size="24" />
                </div>
                <div>
                  <p class="font-bold text-neutral-900">{{ sp.category?.name }}</p>
                  <p class="text-sm text-neutral-500 font-semibold gap-2 flex items-center">
                    Size: <span class="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">{{ sp.size }}</span>
                  </p>
                </div>
              </div>
              <button @click="handleDeleteSize(sp.id)" class="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-error/20">
                <Icon name="lucide:trash-2" size="14" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUserStore } from '~/stores/user'
import { usePostStore } from '~/stores/post'

definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Profil Saya — SisiKita' })

const authStore = useAuthStore()
const userStore = useUserStore()
const postStore = usePostStore()

const activeTab = ref('posts')
const postStatusFilter = ref('active') // 'active' | 'completed'

const profile = computed(() => userStore.profile)
const sizeProfiles = computed(() => userStore.sizeProfiles)
const myPosts = computed(() => postStore.myPosts)
const { showSuccess } = useToast()

watch(postStatusFilter, () => {
  postStore.fetchMyPosts(postStatusFilter.value)
})

onMounted(async () => {
  await Promise.all([
    userStore.fetchProfile(),
    postStore.fetchMyPosts(postStatusFilter.value)
  ])
})

async function handleDeleteSize(id: string) {
  if (window.confirm('Yakin ingin menghapus size profile ini?')) {
    await userStore.deleteSizeProfile(id)
  }
}

async function handleComplete(id: string) {
  if (window.confirm('Yakin ingin menandai post ini sebagai selesai? Post akan disembunyikan dari hasil pencarian.')) {
    await postStore.completePost(id)
    showSuccess('Post ditandai selesai')
  }
}

async function handleDelete(id: string) {
  if (window.confirm('Yakin ingin menghapus post ini secara permanen?')) {
    await postStore.deletePost(id)
    showSuccess('Post berhasil dihapus')
  }
}
</script>
