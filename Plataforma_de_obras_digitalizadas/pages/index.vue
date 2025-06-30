<template>
  <div class="min-h-screen bg-[#1C1C1C] text-white">
    <!-- Header -->
    <header class="p-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Biblioteca Digital</h1>
      <div class="relative">
        <button class="flex items-center space-x-2 text-gray-300 hover:text-white">
          <span>Português</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-12">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left Side - Text Content -->
        <div class="space-y-6">
          <h2 class="text-4xl font-bold text-[#E6B449]">Em Destaque</h2>
          <div class="mt-8">
            <h3 class="text-5xl font-bold text-[#E6B449] mb-6">Joanina Digital</h3>
            <p class="text-xl text-gray-300">
              Uma nova plataforma com acesso aberto aos tesouros do fundo patrimonial da Biblioteca Joanina.
            </p>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 mt-12">
            <div>
              <div class="text-3xl font-bold">
                <span v-if="pending" class="animate-pulse">...</span>
                <span v-else-if="error" class="text-red-400">--</span>
                <span v-else>{{ formatNumber(stats.totalItems) }}</span>
              </div>
              <div class="text-gray-400">Itens</div>
            </div>
            <div>
              <div class="text-3xl font-bold">
                <span v-if="pending" class="animate-pulse">...</span>
                <span v-else-if="error" class="text-red-400">--</span>
                <span v-else>{{ formatNumber(stats.totalPages) }}</span>
              </div>
              <div class="text-gray-400">Páginas</div>
            </div>
            <div>
              <div class="text-3xl font-bold">
                <span v-if="pending" class="animate-pulse">...</span>
                <span v-else-if="error" class="text-red-400">--</span>
                <span v-else>{{ stats.totalSize }}</span>
              </div>
              <div class="text-gray-400">Ficheiros</div>
            </div>
          </div>

          <NuxtLink 
            to="/inicio"
            class="inline-block mt-8 bg-[#E6B449] text-black px-8 py-3 rounded-md font-semibold hover:bg-[#d4a543] transition-colors"
          >
            Abrir Coleção
          </NuxtLink>
        </div>

        <!-- Right Side - Image -->
        <div class="rounded-2xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="Biblioteca Joanina" 
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Recent Items Preview -->
      <div v-if="!pending && !error && displayedItems.length > 0" class="mt-16">
        <h3 class="text-2xl font-bold text-[#E6B449] mb-8">Itens Recentes</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div
            v-for="item in displayedItems.slice(0, 5)" 
            :key="item.key"
            class="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div class="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-300">
              <div class="relative h-48 bg-gradient-to-br from-amber-100 to-orange-200 overflow-hidden">
                <img 
                  :src="getItemThumbnail(item)" 
                  :alt="item.metadata.title.values"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  @error="onImageError"
                />
                <div v-if="!getItemThumbnail(item)" class="w-full h-full flex items-center justify-center bg-amber-100">
                  <div class="text-center text-amber-800 p-4">
                    <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                    </svg>
                    <p class="text-xs font-medium">{{ item.metadata.title.values.substring(0, 20) }}...</p>
                  </div>
                </div>
              </div>
              
              <div class="p-3">
                <h4 class="font-semibold text-white text-sm line-clamp-2 group-hover:text-[#E6B449] transition-colors">
                  {{ item.metadata.title.values }}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="mt-16 text-center">
        <div class="text-red-400 mb-4">
          <h3 class="text-xl font-semibold mb-2">Erro ao carregar dados</h3>
          <p class="text-gray-400">{{ error }}</p>
        </div>
        <button 
          @click="refresh()"
          class="bg-[#E6B449] text-black px-6 py-2 rounded-md font-semibold hover:bg-[#d4a543] transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-800 mt-12 py-6">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <div class="mb-4 md:mb-0">
            UC DIGITALIS v by UC Framework © Universidade de Coimbra
          </div>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-white">Contacto</a>
            <a href="#" class="hover:text-white">Canal de Denúncia</a>
            <a href="#" class="hover:text-white">Elogios, Sugestões e Reclamações</a>
            <a href="#" class="hover:text-white">Proteção de Dados</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Interfaces
