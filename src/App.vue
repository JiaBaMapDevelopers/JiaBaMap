<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Login from './components/Login.vue'
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// 取得目前路由
const route = useRoute();

// 判斷是否隱藏 Footer
const hideFooter = computed(() => {
  // 在 previewnote 頁面不顯示 Footer
  return route.path === "/previewnote";
});
</script>

<template>
  <Login />
  <div class="relative min-h-screen">
    <Header />
    <div class="overflow-x-auto hide-scrollbar">
      <RouterView />
      <Footer />
    </div>
  </div>
</template>

<style scoped>
/* 隱藏滾動條 */
.hide-scrollbar {
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding-top: 60px;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>


