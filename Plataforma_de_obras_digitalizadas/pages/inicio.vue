<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Header -->
    <header class="bg-black/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-medium text-white hover:text-amber-300 transition-colors">
              Biblioteca Digital
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <button class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
              Português
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop" 
          alt="Biblioteca Joanina" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black bg-opacity-70"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl">
          <h1 class="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Joanina Digital
          </h1>
          
          <p class="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-3xl">
            Uma nova plataforma com acesso aberto aos tesouros do fundo patrimonial da Biblioteca Joanina.
          </p>
          
          <div class="text-gray-300 mb-12 max-w-4xl">
            <p class="text-base leading-relaxed mb-4">
              Fruto do Projeto Joanina Digital, uma parceria entre a Universidade de Coimbra e a 
              Autoridade Literária de Sharjah, esta nova plataforma é uma porta aberta a um fundo 
              patrimonial único de Livro Antigo da Biblioteca Joanina, constituído por impressos dos séculos XVI, XVII e XVIII.
            </p>
            <button class="inline-flex items-center text-amber-400 hover:text-amber-300 font-medium transition-colors group">
              Saber mais
              <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          <!-- Statistics -->
          <div class="grid grid-cols-3 gap-8 mb-12">
            <div class="text-center">
              <div class="text-5xl md:text-6xl font-bold mb-2 text-white">
                <span v-if="pending" class="animate-pulse">...</span>
                <span v-else-if="error" class="text-red-400">--</span>
                <span v-else>{{ formatNumber(stats.totalItems) }}</span>
              </div>
              <div class="text-amber-400 font-medium text-lg">Livros</div>
            </div>
            
            <div class="text-center">
              <div class="text-5xl md:text-6xl font-bold mb-2 text-white">
                <span v-if="pending" class="animate-pulse">...</span>
                <span v-else-if="error" class="text-red-400">--</span>
                <span v-else>{{ formatNumber(stats.totalPages) }}</span>
              </div>
              <div class="text-amber-400 font-medium text-lg">Páginas</div>
            </div>
            
            <div class="text-center">
              <div class="text-5xl md:text-6xl font-bold mb-2 text-white">
                <span v-if="pending" class="animate-pulse">...</span>
                <span v-else-if="error" class="text-red-400">--</span>
                <span v-else>{{ stats.totalSize }}</span>
              </div>
              <div class="text-amber-400 font-medium text-lg">Ficheiros</div>
            </div>
          </div>

          <!-- CTA Button -->
          <div class="mb-16">
            <NuxtLink 
              to="/explorar"
              class="bg-amber-600 hover:bg-amber-500 text-white px-12 py-4 rounded-lg text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Explorar Itens
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Recent Items Section -->
    <section id="books-section" class="py-16 bg-black">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-amber-400 mb-4">Recentes</h2>
        </div>

        <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div v-for="i in 5" :key="i" class="animate-pulse">
            <div class="bg-gray-800 rounded-lg h-80 mb-4"></div>
            <div class="bg-gray-800 rounded h-4 mb-2"></div>
            <div class="bg-gray-800 rounded h-3 w-3/4"></div>
          </div>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-400 mb-4">
            <h3 class="text-xl font-semibold mb-2">Erro ao carregar itens</h3>
            <p class="text-gray-400">Não foi possível carregar os itens da biblioteca.</p>
            <p class="text-gray-500 text-sm mt-2">{{ error }}</p>
          </div>
          <button 
            @click="refresh()"
            class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Tentar novamente
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <NuxtLink
            v-for="item in displayedItems.slice(0, 5)" 
            :key="item.key"
            :to="`/livro/${item.key}`"
            class="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div class="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors duration-300">
              <div class="relative h-80 bg-gradient-to-br from-amber-100 to-orange-200 overflow-hidden">
                <img 
                  :src="getItemThumbnail(item)" 
                  :alt="item.metadata.title.values"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  @error="onImageError"
                />
                <div v-if="!getItemThumbnail(item)" class="w-full h-full flex items-center justify-center bg-amber-100">
                  <div class="text-center text-amber-800 p-4">
                    <svg class="w-16 h-16 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                    </svg>
                    <p class="text-xs font-medium">{{ item.metadata.title.values.substring(0, 30) }}...</p>
                  </div>
                </div>
              </div>
              
              <div class="p-4">
                <h3 class="font-semibold text-white mb-2 line-clamp-3 text-sm leading-tight group-hover:text-amber-300 transition-colors">
                  {{ item.metadata.title.values }}
                </h3>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="text-center mt-8">
          <NuxtLink 
            to="/explorar"
            class="inline-flex items-center px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition-colors"
          >
            Ver todos os itens
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>
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
  items: JoaninaItem[]
  total: number
  page: number
  limit: number
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
    if (response && Array.isArray(response.items)) {
      return response.items
    } else if (Array.isArray(response)) {
      // Se a resposta for diretamente um array
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
  'joanina-items-inicio',
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
  // Usar verificação adicional para garantir que items é um array
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
  title: 'Joanina Digital - Biblioteca Digital',
  meta: [
    { name: 'description', content: 'Acesso aberto aos tesouros do fundo patrimonial da Biblioteca Joanina.' }
  ]
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>