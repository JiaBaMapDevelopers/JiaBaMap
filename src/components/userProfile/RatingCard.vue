<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useKeywordStore } from "@/stores/keywordStore";

const restaurants = ref([
  {
    rank: 1,
    name: "麻的 小辛辣｜麻辣干鍋 台中美村店",
    rating: 4.9,
    reviews: 20,
    cost: 600,
    openingHours: "12:00-14:30, 16:00-22:00",
    keyword: "晚餐",
    imageUrl: "/image/麻的小辛辣.jpg"
  },
  {
    rank: 2,
    name: "麻的 小辛辣｜麻辣干鍋 台中美村店",
    rating: 4.8,
    reviews: 10,
    cost: 500,
    openingHours: "12:00-14:30, 16:00-22:00",
    keyword: "咖啡",
    imageUrl: "/image/麻的小辛辣.jpg"
  },
  {
    rank: 3,
    name: "麻的 小辛辣｜麻辣干鍋 台中美村店",
    rating: 4.7,
    reviews: 20,
    cost: 400,
    openingHours: "12:00-14:30, 16:00-22:00",
    keyword: "燒肉",
    imageUrl: "/image/麻的小辛辣.jpg"
  },
  {
    rank: 4,
    name: "麻的 小辛辣｜麻辣干鍋 台中美村店",
    rating: 4.7,
    reviews: 20,
    cost: 600,
    openingHours: "12:00-14:30, 16:00-22:00",
    keyword: "pizza",
    imageUrl: "/image/麻的小辛辣.jpg"
  },
  {
    rank: 5,
    name: "麻的 小辛辣｜麻辣干鍋 台中美村店",
    rating: 4.7,
    reviews: 20,
    cost: 700,
    openingHours: "12:00-14:30, 16:00-22:00",
    keyword: "中餐",
    imageUrl: "/image/麻的小辛辣.jpg"
  }
]);

const getRankImage = computed(() => {
  return (rank) => {
    if (rank <= 3) {
      return `/image/top${rank}.png`;
    }
    return null;
  };
});

const router = useRouter()
const keywordStore = useKeywordStore()

const navigateToSearch = (tag) => {
  keywordStore.navigateToSearch(router, tag)
}

</script>

<template>
  <div class="box-border w-full h-screen pt-2 mt-2 overflow-y-auto sm:w-72">
    <div>
      <h1 class="mx-3 text-2xl font-bold text-amber-500">熱門餐廳</h1>
    </div>
    <div 
      v-for="(item, index) in restaurants" 
      :key="index" 
      class="relative flex items-center pb-2 mt-10"
    >    
       <!-- 排名圖 -->
       <div class="absolute w-10 h-10 -top-4 left-3" v-if="getRankImage(item.rank)">
        <img :src="getRankImage(item.rank)" alt="店家排名">
      </div>
      <!-- 餐廳圖 -->
      <div class="w-32 h-32 sm:w-28 sm:h-24">
        <img
          :src="item.imageUrl" 
          class="object-cover w-full h-full mx-3 rounded-md"
        >
      </div>
      <!-- 餐廳排名、名稱 -->
      <div class="flex flex-col justify-between ml-3 sm:text-xl">
        <div class="ml-3">
          <h2 class="text-base font-bold text-gray-500 sm:text-xs">
            {{ item.rank }}. 
            <a href="#" class="text-amber-500 hover:text-orange-300">{{ item.name }}</a>
          </h2>
        </div>
        <!-- 餐廳內容 -->
        <div class="flex flex-row items-center mt-3 ml-3 space-x-1 text-center">

          <div class="flex items-center w-12 h-6 px-2 space-x-1 text-center text-white bg-red-600  rounded-2xl">
            <p class="text-xs">{{ item.rating }}</p>
            <font-awesome-icon :icon="['fas', 'star']" class="text-xs" />
          </div>

          <p class="font-light sm:text-xs">(評論數: {{ item.reviews }})</p>
          
        </div>
        <!-- 需判斷是否營業 -->
        <div class="flex items-center mx-3 mt-3 text-sm sm:hidden">
          <span class="mr-2 text-center text-green-600">
            <font-awesome-icon :icon="['fas', 'circle']" style="font-size: 8px;" />
          </span>
          <p>營業時間: {{ item.openingHours }}</p>
        </div>

        <div class="flex items-center mt-3 ml-3">
          <div class="px-2 mx-1 text-base bg-gray-200 rounded-full sm:text-xs ">
            <a href="#"
              class="text-xs"
              @click="navigateToSearch(item.keyword)"
            >
            {{ item.keyword }}
            </a>
          </div>
          <div>
            <p class="font-bold  sm:text-xs">均消: {{ item.cost }}</p>
          </div>
        </div>    
      </div>
    </div>
  </div>
</template>
