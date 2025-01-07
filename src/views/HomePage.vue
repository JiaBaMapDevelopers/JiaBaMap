<script>
import StoreType from "@/components/HomePage/StoreType.vue"
import SearchInput from "@/components/SearchInput.vue";
import Header from '@/components/Header.vue';

export default {
  components: {
    StoreType,
    SearchInput,
    Header
  },
};
</script>




<template>
  <Header />
  <div>
    <!-- 搜尋區塊 -->
    <div class="relative flex flex-col items-center justify-center m-auto text-center bg-top bg-no-repeat bg-cover h-96 bg-index_searchBG"
         aria-label="Photo by Ivan Torres on Unsplash">
      <div class="absolute inset-0 bg-gray-800 opacity-40"></div>
      <h1 class="z-10 px-3 mt-8 text-3xl text-white md:text-5xl text-bold">想知道哪裡有美食？</h1>
      <h2 class="z-10 px-3 mt-5 text-lg text-white md:text-xl text-bold">從超過 50,000 家精選餐廳中，探索您不知道的熱門美食。</h2>
      <!-- 搜尋欄容器 -->
      <div class="z-10 items-center hidden mt-10 bg-white rounded-full md:flex h-11">
        <SearchInput />
      </div>
    </div>

    <!-- 餐廳分類按鈕 -->
    <StoreType />
  </div>
</template>

<style scoped>
/* 如果需要自定義一些額外樣式可以在這裡加入 */

@media (max-width: 768px) {
    header {
        flex-wrap: nowrap;
    }
    .hidden {
        display: none !important;
    }
    .main-menu {
        display: none; /* 小於等於 768px 隱藏主選單 */
    }
    .hamburger-menu {
        display: flex; /* 小於等於 768px 顯示漢堡選單 */
    }
}

@media (min-width: 769px) {
    .main-menu {
        display: flex; /* 大於等於 769px 顯示主選單 */
    }
    .hamburger-menu {
        display: none; /* 大於等於 769px 隱藏漢堡選單 */
    }
}
</style>