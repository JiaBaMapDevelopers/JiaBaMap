<template>
  <div>
    <!-- tab選單 -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <ul
        class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400"
      >
        <li class="flex-1">
          <a
            @click="clickReview"
            :class="[
              'inline-flex items-center justify-center w-full p-4 border-b-2 rounded-t-lg cursor-pointer group',
              // 當 activeTab 是 review 時，套用 text-amber-500 和 border-amber-500
              activeTab === 'review'
                ? 'text-amber-500 border-amber-500'
                : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
            ]"
          >
            <font-awesome-icon
              :icon="['fas', 'bowl-food']"
              :class="[
                'w-4 h-4 me-2',
                // 當 activeTab 是 review 時，圖示顏色變為 amber-500
                activeTab === 'review'
                  ? 'text-amber-500'
                  : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300',
              ]"
              aria-hidden="true"
            />餐廳評論
          </a>
        </li>
        <li class="flex-1">
          <a
            @click="clickArticle"
            :class="[
              'inline-flex items-center justify-center w-full p-4 border-b-2 rounded-t-lg cursor-pointer group',
              // 當 activeTab 是 article 時，套用 text-amber-500 和 border-amber-500
              activeTab === 'article'
                ? 'text-amber-500 border-amber-500'
                : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
            ]"
          >
            <font-awesome-icon
              :icon="['fas', 'star-half-stroke']"
              :class="[
                'w-4 h-4 me-2',
                // 當 activeTab 是 article 時，圖示顏色變為 amber-500
                activeTab === 'article'
                  ? 'text-amber-500'
                  : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300',
              ]"
              aria-hidden="true"
            />所有食記
          </a>
        </li>
        <li class="flex-1">
          <a
            @click="clickKeep"
            :class="[
              'inline-flex items-center justify-center w-full p-4 border-b-2 rounded-t-lg cursor-pointer group',
              // 當 activeTab 是 keep 時，套用 text-amber-500 和 border-amber-500
              activeTab === 'keep'
                ? 'text-amber-500 border-amber-500'
                : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
            ]"
          >
            <font-awesome-icon
              :icon="['fas', 'bookmark']"
              :class="[
                'w-4 h-4 me-2',
                // 當 activeTab 是 keep 時，圖示顏色變為 amber-500
                activeTab === 'keep'
                  ? 'text-amber-500'
                  : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300',
              ]"
              aria-hidden="true"
            />我的珍藏
          </a>
        </li>
      </ul>
    </div>
    <!-- tab 內容 -->
    <!-- 所有食記 -->
    <div v-show="activeTab === 'article'">
      <h2>最新食記</h2>
      <p>暫無食記</p>
    </div>

    <!-- 我的珍藏 -->
    <div v-show="activeTab === 'keep'">
      <KeepList />
    </div>

    <!-- 餐廳評論 -->
    <div v-show="activeTab === 'review'">
      <h2 class="my-8 font-bold text-left text-amber-500">我留下的評論</h2>
      <!-- <PreviousReview/> -->
      <div
        class="flex flex-row gap-x-5 py-2.5 w-full max-w-screen-lg mx-auto md:px-0"
        v-for="(comment, index) in myComment"
        :key="index"
      >
        <div
          class="flex-shrink-0 w-16 h-16 overflow-hidden rounded-full bg-slate-300"
        >
          <img
            :src="
              userData.profilePicture
                ? userData.profilePicture
                : '/src/assets/default_user.png'
            "
            alt="avatar"
            class="object-cover w-full h-full"
          />
        </div>
        <div class="flex flex-col flex-1 w-0 text-left">
          <div class="font-bold cursor-pointer text-amber-500">
            <button @click="store.StoreId(comment.placeId)">
              {{ userData.name }}
            </button>
          </div>
          <div class="flex gap-3">
            <span
              v-if="comment.rating"
              class="px-2 py-1 text-sm font-bold text-white rounded-full bg-amber-500"
              >{{ comment.rating }}.0 ★</span
            >
            <p v-if="comment.AvgPrice">均消價位：${{ comment.AvgPrice }}</p>
          </div>
          <p class="text-slate-500">
            評論日期：{{ comment.createdAt.slice(0, 10) }}
          </p>
          <p class="my-3">{{ comment.content }}</p>
          <div
            class="flex gap-4 mt-4 overflow-x-auto scrollbar-hide"
            style="scroll-snap-type: x mandatory"
          >
            <!-- <div
            v-for="(imageUrl, index) in comment.photos"
            :key="index"
            class="flex-shrink-0 w-32 h-32 overflow-hidden"
          >
            <img
              :src="imageUrl"
              @click="showPopup(imageUrl)"
              class="object-cover w-full h-full cursor-pointer"
            />
          </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, ref, onMounted } from "vue";
import KeepList from "./KeepList.vue";
import PreviousReview from "@/components/storeComment/PreviousReview.vue";
import { useAuth } from "../../stores/authStore";
import { useStore } from "../../stores/storePage";
const activeTab = ref("review");
const user = useAuth();
const store = useStore();
const clickReview = () => (activeTab.value = "review");
const clickArticle = () => (activeTab.value = "article");
const clickKeep = () => (activeTab.value = "keep");
const userData = computed(() => user.userData);
const myComment = ref([]);

const getMyComment = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/comments/user/${userData.value._id}`,
  );
  myComment.value = response.data;
  console.log(myComment.value);
};

onMounted(() => {
  getMyComment();
});
</script>
