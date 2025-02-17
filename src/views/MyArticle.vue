<script setup>
import { ref, onMounted, inject, watch, onBeforeUnmount } from "vue";
import { useAuth } from "../stores/authStore";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const auth = useAuth();
const $swal = inject("$swal");
const articles = ref([]);
let isComponentMounted = ref(true);

// 從 localStorage 讀取草稿
const loadDrafts = () => {
  const formData = localStorage.getItem("formData");
  if (formData) {
    try {
      const parsedData = JSON.parse(formData);
      articles.value = [
        {
          id: Date.now(),
          ...parsedData,
          createdAt: new Date().toISOString(),
        },
      ];
    } catch (error) {
      console.error("解析 formData 失敗:", error);
      articles.value = [];
    }
  } else {
    articles.value = [];
  }
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

// 編輯草稿
const editDraft = (article) => {
  const draftId = article.id || Date.now();

  const formData = {
    id: draftId,
    title: article.title || "",
    content: article.content || "",
    restaurantName: article.restaurantName || "",
    placeId: article.placeId || "",
    photo: article.photo || "",
  };

  localStorage.setItem(`draft_${draftId}`, JSON.stringify(formData));
  router.push(`/createnote?draftId=${draftId}`);
};

// 編輯已發佈文章
const editPublishedArticle = async (articleId) => {
  try {
    // 直接導航到編輯頁面，帶上文章 ID
    router.push({
      path: "/createnote",
      query: {
        id: articleId,
        type: "published", // 標記這是已發佈的文章
      },
    });
  } catch (error) {
    console.error("導航失敗:", error);
    await swalWithBootstrapButtons.fire({
      title: "錯誤",
      text: "無法編輯文章，請稍後再試",
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};

// 監聽路由變化
watch(
  () => route.query.status,
  async (newStatus) => {
    if (!isComponentMounted.value) return;

    if (newStatus === "published") {
      await loadPublishedArticles();
    } else if (newStatus === "draft") {
      loadDrafts();
    }
  },
  { immediate: true },
);

// 組件掛載
onMounted(() => {
  isComponentMounted.value = true;
  loadDrafts();
});

// 組件卸載前
onBeforeUnmount(() => {
  isComponentMounted.value = false;
});

// 配置 SweetAlert 樣式
const swalWithBootstrapButtons = $swal.mixin({
  customClass: {
    confirmButton:
      "bg-red-500 text-white px-6 py-2 rounded mx-2 hover:bg-red-600",
    cancelButton:
      "bg-gray-500 text-white px-6 py-2 rounded mx-2 hover:bg-gray-600",
    actions: "flex justify-center gap-4",
  },
  buttonsStyling: false,
});

// 刪除文章（統一的刪除處理函數）
const deleteArticle = async (articleId = null) => {
  try {
    const result = await swalWithBootstrapButtons.fire({
      title: "確定要刪除嗎？",
      text: "刪除後將無法恢復！",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "確定刪除",
      cancelButtonText: "取消",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      if (route.query.status === "published") {
        // 刪除已發佈文章
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/articles/${articleId}`,
        );
        // 重新載入文章列表
        await loadPublishedArticles();
      } else {
        // 刪除草稿
        localStorage.removeItem("formData");
        articles.value = [];
      }

      await swalWithBootstrapButtons.fire({
        title: "已刪除！",
        text:
          route.query.status === "published"
            ? "文章已成功刪除"
            : "草稿已成功刪除",
        icon: "success",
        confirmButtonText: "確定",
      });
    }
  } catch (error) {
    console.error("刪除失敗:", error);
    await swalWithBootstrapButtons.fire({
      title: "錯誤",
      text: "刪除失敗，請稍後再試",
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};

// 在模板中使用
const handleDelete = (articleId = null) => {
  if (!isComponentMounted.value) return;
  deleteArticle(articleId);
};

const windowWidth = ref(window.innerWidth);

// 監聽視窗大小變化
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

// 在組件掛載時添加監聽器
onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize(); // 初始化寬度
});

// 在組件卸載時移除監聽器
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
<template>
  <div v-if="isComponentMounted" class="container px-4 py-8 mx-auto">
    <!-- 頁面標題 -->
    <div
      class="flex items-center justify-between mb-8"
      :class="[
        'flex',
        {
          'mt-24': windowWidth < 768,
          'mt-20': windowWidth >= 768 && windowWidth < 1167,
        },
      ]"
    >
      <h1 class="text-2xl font-bold">我的食記</h1>
      <button
        @click="
          router.push({ path: '/createnote', query: { from: 'articleList' } })
        "
        class="px-4 py-2 text-white transition rounded bg-amber-400 hover:bg-amber-500"
      >
        撰寫食記
      </button>
    </div>

    <!-- 文章狀態切換 -->
    <div class="flex mb-8 space-x-4">
      <router-link
        :to="{ query: { status: 'draft' } }"
        class="px-4 py-2 rounded"
        :class="
          route.query.status === 'draft'
            ? 'bg-amber-400 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        "
      >
        草稿
      </router-link>
      <router-link
        :to="{ query: { status: 'published' } }"
        class="px-4 py-2 rounded"
        :class="
          route.query.status === 'published'
            ? 'bg-amber-400 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        "
      >
        已發佈
      </router-link>
    </div>

    <!-- 文章列表 -->
    <div class="space-y-4">
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
          <div class="flex space-x-4">
            <button
              @click.stop="
                route.query.status === 'published'
                  ? editPublishedArticle(article._id)
                  : editDraft(article)
              "
              class="px-4 py-2 transition-colors duration-200 bg-white border-2 rounded-lg border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
            >
              編輯
            </button>
            <button
              @click.stop="
                handleDelete(
                  route.query.status === 'published' ? article._id : article.id,
                )
              "
              class="px-4 py-2 text-red-500 transition-colors duration-200 bg-white border-2 border-red-500 rounded-lg hover:bg-red-500 hover:text-white"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 無文章時顯示 -->
    <div v-if="articles.length === 0" class="py-8 text-center text-gray-500">
      目前沒有{{ route.query.status === "published" ? "已發佈的文章" : "草稿" }}
    </div>
  </div>
</template>
