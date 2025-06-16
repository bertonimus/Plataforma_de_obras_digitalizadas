<template>
  <header class="w-full py-4 px-6 md:px-12 flex justify-between items-center bg-library-dark-800/80 backdrop-blur-sm fixed top-0 z-50">
    <div class="flex items-center">
      <NuxtLink to="/" class="text-xl font-serif font-bold text-book-brown-200 hover:text-book-brown-100 transition-colors">
        Biblioteca Digital
      </NuxtLink>
    </div>
    <div class="relative">
      <button @click="toggleLanguage" class="flex items-center text-book-brown-300 hover:text-book-brown-100 transition-colors">
        {{ currentLanguage }}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-if="showLanguages" class="absolute right-0 mt-2 w-32 bg-library-dark-800 border border-book-brown-700 rounded-md shadow-lg overflow-hidden">
        <div v-for="lang in languages" :key="lang" @click="selectLanguage(lang)" class="px-4 py-2 text-book-brown-300 hover:bg-book-brown-800 hover:text-book-brown-100 cursor-pointer">
          {{ lang }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const currentLanguage = ref('Português');
const showLanguages = ref(false);
const languages = ['Português', 'English', 'Español'];

const toggleLanguage = () => {
  showLanguages.value = !showLanguages.value;
};

const selectLanguage = (lang) => {
  currentLanguage.value = lang;
  showLanguages.value = false;
};

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('header')) {
      showLanguages.value = false;
    }
  });
});
</script>