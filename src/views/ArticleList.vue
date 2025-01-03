<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs'
import Header from "@/components/Header.vue";
import articleData from '../../data/articleList.json';
import { useAuth } from '@/stores/authStore';

const auth = useAuth();

const $swal = inject('$swal');  // 注入 $swal

const formatDate = (date) => {
 return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};


const articles = ref([]);


const newComment = ref({
 content: '',
});

const newReply = ref({
 content: '',
 replyingTo: null
});

// 設置 axios  URL
const api = axios.create({
 baseURL: import.meta.env.VITE_BACKEND_BASE_URL
});


// 獲取所有文章
const fetchArticles = async () => {
  try {
    const { data } = await api.get('/articles');
    // 確保每篇文章都有必要的屬性
    articles.value = data.map(article => ({
      ...article,
      likesCount: article.likesCount || 0,
      isLiked: false,
      comments: (article.comments || []).map(comment => ({
        ...comment,
        likesCount: comment.likesCount || 0,
        isLiked: false,
        replies: (comment.replies || []).map(reply => ({
          ...reply,
          likesCount: reply.likesCount || 0,
          isLiked: false
        }))
      }))
    }));
  } catch (error) {
    articles.value = articleData.articles;
  }
};






// 按讚功能
const toggleLike = async (type, id) => {
  if (!auth.userData) {
    await swalWithBootstrapButtons.fire({
      title: '提醒',
      text: '請先登入後再按讚',
      icon: 'warning',
      confirmButtonText: '確定'
    });
    return;
  }

  const userId = auth.userData.sub;
  let endpoint = '';
  
  // 根據類型設置不同的 API 端點
  if (type === 'article') {
    endpoint = `/articles/${id}/like`;
  } else if (type === 'comment') {
    const article = articles.value.find(a => a.comments.some(c => c._id === id));
    if (article) {
      endpoint = `/articles/${article._id}/comments/${id}/like`;
    }
  } else if (type === 'reply') {
    const article = articles.value.find(a => 
      a.comments.some(c => c.replies.some(r => r._id === id))
    );
    if (article) {
      const comment = article.comments.find(c => 
        c.replies.some(r => r._id === id)
      );
      if (comment) {
        endpoint = `/articles/${article._id}/comments/${comment._id}/replies/${id}/like`;
      }
    }
  }

  try {
    const response = await api.post(endpoint, { userId });
      
    // 根據類型找到對應的項目
    let target;
    if (type === 'article') {
      target = articles.value.find(item => item._id === id);
    } else if (type === 'comment') {
      target = articles.value.flatMap(a => a.comments).find(item => item._id === id);
    } else if (type === 'reply') {
      target = articles.value.flatMap(a => a.comments).flatMap(c => c.replies).find(item => item._id === id);
    }

    // 更新按讚狀態
    if (target && response.status === 200) {
      target.isLiked = !target.isLiked;
      target.likesCount = response.data.likesCount;
    }
  } catch (error) {
    await swalWithBootstrapButtons.fire({
      title: '錯誤！',
      text: '按讚失敗，請稍後再試',
      icon: 'error'
    });
  }
};


// 添加評論
const addComment = async (articleId) => {
  if (!auth.userData) {
    await swalWithBootstrapButtons.fire({
      title: '提醒',
      text: '請先登入後再發表評論',
      icon: 'warning',
      confirmButtonText: '確定'
    });
    return;
  }

  if (!newComment.value.content.trim()) {
    await swalWithBootstrapButtons.fire({
      title: '提醒',
      text: '請輸入評論內容',
      icon: 'warning',
      confirmButtonText: '確定'
    });
    return;
  }

  try {
    // 定義新評論的資料
    const newCommentData = {
      content: newComment.value.content.trim(),
      userId: auth.userData.sub,
      user: auth.userData.name,
      userPhoto: auth.userData.picture || ''
    };
    console.log('newCommentData', newCommentData);
    const { data } = await api.post(`/articles/${articleId}/comments`, newCommentData);
    const article = articles.value.find(a => a._id === articleId);
    if (article) {
      if (!article.comments) {
        article.comments = [];
      }
      article.comments.push({
        ...data,
        likesCount: 0,
        isLiked: false,
        replies: []
      });
      newComment.value.content = '';
    }
  } catch (error) {
    console.error('Comment error:', error.response?.data || error);
    await swalWithBootstrapButtons.fire({
      title: '錯誤！',
      text: '發表評論失敗，請稍後再試',
      icon: 'error'
    });
  }
};

