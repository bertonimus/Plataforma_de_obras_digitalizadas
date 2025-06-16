<template>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Lista de Livros</h1>
  
      <div v-if="loading">Carregando livros...</div>
      <div v-else-if="error" class="text-red-600">Erro ao carregar livros: {{ error }}</div>
      <ul v-else>
        <li v-for="livro in livros" :key="livro.id" class="mb-2">
          {{ livro.metadata.title.values }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const livros = ref([])
  const loading = ref(true)
  const error = ref(null)
  
  // URL da tua API de livros
  const API_URL = 'https://nexus.fw.dev.ucframework.pt/v1/digitalis/collections/joanina/items'
  
  onMounted(async () => {
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Falha ao buscar os livros')
      const data = await res.json()
      livros.value = data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  })
  </script>
  
  <style scoped>
  ul {
    list-style-type: disc;
    padding-left: 1.5rem;
  }
  </style>