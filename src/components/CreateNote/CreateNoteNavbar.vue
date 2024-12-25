<template>
    <header class="flex flex-wrap items-center justify-between p-2 space-x-4 space-y-2 border-b border-orange-200 text-amber-500 bg-white md:space-y-0">
        <!-- 左側內容 -->
      <div class="flex items-center space-x-6">
        <router-link to="/"><img src="../../assets/logo.jpg" alt="Logo" class="w-[130px]"></router-link>
        <router-link to="/myarticle" class="p-2 rounded-md hover:bg-amber-100 whitespace-nowrap">
          回到文章列表
        </router-link> 
        <router-link to="/user" class="p-2 rounded-md hover:bg-amber-100 whitespace-nowrap">
          個人頁面
        </router-link>
      </div>
  
      <!-- 右側內容 -->
      <div class="flex items-center space-x-4">
        <button
          class="bg-amber-400 text-white px-4 py-1 rounded hover:bg-amber-500  transition"
        @click="$emit('save')"
        >
          存檔
        </button>
        <button
          class="bg-amber-400 text-white px-4 py-1 rounded hover:bg-amber-500  transition"
        @click="$emit('preview')"
        >
          預覽
        </button>
        <!-- 會員頭貼 -->
        <div class="relative inline-block text-left group">
            <div class="w-10 h-10 rounded-full cursor-pointer bg-slate-400">
              <img src="" alt="">
            </div>
            <!-- 會員下拉選單 -->
            <div class="absolute right-0 z-10 hidden w-32 mt-0 bg-white rounded-md shadow-md group-hover:block">
              <ul class="mt-2">
                <li>
                  <router-link to="/user" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">
                    <font-awesome-icon
                      :icon="['fas', 'user']"
                      class="mr-4 text-amber-500" />個人檔案
                  </router-link>
                </li>
                <li>
                    <router-link to="/user" class="block px-4 py-2 text-amber-500 hover:bg-amber-100 rounded-bl-md rounded-br-md">
                      <font-awesome-icon
                      :icon="['fas', 'bookmark']"
                      class="mr-4 text-amber-500" />珍藏餐廳
                    </router-link>
                </li>
              </ul>
            </div>
          </div> 
          <!-- 會員頭貼end -->
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: "CreateNoteNavbar",
  };
  </script>
  
  <style scoped>
  /* 自訂樣式可加於此 */
  </style>
  