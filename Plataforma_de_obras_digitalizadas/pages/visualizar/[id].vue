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
        <p class="text-gray-300">{{ loadingMessage }}</p>
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
          <p class="text-gray-400 mb-2">{{ error }}</p>
          <p class="text-gray-500 text-sm">ID: {{ bookId }}</p>
        </div>
        <div class="flex gap-4 justify-center">
          <button 
            @click="retryInitialization"
            class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Tentar novamente
          </button>
          <NuxtLink 
            :to="`/livro/${bookId}`"
            class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Voltar aos detalhes
          </NuxtLink>
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
import type { IIIFManifest, MiradorViewer } from 'mirador'

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
const error = ref('')
const bookTitle = ref('')
const loadingMessage = ref('Carregando dados do livro...')
const miradorInstance = ref<MiradorViewer | null>(null)

// Fetch book data
const fetchBookData = async (): Promise<JoaninaItem> => {
  try {
    loadingMessage.value = 'Carregando dados do livro...'
    console.log('Fetching book data for ID:', bookId)
    
    const response = await $fetch<JoaninaItem>(`https://nexus.fw.dev.ucframework.pt/v1/digitalis/collections/joanina/items/${bookId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Book data received:', response)
    bookTitle.value = response.metadata.title.values
    return response
  } catch (err) {
    console.error('Erro ao carregar dados do livro:', err)
    throw new Error('Não foi possível carregar os dados do livro')
  }
}

// Fetch IIIF manifest
const fetchManifest = async (bookKey: string): Promise<IIIFManifest> => {
  try {
    loadingMessage.value = 'Carregando manifest IIIF...'
    console.log('Fetching manifest for book:', bookKey)
    
    const manifestUrl = `https://nexus.fw.dev.ucframework.pt/v1/digitalis/iiif/joanina/${bookKey}/manifest.json`
    console.log('Manifest URL:', manifestUrl)
    
    const manifest = await $fetch<IIIFManifest>(manifestUrl, {
      headers: {
        'Accept': 'application/json'
      }
    })
    
    console.log('Manifest received:', manifest)
    return manifest
  } catch (err) {
    console.error('Erro ao carregar manifest:', err)
    throw new Error('Não foi possível carregar o manifest IIIF')
  }
}

// Initialize Mirador
const initializeMirador = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Fetch book data first
    const book = await fetchBookData()
    
    // Fetch IIIF manifest
    const manifest = await fetchManifest(book.key)
    
    // Wait for next tick to ensure DOM is ready
    await nextTick()
    
    // Check if container exists
    const container = document.getElementById('mirador-viewer')
    if (!container) {
      throw new Error('Container do Mirador não encontrado')
    }
    
    loadingMessage.value = 'Inicializando visualizador...'
    
    // Load Mirador dynamically
    const Mirador = await import('mirador')
    console.log('Mirador loaded:', Mirador)
    
    // Clear any existing content
    container.innerHTML = ''
    
    // Initialize Mirador
    const manifestId = manifest['@id'] || manifest.id || `manifest-${book.key}`
    console.log('Initializing Mirador with manifest ID:', manifestId)
    
    miradorInstance.value = Mirador.default.viewer({
      id: 'mirador-viewer',
      manifests: {
        [manifestId]: manifest
      },
      windows: [{
        manifestId: manifestId,
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
    
    console.log('Mirador initialized successfully:', miradorInstance.value)
    loading.value = false
    
  } catch (err) {
    console.error('Erro ao inicializar Mirador:', err)
    error.value = err instanceof Error ? err.message : 'Erro desconhecido'
    loading.value = false
  }
}

// Retry initialization
const retryInitialization = () => {
  error.value = ''
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

// Lifecycle
onMounted(() => {
  console.log('Component mounted, initializing Mirador...')
  initializeMirador()
})

onUnmounted(() => {
  if (miradorInstance.value) {
    console.log('Cleaning up Mirador instance')
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