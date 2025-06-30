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
  
      <!-- Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div v-if="pending" class="flex justify-center items-center min-h-[400px]">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
        
        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-400 mb-4">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h1 class="text-2xl font-bold mb-2">Erro ao carregar livro</h1>
            <p class="text-gray-400">Não foi possível carregar os detalhes do livro.</p>
            <p class="text-gray-500 text-sm mt-2">ID: {{ id }}</p>
          </div>
          <NuxtLink 
            to="/explorar" 
            class="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
          >
            ← Voltar para a biblioteca
          </NuxtLink>
        </div>
        
        <div v-else-if="book" class="max-w-6xl mx-auto">
          <!-- Breadcrumb -->
          <nav class="mb-8">
            <ol class="flex items-center space-x-2 text-sm text-gray-400">
              <li>
                <NuxtLink to="/" class="hover:text-amber-300 transition-colors">Biblioteca Digital</NuxtLink>
              </li>
              <li>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </li>
              <li class="text-amber-300 truncate">{{ book.metadata.title.values }}</li>
            </ol>
          </nav>
  
          <!-- Book Details -->
          <div class="bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
            <div class="md:flex">
              <!-- Book Cover -->
              <div class="md:w-1/3 lg:w-1/4">
                <div class="relative h-96 md:h-full bg-gradient-to-br from-amber-100 to-orange-200">
                  <img 
                    v-if="getBookThumbnail(book)" 
                    :src="getBookThumbnail(book)"
                    :alt="book.metadata.title.values"
                    class="w-full h-full object-cover"
                    @error="onImageError"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <div class="text-center text-amber-800 p-6">
                      <svg class="w-20 h-20 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                      </svg>
                      <p class="text-sm font-medium">{{ book.metadata.title.values.substring(0, 50) }}...</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Book Information -->
              <div class="md:w-2/3 lg:w-3/4 p-8">
                <h1 class="text-4xl font-bold text-white mb-4 leading-tight">{{ book.metadata.title.values }}</h1>
                
                <div class="space-y-4 mb-8">
                  <p v-if="book.metadata.title_personal?.values" class="text-xl text-amber-300">
                    <span class="font-semibold">Autor:</span> {{ book.metadata.title_personal.values }}
                  </p>
                  <p v-if="book.metadata.publication_date?.values" class="text-lg text-gray-300">
                    <span class="font-semibold">Data:</span> 
                    <span v-if="book.metadata.publication_date.values.length > 1">
                      {{ book.metadata.publication_date.values[0] }}-{{ book.metadata.publication_date.values[1] }}
                    </span>
                    <span v-else>
                      {{ book.metadata.publication_date.values[0] }}
                    </span>
                  </p>
                </div>
  
                <!-- Metadata -->
                <div v-if="book.metadata" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div v-if="book.stats.pages" class="bg-gray-800 rounded-lg p-4">
                    <h3 class="text-amber-400 font-semibold mb-2">Páginas</h3>
                    <p class="text-white text-2xl font-bold">{{ book.stats.pages }}</p>
                  </div>  
                  
                  <div v-if="book.metadata.language_code?.values" class="bg-gray-800 rounded-lg p-4">
                    <h3 class="text-amber-400 font-semibold mb-2">Idioma</h3>
                    <p class="text-white text-lg">{{ book.metadata.language_code.values.join(", ") }}</p>
                  </div>
                  
                  <div v-if="book.metadata.hierarchical_place_name?.values" class="bg-gray-800 rounded-lg p-4">
                    <h3 class="text-amber-400 font-semibold mb-2">Local de publicação</h3>
                    <p class="text-white text-lg">{{ book.metadata.hierarchical_place_name.values}}</p>
                  </div>
                  
                  <div v-if="book.metadata.volume?.values" class="bg-gray-800 rounded-lg p-4">
                    <h3 class="text-amber-400 font-semibold mb-2">Volume</h3>
                    <p class="text-white text-lg">{{ book.metadata.volume.values}}</p>
                  </div>
                </div>
  
                <!-- Actions -->
                <div class="flex flex-wrap gap-4">
                  <NuxtLink 
                    :to="`/visualizar/${book.key}`"
                    class="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    Visualizar Livro
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
          <!-- Back Button -->
          <div class="mt-12 text-center">
            <NuxtLink 
              to="/explorar" 
              class="inline-flex items-center px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Voltar para a biblioteca
            </NuxtLink>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.877 2.172M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.875a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"></path>
            </svg>
            <h1 class="text-2xl font-bold mb-2">Livro não encontrado</h1>
            <p class="text-gray-500">O livro solicitado não existe ou não está disponível.</p>
          </div>
          <NuxtLink 
            to="/explorar" 
            class="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
          >
            ← Voltar para a biblioteca
          </NuxtLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // Interfaces
  interface JoaninaItem {
 key:string
 type:string
 cover:{
    key:string 
    type:string
    filename:string
    title:string
    url:string
    token:string
    url_format:string
    thumb_filename:string
    webp_filename:string
    thumb_url:string
    thumb_url_format:string
 }
  stats:{
    pages:number
  }
  metadata:{

    title:{
      values:string
    }
    title_personal?:{
        values:string
    }
    publication_date?:{
        values:string[]
    }
    language_code?:{
        values:string[]
    }
    hierarchical_place_name?:{
        values:string
    }
    volume?:{
        values:string
    }
  } 
}
  
  const route = useRoute()
  const id = route.params.id as string
  
  // Fetch book details from API
  const { data: book, pending, error } = await useLazyAsyncData(`book-${id}`, async () => {
    try {
      console.log('Fetching book with ID:', id)
      const response = await $fetch<JoaninaItem>(`https://nexus.fw.dev.ucframework.pt/v1/digitalis/collections/joanina/items/${id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      console.log('Book data received:', response)
      return response
    } catch (error) {
      console.error('Erro ao carregar detalhes do livro:', error)
      throw error
    }
  })
  
  const getBookThumbnail = (item: JoaninaItem): string | undefined => {
  // Tenta diferentes propriedades para encontrar uma imagem
  if (item.cover && item.cover.url && item.cover.key && item.cover.filename) {
    const imageurl = item.cover.url.replace("{KEY}", item.cover.key).replace("{FILENAME}", item.cover.filename)
    console.log('Generated image URL:', imageurl)
    return imageurl
  }
  return undefined
}
  
  const onImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    console.log('Image failed to load:', img.src)
    img.style.display = 'none'
  }
  
  // SEO
  useHead({
    title: book.value ? `${book.value.metadata.title.values} - Biblioteca Digital Joanina` : 'Livro - Biblioteca Digital Joanina',
    meta: [
      { name: 'description', content: book.value ? `Detalhes do livro ${book.value.metadata.title.values} da Biblioteca Joanina Digital.` : 'Detalhes do livro da Biblioteca Joanina Digital.' }
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