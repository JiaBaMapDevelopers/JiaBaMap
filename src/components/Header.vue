<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import SearchInput from "./SearchInput.vue";
import { useRoute } from "vue-router";
import Login from '../components/Login.vue';
import { useAuth } from '../stores/authStore';

const emit = defineEmits(['search-toggle']);
const route = useRoute();
const user = useAuth();

// 響應式狀態
const isMenuOpen = ref(false);
const menuContainer = ref(null);
const isSearchOpen = ref(false);
const showLoginModal = ref(false);

// 新增：判斷是否為首頁
const isHome = computed(() => route.path === '/');

// 新增：監聽視窗寬度變化
const windowWidth = ref(window.innerWidth);

// 切換搜尋欄
const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
  emit('search-toggle', isSearchOpen.value);
};

// 計算是不是在首頁，不是首頁就顯示搜尋欄
const showSearch = computed(() => route.path !== '/');

// 切換選單，打開選單時監聽點擊事件, 關閉選單時移除監聽
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    document.addEventListener('click', handleClickOutside);
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
};

// 點擊外部關閉選單
const handleClickOutside = (event) => {
  if (menuContainer.value && !menuContainer.value.contains(event.target)) {
    isMenuOpen.value = false;
  }
};

// 登入模態控制
const openLoginModal = () => showLoginModal.value = true;
const closeLoginModal = () => showLoginModal.value = false;

// 螢幕寬度檢查
const checkScreenWidth = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value > 768) {
    isMenuOpen.value = false;
  }
};

// 頭像的計算屬性
const currentProfilePicture = computed(() => {
  return user.userData?.picture || '/src/assets/default_user.png';
});

// 生命週期鉤子
onMounted(() => {
  window.addEventListener("resize", checkScreenWidth);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenWidth);
  document.removeEventListener('click', handleClickOutside);
  isSearchOpen.value = false;
});

// 路由監聽
watch(route, () => {
  isSearchOpen.value = false;
});
</script>

