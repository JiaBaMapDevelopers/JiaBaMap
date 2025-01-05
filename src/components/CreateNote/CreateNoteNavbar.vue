<script setup>
import { storeToRefs } from "pinia";
import { useAuth } from "@/stores/authStore";
import { ref, watchEffect } from "vue";

const user = useAuth();
const { userData } = storeToRefs(user);

const currentProfilePicture = ref("/image/default_user.png");

// 動態監聽
watchEffect(() => {
  currentProfilePicture.value =
    userData.value?.profilePicture || "/image/default_user.png";
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
    class="fixed top-0 left-0 z-50 flex flex-wrap items-center w-full gap-4 px-4 py-2 bg-white border-b border-orange-200 shadow-md md:flex-nowrap md:gap-0"
  >
    <!-- 左側內容 -->
    <div class="flex items-center space-x-4">
      <router-link to="/">
        <img
          src="@/assets/logo.jpg"
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
    <div class="flex items-center ml-auto space-x-4">
      <button
        class="px-4 py-2 text-sm text-white transition rounded bg-amber-400 hover:bg-amber-500 md:text-base whitespace-nowrap"
        @click="$emit('save')"
      >
        存檔
      </button>
      <button
        class="px-4 py-2 text-sm text-white transition rounded bg-amber-400 hover:bg-amber-500 md:text-base whitespace-nowrap"
        @click="$emit('preview')"
      >
        預覽
      </button>
      <button
        class="px-4 py-2 text-sm text-white transition rounded bg-amber-400 hover:bg-amber-500 md:text-base whitespace-nowrap"
      >
        發送
      </button>
      <!-- 會員頭貼 -->
      <div class="relative inline-block text-left group">
        <div class="w-10 h-10 rounded-full cursor-pointer bg-slate-400">
          <img
            :src="currentProfilePicture"
            alt="avatar"
            class="object-cover w-full h-full rounded-full"
            @error="handleImageError"
          />
        </div>
      </div>
    </div>
  </header>

  <!-- 內容區域 -->
  <div class="p-2 mt-16 md:mt-20">
    <slot></slot>
  </div>
</template>

<style scoped></style>