interface JoaninaItem {
  key: string
  type: string
  cover: {
    key: string 
    type: string
    filename: string
    title: string
    url: string
    token: string
    url_format: string
    thumb_filename: string
    webp_filename: string
    thumb_url: string
    thumb_url_format: string
  }
  stats: {
    pages: number
  }
  metadata: {
    title: {
      values: string
    }
    title_personal?: {
      values: string
    }
    publication_date?: {
      values: string[]
    }
    language_code?: {
      values: string[]
    }
    hierarchical_place_name?: {
      values: string
    }
    volume?: {
      values: string
    }
  }
}

interface JoaninaResponse {
  items: {
    items: JoaninaItem[]
    total: number
    current_page: number
    per_page: number
  }
}

// API functions
const fetchItems = async (): Promise<JoaninaItem[]> => {
  try {
    const response = await $fetch<JoaninaResponse>('https://nexus.fw.dev.ucframework.pt/v1/digitalis/collections/joanina/items', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: {
        items: {
          filters: [],
          pagination: {
            current_page: 1,
            active_limit: 500
          }
        },
        filters: {
          pagination: {
            current_page: 1,
            active_limit: 5,
            sort: "count",
            direction: "desc"
          },
          filter: null,
          section: "basic"
        }
      }
    })
    
    console.log('API Response:', response)
    
    // Verificar se a resposta tem a estrutura esperada
    if (response?.items?.items && Array.isArray(response.items.items)) {
      return response.items.items
    } else if (response?.items && Array.isArray(response.items)) {
      return response.items
    } else if (Array.isArray(response)) {
      return response
    } else {
      console.error('Resposta da API não tem a estrutura esperada:', response)
      return []
    }
  } catch (error) {
    console.error('Erro ao carregar itens da Biblioteca Joanina:', error)
    throw error
  }
}

// Data fetching
const { data, pending, error, refresh } = await useLazyAsyncData(
  'joanina-items-index',
  () => fetchItems()
)

// Computed properties
const displayedItems = computed(() => {
  if (!data.value) return []
  return Array.isArray(data.value) ? data.value : []
})

const stats = computed(() => {
  // Verificar se temos dados válidos
  if (!data.value || !Array.isArray(data.value) || data.value.length === 0) {
    return {
      totalItems: 0,
      totalPages: 0,
      totalSize: '0 MB'
    }
  }

  const items = data.value
  const totalItems = items.length
  
  // Calcular total de páginas somando as páginas de todos os livros
  const totalPages = items.reduce((sum: number, item: JoaninaItem) => {
    const pages = item?.stats?.pages || 0
    return sum + pages
  }, 0)
  
  // Calcular tamanho estimado baseado no número de páginas
  // Estimativa: cada página digitalizada = ~2MB (alta qualidade)
  const estimatedSizeMB = totalPages * 2
  const estimatedSizeGB = estimatedSizeMB / 1024
  const estimatedSizeTB = estimatedSizeGB / 1024
  
  let sizeDisplay: string
  if (estimatedSizeTB >= 1) {
    sizeDisplay = `${estimatedSizeTB.toFixed(2)} TB`
  } else if (estimatedSizeGB >= 1) {
    sizeDisplay = `${estimatedSizeGB.toFixed(2)} GB`
  } else {
    sizeDisplay = `${estimatedSizeMB.toFixed(0)} MB`
  }

  return {
    totalItems,
    totalPages,
    totalSize: sizeDisplay
  }
})

// Methods
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('pt-PT').format(num)
}

const getItemThumbnail = (item: JoaninaItem): string | undefined => {
  if (item?.cover && item.cover.url && item.cover.key && item.cover.filename) {
    return item.cover.url.replace("{KEY}", item.cover.key).replace("{FILENAME}", item.cover.filename)
  }
  return undefined
}

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  const parent = img.parentElement
  if (parent) {
    img.style.display = 'none'
  }
}

// SEO
useHead({
  title: 'Biblioteca Digital Joanina - Página Inicial',
  meta: [
    { name: 'description', content: 'Acesso aberto aos tesouros do fundo patrimonial da Biblioteca Joanina. Explore nossa coleção digital de livros antigos.' }
  ]
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>