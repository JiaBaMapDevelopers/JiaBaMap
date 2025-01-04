<script setup>
import { storeToRefs } from "pinia";
import { useAuth } from "../../stores/authStore";
import { ref, watchEffect } from "vue";

const user = useAuth();
const { userData } = storeToRefs(user);

const currentProfilePicture = ref("/image/default_user.png");

// 動態監聽
watchEffect(() => {
  currentProfilePicture.value =
    userData.value?.picture || "/image/default_user.png";
});

// 處理圖片錯誤
const handleImageError = (event) => {
  event.target.src = "/image/default_user.png";
};

defineEmits(["save", "preview"]);
</script>

<template>
  <!-- 導覽列 -->
  <header
    class="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-orange-200 px-4 py-2 flex flex-wrap items-center gap-4 md:flex-nowrap md:gap-0"
  >
    <!-- 左側內容 -->
    <div class="flex items-center space-x-4">
      <router-link to="/">
        <img
          src="../../assets/logo.jpg"
          alt="Logo"
          class="w-auto min-w-[60px] max-w-[100px] md:max-w-[130px] h-auto"
        />
      </router-link>
      <router-link
        to="/myarticle"
        class="p-2 rounded-md hover:bg-amber-100 whitespace-nowrap text-amber-500"
      >
        回到文章列表
      </router-link>
      <router-link
        to="/user"
        class="p-2 rounded-md hover:bg-amber-100 whitespace-nowrap text-amber-500"
      >
        個人頁面
      </router-link>
    </div>

    <!-- 右側內容 -->
    <div class="flex items-center space-x-4 ml-auto">
      <button
        class="bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500 transition text-sm md:text-base whitespace-nowrap"
        @click="$emit('save')"
      >
        存檔
      </button>
      <button
        class="bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500 transition text-sm md:text-base whitespace-nowrap"
        @click="$emit('preview')"
      >
        預覽
      </button>
      <button
        class="bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500 transition text-sm md:text-base whitespace-nowrap"
      >
        發送
      </button>
      <!-- 會員頭貼 -->
      <div class="relative inline-block text-left group">
        <div class="w-10 h-10 rounded-full cursor-pointer bg-slate-400">
          <img
            :src="currentProfilePicture"
            alt="avatar"
            class="w-full h-full object-cover rounded-full"
            @error="handleImageError"
          />
        </div>
      </div>
    </div>
  </header>

  <!-- 內容區域 -->
  <div class="mt-16 md:mt-20 p-2">
    <slot></slot>
  </div>
</template>

<style scoped></style>
