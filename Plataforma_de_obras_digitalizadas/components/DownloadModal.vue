<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" @click="closeModal">
    <div class="bg-gray-900 rounded-lg max-w-md w-full mx-4 overflow-hidden" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-700">
        <h2 class="text-xl font-bold text-white">Opções de Download</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Formato -->
        <div class="mb-6">
          <label class="block text-white font-semibold mb-3">Formato</label>
          <div class="space-y-2">
            <label class="flex items-center cursor-pointer">
              <input 
                type="radio" 
                v-model="selectedFormat" 
                value="pdf" 
                class="mr-3 text-amber-500 focus:ring-amber-500"
              >
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-white">PDF (Recomendado)</span>
              </div>
            </label>
            <label class="flex items-center cursor-pointer">
              <input 
                type="radio" 
                v-model="selectedFormat" 
                value="zip" 
                class="mr-3 text-amber-500 focus:ring-amber-500"
              >
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-white">ZIP com imagens</span>
              </div>
            </label>
            <label class="flex items-center cursor-pointer">
              <input 
                type="radio" 
                v-model="selectedFormat" 
                value="images" 
                class="mr-3 text-amber-500 focus:ring-amber-500"
              >
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-white">Imagens individuais</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Qualidade -->
        <div class="mb-6">
          <label class="block text-white font-semibold mb-3">Qualidade</label>
          <select 
            v-model="selectedQuality" 
            class="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="high">Alta (Melhor qualidade)</option>
            <option value="medium">Média (Balanceada)</option>
            <option value="low">Baixa (Arquivo menor)</option>
          </select>
        </div>

        <!-- Páginas -->
        <div class="mb-6">
          <label class="block text-white font-semibold mb-3">Páginas</label>
          <div class="space-y-3">
            <label class="flex items-center cursor-pointer">
              <input 
                type="radio" 
                v-model="pageSelection" 
                value="all" 
                class="mr-3 text-amber-500 focus:ring-amber-500"
              >
              <span class="text-white">Todas as páginas ({{ totalPages }})</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input 
                type="radio" 
                v-model="pageSelection" 
                value="range" 
                class="mr-3 text-amber-500 focus:ring-amber-500"
              >
              <span class="text-white">Intervalo específico</span>
            </label>
            <div v-if="pageSelection === 'range'" class="ml-6 grid grid-cols-2 gap-3">
              <div>
                <label class="block text-gray-400 text-sm mb-1">De:</label>
                <input 
                  type="number" 
                  v-model.number="startPage" 
                  :min="1" 
                  :max="totalPages"
                  class="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
              </div>
              <div>
                <label class="block text-gray-400 text-sm mb-1">Até:</label>
                <input 
                  type="number" 
                  v-model.number="endPage" 
                  :min="startPage" 
                  :max="totalPages"
                  class="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Informações do arquivo -->
        <div class="bg-gray-800 rounded-lg p-4 mb-6">
          <h4 class="text-white font-semibold mb-2">Informações do download</h4>
          <div class="text-sm text-gray-300 space-y-1">
            <p>Páginas: {{ pageSelection === 'all' ? totalPages : `${startPage} - ${endPage} (${endPage - startPage + 1} páginas)` }}</p>
            <p>Formato: {{ formatLabels[selectedFormat] }}</p>
            <p>Qualidade: {{ qualityLabels[selectedQuality] }}</p>
            <p class="text-amber-400">Tamanho estimado: {{ estimatedSize }}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-700">
        <button 
          @click="closeModal" 
          class="px-6 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Cancelar
        </button>
        <button 
          @click="startDownload" 
          :disabled="isDownloading"
          class="bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-2 rounded-lg font-semibold transition-colors"
        >
          {{ isDownloading ? 'Baixando...' : 'Baixar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  bookKey: string
  bookTitle: string
  totalPages: number
}

interface Emits {
  (e: 'close'): void
  (e: 'download', options: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedFormat = ref<'pdf' | 'zip' | 'images'>('pdf')
const selectedQuality = ref<'high' | 'medium' | 'low'>('high')
const pageSelection = ref<'all' | 'range'>('all')
const startPage = ref(1)
const endPage = ref(props.totalPages)
const isDownloading = ref(false)

const formatLabels = {
  pdf: 'PDF',
  zip: 'ZIP com imagens',
  images: 'Imagens individuais'
}

const qualityLabels = {
  high: 'Alta qualidade',
  medium: 'Qualidade média',
  low: 'Qualidade baixa'
}

const estimatedSize = computed(() => {
  const pages = pageSelection.value === 'all' ? props.totalPages : (endPage.value - startPage.value + 1)
  const baseSize = selectedQuality.value === 'high' ? 2 : selectedQuality.value === 'medium' ? 1 : 0.5
  const totalMB = pages * baseSize
  
  if (totalMB > 1024) {
    return `~${(totalMB / 1024).toFixed(1)} GB`
  }
  return `~${totalMB.toFixed(0)} MB`
})

// Watch para ajustar endPage quando totalPages muda
watch(() => props.totalPages, (newTotal) => {
  endPage.value = newTotal
})

// Watch para garantir que endPage não seja menor que startPage
watch([startPage, endPage], () => {
  if (endPage.value < startPage.value) {
    endPage.value = startPage.value
  }
})

const closeModal = () => {
  if (!isDownloading.value) {
    emit('close')
  }
}

const startDownload = () => {
  const options = {
    format: selectedFormat.value,
    quality: selectedQuality.value,
    pages: pageSelection.value === 'range' ? {
      start: startPage.value,
      end: endPage.value
    } : undefined
  }
  
  isDownloading.value = true
  emit('download', options)
  
  // Reset após um tempo
  setTimeout(() => {
    isDownloading.value = false
  }, 5000)
}
</script>