<script setup>
import {useRouter} from "vue-router"
import axios from "axios";
import { onMounted, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores/storePage";
import StoreComment from "@/components/storeComment/StoreComment.vue";
import Header from "@/components/Header.vue";
import StoreType from "@/components/HomePage/StoreType.vue";
import SearchTag from "@/components/SearchTag.vue";
import SimilarRestaurants from "@/components/storePage/SimilarRestaurants.vue";
import RecommendedRestaurants from "@/components/storePage/RecommendedRestaurants.vue";
import SearchInput from "@/components/SearchInput.vue";
import { useAuth } from "@/stores/authStore";

// const router = useRouter()
const restaurantStore = useStore();
const user = useAuth();
const userData = computed(() => user.userData);
const iconClassic = ref("far");
const hasStore = ref(false)
// 從 store 中解構需要的屬性
const {
  storeName,
  rating,
  userRatingCount,
  startPrice,
  endPrice,
  weekDayDescriptions,
  formattedAddress,
  websiteUri,
  nationalPhoneNumber,
  googleMapsUri,
  openNow,
  storePhoto,
  bannerPhoto,
  staticMapUrl,
  placesId
} = storeToRefs(restaurantStore);

// 下拉選單狀態
const isDropdownVisible = ref(false);

const updateFavorite = async () => {
  if (!userData.value) {
    alert("請登入");
    return;
  }
  const isFavorite = iconClassic.value === "fas";
  iconClassic.value = isFavorite ? "far" : "fas";
  if (!isFavorite) {
    // iconClassic.value = "fas"
    await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/user/favorites/${
        userData.value._id
      }`,
      {
        placeId: restaurantStore.placesId,
      },
    );
  } else {
    // iconClassic.value = "far"
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/user/favorites/delete/${
        userData.value._id
      }`,
      {
        data: {
          placeId: restaurantStore.placesId,
        },
      },
    );
  }
  await user.getUserdata();
};

const checkFavorite = () => {
  if (userData.value) {
    iconClassic.value = userData.value.favorites.includes(
      restaurantStore.placesId,
    )
      ? "fas"
      : "far";
  }
};

