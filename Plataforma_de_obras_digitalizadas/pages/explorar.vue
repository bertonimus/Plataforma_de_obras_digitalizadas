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

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-80 bg-gray-900 min-h-screen border-r border-gray-800">
        <!-- Header da Biblioteca -->
        <div class="p-6 border-b border-gray-800">
          <h1 class="text-2xl font-bold text-amber-400 mb-4">Joanina Digital</h1>
          <div class="flex space-x-6 text-sm">
            <NuxtLink to="/inicio" class="text-amber-400 border-b border-amber-400 pb-1 font-medium">INÍCIO</NuxtLink>
            <span class="text-white font-medium">ITENS</span>
          </div>
        </div>

        <!-- Explorar Section -->
        <div class="p-6 border-b border-gray-800">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-amber-400 font-semibold text-lg">Explorar</h3>
            <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </div>
          
          <!-- Pesquisar -->
          <div class="mb-6">
            <h4 class="text-white font-medium mb-3">Pesquisar</h4>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-300">O QUE PROCURA?</span>
                <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              
              <div class="space-y-2 text-xs text-gray-400">
                <div class="flex items-center">
                  <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <span>Mostrar os obras com Local de Publicação (atualização de grafia) "Lisboa"</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <span>Mostrar os obras com Código de língua Latim</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <span>Mostrar os obras com Impressor e Livreiro "Desaint, Nicolas"</span>
                </div>
              </div>
              
              <div class="mt-4">
                <span class="text-amber-400 text-sm font-medium">Filtros avançados</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtros -->
        <div class="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-400px)]">
          <!-- Tipo de Item -->
          <div>
            <h3 class="text-white font-semibold mb-3 text-sm">Tipo de Item</h3>
            <div class="space-y-2">
              <label class="flex items-center justify-between cursor-pointer group">
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    v-model="filters.itemType" 
                    value="Livro"
                    class="mr-3 rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-500"
                  >
                  <span class="text-gray-300 text-sm group-hover:text-white transition-colors">Livro</span>
                </div>
                <span class="text-white font-medium text-sm">{{ totalItems }}</span>
              </label>
            </div>
          </div>

          <!-- Autor -->
          <div>
            <h3 class="text-white font-semibold mb-3 text-sm">Autor</h3>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <label 
                v-for="author in topAuthors" 
                :key="author.name"
                class="flex items-center justify-between cursor-pointer group"
              >
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    v-model="filters.authors" 
                    :value="author.name"
                    class="mr-3 rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-500"
                  >
                  <span class="text-gray-300 text-xs group-hover:text-white transition-colors">{{ author.name }}</span>
                </div>
                <span class="text-white font-medium text-xs">{{ author.count }}</span>
              </label>
            </div>
          </div>

          <!-- Impressor e Livreiro -->
          <div>
            <h3 class="text-white font-semibold mb-3 text-sm">Impressor e Livreiro</h3>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div class="flex items-center justify-between p-2 bg-amber-600 rounded text-xs">
                <span class="text-white font-medium">Desaint, Nicolas</span>
                <span class="text-white font-bold">{{ filteredItemsCount }}</span>
              </div>
              <label 
                v-for="printer in topPrinters" 
                :key="printer.name"
                class="flex items-center justify-between cursor-pointer group"
              >
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    v-model="filters.printers" 
                    :value="printer.name"
                    class="mr-3 rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-500"
                  >
                  <span class="text-gray-300 text-xs group-hover:text-white transition-colors">{{ printer.name }}</span>
                </div>
                <span class="text-white font-medium text-xs">{{ printer.count }}</span>
              </label>
            </div>
          </div>

          <!-- Encadernador -->
          <div>
            <h3 class="text-white font-semibold mb-3 text-sm">Encadernador</h3>
            <div class="space-y-2">
              <label 
                v-for="binder in allBinders" 
                :key="binder.name"
                class="flex items-center justify-between cursor-pointer group"
              >
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    v-model="filters.binders" 
                    :value="binder.name"
                    class="mr-3 rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-500"
                  >
                  <span class="text-gray-300 text-xs group-hover:text-white transition-colors">{{ binder.name }}</span>
                </div>
                <span class="text-white font-medium text-xs">{{ binder.count }}</span>
              </label>
            </div>
          </div>

          <!-- Antigo possuidor -->
          <div>
            <h3 class="text-white font-semibold mb-3 text-sm">Antigo possuidor</h3>
            <div class="space-y-2">
              <label 
                v-for="owner in topOwners" 
                :key="owner.name"
                class="flex items-center justify-between cursor-pointer group"
              >
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    v-model="filters.owners" 
                    :value="owner.name"
                    class="mr-3 rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-500"
                  >
                  <span class="text-gray-300 text-xs group-hover:text-white transition-colors">{{ owner.name }}</span>
                </div>
                <span class="text-white font-medium text-xs">{{ owner.count }}</span>
              </label>
            </div>
          </div>

          <!-- Data de publicação -->
          <div>
            <h3 class="text-white font-semibold mb-3 text-sm">Data de publicação</h3>
            <div class="space-y-4">
              <div class="relative">
                <input 
                  type="range" 
                  min="1520" 
                  max="1803" 
                  v-model="dateRange.start"
                  class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                >
                <input 
                  type="range" 
                  min="1520" 
                  max="1803" 
                  v-model="dateRange.end"
                  class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider absolute top-0"
                >
              </div>
              <div class="flex justify-between text-xs text-gray-400">
                <span>{{ dateRange.start }}</span>
                <span>{{ dateRange.end }}</span>
              </div>
            </div>
          </div>

          <!-- Local de Publicação -->
          <div>
            <h3 class="text-white font-semibold mb-3 text-sm">Local de Publicação (atualização de grafia)</h3>
            <div class="space-y-2">
              <label 
                v-for="place in topPlaces" 
                :key="place.name"
                class="flex items-center justify-between cursor-pointer group"
              >
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    v-model="filters.places" 
                    :value="place.name"
                    class="mr-3 rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-500"
                  >
                  <span class="text-gray-300 text-xs group-hover:text-white transition-colors">{{ place.name }}</span>
                </div>
                <span class="text-white font-medium text-xs">{{ place.count }}</span>
              </label>
            </div>
          </div>

          <!-- Assunto -->
          <div>
            <h3 class="text-white font-semibold mb-3 text-sm">Assunto</h3>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <label 
                v-for="subject in topSubjects" 
                :key="subject.name"
                class="flex items-center justify-between cursor-pointer group"
              >
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    v-model="filters.subjects" 
                    :value="subject.name"
                    class="mr-3 rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-500"
                  >
                  <span class="text-gray-300 text-xs group-hover:text-white transition-colors">{{ subject.name }}</span>
                </div>
                <span class="text-white font-medium text-xs">{{ subject.count }}</span>
              </label>
            </div>
          </div>
        </div>
      </aside>

      <!-- Conteúdo Principal -->
      <main class="flex-1 p-6">
        <!-- Header com contagem -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <h2 class="text-4xl font-bold text-white">{{ filteredItemsCount }}</h2>
            <span class="text-gray-400 text-lg">Itens</span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="flex justify-center items-center min-h-[400px]">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-400 mb-4">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="text-xl font-semibold mb-2">Erro ao carregar itens</h3>
            <p class="text-gray-400">Não foi possível carregar os itens da biblioteca.</p>
          </div>
          <button 
            @click="refresh()"
            class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Tentar novamente
          </button>
        </div>

        <!-- Grid de Livros -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
          <NuxtLink
            v-for="item in paginatedItems" 
            :key="item.key"
            :to="`/livro/${item.key}`"
            class="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div class="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors duration-300">
              <div class="relative h-64 bg-gradient-to-br from-amber-100 to-orange-200 overflow-hidden">
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
                <h3 class="font-semibold text-white mb-2 line-clamp-3 text-xs leading-tight group-hover:text-amber-300 transition-colors">
                  {{ item.metadata.title.values }}
                </h3>
                <p v-if="item.metadata.title_personal?.values" class="text-gray-400 text-xs mb-1">
                  {{ item.metadata.title_personal.values }}
                </p>
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span v-if="item.metadata.publication_date?.values" class="text-amber-400">
                    Livro
                  </span>
                  <span v-if="item.stats.pages" class="text-amber-400 font-medium">{{ item.stats.pages }}</span>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  <span v-if="item.metadata.publication_date?.values">
                    {{ getPublicationYear(item.metadata.publication_date.values) }}
                  </span>
                  <span v-if="item.stats.pages" class="ml-2">Páginas</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Paginação -->
        <div v-if="totalPages > 1" class="flex justify-center mt-12">
          <nav class="flex items-center space-x-2">
            <button 
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              Anterior
            </button>
            
            <span class="px-4 py-2 text-gray-300">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            
            <button 
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              Próxima
            </button>
          </nav>
        </div>
      </main>
    </div>
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

