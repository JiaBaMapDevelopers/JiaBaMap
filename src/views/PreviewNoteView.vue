<template>
    <div class="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">預覽食記</h1>
  
      <!-- 日期 -->
      <div v-if="note.date" class="mb-4">
        <strong>日期：</strong>
        <span>{{ note.date }}</span>
      </div>
  
      <!-- 標題 -->
      <div v-if="note.title" class="mb-4">
        <strong>標題：</strong>
        <h2 class="text-lg font-semibold">{{ note.title }}</h2>
      </div>
  
      <!-- 內容 -->
      <div v-if="note.content" class="mb-4">
        <strong>內容：</strong>
        <div v-html="note.content" class="border border-gray-300 rounded-md p-4 "></div>
      </div>
  
      <!-- 返回編輯按鈕 -->
      <div class="text-center mt-6">
        <router-link
        :to="{ name: 'CreateNote' }"
        class="px-4 py-2 bg-amber-400 text-white rounded hover:bg-amber-500  transition"
        >
        返回編輯
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  
  // 定義響應式資料
  const note = ref({
    date: "",
    title: "",
    content: "",
  });
  
  // 在元件掛載時執行
  onMounted(() => {
    // 從 localStorage 獲取資料
    const noteData = localStorage.getItem("noteData");
    if (noteData) {
      note.value = JSON.parse(noteData); // 更新 note 資料
    }
  });
  </script>
  

<style scoped>
  
</style>
  