const checkStore = async() => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/store/get/${placesId.value}`)
  if(response.status === 200){
    hasStore.value = true
    return
  }else{
    hasStore.value = false
    return
  }
}

// 頁面載入時的初始化
onMounted(async () => {
  try {
    await restaurantStore.fetchPlaceDetail();
    await restaurantStore.fetchStorePhoto();
    await restaurantStore.fetchBannerPhoto();
    await restaurantStore.fetchSimilarRestaurants();
    await restaurantStore.fetchRecommendedRestaurants();
    checkFavorite();
  } catch (error) {
    console.error("數據載入錯誤：", error);
  }
  checkStore();
});

// 點擊頁面其他地方時隱藏下拉選單
function handleDocumentClick(event) {
  const button = document.getElementById("dropdownButton");
  const menu = document.getElementById("dropdownMenu");
  if (!button || !menu) {
    return; // 如果元素不存在，直接退出函數
  }

  if (!button.contains(event.target) && !menu.contains(event.target)) {
    isDropdownVisible.value = false;
  }
}

document.addEventListener("click", handleDocumentClick);
</script>

<template>
  <div>
    <Header />
    <div
      class="fixed top-2 left-1/2 transform -translate-x-1/2 z-40 w-[600px] hidden md:block"
    >
      <SearchInput />
    </div>
    <!-- 橫幅圖片區 -->
    <div class="relative w-full h-48">
      <img 
        v-if="bannerPhoto"
        :src="bannerPhoto"
        alt="Banner"
        class="object-cover w-full h-full"
      />
      <img
        v-else
        src="@/assets/logo.jpg"
        alt="Banner"
        class="object-cover w-full h-full"
      />
      <div
        class="absolute top-0 left-0 w-full h-full bg-gray-800 opacity-25"
      ></div>
    </div>

    <!-- 導航標籤 -->
    <nav id="title" 
      class="flex items-center px-4 space-x-4 overflow-x-auto bg-white shadow md:overflow-visible"
    >
      <a href="#title"><button
        class="px-4 py-4 font-bold border-b-2 border-transparent text-amber-500 hover:border-amber-500 whitespace-nowrap"
      >
        總覽
      </button></a>
      <a href="#comment"><button
        class="px-4 py-4 font-bold border-b-2 border-transparent text-amber-500 hover:border-amber-500 whitespace-nowrap"
      >
        評論
      </button></a>
      <a href="#similar"><button
        class="px-4 py-4 font-bold border-b-2 border-transparent text-amber-500 hover:border-amber-500 whitespace-nowrap"
      >
        相似餐廳
      </button></a>
      <a href="#recommend"><button
        class="px-4 py-4 font-bold border-b-2 border-transparent text-amber-500 hover:border-amber-500 whitespace-nowrap"
      >
        推薦餐廳
      </button></a>
      <a href="#topic"><button
        class="px-4 py-4 font-bold border-b-2 border-transparent text-amber-500 hover:border-amber-500 whitespace-nowrap"
      >
        精選主題
      </button></a>
    </nav>

    <!-- 主要內容區 -->
    <div class="w-full max-w-[1024px] mx-auto bg-white mt-14 px-4 md:px-6 py-4">
      <!-- 店家基本資訊 -->
      <div
        class="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-y-0 md:space-x-4"
      >
        <img
          :src="storePhoto"
          alt="Store Thumbnail"
          class="object-cover w-40 h-32 rounded-lg"
        />
        <div class="space-y-2 text-center md:text-left">
          <div class="relative flex">
            <h2 class="py-1 text-3xl font-black text-gray-700 mr">
              {{ storeName }}
            </h2>
            <button
              @click="updateFavorite"
              class="absolute right-[-25px] top-3 flex items-center"
            >
              <font-awesome-icon
                :icon="[iconClassic, 'bookmark']"
                size="xl"
                style="color: orange"
              />
            </button>
          </div>
          <div
            class="flex flex-wrap items-center justify-center gap-3 md:justify-start"
          >
            <span class="px-2 py-1 bg-orange-600 rounded-2xl text-yellow-50"
              >{{ rating }} ★</span
            >
            <a href="#"
              ><span class="text-gray-400">{{ userRatingCount }}則評論</span></a
            >
          </div>
          <div
            class="flex flex-wrap justify-center gap-3 py-2 md:justify-start"
          >
            <a
              v-if="startPrice != null && endPrice != null"
              class="text-black rounded"
              >均消價位：{{ `${startPrice}-${endPrice}` }}元</a
            >
            <a v-else class="text-black rounded">均消價位：未提供</a>
            <!-- <a href="#" class="text-blue-400 rounded"><font-awesome-icon :icon="['fas', 'star']" />找相似餐廳</a>
                        <a href="#" class="hover:text-amber-500">火鍋</a>
                        <a href="#" class="hover:text-amber-500">日本料理</a>
                        <a href="#" class="hover:text-amber-500">咖哩</a>
                        <a href="#" class="hover:text-amber-500">合菜</a> -->
          </div>
        </div>
      </div>

      <!-- 店家詳情區 -->
      <div class="flex items-center mt-10 space-x-4">
        <!-- 地圖和評價 -->
        <div class="flex flex-col">
          <a
            :href="googleMapsUri"
            target="_blank"
            class="cursor-pointer hover:opacity-90"
          >
            <img
              :src="staticMapUrl"
              alt="formattedAddress"
              class="object-cover w-40 h-40 rounded-lg"
            />
          </a>
          <a
            :href="googleMapsUri"
            target="_blank"
            class="cursor-pointer hover:opacity-90"
          >
            <div class="w-40 mt-2">
              <div
                class="flex items-center justify-center py-1 mb-1 rounded bg-amber-500"
              >
                <font-awesome-icon
                  :icon="['fab', 'google']"
                  class="w-4 h-4 mr-1 text-blue-600"
                />
                <div class="flex items-center">
                  <span class="text-sm">評價:</span>
                  <span class="text-sm text-gray-500"
                    >{{ userRatingCount }}+</span
                  >
                </div>
              </div>
            </div>
          </a>
        </div>

        <!-- 店家資訊 -->
        <div class="space-y-2">
          <!-- 營業時間下拉選單 -->
          <div class="relative inline-block ml-12">
            <button
              id="dropdownButton"
              class="p-2 font-bold rounded-md text-amber-500 hover:bg-amber-100 focus:outline-none"
              @click="isDropdownVisible = !isDropdownVisible"
            >
              {{ openNow ? "目前營業中" : "目前休息中" }}
              <span class="ml-1">&#x25BC;</span>
            </button>
            <div
              id="dropdownMenu"
              v-if="isDropdownVisible"
              class="absolute z-10 w-48 transform -translate-x-1/2 bg-white rounded-md shadow-lg left-1/2"
            >
              <ul class="mt-1">
                <li>
                  <a
                    href="#"
                    class="block p-2 text-amber-500 hover:bg-amber-100"
                    >{{ weekDayDescriptions[0] }}</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="block p-2 text-amber-500 hover:bg-amber-100"
                    >{{ weekDayDescriptions[1] }}</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="block p-2 text-amber-500 hover:bg-amber-100"
                    >{{ weekDayDescriptions[2] }}</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="block p-2 text-amber-500 hover:bg-amber-100"
                    >{{ weekDayDescriptions[3] }}</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="block p-2 text-amber-500 hover:bg-amber-100"
                    >{{ weekDayDescriptions[4] }}</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="block p-2 text-amber-500 hover:bg-amber-100"
                    >{{ weekDayDescriptions[5] }}</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="block p-2 text-amber-500 hover:bg-amber-100 rounded-bl-md rounded-br-md"
                    >{{ weekDayDescriptions[6] }}</a
                  >
                </li>
              </ul>
            </div>
          </div>
          <p>店家地址 | {{ formattedAddress }}</p>
          <p v-if="startPrice != null && endPrice != null">
            均消價位 | {{ `${startPrice}-${endPrice}` }}元
          </p>
          <p v-else>均消價位 | 未提供</p>
          <p id="comment" >
            訂位電話 |
            {{ nationalPhoneNumber != null ? nationalPhoneNumber : "未提供" }}
          </p>
          <a v-if="websiteUri" :href="websiteUri">
            <button class="p-2 mt-6 mr-4 rounded-lg shadow">
              <font-awesome-icon
                :icon="['fas', 'calendar-week']"
                class="w-5 h-5 mr-2 text-amber-500"
              />相關連結
            </button>
          </a>
          <button class="p-2 mt-6 mr-4 rounded-lg shadow">
            <font-awesome-icon
              :icon="['fas', 'arrow-up-from-bracket']"
              class="w-5 h-5 mr-2 text-amber-500"
            />分享餐廳
          </button>
          <a :href="googleMapsUri">
            <button class="p-2 mt-6 rounded-lg shadow">
              <font-awesome-icon
                :icon="['fas', 'arrow-up-from-bracket']"
                class="w-5 h-5 mr-2 text-amber-500"
              />google評價
            </button>
          </a>

          <router-link :to="{ name: 'storecart', params: { storeId: placesId } }" v-if="hasStore">
            <button class="p-2 mt-6 mx-4 rounded-lg shadow text-amber-500">
              訂餐
            </button>
          </router-link>
        </div>
      </div>

      <!-- 店家評論 -->
      <StoreComment />
      <div class="w-full max-w-[800px] mx-auto">
        <!-- 相似餐廳區 -->
        <SimilarRestaurants />

        <!-- 推薦餐廳部分 -->
        <RecommendedRestaurants />
      </div>
      <!-- 熱門餐廳分類 -->
      <div class="mt-10 text-gray-700">
        <StoreType />
      </div>
    </div>
  </div>
</template>
