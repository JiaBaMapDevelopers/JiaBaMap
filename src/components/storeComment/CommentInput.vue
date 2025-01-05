<script setup>
import axios from "axios";
import { ref, computed } from "vue";
import Stars from "./Stars.vue";
import UploadPic from "./UploadPic.vue";
import { useStarsStore } from "../../stores/starStore";
import { useCommentStore } from "../../stores/commentStore";
import { usePicStore } from "../../stores/picStore";
import { useAuth } from "@/stores/authStore";
import { useStore } from "@/stores/storePage";
import Login from "@/components/Login.vue";
import PreviousReview from "@/components/storeComment/PreviousReview.vue";

const user = useAuth();
const store = useStore();
const userData = computed(() => user.userData);

const time = new Date();
const price = ref("");
const commentText = ref("");
let isExpanded = ref(false);

// 引入 Pinia Store
const starsStore = useStarsStore();
const commentStore = useCommentStore();
const picStore = usePicStore();

const submitComment = async () => {
  if (!commentText.value.trim()) {
    alert("請輸入評論");
    return;
  }

  const formData = new FormData();

  formData.append("userId", userData.value._id); // 用戶 ID
  formData.append("placeId", store.placesId); // 餐廳 ID
  formData.append("content", commentText.value.trim()); // 評論內容
  formData.append("rating", starsStore.selectIndex); // 評分
  formData.append("AvgPrice", price.value); // 用餐價格

  if (picStore.files.length > 0) {
    picStore.files.forEach((file) => {
      formData.append("photos", file); // "files" 是後端字段名
    });
  }

  await axios.post(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/comments/`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  // commentStore.addComment(newComment); // 使用 Pinia Store 更新評論
  //重置輸入框
  commentText.value = "";
  price.value = "";
  picStore.resetPic(); // 重置圖片
  starsStore.resetStars(); // 重置星星狀態
  commentStore.getComment();
};

const openComment = () => {
  isExpanded.value = !isExpanded.value;
};

const showLoginModal = ref(false); // 是否顯示登錄小畫面

// 開啟登錄小畫面
const openLoginModal = () => {
  showLoginModal.value = true;
};

// 關閉登錄小畫面
const closeLoginModal = () => {
  showLoginModal.value = false;
};
</script>

<template>
  <Login :visible="showLoginModal" @close="closeLoginModal" />
  <div class="flex gap-5 mb-4">
    <div class="flex-shrink-0 w-16 h-16 rounded-full bg-slate-300">
      <img
        src="../../assets/default_user.png"
        alt="avatar"
        class="w-full h-auto overflow-hidden"
      />
    </div>
    <div class="flex flex-1 md:flex-none md:basis-2/3">
      <div class="w-full text-left md:w-96">
        <button
          @click="openComment"
          class="p-2 border-2 border-solid rounded-lg border-amber-500 text-amber-500"
        >
          留下您對餐廳的評論
        </button>
        <Stars class="my-2" />
        <div class="flex flex-col relative" v-if="isExpanded">
          <div v-if="userData">
            <textarea
              v-model="commentText"
              maxlength="200"
              class="w-full h-20 border-2 border-solid rounded-sm resize-none"
              placeholder="發表用餐經驗"
            ></textarea>
            <p v-if="commentText.length >= 1" class="text-sm text-slate-500">
              還可以輸入 {{ 200 - commentText.length }} 字
            </p>
            <div class="flex items-center w-full h-10 my-2">
              <input
                type="number"
                v-model="price"
                placeholder="輸入用餐價格"
                class="flex-1 h-10 border-2 border-solid rounded-sm"
              />
              <label class="ml-2">元 / 人</label>
            </div>
            <UploadPic />
            <button
              @click="submitComment"
              class="w-full p-2 my-2 font-bold rounded-lg shadow md:flex-1 text-amber-500"
            >
              送出評論
            </button>
          </div>
          <div
            v-else
            class="flex justify-center items-center bg-white h-[100px] w-[250px] border-gray-400 border-2 rounded-xl"
          >
            <p class="font-black">
              請先<button class="m-2 text-orange-400" @click="openLoginModal">
                登入</button
              >以留下您的評論!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 隱藏數字輸入框的小箭頭 */
/* Chrome, Safari, Edge, Opera */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type="number"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
