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
          <p class="text-gray-400">Não foi possível carregar o visualizador do livro.</p>
        </div>
        <NuxtLink 
          :to="`/livro/${bookId}`"
          class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Voltar aos detalhes
        </NuxtLink>
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
const bookTitle = ref('')
const miradorInstance = ref<any>(null)

// Fetch book data
const fetchBookData = async () => {
  try {
    const response = await $fetch<JoaninaItem>(`https://nexus.fw.dev.ucframework.pt/v1/digitalis/collections/joanina/items/${bookId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    bookTitle.value = response.metadata.title.values
    return response
  } catch (err) {
    console.error('Erro ao carregar dados do livro:', err)
    throw err
  }
}

// Generate IIIF manifest from book data
const generateIIIFManifest = (book: JoaninaItem) => {
  const baseUrl = book.cover.url.replace("{KEY}", book.cover.key).replace("{FILENAME}", "")
  
  // Generate pages based on book stats
  const canvases = []
  for (let i = 1; i <= book.stats.pages; i++) {
    const pageNumber = i.toString().padStart(4, '0')
    const imageUrl = `${baseUrl}page_${pageNumber}.jpg`
    
    canvases.push({
      "@id": `${baseUrl}/canvas/${i}`,
      "@type": "sc:Canvas",
      "label": `Página ${i}`,
      "height": 3000,
      "width": 2000,
      "images": [{
        "@id": `${baseUrl}/annotation/${i}`,
        "@type": "oa:Annotation",
        "motivation": "sc:painting",
        "resource": {
          "@id": imageUrl,
          "@type": "dctypes:Image",
          "format": "image/jpeg",
          "height": 3000,
          "width": 2000,
          "service": {
            "@context": "http://iiif.io/api/image/2/context.json",
            "@id": imageUrl.replace('.jpg', ''),
            "profile": "http://iiif.io/api/image/2/level2.json"
          }
        },
        "on": `${baseUrl}/canvas/${i}`
      }]
    })
  }

  return {
    "@context": "http://iiif.io/api/presentation/2/context.json",
    "@id": `${baseUrl}/manifest`,
    "@type": "sc:Manifest",
    "label": book.metadata.title.values,
    "description": book.metadata.title_personal?.values || "",
    "metadata": [
      {
        "label": "Título",
        "value": book.metadata.title.values
      },
      {
        "label": "Autor",
        "value": book.metadata.title_personal?.values || "Desconhecido"
      },
      {
        "label": "Data de Publicação",
        "value": book.metadata.publication_date?.values.join("-") || "Desconhecida"
      },
      {
        "label": "Páginas",
        "value": book.stats.pages.toString()
      }
    ],
    "sequences": [{
      "@id": `${baseUrl}/sequence/normal`,
      "@type": "sc:Sequence",
      "label": "Sequência Normal",
      "canvases": canvases
    }]
  }
}

// Initialize Mirador
const initializeMirador = async () => {
  try {
    loading.value = true
    
    // Load Mirador dynamically
    const Mirador = await import('mirador')
    
    // Fetch book data
    const book = await fetchBookData()
    
    // Generate IIIF manifest
    const manifest = generateIIIFManifest(book)
    
    // Initialize Mirador
    miradorInstance.value = Mirador.viewer({
      id: 'mirador-viewer',
      manifests: {
        [manifest['@id']]: manifest
      },
      windows: [{
        manifestId: manifest['@id'],
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
    
    loading.value = false
  } catch (err) {
    console.error('Erro ao inicializar Mirador:', err)
    error.value = true
    loading.value = false
  }
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
  initializeMirador()
})

onUnmounted(() => {
  if (miradorInstance.value) {
    // Cleanup Mirador instance if needed
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