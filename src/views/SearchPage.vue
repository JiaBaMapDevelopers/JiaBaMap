
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import RestaurantCard from '@/components/RestaurantCard.vue';
import MapComponent from '@/components/MapComponent.vue';
import Header from "@/components/Header.vue";

const route = useRoute();
const isHome = computed(() => route.path === '/');
const windowWidth = ref(window.innerWidth);

const isSearchOpen = ref(false);

const handleSearchToggle = (isOpen) => {
  isSearchOpen.value = isOpen;
};

// 監聽視窗大小變化
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

// 在組件掛載時添加監聽器
onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize(); // 初始化寬度
});

// 在組件卸載時移除監聽器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>


<template>
    <div>
        <Header class:="z-100" @search-toggle="handleSearchToggle" />
        
        <div 
        class:="relative"
        :class="['flex', { 
        'mt-24': isSearchOpen && windowWidth < 768,
        'mt-20': !isHome && windowWidth >= 768 && windowWidth < 1167,
        'mt-8': isHome || windowWidth >= 1167
        }]">
            <RestaurantCard class=""/>
            <MapComponent/>
        </div>
    </div>
</template>