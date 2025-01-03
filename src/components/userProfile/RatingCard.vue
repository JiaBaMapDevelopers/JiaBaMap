<script setup>
import { computed, ref } from "vue";
import Loader from "../Loader.vue";
import axios from "axios";
import debounce from "lodash/debounce";
import Swal from 'sweetalert2';

let restaurants = ref(null);
let restaurantImg = ref([]);
let restaurantUrl = ref([]);
let userLocation = ref("");
let lastLatLng = ref(""); // 最近的經緯度，避免位置重複請求

// 確認使用者裝置能不能抓地點
if(navigator.geolocation) {
  function error(err) {
    Swal.fire({
      title: 'Error!',
      text: '無法取得你的位置',
      icon: 'error',
      confirmButtonText: '好'
    })
  }

  const fetchLocationData = debounce(async (lat, lng) => {
    if (lastLatLng.value === `${lat},${lng}`) return;

    lastLatLng.value = `${lat},${lng}`;
    const keyword = "餐廳";
    let storeUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/restaurants/search?keyword=${keyword}&lat=${lat}&lng=${lng}`;

    try {
      const restaurantsRes = await axios.get(storeUrl)
      restaurants.value = restaurantsRes.data;

      if(restaurants.value && restaurants.value.length > 0){
        const imageIds = restaurants.value.map(r => r.photoId);
        const restaurantIds = restaurants.value.map(r => r.id);
        const [images, urls] = await Promise.all([
          fetchImgs(imageIds),
          fetchUrls(restaurantIds),
        ]);

        restaurantImg.value = images;
        restaurantUrl.value = urls;

        //目前區域
        userLocation.value = restaurants.value[0].address.substr(5, 6)
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: '無法載入餐廳資料，請稍後再試',
        icon: 'error',
        confirmButtonText: '好'
    })
    }
  }, 3000) // 設定防抖時間，3s內重複觸發只會請求一次

  // 允許抓目前位置，回傳經緯度
  async function success(position) {
    let lat = position.coords.latitude
    let lng = position.coords.longitude
    try{
      fetchLocationData(lat, lng);
    } catch (err) {
      console.log('Error fetching location data:', err);
    }
    
  }
  // 跟使用者拿所在位置的權限
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  Swal.fire({
      title: 'Error!',
      text: '你的裝置不支援地理位置功能',
      icon: 'error',
      confirmButtonText: '好'
  })
}

async function fetchImgs(imageId) {
  try {
    const promises = imageId.map(async (id) => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/restaurants/photos/${id}`, {
        responseType: 'blob'
      })
      const objectUrl = URL.createObjectURL(response.data);
      return objectUrl;
    })
    const imageUrls = await Promise.all(promises)
    return imageUrls
  } catch (err) {
    Swal.fire({
      title: 'Error!',
      text: '載入圖片錯誤，請稍後再試',
      icon: 'error',
      confirmButtonText: '好'
  })
  }
}

async function fetchUrls(restaurantId){
  try {
    const promises = restaurantId.map(async (id) => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/restaurants/${id}`)
      return response.data.googleMapsUri
    })
    const urls = await Promise.all(promises)
    return urls
  } catch (err) {
    console.log(err)
  }
}

const getRankImage = computed(() => {
  return (rank) => {
    if (rank <= 3) {
      return `/image/top${rank}.png`;
    }
  };
});

</script>

<template>
  <div class="box-border w-full h-screen pt-2 mt-2 overflow-y-auto sm:w-72 scrollbar-hide">
    <h1 class="text-2xl font-bold text-amber-500">熱門餐廳排行榜</h1>
    <div v-if="restaurants">
      <p class="text-gray-500">目前所在地：{{ userLocation }}</p>
      <div
        v-for="(item, index) in restaurants" 
        :key="index"
        class="relative flex items-center gap-3 pb-2 mt-8"
      >
        <!-- 排名圖 -->
        <div class="absolute w-10 h-10 -top-4" v-if="index < 3">
          <img :src="getRankImage(index+1)" alt="店家排名">
        </div>
        <!-- 餐廳圖 -->
        <div class="relative w-32 h-32 overflow-hidden">
          <img
            v-if="restaurantImg[index]"
            :src="restaurantImg[index]"
            alt="Restaurant Image"
            class="absolute inset-0 object-cover w-full h-full rounded-md"
          >
          <img
            v-else
            src="/placeholder.jpg"
            alt="Placeholder"
            class="absolute inset-0 object-cover w-full h-full rounded-md"
          >
        </div>
        <!-- 餐廳排名、名稱 -->
        <div class="flex flex-col justify-between flex-shrink-0 w-40 sm:text-xl">
          <div>
            <h2 class="text-base font-bold text-gray-500 truncate">
              {{ index+1 }}. 
              <a class="text-amber-500 hover:text-orange-300" :href="restaurantUrl[index]" target="_blank">{{ item.name }}</a>
            </h2>
          </div>
          <!-- 餐廳內容 -->
          <div class="flex flex-row items-center mt-3 space-x-1 text-center">
            <div class="flex items-center px-2 py-1 space-x-1 text-center text-white bg-orange-600 rounded-2xl">
              <p class="text-sm">{{ item.rating }}</p>
              <font-awesome-icon :icon="['fas', 'star']" class="text-xs" />
            </div>
            <p class="text-sm font-light">評論: {{ item.userRatingCount }} 則</p>
          </div>
          <p class="mt-2 text-sm">均消: {{ item.startPrice }} - {{ item.endPrice }}</p>
          <div class="flex items-center mt-2 text-sm">
            <span class="mr-2 text-center text-green-600">
              <font-awesome-icon :icon="['fas', 'circle']" style="font-size: 8px;" />
            </span>
            <p class="font-bold">{{ item?.openNow ? '營業中' : '已打烊' }}</p>
          </div>  
        </div>
      </div>
    </div>
    <div v-else>
      <Loader />
      <p class="font-bold text-center text-amber-500">載入中...</p>
    </div>
  </div>
</template>