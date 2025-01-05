<script setup>
import { ref, onMounted, inject, watch, onBeforeUnmount } from 'vue';
import { useAuth } from '../stores/authStore';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const auth = useAuth();
const $swal = inject('$swal');
const articles = ref([]);
let isComponentMounted = ref(true);

// 從 localStorage 讀取草稿
const loadDrafts = () => {
  const formData = localStorage.getItem('formData');
  if (formData) {
    try {
      const parsedData = JSON.parse(formData);
      articles.value = [
        {
          id: Date.now(),
          ...parsedData,
          createdAt: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('解析 formData 失敗:', error);
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
        title: '提醒',
        text: '請先登入後再查看已發佈文章',
        icon: 'warning',
        confirmButtonText: '確定'
      });
      return;
    }

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/articles/published/${auth.userData._id}`);
    articles.value = response.data;
    
  } catch (error) {
    console.error('載入已發佈文章時發生錯誤:', error);
    await swalWithBootstrapButtons.fire({
      title: '錯誤',
      text: '載入已發佈文章失敗，請稍後再試',
      icon: 'error',
      confirmButtonText: '確定'
    });
  }
};



// 編輯草稿
const editDraft = (article) => {
  const draftId = article.id || Date.now();
  
  const formData = {
    id: draftId,
    title: article.title || '',
    content: article.content || '',
    restaurantName: article.restaurantName || '',
    placeId: article.placeId || '',
    photo: article.photo || '',
  };
  
  localStorage.setItem(`draft_${draftId}`, JSON.stringify(formData));
  router.push(`/createnote?draftId=${draftId}`);
};

// 編輯已發佈文章
const editPublishedArticle = async (articleId) => {
  try {
    // 直接導航到編輯頁面，帶上文章 ID
    router.push({
      path: '/createnote',
      query: { 
        id: articleId,
        type: 'published'  // 標記這是已發佈的文章
      }
    });
    
  } catch (error) {
    console.error('導航失敗:', error);
    await swalWithBootstrapButtons.fire({
      title: '錯誤',
      text: '無法編輯文章，請稍後再試',
      icon: 'error',
      confirmButtonText: '確定'
    });
  }
};

// 監聽路由變化
watch(() => route.query.status, async (newStatus) => {
  if (!isComponentMounted.value) return;
  
  if (newStatus === 'published') {
    await loadPublishedArticles();
  } else if (newStatus === 'draft') {
    loadDrafts();
  }
}, { immediate: true });

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
    confirmButton: 'bg-red-500 text-white px-6 py-2 rounded mx-2 hover:bg-red-600',
    cancelButton: 'bg-gray-500 text-white px-6 py-2 rounded mx-2 hover:bg-gray-600',
    actions: 'flex justify-center gap-4'
  },
  buttonsStyling: false
});

// 刪除文章（統一的刪除處理函數）
const deleteArticle = async (articleId = null) => {
  try {
    const result = await swalWithBootstrapButtons.fire({
      title: '確定要刪除嗎？',
      text: '刪除後將無法恢復！',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確定刪除',
      cancelButtonText: '取消',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      if (route.query.status === 'published') {
        // 刪除已發佈文章
        await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/articles/${articleId}`);
        // 重新載入文章列表
        await loadPublishedArticles();
      } else {
        // 刪除草稿
        localStorage.removeItem('formData');
        articles.value = [];
      }

      await swalWithBootstrapButtons.fire({
        title: '已刪除！',
        text: route.query.status === 'published' ? '文章已成功刪除' : '草稿已成功刪除',
        icon: 'success',
        confirmButtonText: '確定'
      });
    }
  } catch (error) {
    console.error('刪除失敗:', error);
    await swalWithBootstrapButtons.fire({
      title: '錯誤',
      text: '刪除失敗，請稍後再試',
      icon: 'error',
      confirmButtonText: '確定'
    });
  }
};

// 在模板中使用
const handleDelete = (articleId = null) => {
  if (!isComponentMounted.value) return;
  deleteArticle(articleId);
};





</script>
<template>
  <div v-if="isComponentMounted" class="container mx-auto px-4 py-8">
    <!-- 頁面標題 -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">我的食記</h1>
      <button
        @click="router.push({ path: '/createnote', query: { from: 'articleList' }})"
        class="bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500 transition"
      >
        撰寫食記
      </button>
    </div>

    <!-- 文章狀態切換 -->
    <div class="flex space-x-4 mb-8">
      <router-link
        :to="{ query: { status: 'draft' }}"
        class="px-4 py-2 rounded"
        :class="route.query.status === 'draft' ? 'bg-amber-400 text-white' : 'text-gray-600 hover:bg-gray-100'"
      >
        草稿
      </router-link>
      <router-link
        :to="{ query: { status: 'published' }}"
        class="px-4 py-2 rounded"
        :class="route.query.status === 'published' ? 'bg-amber-400 text-white' : 'text-gray-600 hover:bg-gray-100'"
      >
        已發佈
      </router-link>
    </div>

    <!-- 文章列表 -->
    <div class="space-y-4">
      <div v-for="article in articles" :key="article.id" 
        class="bg-white p-4 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-200"
        :class="{ 'cursor-pointer': route.query.status == 'published' && 'draft' }"
        @click="route.query.status === 'published' ? editPublishedArticle(article._id) : editDraft(article)"
      >
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-xl font-semibold mb-2">{{ article.title || '無標題' }}</h2>
            <p class="text-gray-600 mb-2">{{ article.restaurantName || '未指定餐廳' }}</p>
            <p class="text-gray-500 text-sm">
              {{ route.query.status === 'published' ? '發佈時間' : '最後編輯時間' }}：
              {{ new Date(article.createdAt).toLocaleString() }}
            </p>
          </div>
          <div class="flex space-x-4">
            <button
              @click.stop="route.query.status === 'published' ? editPublishedArticle(article._id) : editDraft(article)"
              class="px-4 py-2 border-2 border-amber-500 bg-white text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg transition-colors duration-200"
            >
              編輯
            </button>
            <button
              @click.stop="handleDelete(route.query.status === 'published' ? article._id : article.id)"
              class="px-4 py-2 border-2 border-red-500 bg-white text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors duration-200"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 無文章時顯示 -->
    <div v-if="articles.length === 0" class="text-center py-8 text-gray-500">
      目前沒有{{ route.query.status === 'published' ? '已發佈的文章' : '草稿' }}
    </div>
  </div>
</template>

