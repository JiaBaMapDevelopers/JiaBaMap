<template>
  <div
    v-if="visible && !authStore.userData"
    class="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen ml-0 modal-overlay bg-black/50"
    @click.self="closeModal"
  >
    <div
      class="flex-col w-1/5 min-w-[260px] h-1/2 justify-items-center bg-white rounded-lg p-3 leading-10"
    >
      <h1>登入 「 JiaBaMap 」</h1>
      <div class="">
        <img src="@/assets/logo.jpg" alt="" />
      </div>
      <p class="m-3 mb-12">按下登入以使用更多功能！！</p>
      <div id="googleButton"></div>
      <div v-if="authStore.userData" class="user-info">
        <h3>登錄成功！</h3>
        <p>名稱：{{ authStore.userData.name }}</p>
        <p>Email：{{ authStore.userData.email }}</p>
        <img :src="authStore.userData.profilePicture" alt="用戶頭像" />
        <button @click="logout">登出</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, nextTick } from "vue";
import { useAuth } from "@/stores/authStore";

const authStore = useAuth();

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      nextTick(() => {
        authStore.initializeGoogleButton();
      });
    }
  },
);

onMounted(() => {
  if (props.visible) {
    nextTick(() => {
      authStore.initializeGoogleButton();
    });
  }
});
</script>

<style scoped>
/* 如果有任何樣式 */
</style>
