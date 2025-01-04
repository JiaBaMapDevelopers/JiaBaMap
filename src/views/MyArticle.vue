<script setup>
import { useRouter, useRoute } from "vue-router";
import Footer from "../components/Footer.vue";
import { ref, computed, onMounted, onUnmounted, inject } from "vue";
import articleData from "../../data/myArticle.json";
const router = useRouter();
const route = useRoute();
const $swal = inject("$swal");

// 新增：判斷是否為首頁
const isHome = computed(() => route.path === "/");

// 新增：視窗寬度狀態
const windowWidth = ref(window.innerWidth);

// 修改：監聽視窗大小變化
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

// 文章資料
const articles = ref(articleData.articles);

// 根據狀態過濾食記
const filteredArticles = computed(() => {
  return articles.value.filter(
    (article) => article.status === route.query.status,
  );
});

const changeStatus = (status) => {
  router.push({
    path: "/myarticle",
    query: { status },
  });
};

const deleteArticle = async (id) => {
  const result = await swalWithBootstrapButtons.fire({
    title: "確定要刪除這篇文章嗎？",
    text: "刪除後將無法恢復！",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "確定刪除",
    cancelButtonText: "取消",
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    articles.value = articles.value.filter((article) => article.id !== id);
    await swalWithBootstrapButtons.fire({
      title: "已刪除！",
      text: "文章已成功刪除。",
      icon: "success",
    });
  }
};

const editArticle = (id) => {
  router.push({
    path: `/myarticle/edit/${id}`,
  });
};

// 在 onMounted 中初始化狀態和加載資料
onMounted(() => {
  // 如果 URL 中沒有 status 參數，預設為 'draft' 並加載資料
  if (!route.query.status) {
    router.replace({
      path: "/myarticle",
      query: { status: "draft" },
    });
  }
  // 添加視窗大小監聽
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
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
</script>

<template>
  <div>
    <div
      :class="[
        'min-h-screen bg-white',
        {
          'mt-24': windowWidth < 768,
          'mt-20': !isHome && windowWidth >= 768 && windowWidth < 1167,
          'mt-8': isHome || windowWidth >= 1167,
        },
      ]"
    >
      <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-5xl font-extrabold mb-6">您的食記</h2>
        <div class="flex flex-row-reverse space-x-4 mb-4 text-xl">
          <router-link
            to="/createnote"
            class="px-4 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            撰寫食記
          </router-link>
        </div>

        <div class="border-b">
          <div class="flex space-x-8">
            <button
              @click="changeStatus('draft')"
              :class="[
                'px-4 py-2 transition-colors',
                route.query.status === 'draft'
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'hover:text-red-500',
              ]"
            >
              草稿
            </button>
            <button
              @click="changeStatus('published')"
              :class="[
                'px-4 py-2 transition-colors',
                route.query.status === 'published'
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'hover:text-red-500',
              ]"
            >
              已發佈
            </button>
          </div>
        </div>

        <!-- 食記列表 -->
        <div class="mt-6 space-y-4">
          <article
            v-for="article in filteredArticles"
            :key="article.id"
            class="flex space-x-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div class="w-24 h-24 bg-gray-200 rounded overflow-hidden">
              <img
                :src="article.photo"
                :alt="article.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <h3 class="text-lg font-medium text-gray-800">
                  {{ article.title }}
                </h3>
                <div class="text-sm text-gray-500">
                  {{ article.location }}
                </div>
              </div>
              <p class="text-sm text-gray-500 mt-1">
                {{ article.date }} ·
                <button
                  @click="editArticle(article.id)"
                  class="text-blue-500 hover:text-blue-600"
                >
                  編輯
                </button>
                |
                <button
                  @click="deleteArticle(article.id)"
                  class="text-red-500 hover:text-red-600"
                >
                  刪除
                </button>
              </p>
              <p class="text-sm text-gray-400 mt-1">
                滿意評分：{{ article.rating }}
              </p>
              <p class="text-sm text-gray-600 mt-2 line-clamp-2">
                {{ article.content }}
              </p>
            </div>
          </article>

          <!-- 無食記提示 -->
          <div
            v-if="filteredArticles.length === 0"
            class="text-center text-gray-500 py-8 bg-white rounded-lg shadow"
          >
            目前沒有{{
              route.query.status === "draft" ? "草稿" : "已發佈"
            }}的食記
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