interface FilterCount {
  name: string
  count: number
}

// Estado reativo
const currentPage = ref(1)
const itemsPerPage = 24

const filters = ref({
  itemType: [] as string[],
  authors: [] as string[],
  printers: [] as string[],
  binders: [] as string[],
  owners: [] as string[],
  places: [] as string[],
  subjects: [] as string[]
})

const dateRange = ref({
  start: 1520,
  end: 1803
})

// API functions
const fetchItems = async (): Promise<JoaninaItem[]> => {
  try {
    const response = await $fetch<JoaninaItem[]>('https://nexus.fw.dev.ucframework.pt/v1/digitalis/collections/joanina/items', { 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    return response
  } catch (error) {
    console.error('Erro ao carregar itens da Biblioteca Joanina:', error)
    throw error
  }
}

// Data fetching
const { data, pending, error, refresh } = await useLazyAsyncData(
  'joanina-items-explorar',
  () => fetchItems(),
  {
    watch: [currentPage]
  }
)

// Computed properties
const allItems = computed(() => data.value || [])

const filteredItems = computed(() => {
  let items = allItems.value

  // Filtrar por tipo de item
  if (filters.value.itemType.length > 0) {
    items = items.filter(item => filters.value.itemType.includes(item.type))
  }

  // Filtrar por autores
  if (filters.value.authors.length > 0) {
    items = items.filter(item => 
      item.metadata.title_personal?.values && 
      filters.value.authors.some(author => 
        item.metadata.title_personal!.values.includes(author)
      )
    )
  }

  // Filtrar por data
  items = items.filter(item => {
    if (!item.metadata.publication_date?.values) return true
    const year = parseInt(item.metadata.publication_date.values[0])
    return year >= dateRange.value.start && year <= dateRange.value.end
  })

  return items
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredItems.value.slice(start, end)
})

const filteredItemsCount = computed(() => filteredItems.value.length)
const totalItems = computed(() => allItems.value.length)
const totalPages = computed(() => Math.ceil(filteredItemsCount.value / itemsPerPage))

const topAuthors = computed(() => {
  const authorCounts: { [key: string]: number } = {}
  
  allItems.value.forEach(item => {
    if (item.metadata.title_personal?.values) {
      const author = item.metadata.title_personal.values
      authorCounts[author] = (authorCounts[author] || 0) + 1
    }
  })

  return Object.entries(authorCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
})

const topPrinters = computed(() => {
  return [
    { name: 'Clousier, Michel', count: 10 },
    { name: 'Delaulne, Florentin', count: 10 },
    { name: 'Foucault, Hilaire', count: 10 },
    { name: 'Ganeau, Étienne', count: 10 }
  ]
})

const allBinders = computed(() => {
  return [
    { name: 'Correia, António Maria', count: 2 },
    { name: 'Viana, Alberto', count: 2 },
    { name: 'David, A', count: 1 },
    { name: 'Giannini, Giulio', count: 1 }
  ]
})

const topOwners = computed(() => {
  return [
    { name: 'Liceu Nacional Dom João III', count: 21 },
    { name: 'Ordem dos Eremitas Descalços de Santo Agostinho', count: 21 }
  ]
})

const topPlaces = computed(() => {
  return [
    { name: 'Paris', count: 21 }
  ]
})

const topSubjects = computed(() => {
  return [
    { name: 'América', count: 21 },
    { name: 'Arábia', count: 21 },
    { name: 'China', count: 21 },
    { name: 'Grécia', count: 21 }
  ]
})

// Methods
const getItemThumbnail = (item: JoaninaItem): string | undefined => {
  if (item.cover) {
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

const getPublicationYear = (dates: string[]): string => {
  if (dates.length > 1) {
    return `${dates[0]}-${dates[1]}`
  }
  return dates[0] || ''
}

// Watch for filter changes
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

watch(dateRange, () => {
  currentPage.value = 1
}, { deep: true })

// SEO
useHead({
  title: 'Explorar - Biblioteca Digital Joanina',
  meta: [
    { name: 'description', content: 'Explore a coleção completa da Biblioteca Joanina Digital com filtros avançados.' }
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

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #374151;
}

::-webkit-scrollbar-thumb {
  background: #6B7280;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF;
}

/* Range slider styling */
.slider {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.slider::-webkit-slider-track {
  background: #374151;
  height: 8px;
  border-radius: 4px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #F59E0B;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-track {
  background: #374151;
  height: 8px;
  border-radius: 4px;
  border: none;
}

.slider::-moz-range-thumb {
  background: #F59E0B;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>