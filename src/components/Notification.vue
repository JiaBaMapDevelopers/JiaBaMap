<script setup> 
import { ref } from 'vue';

const isDropdownOption = ref(false);

const toggleDropdown = () => {
  isDropdownOption.value = !isDropdownOption.value;
};
</script>

<template>
  <div class="hover:bg-amber-100 p-2 rounded-md">
      <button @click="toggleDropdown" class="relative">
      <div class="flex items-center text-amber-500">
        通知
        <font-awesome-icon :icon="['fas', 'bell']" class="ml-1"/>
      </div>
      <ul v-if="isDropdownOption" class="absolute right-0 z-10 w-44 mt-3 text-xs text-amber-500 rounded-md shadow-md bg-white top-full flex flex-row justify-around">
        <li class="text-sm">已訂購</li>
        <li class="text-sm">歷史紀錄</li>
      </ul>
    </button>
  </div>
</template>