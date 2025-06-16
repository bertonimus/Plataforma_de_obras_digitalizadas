<template>
  <div class="min-h-screen bg-[#1C1C1C] text-white">
    <!-- Header -->
    <header class="p-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Biblioteca Digital</h1>
      <div class="relative">
        <button class="flex items-center space-x-2 text-gray-300 hover:text-white">
          <span>Português</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-12">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left Side - Text Content -->
        <div class="space-y-6">
          <h2 class="text-4xl font-bold text-[#E6B449]">Em Destaque</h2>
          <div class="mt-8">
            <h3 class="text-5xl font-bold text-[#E6B449] mb-6">Joanina Digital</h3>
            <p class="text-xl text-gray-300">
              Uma nova plataforma com acesso aberto aos tesouros do fundo patrimonial da Biblioteca Joanina.
            </p>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 mt-12">
            <div>
              <div class="text-3xl font-bold">141</div>
              <div class="text-gray-400">Itens</div>
            </div>
            <div>
              <div class="text-3xl font-bold">69528</div>
              <div class="text-gray-400">Páginas</div>
            </div>
            <div>
              <div class="text-3xl font-bold">4.67 TB</div>
              <div class="text-gray-400">Ficheiros</div>
            </div>
          </div>

          <NuxtLink 
            to="/inicio"
            class="inline-block mt-8 bg-[#E6B449] text-black px-8 py-3 rounded-md font-semibold hover:bg-[#d4a543] transition-colors"
          >
            Abrir Coleção
          </NuxtLink>
        </div>

        <!-- Right Side - Image -->
        <div class="rounded-2xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="Biblioteca Joanina" 
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-800 mt-12 py-6">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <div class="mb-4 md:mb-0">
            UC DIGITALIS v by UC Framework © Universidade de Coimbra
          </div>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-white">Contacto</a>
            <a href="#" class="hover:text-white">Canal de Denúncia</a>
            <a href="#" class="hover:text-white">Elogios, Sugestões e Reclamações</a>
            <a href="#" class="hover:text-white">Proteção de Dados</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