// 刪除評論函數
const deleteComment = async (articleId, commentId) => {
  const result = await swalWithBootstrapButtons.fire({
    title: '確定要刪除評論？',
    text: '刪除後將無法恢復！',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '刪除！',
    cancelButtonText: '取消',
    reverseButtons: true
  });
  
  if (result.isConfirmed) {
    try {
      await api.delete(`/articles/${articleId}/comments/${commentId}`);
      
      // 在前端更新資料
      const article = articles.value.find(a => a._id === articleId);
      if (article) {
        const commentIndex = article.comments.findIndex(c => c._id === commentId);
        if (commentIndex !== -1) {
          article.comments.splice(commentIndex, 1);
        }
      }

      await swalWithBootstrapButtons.fire({
        title: '已刪除！',
        text: '評論已成功刪除。',
        icon: 'success'
      });
    } catch (error) {
      console.error('Delete comment error:', error.response?.data || error);
      await swalWithBootstrapButtons.fire({
        title: '錯誤！',
        text: error.response?.data?.message || '刪除評論失敗，請稍後再試',
        icon: 'error'
      });
    }
  }
};

// 新增回覆
const addReply = async (articleId, commentId) => {
  if (!auth.userData) {
    await swalWithBootstrapButtons.fire({
      title: '提醒',
      text: '請先登入後再發表回覆',
      icon: 'warning',
      confirmButtonText: '確定'
    });
    return;
  }

  if (!newReply.value.content.trim()) {
    await swalWithBootstrapButtons.fire({
      title: '提醒',
      text: '請輸入回覆內容',
      icon: 'warning',
      confirmButtonText: '確定'
    });
    return;
  }

  try {
    // 新回覆的資料
    const newReplyData = {
      content: newReply.value.content.trim(),
      userId: auth.userData.sub,
      user: auth.userData.name,
      userPhoto: auth.userData.picture
    };

    const { data } = await api.post(`/articles/${articleId}/comments/${commentId}/replies`, newReplyData);
    const article = articles.value.find(a => a._id === articleId);
    if (article) {
      const comment = article.comments.find(c => c._id === commentId);
      if (comment) {
        if (!comment.replies) {
          comment.replies = [];
        }
        comment.replies.push({
          _id: data._id,
          content: data.content,
          userId: data.userId,
          user: data.user,
          userPhoto: data.userPhoto,
          createdAt: data.date || new Date(),
          likesCount: 0,
          isLiked: false
        });
      }
    }
    newReply.value.content = '';
    newReply.value.replyingTo = null;
  } catch (error) {
    await swalWithBootstrapButtons.fire({
      title: '錯誤！',
      text: error.response?.data?.message || '發表回覆失敗，請稍後再試',
      icon: 'error'
    });
  }
};


