<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/stores/authStore";
import axios from "axios";
import { io } from "socket.io-client";

const router = useRouter();
const auth = useAuth();
const notifications = ref([]);
const isDropdownOpen = ref(false);
const socket = ref(null);

const getNotificationMessage = (notification) => {
  const typeMap = {
    comment: '發表了評論',
    like: '按讚了',
    reply: '回覆了'
  };
  return typeMap[notification.actionType] || '與你互動';
};

const handleNotificationClick = async (notification) => {
  try {
    await axios.patch(`/api/notifications/${notification._id}/read`);
    
    const index = notifications.value.findIndex(n => n._id === notification._id);
    if (index !== -1) {
      notifications.value[index].read = true;
    }

    if (notification.relatedType.includes('article')) {
      router.push({
        name: 'Article',
        params: { id: notification.relatedId },
        query: { commentId: notification.metadata?.commentId }
      });
    } else if (notification.relatedType.includes('restaurant')) {
      router.push({
        name: 'Store',
        params: { id: notification.relatedId }
      });
    }
    
    isDropdownOpen.value = false;
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

const fetchNotifications = async () => {
  if (!auth.userData?.id) return;
  
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/notifications/${auth.userData.id}`,
      { params: { page: 1, limit: 5 } }
    );
    notifications.value = data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

const initializeSocket = () => {
  if (!auth.userData?.id) return;

  const token = localStorage.getItem('token');

  socket.value = io(import.meta.env.VITE_BACKEND_SERVER_URL, {
    auth:{ token: token },
    withCredentials: true,
    autoConnect: true
  });

  socket.value.on('connect', () => {
    socket.value.emit('join', auth.userData.id);
  });

  socket.value.on('newNotification', ({ notification }) => {
    notifications.value.unshift(notification);
  });

  socket.value.on('readNotification', ({ notificationId }) => {
    const index = notifications.value.findIndex(n => n._id === notificationId);
    if (index !== -1) {
      notifications.value[index].read = true;
    }
  });
};

console.log("WebSocket 連接狀態:", socket.value?.connected);


onMounted(() => {
  fetchNotifications();
  initializeSocket();
});

onUnmounted(() => {
  socket.value?.disconnect();
});
</script>

<template>
  <div class="relative">
    <button 
      @click="isDropdownOpen = !isDropdownOpen"
      class="hover:bg-amber-100 p-2 rounded-md"
    >
      <div class="flex items-center text-amber-500 whitespace-nowrap">
        通知
        <font-awesome-icon :icon="['fas', 'bell']" class="ml-1" />
      </div>
    </button>

    <div 
      v-if="isDropdownOpen"
      class="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50"
    >
      <div class="border-b border-amber-300 p-2 flex">
        <div class="w-1/2 text-center hover:bg-amber-100 rounded-md cursor-pointer">
          新通知
        </div>
        <div class="w-1/2 text-center hover:bg-amber-100 rounded-md cursor-pointer">
          歷史紀錄
        </div>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div 
          v-for="notification in notifications" 
          :key="notification._id"
          @click="handleNotificationClick(notification)"
          class="p-2 hover:bg-amber-100 cursor-pointer"
          :class="{ 'opacity-50': notification.read }"
        >
          <div class="flex items-center space-x-2">
            <img 
              :src="notification.metadata?.userImg || '/default-avatar.jpg'"
              class="w-8 h-8 rounded-full object-cover"
              alt="User avatar"
            />
            <span class="font-medium text-sm">
              {{ notification.metadata?.userName }}
            </span>
            <span class="text-sm">
              {{ getNotificationMessage(notification) }}
            </span>
          </div>
        </div>
        
        <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
          沒有新通知
        </div>
      </div>
    </div>
  </div>
</template>