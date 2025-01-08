<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/stores/authStore";
import axios from "axios";
import { io } from "socket.io-client";

// 常量
const MAX_NOTIFICATIONS = 50;
const BACKEND_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const router = useRouter();
const auth = useAuth();

const notifications = ref([]);
const unreadCount = ref(0);
const isDropdownOpen = ref(false);
const socket = ref(null);
const isConnected = ref(false);

const getAuthToken = () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    console.warn('No authentication token found');
    return null;
  }
  return token;
};

const setupAxios = () => {
  const token = getAuthToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

const formatNotificationTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffMinutes < 1) return '剛剛';
  if (diffMinutes < 60) return `${diffMinutes} 分鐘前`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} 小時前`;
  return date.toLocaleDateString();
};

// 發送系統通知
const sendSystemNotification = (notification) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('新通知', {
      body: notification.message,
      icon: notification.metadata?.userImg || '/default-avatar.jpg'
    });
  }
};

、const initializeSocket = () => {
  if (!auth.userData?.id) {
    console.warn('No user data available');
    return;
  }

  const token = getAuthToken();
  if (!token) return;

  try {
    if (socket.value?.connected) {
      console.log('Socket already connected');
      return;
    }

    console.log('Initializing socket connection...');
    
    socket.value = io(BACKEND_URL, {
      auth: { token },
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.value.on('connect', () => {
      console.log('Socket connected successfully');
      isConnected.value = true;
      socket.value.emit('join', auth.userData.id);
    });

    socket.value.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      isConnected.value = false;
    });

    socket.value.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        socket.value.connect();
      }
    });

    socket.value.on('newNotification', (data) => {
      console.log('New notification received:', data);
      if (data.notification) {
        // 插入新通知到數組頭部
        notifications.value.unshift(data.notification);
        
        if (notifications.value.length > MAX_NOTIFICATIONS) {
          notifications.value.pop();
        }
        
        // 增加未讀數
        unreadCount.value++;
        
        sendSystemNotification(data.notification);
      }
    });

    socket.value.on('readNotification', ({ notificationId }) => {
      const notification = notifications.value.find(n => n._id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    });

    socket.value.connect();

  } catch (error) {
    console.error('Socket initialization error:', error);
  }
};

// 獲取通知列表
const fetchNotifications = async () => {
  if (!auth.userData?.id) return;
  
  try {
    setupAxios();
    const { data } = await axios.get(`${BACKEND_URL}/notification`);
    
    // 排序並限制通知數量
    notifications.value = data
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, MAX_NOTIFICATIONS);
    
    // 計算未讀通知數
    unreadCount.value = data.filter(n => !n.read).length;
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

const markAsRead = async (notificationId) => {
  try {
    setupAxios();
    await axios.patch(`${BACKEND_URL}/notification/read/${notificationId}`);
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

const handleNotificationClick = async (notification) => {
  if (!notification.read) {
    await markAsRead(notification._id);
  }
  
  // 根據通知類型導航到相應頁面
  if (notification.relatedType.includes('article')) {
    router.push(`/articlelist/${notification.relatedId}`);
  } else if (notification.relatedType.includes('restaurant')) {
    router.push(`/store/${notification.relatedId}`);
  }
  
  isDropdownOpen.value = false;
};

watch(() => auth.userData, (newUser) => {
  if (newUser?.id) {
    initializeSocket();
    fetchNotifications();
  } else if (socket.value) {
    socket.value.disconnect();
    isConnected.value = false;
  }
}, { immediate: true });

onMounted(() => {
  // 請求系統通知權限
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }

  if (auth.userData?.id) {
    initializeSocket();
    fetchNotifications();
  }
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});
</script>

<template>
  <div class="relative">
    <button 
      @click="isDropdownOpen = !isDropdownOpen"
      class="hover:bg-amber-100 p-2 rounded-md relative"
    >
      <div class="flex items-center text-amber-500 whitespace-nowrap">
        <font-awesome-icon :icon="['fas', 'bell']" class="ml-1" />
        <span 
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-2 py-1 min-w-[20px] text-center"
        >
          {{ unreadCount }}
        </span>
      </div>
    </button>

    <div 
      v-if="isDropdownOpen"
      class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50"
    >
      <div class="max-h-96 overflow-y-auto">
        <div 
          v-for="notification in notifications" 
          :key="notification._id"
          @click="handleNotificationClick(notification)"
          class="p-3 hover:bg-amber-50 cursor-pointer border-b border-gray-100"
          :class="{ 'bg-amber-50/50': notification.read }"
        >
          <div class="flex items-start space-x-3">
            <img 
              :src="notification.metadata?.userImg || '/default-avatar.jpg'"
              class="w-10 h-10 rounded-full object-cover"
              alt="User avatar"
            />
            <div class="flex-1">
              <p class="text-sm">
                <span class="font-medium">{{ notification.metadata?.userName }}</span>
                {{ notification.message }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ formatNotificationTime(notification.timestamp) }}
              </p>
            </div>
            <div 
              v-if="!notification.read"
              class="w-2 h-2 bg-blue-500 rounded-full mt-2"
            ></div>
          </div>
        </div>
        
        <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
          沒有新通知
        </div>
      </div>
    </div>
  </div>
</template>