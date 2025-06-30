<template>
  <div v-if="progress" class="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-2xl z-50 min-w-80">
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-white font-semibold">{{ getStatusTitle() }}</h4>
      <button 
        v-if="progress.status === 'complete' || progress.status === 'error'" 
        @click="$emit('close')"
        class="text-gray-400 hover:text-white"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    
    <!-- Progress Bar -->
    <div class="mb-3">
      <div class="flex justify-between text-sm text-gray-300 mb-1">
        <span>{{ progress.message }}</span>
        <span>{{ progress.percentage }}%</span>
      </div>
      <div class="w-full bg-gray-700 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all duration-300"
          :class="{
            'bg-amber-500': progress.status === 'downloading' || progress.status === 'preparing' || progress.status === 'processing',
            'bg-green-500': progress.status === 'complete',
            'bg-red-500': progress.status === 'error'
          }"
          :style="{ width: `${progress.percentage}%` }"
        ></div>
      </div>
    </div>
    
    <!-- Status Info -->
    <div class="flex items-center text-sm">
      <!-- Loading Spinner -->
      <div 
        v-if="progress.status === 'downloading' || progress.status === 'preparing' || progress.status === 'processing'"
        class="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500 mr-2"
      ></div>
      
      <!-- Success Icon -->
      <svg 
        v-else-if="progress.status === 'complete'"
        class="w-4 h-4 mr-2 text-green-500" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
      </svg>
      
      <!-- Error Icon -->
      <svg 
        v-else-if="progress.status === 'error'"
        class="w-4 h-4 mr-2 text-red-500" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
      </svg>
      
      <span 
        :class="{
          'text-gray-300': progress.status === 'downloading' || progress.status === 'preparing' || progress.status === 'processing',
          'text-green-400': progress.status === 'complete',
          'text-red-400': progress.status === 'error'
        }"
      >
        {{ getStatusText() }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DownloadProgress } from '~/composables/useDownload'

interface Props {
  progress: DownloadProgress | null
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
defineEmits<Emits>()

const getStatusTitle = () => {
  const progress = defineProps<Props>().progress
  if (!progress) return ''
  
  switch (progress.status) {
    case 'preparing':
      return 'Preparando Download'
    case 'downloading':
      return 'Baixando Arquivo'
    case 'processing':
      return 'Processando'
    case 'complete':
      return 'Download Concluído'
    case 'error':
      return 'Erro no Download'
    default:
      return 'Download'
  }
}

const getStatusText = () => {
  const progress = defineProps<Props>().progress
  if (!progress) return ''
  
  switch (progress.status) {
    case 'preparing':
      return 'Preparando arquivos...'
    case 'downloading':
      return `${progress.current} de ${progress.total} páginas`
    case 'processing':
      return 'Finalizando arquivo...'
    case 'complete':
      return 'Arquivo baixado com sucesso!'
    case 'error':
      return 'Falha no download'
    default:
      return ''
  }
}
</script>