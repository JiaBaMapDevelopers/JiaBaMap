<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useAuth } from "@/stores/authStore";
import { useStore } from "@/stores/storePage";

const user = useAuth();
const Store = useStore();
const { userData } = user;
const dataReady = ref(false);
const restaurants = ref([]);

const getDetails = async () => {
  const placeIds = userData.favorites;
  const response = await Promise.all(
    placeIds.map((placeId) =>
      axios.get(`http://localhost:3000/restaurants/${placeId}`),
    ),
  );
  restaurants.value = response.map((response) => response.data);
  dataReady.value = true;
};

const photos = (photoId) => {
  return `${
    import.meta.env.VITE_BACKEND_BASE_URL
  }/restaurants/photos/${photoId}`;
};

const StoreId = (placeId) => {
  Store.StoreId(placeId);
};

onMounted(() => {
  getDetails();
});
</script>

<template>
  <div v-if="dataReady">
    <div
      class="box-border w-full my-4 overflow-y-auto"
      v-if="restaurants.length > 0"
    >
      <div
        v-for="(restaurant, index) in restaurants"
        :key="restaurant.id || index"
        class="flex items-center pb-2 mt-2 border-b"
      >
        <!-- 餐廳圖 -->
        <div class="w-32 h-32 overflow-hidden">
          <img
            :src="photos(restaurant.photoIds[0])"
            class="object-cover w-full h-full rounded-md"
          />
        </div>
        <!-- 餐廳排名、名稱 -->
        <div class="flex flex-col justify-between gap-1 sm:text-xl">
          <div class="ml-3 text-left">
            <h2 class="text-base font-bold text-gray-500">
              <a href="#" @click="StoreId(restaurant.placeId)">{{
                restaurant.displayName
              }}</a>
            </h2>
          </div>
          <!-- 餐廳內容 -->
          <div class="flex mt-3 ml-3 text-xs">
            <div
              class="items-center px-2 mr-2 text-white bg-orange-600 rounded-2xl"
            >
              <p>
                {{ restaurant.rating }}
                <font-awesome-icon :icon="['fas', 'star']" />
              </p>
            </div>

            <p class="mr-2 font-light">
              (評論數: {{ restaurant.userRatingCount }})
            </p>
            <p
              v-if="restaurant.startPrice && restaurant.endPrice"
              class="mr-2 font-bold"
            >
              均消: {{ restaurant.startPrice }} ~ {{ restaurant.endPrice }}
            </p>
            <p v-else class="mr-2 font-bold">均消: 未提供</p>
          </div>

          <!-- 需判斷是否營業 -->
          <div class="items-center hidden mx-3 mt-3 text-sm md:flex">
            <!-- <span class="mr-2 text-center text-green-600">
                            <font-awesome-icon :icon="['fas', 'circle']" style="font-size: 8px;" />
                        </span> -->
            <!-- <p>營業時間: {{ restaurant.openingHours }}</p> -->
            <p>地址: {{ restaurant.formattedAddress }}</p>
          </div>

          <div class="flex flex-wrap items-center mt-3 ml-3">
            <!-- <span>
                            <a href="#" 
                               class="items-center hidden px-3 py-1 mb-1 mr-2 text-sm bg-gray-200 rounded-full md:block">
                                <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" class="text-orange-400"/>
                                 相似餐廳
                            </a>
                        </span>

                        <span>
                            <a href="#" 
                               class="items-center hidden px-3 py-1 mb-1 mr-2 text-sm bg-gray-200 rounded-full md:block">
                                <font-awesome-icon :icon="['fas', 'location-dot']" class="text-orange-400"/>
                                 附近                 
                            </a>
                        </span>

                        <span>
                            <a href="#"
                                v-for="tag in restaurant.tags" 
                                :key="`${restaurant.name}-${tag}`" 
                                class="items-center inline-block px-3 py-1 mb-1 mr-2 text-sm bg-gray-200 rounded-full"
                            >
                            {{ tag }}
                            </a>
                        </span> -->
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="my-2 text-base font-bold text-gray-500">目前沒有收藏的餐廳！</p>
    </div>
  </div>
</template>
