<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Login from './components/Login.vue'
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const hideFooter = computed(() => {
  return route.path === "/previewnote";
});

const hideHeader = computed(() => {
  return route.path === "/createnote" || route.path === "/previewnote";
});

// 移除 padding 的條件
const noPadding = computed(() => {
  return route.path === "/createnote";
});

</script>

<template>
  <Login />
  <div class="relative min-h-screen">
    <Header v-if="!hideHeader" />
    <div :class="['overflow-x-auto hide-scrollbar', { 'no-padding': noPadding }]">
      <RouterView />
      <Footer v-if="!hideFooter" />
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar:not(.no-padding) {
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding-top: 60px;
}

/* .hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-padding {
  padding-top: 0 !important;
} */
</style>



