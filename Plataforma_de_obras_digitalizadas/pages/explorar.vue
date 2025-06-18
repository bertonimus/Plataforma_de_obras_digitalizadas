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
      <!-- Sidebar com Filtros -->
      <aside class="w-80 bg-gray-900 min-h-screen p-6 border-r border-gray-800">
        <!-- Header da Biblioteca -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-amber-400 mb-2">Joanina Digital</h1>
          <div class="flex space-x-4 text-sm">
            <NuxtLink to="/inicio" class="text-amber-400 border-b border-amber-400 pb-1">INÍCIO</NuxtLink>
            <span class="text-white">ITENS</span>
          </div>
        </div>

        <!-- Seção Explorar -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-amber-400 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Explorar
          </h2>
          
          <!-- Pesquisar -->
          <div class="mb-6">
            <h3 class="text-white font-medium mb-3">Pesquisar</h3>
            <div class="space-y-2 text-sm text-gray-300">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <span class="text-amber-400">O QUE PROCURA?</span>
              </div>
              <div class="ml-6 space-y-1">
                <div class="flex items-center cursor-pointer hover:text-white">
                  <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <span>Mostre-se obras com Escal de publicação</span>
                </div>
                <div class="flex items-center cursor-pointer hover:text-white">
                  <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <span>Mostre-se obras com Código de língua Latim</span>
                </div>
                <div class="flex items-center cursor-pointer hover:text-white">
                  <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <span>Mostre-se obras com Impressor e Livreiro</span>
                </div>
              </div>
            </div>
            
            <button 
              @click="showAdvancedFilters = true"
              class="mt-4 text-amber-400 hover:text-amber-300 text-sm flex items-center"
            >
              Filtros avançados
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Filtros por Tipo -->
        <div class="mb-6">
          <h3 class="text-white font-medium mb-3">Tipo de Item</h3>
          <div class="space-y-2">
            <label class="flex items-center justify-between cursor-pointer hover:bg-gray-800 p-2 rounded">
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="filters.itemType" 
                  value="Livro"
                  class="mr-3 rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-500"
                >
                <span class="text-gray-300">Livro</span>
              </div>
              <span class="text-gray-500 text-sm">{{ totalItems }}</span>
            </label>
          </div>
        </div>

        <!-- Filtros por Autor -->
        <div class="mb-6">
          <h3 class="text-white font-medium mb-3">Autor</h3>
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <label 
              v-for="author in topAuthors" 
              :key="author.name"
              class="flex items-center justify-between cursor-pointer hover:bg-gray-800 p-2 rounded"
            >
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="filters.authors" 
                  :value="author.name"
                  class="mr-3 rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-500"
                >
                <span class="text-gray-300 text-sm">{{ author.name }}</span>
              </div>
              <span class="text-gray-500 text-sm">{{ author.count }}</span>
            </label>
          </div>
        </div>

        <!-- Filtros por Impressor -->
        <div class="mb-6">
          <h3 class="text-white font-medium mb-3">Impressor e Livreiro</h3>
          <div class="space-y-2 max-h-32 overflow-y-auto">
            <label 
              v-for="printer in topPrinters" 
              :key="printer.name"
              class="flex items-center justify-between cursor-pointer hover:bg-gray-800 p-2 rounded"
            >
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="filters.printers" 
                  :value="printer.name"
                  class="mr-3 rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-500"
                >
                <span class="text-gray-300 text-sm">{{ printer.name }}</span>
              </div>
              <span class="text-gray-500 text-sm">{{ printer.count }}</span>
            </label>
          </div>
        </div>
      </aside>

      <!-- Conteúdo Principal -->
      <main class="flex-1 p-6">
        <!-- Header com contagem e ordenação -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <h2 class="text-2xl font-bold text-white">{{ filteredItemsCount }}</h2>
            <span class="text-gray-400">Itens</span>
          </div>
          <div class="flex items-center space-x-4">
            <select 
              v-model="sortBy" 
              class="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm"
            >
              <option value="title">Título</option>
              <option value="date">Data</option>
              <option value="author">Autor</option>
            </select>
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
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
          <NuxtLink
            v-for="item in paginatedItems" 
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
                <p v-if="item.metadata.title_personal?.values" class="text-gray-400 text-xs mb-1">
                  {{ item.metadata.title_personal.values }}
                </p>
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span v-if="item.metadata.publication_date?.values">
                    {{ getPublicationYear(item.metadata.publication_date.values) }}
                  </span>
                  <span v-if="item.stats.pages">{{ item.stats.pages }} páginas</span>
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

    <!-- Modal de Filtros Avançados -->
    <div v-if="showAdvancedFilters" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-900 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-white">Filtros</h3>
          <button @click="showAdvancedFilters = false" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Filtros Ativos -->
        <div class="mb-6">
          <h4 class="text-amber-400 font-semibold mb-3">Filtros Ativos</h4>
          <div class="flex flex-wrap gap-2">
            <div v-for="author in filters.authors" :key="author" class="flex items-center bg-amber-600 text-white px-3 py-1 rounded-full text-sm">
              <span class="mr-2">Autor</span>
              <span class="mr-2 font-medium">{{ author }}</span>
              <button @click="removeFilter('authors', author)" class="hover:bg-amber-700 rounded-full p-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div v-for="binder in filters.binders" :key="binder" class="flex items-center bg-amber-600 text-white px-3 py-1 rounded-full text-sm">
              <span class="mr-2">Encadernador</span>
              <span class="mr-2 font-medium">{{ binder }}</span>
              <button @click="removeFilter('binders', binder)" class="hover:bg-amber-700 rounded-full p-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Filtro por Autor -->
          <div>
            <h4 class="text-amber-400 font-semibold mb-3">Autor</h4>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <label 
                v-for="author in allAuthors" 
                :key="author.name"
                class="flex items-center justify-between cursor-pointer hover:bg-gray-800 p-2 rounded"
              >
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    v-model="filters.authors" 
                    :value="author.name"
                    class="mr-3 rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-500"
                  >
                  <span class="text-gray-300 text-sm">{{ author.name }}</span>
                </div>
                <span class="text-gray-500 text-sm">{{ author.count }}</span>
              </label>
            </div>
          </div>

          <!-- Filtro por Encadernador -->
          <div>
            <h4 class="text-amber-400 font-semibold mb-3">Encadernador</h4>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <label 
                v-for="binder in allBinders" 
                :key="binder.name"
                class="flex items-center justify-between cursor-pointer hover:bg-gray-800 p-2 rounded"
              >
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    v-model="filters.binders" 
                    :value="binder.name"
                    class="mr-3 rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-500"
                  >
                  <span class="text-gray-300 text-sm">{{ binder.name }}</span>
                </div>
                <span class="text-gray-500 text-sm">{{ binder.count }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Filtros Adicionais -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <h4 class="text-amber-400 font-semibold mb-3">Data de publicação</h4>
            <div class="text-gray-400 text-sm">1</div>
          </div>
          <div>
            <h4 class="text-amber-400 font-semibold mb-3">Tipo de Item</h4>
            <div class="text-gray-400 text-sm">1</div>
          </div>
          <div>
            <h4 class="text-amber-400 font-semibold mb-3">Código de língua</h4>
            <div class="text-gray-400 text-sm">11</div>
          </div>
          <div>
            <h4 class="text-amber-400 font-semibold mb-3">Título</h4>
            <div class="text-gray-400 text-sm">80</div>
          </div>
          <div>
            <h4 class="text-amber-400 font-semibold mb-3">Local de Publicação</h4>
            <div class="text-gray-400 text-sm">31</div>
          </div>
          <div>
            <h4 class="text-amber-400 font-semibold mb-3">Autor</h4>
            <div class="text-gray-400 text-sm">57</div>
          </div>
          <div>
            <h4 class="text-amber-400 font-semibold mb-3">Encadernador</h4>
            <div class="text-gray-400 text-sm">4</div>
          </div>
          <div>
            <h4 class="text-amber-400 font-semibold mb-3">Antigo possuidor</h4>
            <div class="text-gray-400 text-sm">29</div>
          </div>
          <div>
            <h4 class="text-amber-400 font-semibold mb-3">Impressor e Livreiro</h4>
            <div class="text-gray-400 text-sm">106</div>
          </div>
          <div>
            <h4 class="text-amber-400 font-semibold mb-3">Assunto</h4>
            <div class="text-gray-400 text-sm">194</div>
          </div>
        </div>

        <div class="flex justify-between mt-8">
          <div class="text-gray-400 text-sm">
            {{ selectedFiltersCount }} filtros selecionados
          </div>
          <div class="flex space-x-4">
            <button 
              @click="clearFilters"
              class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Repor
            </button>
            <button 
              @click="applyFilters"
              class="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
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

interface AuthorCount {
  name: string
  count: number
}

// Estado reativo
const showAdvancedFilters = ref(false)
const currentPage = ref(1)
const itemsPerPage = 24
const sortBy = ref('title')

const filters = ref({
  itemType: [] as string[],
  authors: [] as string[],
  printers: [] as string[],
  binders: [] as string[],
  dateRange: null as string | null,
  language: [] as string[]
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

  // Ordenar
  items = [...items].sort((a, b) => {
    switch (sortBy.value) {
      case 'title':
        return a.metadata.title.values.localeCompare(b.metadata.title.values)
      case 'date':
        const dateA = a.metadata.publication_date?.values?.[0] || '0'
        const dateB = b.metadata.publication_date?.values?.[0] || '0'
        return dateB.localeCompare(dateA)
      case 'author':
        const authorA = a.metadata.title_personal?.values || ''
        const authorB = b.metadata.title_personal?.values || ''
        return authorA.localeCompare(authorB)
      default:
        return 0
    }
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

const selectedFiltersCount = computed(() => {
  return filters.value.authors.length + filters.value.binders.length + filters.value.printers.length
})

const allAuthors = computed(() => {
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
})

const topAuthors = computed(() => allAuthors.value.slice(0, 10))

const allBinders = computed(() => {
  // Simulando dados de encadernadores baseados na imagem
  return [
    { name: 'Correia, António Maria', count: 2 },
    { name: 'Viana, Alberto', count: 2 },
    { name: 'David, A', count: 1 },
    { name: 'Giannini, Giulio', count: 1 }
  ]
})

const topPrinters = computed(() => {
  // Simulando dados de impressores
  return [
    { name: 'Desaint, Nicolas', count: 21 },
    { name: 'Clousier, Michel', count: 10 },
    { name: 'Delaulne, Florentin', count: 10 },
    { name: 'Foucault, Hilaire', count: 10 },
    { name: 'Ganeau, Étienne', count: 10 }
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

const removeFilter = (filterType: string, value: string) => {
  const filterArray = filters.value[filterType as keyof typeof filters.value] as string[]
  const index = filterArray.indexOf(value)
  if (index > -1) {
    filterArray.splice(index, 1)
  }
}

const clearFilters = () => {
  filters.value = {
    itemType: [],
    authors: [],
    printers: [],
    binders: [],
    dateRange: null,
    language: []
  }
  currentPage.value = 1
}

const applyFilters = () => {
  showAdvancedFilters.value = false
  currentPage.value = 1
}

// Watch for filter changes
watch(filters, () => {
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
</style>