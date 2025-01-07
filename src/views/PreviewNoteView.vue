<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const note = ref({
  date: "",
  title: "",
  content: "",
  restaurantName: "",
  fileList: [],
});

// 在元件掛載時執行
onMounted(() => {
  // 根據路由參數選擇正確的 storage key
  const storageKey =
    route.query.type === "published"
      ? "publishedPreviewData"
      : "previewNoteData";

  const previewData = localStorage.getItem(storageKey);
  if (previewData) {
    note.value = JSON.parse(previewData);
  }
});

// 在組件卸載時清理
onUnmounted(() => {
  // 如果用戶直接關閉頁面，也要確保數據能夠恢復
  const tempFormData = localStorage.getItem("tempFormData");
  if (tempFormData) {
    localStorage.setItem("formData", tempFormData);
    localStorage.removeItem("tempFormData");
  }
  localStorage.removeItem("previewNoteData");
});

// 返回編輯頁面
const backToEdit = () => {
  // 恢復原始數據
  const tempFormData = localStorage.getItem("tempFormData");
  if (tempFormData) {
    localStorage.setItem("formData", tempFormData);
    localStorage.removeItem("tempFormData");
  }

  // 返回編輯頁面
  router.push("/createnote");
};
</script>
<template>
  <div class="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
    <h1 class="mb-6 text-2xl font-bold text-center text-gray-800">預覽食記</h1>

    <!-- 日期 -->
    <div v-if="note.date" class="mb-4 break-words">
      <strong>日期：</strong>
      <span>{{ note.date }}</span>
    </div>

    <!-- 餐廳名稱 -->
    <div v-if="note.restaurantName" class="mb-4 break-words">
      <strong>餐廳名稱：</strong>
      <span>{{ note.restaurantName }}</span>
    </div>

    <!-- 標題 -->
    <div v-if="note.title" class="mb-4 break-words">
      <strong>標題：</strong>
      <h2 class="text-lg font-semibold">{{ note.title }}</h2>
    </div>

    <!-- 內容 -->
    <div v-if="note.content" class="mb-4">
      <strong>內容：</strong>
      <div
        v-html="note.content"
        class="p-4 prose break-words whitespace-pre-wrap border border-gray-300 rounded-md max-w-none"
      ></div>
    </div>

    <!-- 返回編輯按鈕 -->
    <div class="mt-6 text-center">
      <button
        @click="backToEdit"
        class="px-4 py-2 text-white transition rounded bg-amber-400 hover:bg-amber-500"
      >
        返回編輯
      </button>
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 100%;
  height: auto;
  margin: 1rem auto;
  display: block;
  border-radius: 0.5rem;
}

/* 添加內容區域的樣式 */
:deep(.prose) {
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

/* 確保所有內容都在容器內 */
:deep(p),
:deep(div) {
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}

/* 確保圖片不會超出容器 */
:deep(img) {
  max-width: 100%;
  height: auto;
}
</style>
