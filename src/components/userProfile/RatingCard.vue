<script setup>
import { computed, ref, TrackOpTypes } from "vue";
import { useRouter } from "vue-router";
import { useKeywordStore } from "@/stores/keywordStore";
import Loader from "@/components/Loader.vue";
import axios from "axios";

let restaurants = ref(null)
let imageResponse = ref([])
let userLocation = ref("")

// 先確認使用者裝置能不能抓地點
if(navigator.geolocation) {
  function error() {
    alert('無法取得你的位置');
  }
  // 使用者允許抓目前位置，回傳經緯度
  async function success(position) {
    let lat = position.coords.latitude
    let lng = position.coords.longitude
    const keyword = "餐廳"

    let storeUrl = `http://localhost:3000/restaurants/search?keyword=${keyword}&lat=${lat}&lng=${lng}`
    await fetchRestaurants(storeUrl)

    //取得目前區域
    userLocation.value = restaurants.value[0].address.substr(5, 6)
    // 把圖片id拿出來
    const imageId = ref([])
    restaurants.value.forEach(element => {
      imageId.value.push(element.photoId)
    })

    // 抓餐廳圖片
    imageResponse.value = await fetchImgs(imageId.value)
  }
  // 跟使用者拿所在位置的權限
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  alert('Sorry, 你的裝置不支援地理位置功能。')
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192; // 每次處理的字節數，根據需要調整

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return window.btoa(binary);
}


async function fetchImgs(imageId) {
  try {
    const promises = imageId.map(async (id) => {
      const response = await axios.get(`http://localhost:3000/restaurants/photos/${id}`, {
        responseType: 'arraybuffer' // 確保響應是二進制數據
      })
      if (response) {
        const base64Image = response.data ? arrayBufferToBase64(response.data) : null;
        return `data:image/jpeg;base64,${base64Image}`
      } else {
        return null
      }
    })
    const imageUrls = await Promise.all(promises)
    return imageUrls
  } catch (err) {
    console.error(err)
  }
}

async function fetchRestaurants(url){
  try{ // 抓15間餐廳
    const response = await axios.get(url)
    restaurants.value = response.data
    return restaurants
  } catch (err) {
    console.error(err)
  }
}

const router = useRouter()
const keywordStore = useKeywordStore()

const navigateToSearch = (tag) => {
  keywordStore.navigateToSearch(router, tag)
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
    <div v-if="restaurants && imageResponse">
      <p>目前所在地：{{ userLocation }}</p>
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
            v-if="imageResponse[index]"
            :src="imageResponse[index]"
            alt="Restaurant Image"
            class="absolute inset-0 object-cover w-full h-full rounded-md"
          >
        </div>
        <!-- 餐廳排名、名稱 -->
        <div class="flex flex-col justify-between w-3/5 sm:text-xl">
          <div>
            <h2 class="text-base font-bold text-gray-500">
              {{ index+1 }}. 
              <a href="#" class="text-amber-500 hover:text-orange-300">{{ item.name }}</a>
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
          <!-- 需判斷是否營業 -->
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
      <p class="font-bold text-center text-amber-500">Loading...</p>
    </div>
  </div>
</template>