// 刪除回覆函數
const deleteReply = async (articleId, commentId, replyId) => {
  const result = await swalWithBootstrapButtons.fire({
    title: '確定要刪除回覆？',
    text: '刪除後將無法恢復！',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '刪除',
    cancelButtonText: '取消',
    reverseButtons: true
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/articles/${articleId}/comments/${commentId}/replies/${replyId}`);
      
      
      const article = articles.value.find(a => a._id === articleId);
      if (article) {
        const comment = article.comments.find(c => c._id === commentId);
        if (comment) {
          const replyIndex = comment.replies.findIndex(r => r._id === replyId);
          if (replyIndex !== -1) {
            comment.replies.splice(replyIndex, 1);
          }
        }
      }

      await swalWithBootstrapButtons.fire({
        title: '已刪除！',
        text: '回覆已刪除。',
        icon: 'success'
      });
    } catch (error) {
      await swalWithBootstrapButtons.fire({
        title: '錯誤！',
        text: error.response?.data?.message || '刪除回覆失敗，請稍後再試',
        icon: 'error'
      });
    }
  }
};


const toggleContent = (article) => {
 article.showFullContent = !article.showFullContent;
};

const toggleReplyForm = async (commentId) => {
  if (!auth.userData) {
    await swalWithBootstrapButtons.fire({
      title: '提醒',
      text: '請先登入後再發表回覆',
      icon: 'warning',
      confirmButtonText: '確定'
    });
    return;
  }

  if (newReply.value.replyingTo === commentId) {
    newReply.value.replyingTo = null;  // 關閉表單
  } else {
    newReply.value.replyingTo = commentId;  // 打開表單
  }
};

// 追蹤當前打開的選單 ID
const activeMenuId = ref(null);

// 打開閱讀更多選單
const toggleMenu = (id) => {
  activeMenuId.value = activeMenuId.value === id ? null : id;
};

// 點擊外部關閉選單
const handleClickOutside = (event) => {
  if (!event.target.closest('.menu-button') && !event.target.closest('.menu-content')) {
    activeMenuId.value = null;
  }
};

// 控制手機版搜尋欄的狀態
const isSearchOpen = ref(false);
const isMobile = ref(window.innerWidth < 768);

// 處理搜尋欄開關事件
const handleSearchToggle = (isOpen) => {
  isSearchOpen.value = isOpen;
};

// 監聽視窗大小變化
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

// 在 onMounted 中調用
onMounted(async () => {
  await fetchArticles();
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
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

</script>

<template>
  <div>
    <Header @search-toggle="handleSearchToggle" />
    <div :class="['max-w-4xl mx-auto', { 'mt-24': isSearchOpen && isMobile, 'md:mt-14 mt-16': !isSearchOpen || !isMobile }]">
      <article 
        v-for="article in articles" 
        :key="article._id"
        class="bg-white rounded-lg shadow-lg overflow-hidden mb-8"
      >
        <!-- 桌面版排版 (>=768px) -->
        <div class="hidden md:block">
          <div class="p-6">
            <img 
              :src="article.photo" 
              :alt="article.title"
              class="w-full h-64 object-cover rounded-lg mb-4"
            />
            <div class="space-y-4">
              <h2 class="text-2xl font-bold">{{ article.title }}</h2>
              <div class="flex items-center text-gray-600 space-x-4">
                <span>{{ formatDate(article.createdAt) }}</span>
                <span>{{ article.location }}</span>
                <span>{{ article.price }}</span>
                <span>營業時間: {{ article.openHours }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  @click="toggleLike('article', article._id)"
                  class="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
                >
                  <font-awesome-icon 
                    :icon="[article.isLiked ? 'fas' : 'far', 'thumbs-up']" 
                    class="text-xl"
                  />
                  <span>{{ article.likesCount }}</span>
                </button>
              </div>
              <p class="text-gray-700 leading-relaxed">{{ article.content }}</p>
            </div>
          </div>
        </div>

        <!-- 手機版排版 (<768px) -->
        <div class="md:hidden">
          <div class="relative">
            <img 
              :src="article.photo" 
              :alt="article.title"
              class="w-full h-48 object-cover"
            />
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <h2 class="text-xl font-bold text-white">{{ article.title }}</h2>
            </div>
          </div>
          <div class="p-4 space-y-3">
            <div class="flex justify-between items-center text-sm text-gray-600">
              <span>{{ formatDate(article.createdAt) }}</span>
              <button 
                  @click="toggleLike('article', article._id)"
                  class="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
                >
                  <font-awesome-icon 
                    :icon="[article.isLiked ? 'fas' : 'far', 'thumbs-up']" 
                    class="text-xl"
                  />
                  <span>{{ article.likesCount }}</span>
              </button>
            </div>
            <div class="text-sm text-gray-600">
              <div>{{ article.location }}</div>
              <div>{{ article.price }} | {{ article.openHours }}</div>
            </div>
            <div class="relative">
              <p class="text-gray-700 text-sm line-clamp-3" :class="{ 'line-clamp-none': !article.showFullContent }">
                {{ article.content }}
              </p>
              <button 
                @click="toggleContent(article)"
                class="text-blue-500 text-sm mt-2"
              >
                {{ article.showFullContent ? '繼續閱讀' : '收起' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 評論區域 -->
        <div class="bg-gray-50 p-4 md:p-6">
          <h3 class="text-lg md:text-xl font-bold mb-4">評論</h3>
          <!-- 評論列表 -->
          <div class="space-y-4 mb-6">
            <div 
              v-for="comment in article.comments" 
              :key="comment._id"
              class="bg-white p-3 md:p-4 rounded-lg shadow"
            >
              <div class="flex items-center gap-3 mb-2">
                <div v-if="auth.userData" class="w-8 h-8">
                  <img 
                    :src="comment.userPhoto"
                    :alt="comment.user"
                    class="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div v-else class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <font-awesome-icon :icon="['fas', 'user']" class="text-gray-400 text-lg" />
                </div>
                <div class="flex flex-col">
                  <span class="font-medium text-sm md:text-base">{{ comment.user }}</span>
                  <span class="text-xs md:text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</span>
                </div>
              </div>
              <p class="text-sm md:text-base text-gray-700 ml-11">{{ comment.content }}</p>

              <div class="flex items-center justify-between mt-2">
                <div class="flex gap-4 items-center w-full ml-11">
                  <button 
                    @click="toggleLike('comment', comment._id)"
                    class="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
                  >
                    <font-awesome-icon 
                      :icon="[comment.isLiked ? 'fas' : 'far', 'thumbs-up']" 
                      class="text-xl"
                    />
                    <span>{{ comment.likesCount }}</span>
                  </button>
                  <div class="flex items-center gap-2">
                    <button 
                      @click="toggleReplyForm(comment._id)"
                      class="text-blue-500 text-sm hover:text-blue-600"
                    >
                      {{ newReply.replyingTo === comment._id ? '取消回覆' : '回覆' }}
                    </button>
                    <!-- 評論的三點選單 -->
                    <div class="relative group">
                      <button 
                        @click.stop="toggleMenu(comment._id)"
                        class="text-gray-500 hover:text-gray-700 px-2 font-bold menu-button"
                      >
                        <font-awesome-icon :icon="['fas', 'ellipsis']" />
                      </button>
                      <!-- 下拉選單 -->
                      <div 
                        v-if="activeMenuId === comment._id"
                        class="absolute left-0 mt-1 bg-amber-200 rounded-lg shadow-lg py-1 min-w-[100px] z-10 menu-content"
                      >
                        <button 
                          @click="deleteComment(article._id, comment._id); activeMenuId = null"
                          class="w-full text-center px-4 py-2 text-sm font-bold text-red-500 hover:bg-gray-300"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 回覆列表 -->
              <div 
                v-if="comment.replies && comment.replies.length > 0"
                class="mt-3 ml-11 space-y-3"
              >
                <div 
                  v-for="reply in comment.replies"
                  :key="reply._id"
                  class="bg-gray-50 p-3 rounded"
                >
                  <div class="flex items-center gap-3 mb-2">
                    <div v-if="auth.userData" class="w-6 h-6">
                      <img 
                        :src="reply.userPhoto"
                        :alt="reply.user"
                        class="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div v-else class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <font-awesome-icon :icon="['fas', 'user']" class="text-gray-400 text-sm" />
                    </div>
                    <div class="flex flex-col">
                      <span class="font-medium text-sm">{{ reply.user }}</span>
                      <span class="text-xs text-gray-500">{{ formatDate(reply.createdAt) }}</span>
                    </div>
                  </div>
                  <p class="text-sm text-gray-700 ml-9">{{ reply.content }}</p>
                  <div class="flex items-center gap-4 mt-2 ml-9">
                    <button 
                      @click="toggleLike('reply', reply._id)"
                      class="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
                    >
                      <font-awesome-icon 
                        :icon="[reply.isLiked ? 'fas' : 'far', 'thumbs-up']" 
                        class="text-lg"
                      />
                      <span>{{ reply.likesCount }}</span>
                    </button>
                    <!-- 回覆的三點選單 -->
                    <div class="relative group">
                      <button 
                        @click.stop="toggleMenu(reply._id)"
                        class="text-gray-500 hover:text-gray-700 px-2 font-bold menu-button"
                      >
                        <font-awesome-icon :icon="['fas', 'ellipsis']" />
                      </button>
                      <!-- 下拉選單 -->
                      <div 
                        v-if="activeMenuId === reply._id"
                        class="absolute left-0 mt-1 bg-amber-200 rounded-lg shadow-lg py-1 min-w-[100px] z-10 menu-content"
                      >
                        <button 
                          @click="deleteReply(article._id, comment._id, reply._id); activeMenuId = null"
                          class="w-full text-center px-4 py-2 text-sm font-bold text-red-500 hover:bg-gray-300"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 回覆表單 -->
              <div 
                v-if="newReply.replyingTo === comment._id"
                class="mt-3 ml-11"
              >
                <div class="flex items-start gap-3">
                  <div v-if="auth.userData" class="w-6 h-6">
                    <img 
                      :src="auth.userData.picture"
                      :alt="auth.userData.name"
                      class="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div v-else class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <font-awesome-icon :icon="['fas', 'user']" class="text-gray-400 text-sm" />
                  </div>
                  <div class="flex-1">
                    <div class="relative">
                      <textarea
                        v-model="newReply.content"
                        rows="2"
                        maxlength="200"
                        class="w-full border rounded p-2 text-sm disabled:bg-gray-100"
                        :class="{ 'bg-gray-50': newReply.content.length >= 200 }"
                        :placeholder="auth.userData ? '請發表回覆...' : '請先登入後再發表回覆...'"
                        :disabled="!auth.userData"
                        @input="newReply.content = $event.target.value.slice(0, 200)"
                      ></textarea>
                      <p v-if="newReply.content.length > 0" 
                        class="text-xs mt-1"
                        :class="newReply.content.length >= 200 ? 'text-red-500' : 'text-gray-500'"
                      >
                        {{ newReply.content.length >= 200 ? '已達到字數上限' : `還可以輸入 ${200 - newReply.content.length} 字` }}
                      </p>
                    </div>
                    <button
                      @click="addReply(article._id, comment._id)"
                      class="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      :disabled="!auth.userData"
                    >
                      {{ auth.userData ? '發表回覆' : '請先登入' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 新增評論表單 -->
          <div class="bg-white p-3 md:p-4 rounded-lg">
            <h4 class="font-medium mb-2 text-sm md:text-base">撰寫評論</h4>
            <div class="flex items-start gap-3">
              <div v-if="auth.userData" class="w-8 h-8">
                <img 
                  :src="auth.userData.picture"
                  :alt="auth.userData.name"
                  class="w-full h-full rounded-full object-cover"
                />
              </div>
              <div v-else class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <font-awesome-icon :icon="['fas', 'user']" class="text-gray-400 text-lg" />
              </div>
              <div class="flex-1">
                <div class="relative">
                  <textarea
                    v-model="newComment.content"
                    rows="3"
                    maxlength="200"
                    class="w-full border rounded p-2 text-sm md:text-base disabled:bg-gray-100"
                    :class="{ 'bg-gray-50': newComment.content.length >= 200 }"
                    :placeholder="auth.userData ? '請輸入評論' : '請先登入後再發表評論...'"
                    :disabled="!auth.userData"
                    @input="newComment.content = $event.target.value.slice(0, 200)"
                  ></textarea>
                  <p v-if="newComment.content.length > 0" 
                    class="text-xs mt-1"
                    :class="newComment.content.length >= 200 ? 'text-red-500' : 'text-gray-500'"
                  >
                    {{ newComment.content.length >= 200 ? '已達到字數上限' : `還可以輸入 ${200 - newComment.content.length} 字` }}
                  </p>
                </div>
                <button
                  @click="auth.userData ? addComment(article._id) : swalWithBootstrapButtons.fire({
                    title: '提醒',
                    text: '請先登入後再發表評論',
                    icon: 'warning',
                    confirmButtonText: '確定'
                  })"
                  class="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm md:text-base mt-2"
                >
                   發表評論
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
<style scoped>
</style>
