<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Header -->
    <header class="bg-black/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <NuxtLink :to="`/livro/${bookId}`" class="text-gray-300 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </NuxtLink>
            <h1 class="text-xl font-medium text-white">
              {{ bookTitle || 'Visualizador de Livro' }}
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <button @click="toggleFullscreen" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-[calc(100vh-64px)]">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <p class="text-gray-300">Carregando visualizador...</p>
        <p class="text-gray-500 text-sm mt-2">{{ loadingMessage }}</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex justify-center items-center min-h-[calc(100vh-64px)]">
      <div class="text-center">
        <div class="text-red-400 mb-4">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-semibold mb-2">Erro ao carregar livro</h3>
          <p class="text-gray-400">{{ errorMessage }}</p>
          <p class="text-gray-500 text-sm mt-2">ID: {{ bookId }}</p>
        </div>
        <div class="flex gap-4 justify-center">
          <button 
            @click="retryWithSimpleViewer"
            class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Tentar visualizador simples
          </button>
          <NuxtLink 
            :to="`/livro/${bookId}`"
            class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Voltar aos detalhes
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Simple Image Viewer (fallback) -->
    <div v-else-if="!useMirador && bookData" class="h-[calc(100vh-64px)] overflow-auto">
      <div class="max-w-4xl mx-auto p-6">
        <h2 class="text-2xl font-bold text-white mb-6">{{ bookData.metadata.title.values }}</h2>
        <div class="grid gap-4">
          <div v-for="pageNum in Math.min(bookData.stats.pages, 20)" :key="pageNum" class="bg-gray-800 rounded-lg p-4">
            <h3 class="text-amber-400 mb-2">Página {{ pageNum }}</h3>
            <img 
              :src="getPageImageUrl(bookData, pageNum)"
              :alt="`Página ${pageNum}`"
              class="w-full max-w-2xl mx-auto rounded shadow-lg"
              @error="onImageError"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Mirador Viewer -->
    <div v-else class="h-[calc(100vh-64px)]">
      <div id="mirador-viewer" class="w-full h-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const route = useRoute()
const bookId = route.params.id as string

const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')
const loadingMessage = ref('Inicializando...')
const bookTitle = ref('')
const bookData = ref<JoaninaItem | null>(null)
const miradorInstance = ref<any>(null)
const useMirador = ref(true)

// Get IIIF manifest URL
const getManifestUrl = (bookKey: string): string => {
  return `https://nexus.fw.dev.ucframework.pt/v1/digitalis/iiif/joanina/${bookKey}/manifest.json`
}

// Fetch book data
const fetchBookData = async () => {
  try {
    loadingMessage.value = 'Carregando dados do livro...'
    console.log('Fetching book data for visualization:', bookId)
    
    const response = await $fetch<JoaninaItem>(`https://nexus.fw.dev.ucframework.pt/v1/digitalis/collections/joanina/items/${bookId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Book data received for visualization:', response)
    bookTitle.value = response.metadata.title.values
    bookData.value = response
    return response
  } catch (err) {
    console.error('Erro ao carregar dados do livro:', err)
    throw err
  }
}

// Fetch IIIF manifest
const fetchManifest = async (bookKey: string) => {
  try {
    loadingMessage.value = 'Carregando manifest IIIF...'
    const manifestUrl = getManifestUrl(bookKey)
    console.log('Fetching IIIF manifest from:', manifestUrl)
    
    const manifest = await $fetch(manifestUrl, {
      headers: {
        'Accept': 'application/json'
      }
    })
    
    console.log('IIIF manifest received:', manifest)
    return { manifest, manifestUrl }
  } catch (err) {
    console.error('Erro ao carregar manifest IIIF:', err)
    throw err
  }
}

// Get page image URL (fallback method)
const getPageImageUrl = (book: JoaninaItem, pageNumber: number): string => {
  const baseUrl = book.cover.url.replace("{KEY}", book.cover.key).replace("{FILENAME}", "")
  const pageNum = pageNumber.toString().padStart(4, '0')
  return `${baseUrl}page_${pageNum}.jpg`
}

// Initialize Mirador with real IIIF manifest
const initializeMirador = async () => {
  try {
    loading.value = true
    error.value = false
    
    // Fetch book data first
    const book = await fetchBookData()
    
    if (!useMirador.value) {
      loading.value = false
      return
    }
    
    // Fetch IIIF manifest
    const { manifest, manifestUrl } = await fetchManifest(book.key)
    
    // Try to load Mirador
    try {
      loadingMessage.value = 'Inicializando Mirador...'
      const Mirador = await import('mirador')
      
      console.log('Initializing Mirador with manifest:', manifestUrl)
      
      // Initialize Mirador with the real IIIF manifest
      miradorInstance.value = Mirador.viewer({
        id: 'mirador-viewer',
        manifests: {
          [manifestUrl]: manifest
        },
        windows: [{
          manifestId: manifestUrl,
          canvasIndex: 0
        }],
        workspaceControlPanel: {
          enabled: true
        },
        window: {
          allowClose: false,
          allowMaximize: true,
          defaultSideBarPanel: 'info',
          sideBarOpenByDefault: false,
          panels: {
            info: true,
            attribution: true,
            canvas: true,
            annotations: false,
            search: false
          }
        },
        workspace: {
          showZoomControls: true,
          type: 'single'
        },
        thumbnailNavigation: {
          defaultPosition: 'off'
        }
      })
      
      console.log('Mirador initialized successfully')
    } catch (miradorError) {
      console.error('Erro ao carregar Mirador, usando visualizador simples:', miradorError)
      errorMessage.value = 'Erro ao carregar Mirador. Tentando visualizador alternativo...'
      useMirador.value = false
    }
    
    loading.value = false
  } catch (err) {
    console.error('Erro ao inicializar visualizador:', err)
    error.value = true
    errorMessage.value = err instanceof Error ? err.message : 'Erro desconhecido ao carregar o livro'
    loading.value = false
  }
}

// Retry with simple viewer
const retryWithSimpleViewer = () => {
  useMirador.value = false
  error.value = false
  initializeMirador()
}

// Toggle fullscreen
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// Handle image errors
const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.log('Image failed to load:', img.src)
  img.style.display = 'none'
}

// Lifecycle
onMounted(() => {
  initializeMirador()
})

onUnmounted(() => {
  if (miradorInstance.value) {
    miradorInstance.value = null
  }
})

// SEO
useHead({
  title: `Visualizar: ${bookTitle.value || 'Livro'} - Biblioteca Digital Joanina`,
  meta: [
    { name: 'description', content: `Visualização do livro ${bookTitle.value} da Biblioteca Joanina Digital.` }
  ]
})
</script>

<style scoped>
#mirador-viewer {
  background: #1a1a1a;
}

/* Custom Mirador styling */
:global(.mirador-viewer) {
  background-color: #1a1a1a !important;
}

:global(.MuiPaper-root) {
  background-color: #2d2d2d !important;
  color: white !important;
}

:global(.MuiAppBar-root) {
  background-color: #1f1f1f !important;
}
</style>