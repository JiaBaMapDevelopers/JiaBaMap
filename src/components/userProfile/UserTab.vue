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
      <h2 class="mt-4 font-bold text-left text-amber-500">我寫的食記</h2>
      <!-- 文章列表 -->
      <!-- <div v-if="articles.length > 0" class="space-y-4">
        <div
          v-for="article in articles"
          :key="article.id"
          class="p-4 transition-shadow duration-200 bg-white rounded-lg shadow-xl hover:shadow-2xl"
          :class="{
            'cursor-pointer': route.query.status == 'published' && 'draft',
          }"
          @click="
            route.query.status === 'published'
              ? editPublishedArticle(article._id)
              : editDraft(article)
          "
        >
          <div class="flex items-start justify-between">
            <div>
              <h2 class="mb-2 text-xl font-semibold">
                {{ article.title || "無標題" }}
              </h2>
              <p class="mb-2 text-gray-600">
                {{ article.restaurantName || "未指定餐廳" }}
              </p>
              <p class="text-sm text-gray-500">
                {{
                  route.query.status === "published"
                    ? "發佈時間"
                    : "最後編輯時間"
                }}：
                {{ new Date(article.createdAt).toLocaleString() }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="my-2 text-base font-bold text-gray-500">暫無食記！</p>
      </div> -->
    </div>

    <!-- 我的珍藏 -->
    <div v-show="activeTab === 'keep'">
      <h2 class="mt-4 font-bold text-left text-amber-500">我收藏的餐廳</h2>
      <KeepList />
    </div>

    <!-- 餐廳評論 -->
    <div v-show="activeTab === 'review'">
      <h2 class="mt-4 font-bold text-left text-amber-500">我留下的評論</h2>
      <div v-if="myComment.length > 0">
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
      <div v-else>
        <p class="my-2 text-base font-bold text-gray-500">暫無評論！</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, ref, onMounted } from "vue";
import KeepList from "./KeepList.vue";
import { useAuth } from "../../stores/authStore";
import { useStore } from "../../stores/storePage";
import { useRoute } from "vue-router";

const route = useRoute();
const activeTab = ref("review");
const user = useAuth();
const store = useStore();
const clickReview = () => (activeTab.value = "review");
const clickArticle = () => (activeTab.value = "article");
const clickKeep = () => (activeTab.value = "keep");
const userData = computed(() => user.userData);
const myComment = ref([]);
const auth = useAuth();
const articles = ref([]);

const getMyComment = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/comments/user/${userData.value._id}`,
  );
  myComment.value = response.data;
  console.log(myComment.value);
};
// 從資料庫讀取已發布文章
const loadPublishedArticles = async () => {
  try {
    if (!auth.userData?._id) {
      await swalWithBootstrapButtons.fire({
        title: "提醒",
        text: "請先登入後再查看已發佈文章",
        icon: "warning",
        confirmButtonText: "確定",
      });
      return;
    }

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/articles/published/${auth.userData._id}`,
    );
    articles.value = response.data;
  } catch (error) {
    console.error("載入已發佈文章時發生錯誤:", error);
    await swalWithBootstrapButtons.fire({
      title: "錯誤",
      text: "載入已發佈文章失敗，請稍後再試",
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};

onMounted(() => {
  getMyComment();
  // loadPublishedArticles();
});
</script>
