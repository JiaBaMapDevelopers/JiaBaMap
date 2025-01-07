<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, watchEffect } from "vue";
import { useAuth } from "@/stores/authStore";
import axios from "axios";
import { io } from "socket.io-client";

const router = useRouter();
const isDropdownOption = ref(false);
const user = useAuth();
const notifications = ref([]);

// 切換通知欄顯示
const toggleDropdown = () => {
  isDropdownOption.value = !isDropdownOption.value;
};

// 根據通知類型獲取對應的消息文本
const getNotificationMessage = (notification) => {
  const messages = {
    // 餐廳相關通知
    restaurant_comment: {
      comment: '評論了你的餐廳'
    },
    restaurant_comment_like: {
      like: '對你的餐廳評論按讚'
    },
    // 文章相關通知
    article_comment: {
      comment: '評論了你的文章'
    },
    article_like: {
      like: '對你的文章按讚'
    },
    article_comment_like: {
      like: '對你的文章評論按讚'
    },
    article_comment_reply: {
      reply: '回覆了你的文章評論'
    },
    article_reply_like: {
      like: '對你的回覆按讚'
    }
  };

  const typeMessages = messages[notification.relatedType];
  return typeMessages ? typeMessages[notification.actionType] || '與你互動' : '與你互動';
};

// 處理通知點擊
const handleNotificationClick = async (notification) => {
  try {
    // 標記通知為已讀
    await axios.patch(`/api/notifications/read/${notification._id}`);
    
    // 更新本地通知狀態
    const index = notifications.value.findIndex(n => n._id === notification._id);
    if (index !== -1) {
      notifications.value[index].read = true;
    }

    // 根據通知類型決定跳轉邏輯
    if (notification.relatedType.startsWith('restaurant_')) {
      router.push({
        name: "Store",
        params: { id: notification.storeId },
        query: notification.commentId ? { commentId: notification.commentId } : {}
      });
    } else if (notification.relatedType.startsWith('article_')) {
      router.push({
        name: "Article",
        params: { id: notification.metadata?.articleId },
        query: {
          ...(notification.commentId && { commentId: notification.commentId }),
          ...(notification.metadata?.replyId && { replyId: notification.metadata.replyId })
        }
      });
    }
  } catch (error) {
    console.error("標記通知已讀失敗:", error);
  }
};

// 獲取通知列表
const fetchNotifications = async () => {
  if (user.userData) {
    try {
      const response = await axios.get(`import.meta.env.VITE_BACKEND_BASE_URL}/notifications/${user.userData.id}`, {
        params: {
          page: 1,
          limit: 5
        }
      });
      notifications.value = response.data;
    } catch (error) {
      console.error("獲取通知失敗:", error);
    }
  }
};

const socket = ref(null);
// 初始化 WebSocket 連接
const initializeWebSocket = () => {
  if (!user.userData || !user.userData.id) {
    console.log("No user data available, skipping socket connection");
    return;
  }

  socket.value = io(import.meta.env.VITE_BACKEND_SERVER_URL, {
    withCredentials: true,
  });

  socket.value.on("connect", () => {
    console.log("已連接，用戶ID:", user.userData.id);
    socket.value.emit("join", user.userData.id);
    
  });

  socket.value.on("connect_error", (error) => {
    console.error("Connection error:", error);
  });

  socket.value.on("newNotification", ({ notification }) => {
    if (notification) {
      notifications.value.unshift(notification);
    }
  });

  socket.value.on("readNotification", ({ notificationId }) => {
    if (notificationId) {
      const index = notifications.value.findIndex(n => n._id === notificationId);
      if (index !== -1) {
        notifications.value[index].read = true;
      }
    }
  });

  socket.value.on("disconnect", () => {
    console.log("WebSocket disconnected");
  });
};

// 組件卸載時清理
onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});

onMounted(() => {
  if (user.userData && user.userData.id) {
    fetchNotifications();
    initializeWebSocket();
  }
});
</script>

<template>
  <div class="hover:bg-amber-100 p-2 rounded-md">
    <button @click="toggleDropdown" class="relative">
      <div class="flex items-center text-amber-500 whitespace-nowrap">
        通知
        <font-awesome-icon :icon="['fas', 'bell']" class="ml-1" />
      </div>
      <!-- 通知下拉菜單 -->
      <div 
        v-if="isDropdownOption" 
        class="absolute -right-2 z-10 w-64 mt-3 text-xs text-amber-500 rounded-md shadow-md bg-white top-full flex flex-col"
      >
        <!-- 新通知與歷史紀錄選項 -->
        <div class="flex flex-row justify-between w-full border-b border-amber-300 p-2">
          <div class="w-1/2 text-base hover:bg-amber-100 hover:rounded-md">新通知</div>
          <div class="w-1/2 text-base hover:bg-amber-100 hover:rounded-md">歷史紀錄</div>
        </div>
        <!-- 通知列表 -->
        <div 
          v-for="notification in notifications" 
          :key="notification._id"
          @click="handleNotificationClick(notification)"
          :class="['flex flex-row items-center p-2 hover:bg-amber-100 hover:rounded-md', notification.read ? 'opacity-50' : '']"
        >
          <!-- 用戶頭像 -->
          <div class="w-8 h-8">
            <img 
              :src="notification.userImg || 'https://i.pinimg.com/1200x/c0/8d/d4/c08dd43375752cd0437c736e6eabb389.jpg'" 
              alt="userImg"
              class="w-full h-full rounded-full object-cover"
            >
          </div>
          <!-- 通知內容 -->
          <div class="font-bold px-1 text-sm">{{ notification.userName }}</div>
          <div class="text-sm">{{ getNotificationMessage(notification) }}</div>
        </div>
      </div>
    </button>
  </div>
</template>