<template>
  <Login :visible="showLoginModal" @close="closeLoginModal" />
  <header class="fixed top-0 left-0 right-0 z-50 flex items-center p-2 border-b border-orange-200 bg-white"
         :class="{ 'flex-wrap': !isHome && windowWidth >= 768 && windowWidth < 1167 }">
    <!-- 第一行：LOGO 和搜尋欄 -->
    <div class="flex w-full items-center justify-between">
      <!-- LOGO -->
      <router-link to="/" class="w-[130px] flex-shrink-0">
        <img src="../assets/logo.jpg" alt="Logo" class="w-full">
      </router-link>

      <!-- 中間區域：搜尋欄 -->
      <div class="hidden md:flex flex-1 justify-center mx-4">
        <div v-if="route.path !== '/'" class="w-[500px]">
          <SearchInput />
        </div>
      </div>

      <!-- 手機版選單按鈕 -->
      <div class="flex md:hidden items-center space-x-4">
        <button @click="toggleSearch" class="text-amber-500">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="w-5 h-5" />
        </button>
        <button @click="toggleMenu" class="text-amber-500">
          <font-awesome-icon :icon="['fas', 'bars']" class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- 手機版搜尋欄 -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform -translate-y-4"
      enter-to-class="opacity-100 transform translate-y-0"
    >
      <div v-if="isSearchOpen" 
           class="absolute left-0 right-0 p-4 bg-white shadow-md top-full md:hidden">
        <SearchInput />
      </div>
    </Transition>

    <!-- 手機版選單 -->
    <div v-if="isMenuOpen" 
         class="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
      <div class="py-2">
        <ul class="space-y-2">
          <li v-if="!user.userData">
            <button @click="openLoginModal" class="w-full text-left p-2 text-amber-500 hover:bg-amber-100">
              登入
            </button>
          </li>
          <li v-else>
            <button @click="user.logout" class="w-full text-left p-2 text-amber-500 hover:bg-amber-100">
              登出
            </button>
          </li>
          <li><router-link to="/myarticle" class="block p-2 text-amber-500 hover:bg-amber-100">發表食記</router-link></li>
          <li><router-link to="/articlelist" class="block p-2 text-amber-500 hover:bg-amber-100">專欄文章</router-link></li>
          <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">店家專區</a></li>
          <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">排行榜</a></li>
        </ul>
      </div>
    </div>

    <!-- 桌面版主選單 -->
    <div v-if="!isHome" 
         class="hidden md:flex items-center space-x-4 w-full mt-2 justify-start pl-4 xl:w-auto xl:mt-0 xl:justify-end xl:pl-0">
      <!-- 登入/登出按鈕 -->
      <div class="flex items-center space-x-4">
        <button v-if="!user.userData" 
                class="p-2 rounded-md text-amber-500 hover:bg-amber-100 min-w-20" 
                @click="openLoginModal">
          登入
        </button>
        <button v-else 
                class="p-2 rounded-md text-amber-500 hover:bg-amber-100 min-w-20" 
                @click="user.logout">
          登出
        </button>
        <router-link to="/myarticle" class="p-2 rounded-md text-amber-500 hover:bg-amber-100 min-w-20">
          發表食記
        </router-link>
        <router-link to="/articlelist" class="p-2 rounded-md text-amber-500 hover:bg-amber-100 min-w-20">
          專欄文章
        </router-link>
      </div>

      <!-- 下拉選單群組 -->
      <div class="flex items-center space-x-4">
        <!-- 店家專區的下拉選單 -->
        <div class="relative inline-block text-left group">
          <button class="p-2 rounded-md text-amber-500 hover:bg-amber-100 focus:outline-none min-w-20 whitespace-nowrap flex items-center">
            店家專區<span class="ml-1">&#x25BC;</span>
          </button>
          <div class="hidden absolute right-0 z-50 w-32 mt-0 bg-white rounded-md shadow-lg group-hover:block">
            <ul class="py-1">
              <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">店家加入</a></li>
              <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">行銷方案</a></li>
              <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">邀請部落客</a></li>
            </ul>
          </div>
        </div>

        <!-- 排行榜的下拉選單 -->
        <div class="relative inline-block text-left group">
          <button class="p-2 rounded-md text-amber-500 hover:bg-amber-100 focus:outline-none min-w-20 whitespace-nowrap flex items-center">
            排行榜<span class="ml-1">&#x25BC;</span>
          </button>
          <div class="hidden absolute right-0 z-50 w-32 mt-0 bg-white rounded-md shadow-lg group-hover:block">
            <ul class="py-1">
              <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">週排行</a></li>
              <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">月排行</a></li>
            </ul>
          </div>
        </div>

        <!-- 會員頭貼 -->
        <div v-if="user.userData" class="relative inline-block text-left group">
          <div class="w-10 h-10 rounded-full cursor-pointer overflow-hidden">
            <img :src="currentProfilePicture" alt="avatar" class="w-full h-full object-cover">
          </div>
          <div class="hidden absolute right-0 z-50 w-36 mt-0 bg-white rounded-md shadow-lg group-hover:block">
            <ul class="py-1">
              <li>
                <router-link to="/user" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">
                  <font-awesome-icon :icon="['fas', 'user']" class="mr-2" />
                  個人檔案
                </router-link>
              </li>
              <li>
                <router-link to="/user" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">
                  <font-awesome-icon :icon="['fas', 'bookmark']" class="mr-2" />
                  珍藏餐廳
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 首頁版本的選單 -->
    <div v-else class="hidden md:flex items-center space-x-4 justify-end">
      <!-- 登入/登出按鈕 -->
      <div class="flex items-center space-x-4">
        <button v-if="!user.userData" 
                class="p-2 rounded-md text-amber-500 hover:bg-amber-100 min-w-20" 
                @click="openLoginModal">
          登入
        </button>
        <button v-else 
                class="p-2 rounded-md text-amber-500 hover:bg-amber-100 min-w-20" 
                @click="user.logout">
          登出
        </button>
        <router-link to="/myarticle" class="p-2 rounded-md text-amber-500 hover:bg-amber-100 min-w-20">
          發表食記
        </router-link>
        <router-link to="/articlelist" class="p-2 rounded-md text-amber-500 hover:bg-amber-100 min-w-20">
          專欄文章
        </router-link>
      </div>

      <!-- 下拉選單群組 -->
      <div class="flex items-center space-x-4">
        <!-- 店家專區的下拉選單 -->
        <div class="relative inline-block text-left group">
          <button class="p-2 rounded-md text-amber-500 hover:bg-amber-100 focus:outline-none min-w-20 whitespace-nowrap flex items-center">
            店家專區<span class="ml-1">&#x25BC;</span>
          </button>
          <div class="hidden absolute right-0 z-50 w-32 mt-0 bg-white rounded-md shadow-lg group-hover:block">
            <ul class="py-1">
              <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">店家加入</a></li>
              <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">行銷方案</a></li>
              <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">邀請部落客</a></li>
            </ul>
          </div>
        </div>

        <!-- 排行榜的下拉選單 -->
        <div class="relative inline-block text-left group">
          <button class="p-2 rounded-md text-amber-500 hover:bg-amber-100 focus:outline-none min-w-20 whitespace-nowrap flex items-center">
            排行榜<span class="ml-1">&#x25BC;</span>
          </button>
          <div class="hidden absolute right-0 z-50 w-32 mt-0 bg-white rounded-md shadow-lg group-hover:block">
            <ul class="py-1">
              <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">週排行</a></li>
              <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">月排行</a></li>
            </ul>
          </div>
        </div>

        <!-- 會員頭貼 -->
        <div v-if="user.userData" class="relative inline-block text-left group">
          <div class="w-10 h-10 rounded-full cursor-pointer overflow-hidden">
            <img :src="currentProfilePicture" alt="avatar" class="w-full h-full object-cover">
          </div>
          <div class="hidden absolute right-0 z-50 w-36 mt-0 bg-white rounded-md shadow-lg group-hover:block">
            <ul class="py-1">
              <li>
                <router-link to="/user" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">
                  <font-awesome-icon :icon="['fas', 'user']" class="mr-2" />
                  個人檔案
                </router-link>
              </li>
              <li>
                <router-link to="/user" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">
                  <font-awesome-icon :icon="['fas', 'bookmark']" class="mr-2" />
                  珍藏餐廳
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* 基本樣式 */
header {
  transition: all 0.3s ease;
}

/* 手機版（小於768px） */
@media (max-width: 767px) {
  header {
    flex-wrap: nowrap;
  }
}
</style>