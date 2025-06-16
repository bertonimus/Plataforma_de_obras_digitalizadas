<template>
  <section class="relative w-full min-h-screen flex flex-col items-start justify-end pb-16 md:pb-24 px-6 md:px-12">
    <!-- Background with overlay -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-hero-books bg-cover bg-center"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-library-dark-900 via-library-dark-900/90 to-library-dark-900/70"></div>
    </div>
    
    <!-- Content -->
    <div class="relative z-10 max-w-3xl">
      <h1 class="text-4xl md:text-6xl font-bold mb-4 text-book-brown-100">
        Joanina Digital
      </h1>
      <p class="text-lg md:text-xl text-book-brown-200 mb-6 max-w-2xl">
        Uma nova plataforma com acesso aberto aos tesouros do fundo patrimonial da Biblioteca Joanina.
      </p>
      <div class="text-sm text-book-brown-300 mb-8 max-w-2xl">
        <p>
          Fruto do Projeto Joanina Digital, uma parceria entre a Universidade de Coimbra e a Autoridade Literária de Sharjah, esta nova plataforma é uma porta aberta a um fundo patrimonial único de Livro Antigo da Biblioteca Joanina, constituído por impressos dos séculos XVI, XVII e XVIII.
          <span class="text-book-brown-200 cursor-pointer hover:underline ml-2">Saber mais</span>
        </p>
      </div>
      
      <!-- Stats -->
      <div class="flex flex-wrap justify-end gap-8 md:gap-12 mb-8">
        <div class="stats-item">
          <span class="stats-number">141</span>
          <span class="stats-label">Livros</span>
        </div>
        <div class="stats-item">
          <span class="stats-number">69528</span>
          <span class="stats-label">Páginas</span>
        </div>
        <div class="stats-item">
          <span class="stats-number">4.67 TB</span>
          <span class="stats-label">Ficheiros</span>
        </div>
      </div>
      
      <button class="bg-book-brown-600 hover:bg-book-brown-500 text-white py-3 px-8 rounded-md font-semibold transition-all duration-300 hover:shadow-md hover:shadow-book-brown-500/50">
        Explorar items
      </button>
    </div>
  </section>
</template>