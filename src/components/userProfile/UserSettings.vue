<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useAuth } from '@/stores/authStore'
import { storeToRefs } from 'pinia';

const user = useAuth()
const { userData, logout } = storeToRefs(user); 
const menuVisible = ref(false);
const isEditing = ref(false);
const instagramUsername = ref(userData.value?.instagram || ''); 
const editedUsername = ref(userData.value?.name || "使用者");
const editedProfilePicture = ref('/image/default_user.png');

// 計算屬性 - 生成 IG 連結
const instagramLink = computed(() => `https://instagram.com/${instagramUsername.value}`);

const handleImageError = (event) => {
    event.target.src = '/image/default_user.png';
    editedProfilePicture.value = '/image/default_user.png';
    // 更新 localStorage 中的圖片資料
    const updatedData = {
        ...userData.value,
        picture: '/image/default_user.png',
    };
    localStorage.setItem('userData', JSON.stringify(updatedData));
    userData.value = updatedData;
};

// 切換編輯模式
const toggleEditMode = () => {
    isEditing.value = true; 
    instagramUsername.value = userData.value?.instagram || '';
    editedUsername.value = userData.value?.name || "使用者";
    editedProfilePicture.value = userData.value?.picture || '/image/default_user.png'; 
};

// 保存使用者資料並退出編輯模式
const saveProfile = () => {
    isEditing.value = false; // 結束編輯模式
    const updatedData = {
        name: editedUsername.value,
        instagram: instagramUsername.value,
        picture: editedProfilePicture.value,
    };
    localStorage.setItem('userData', JSON.stringify(updatedData)); // 保存到 localStorage
    userData.value = updatedData; // 更新 userData
};

// 取消編輯，恢復原始值（可擴展為重置到用戶原始數據）
const cancelEdit = () => {
    isEditing.value = false;
    instagramUsername.value = userData.value?.instagram || ''; 
    editedUsername.value = userData.value?.name || "使用者";
    editedProfilePicture.value = userData.value?.picture || '/image/default_user.png'; 
};

// 切換選單顯示/隱藏
const toggleMenu = () => {
    menuVisible.value = !menuVisible.value;
};

// 撰寫食記的功能
const writeReview = () => {
    alert('撰寫食評功能即將啟用！');
};

// 更新頭像
const onPhotoChange = (event) => {
    const file = event.target.files[0]; 
    if (file) {
        const newImage = URL.createObjectURL(file); // 建立預覽圖片連結
        editedProfilePicture.value = newImage;
    }
};

// 使用 watch 確保即時更新圖片
watch(
    () => userData.value?.picture,
    (newValue) => {
        editedProfilePicture.value = newValue || '/image/default_user.png';
    },
    { immediate: true }
);

// 點擊其他地方時關閉下拉選單
const handleClickOutside = (event) => {
    if (
        menuVisible.value &&
        !event.target.closest('#dropdownMenu') && // 點擊的元素不在選單內
        !event.target.closest('#dropdownButton') 
    ) {
        menuVisible.value = false;
    }
};

// 添加全域事件監聽器
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    editedProfilePicture.value =userData.value?.picture || '/image/default_user.png';
});

// 移除全域事件監聽器
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div class="p-4 my-10">
        <!-- 非編輯模式 -->
        <div v-if="!isEditing">
            <!-- 個人照片 -->
            <div class="flex justify-center">
                <img
                    :src="editedProfilePicture"
                    alt="Profile Picture"
                    class="object-cover w-24 h-24 border border-gray-300 rounded-full"
                />
            </div>

            <!-- 名稱和數據 -->
            <div class="mt-4 text-center" >
                <h2 class="text-2xl font-bold text-gray-700">{{ editedUsername }}</h2>  
            </div>

            <!-- 社群連結 -->
            <div class="mt-4 text-center">
                <p class="mb-2 text-sm text-gray-500">社群連結：</p>
                <a
                    :href="instagramLink"
                    class="underline text-amber-500 hover:text-amber-400"
                    v-if="instagramUsername"
                    target="_blank"
                >
                    Instagram: {{ instagramUsername }}
                </a>
                <p v-else class="flex items-center justify-center text-gray-500"><font-awesome-icon :icon="['fab', 'instagram']" class="w-5 h-5 mr-1 text-amber-500"/>Instagram 未連結</p>
            </div>

            <!-- 編輯個人檔案按鈕 -->
            <div class="relative flex items-center justify-center mt-6 ">
                <div class="w-full"></div>
                <button
                    @click="toggleEditMode"
                    class="w-full py-2 mx-2 text-white rounded-md min-w-36 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                    編輯個人檔案
                </button>
                <div class="relative w-full ">
                    <button
                        id="dropdownButton"
                        @click="toggleMenu"
                        class="p-1 text-2xl text-gray-500 rounded-md hover:bg-amber-100 focus:outline-none"
                        >
                        ⋯
                    </button>

                    <!-- 下拉選單 -->
                    <div
                        v-if="menuVisible"
                        class="absolute left-0 z-10 w-40 mt-2 bg-white rounded-lg shadow-lg"
                    >
                        <button @click="writeReview" class="block w-full px-4 py-2 text-left text-amber-500 hover:bg-amber-100">
                            撰寫食記
                        </button>
                        <button @click="logout" class="block w-full px-4 py-2 text-left text-amber-500 hover:bg-amber-100">
                            登出
                        </button>
                    </div>
                </div>
            </div>
        
        </div>

<!-- ---------------------------------------------------------------------------------------- -->
        
        <!-- 編輯模式 -->
        <div v-else>
            <!-- 更換照片 -->
            <div class="relative flex justify-center">
                <img
                    :src="editedProfilePicture"
                    alt="Profile Picture"
                    class="object-cover w-24 h-24 border border-gray-300 rounded-full"
                    @error="handleImageError"
                />
                <label
                    for="photo-upload"
                    class="absolute inset-0 flex items-center justify-center bg-black rounded-full cursor-pointer bg-opacity-20"
                    >
                    <span class="text-xl text-white"><font-awesome-icon :icon="['fas', 'camera']" /></span>
                </label>
                <input
                    id="photo-upload"
                    type="file"
                    @change="onPhotoChange"
                    accept="image/*"
                    class="hidden"
                />
            </div>

            <!-- 編輯名字 -->
            <div class="mt-4 text-center">
                <input
                    v-model="editedUsername"
                    type="text"
                    class="w-1/2 p-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="輸入名字"
                />
            </div>

            <!-- 編輯 IG 帳號 -->
            <div class="mt-4 text-center">
                <p class="mb-2 text-sm text-gray-500">您的社群連結：</p>
                <span class="text-2xl text-amber-500"><font-awesome-icon :icon="['fab', 'instagram']" class="w-5 h-5 mr-1 text-amber-500"/></span>
                <div class="flex items-center justify-center">
                    <input
                        v-model="instagramUsername"
                        type="text"
                        placeholder="輸入 IG 帳號"
                        class="w-1/2 p-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
            </div>

            <!-- 保存/取消按鈕 -->
            <div class="flex justify-center mt-6 space-x-4">
                <button
                @click="saveProfile"
                class="px-4 py-2 text-white rounded-md bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                儲存
                </button>
                <button
                @click="cancelEdit"
                class="px-4 py-2 text-white bg-gray-400 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                取消
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    label {
        width: 6rem; 
        height: 6rem; 
        transition: background 0.3s;
        left: 50%;
        transform: translateX(-50%);
    }

    label:hover {
        background: rgba(0, 0, 0, 0.5);
    }

    input[type="file"] {
        display: none;
    }
</style>
