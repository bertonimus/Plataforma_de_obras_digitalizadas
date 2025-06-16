<template>
  <section class="w-full bg-library-dark-900 py-16 px-6 md:px-12">
    <h2 class="text-2xl md:text-3xl font-serif font-bold mb-8 text-book-brown-200">Recentes</h2>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <div v-for="(book, index) in recentBooks" :key="index" class="book-card">
        <div class="relative pt-[120%] bg-library-dark-800">
          <img :src="book.coverUrl" :alt="book.title" class="absolute inset-0 w-full h-full object-contain p-4">
        </div>
        <div class="p-3">
          <h3 class="text-sm text-book-brown-200 font-semibold line-clamp-2">{{ book.title }}</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const recentBooks = [
  {
    title: "Relaçam de huma solemne, e extraordinaria Procissam de Preces, que fez o Rev. Cabido...",
    coverUrl: "https://images.pexels.com/photos/5834/nature-grass-leaf-green.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    title: "Joannis Seldeni, J.C. De Synedriis & praefecturis ivridicis vetervm Ebraeorvm",
    coverUrl: "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    title: "Dissertatio de Metropolibus Jure, multis tam Arabicis, & Chaldaeis, quàm Rabbinorum...",
    coverUrl: "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    title: "Annales Svitanorvm Bohemicorvm, a Tvrciis sva lingva scripti [etc]...",
    coverUrl: "https://images.pexels.com/photos/51342/books-education-school-literature-51342.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    title: "Historiae Mvsvlmanae Tvrvorvm, de monvmentis ipsorvm exscriptae, libri XVIII...",
    coverUrl: "https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  }
];
</script>