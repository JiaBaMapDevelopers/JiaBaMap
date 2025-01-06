<script setup>
import { useAuth } from "@/stores/authStore";
import { useRouter, useRoute } from "vue-router";
import { ref, watchEffect, inject } from "vue";
import { storeToRefs } from "pinia";
import axios from "axios";

const auth = useAuth();
const router = useRouter();
const route = useRoute();
const $swal = inject("$swal");
const { userData } = storeToRefs(auth);

// 修改 emit 宣告，加入 validationErrors
const emit = defineEmits([
  "save",
  "preview",
  "checkContent",
  "validationErrors",
]);

const currentProfilePicture = ref("/image/default_user.png");

// 動態監聽
watchEffect(() => {
  currentProfilePicture.value =
    userData.value?.profilePicture || "/image/default_user.png";
});

// 處理圖片錯誤
const handleImageError = (event) => {
  event.target.src = "/image/default_user.png";
};

// 定義 props
const props = defineProps({
  checkContent: {
    type: Function,
    required: true,
  },
  currentTitle: {
    type: String,
    required: true,
  },
  currentRestaurantName: {
    type: String,
    required: true,
  },
  getCurrentContent: {
    type: Function,
    required: true,
  },
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

// 修改驗證函數
const validateContent = () => {
  // 直接從 DOM 獲取當前輸入值
  const title = document.getElementById("title").value;
  const restaurantName = document.getElementById("restaurant").value;

  // 發出驗證錯誤事件
  const validationErrors = {};

  // 檢查餐廳名稱
  if (!restaurantName.trim()) {
    validationErrors.restaurantName = "請填寫餐廳名稱";
  } else if (restaurantName.length > 20) {
    validationErrors.restaurantName = "餐廳名稱不能超過20個字";
  }

  // 檢查文章標題
  if (!title.trim()) {
    validationErrors.title = "請填寫文章標題";
  } else if (title.length > 20) {
    validationErrors.title = "文章標題不能超過20個字";
  }

  // 發送驗證結果
  emit("validationErrors", validationErrors);

  // 返回驗證結果
  return Object.keys(validationErrors).length === 0 && props.checkContent();
};

// 修改預覽功能
const handlePreview = async () => {
  try {
    // 先進行驗證
    if (!validateContent()) {
      return;
    }

    // 獲取當前表單所有數據
    const currentFormData = {
      date: document.getElementById("date")?.value || "",
      title: document.getElementById("title")?.value || "",
      content: props.getCurrentContent() || "",
      restaurantName: document.getElementById("restaurant")?.value || "",
      fileList: [],
    };

    // 檢查必要欄位
    if (!currentFormData.title.trim()) {
      throw new Error("請填寫文章標題");
    }

    if (!currentFormData.restaurantName.trim()) {
      throw new Error("請填寫餐廳名稱");
    }

    if (!currentFormData.content.trim()) {
      throw new Error("請填寫文章內容");
    }

    // 保存原始數據到 localStorage
    localStorage.setItem("formData", JSON.stringify(currentFormData));
    // 同時保存一份到預覽數據
    localStorage.setItem("previewNoteData", JSON.stringify(currentFormData));

    // 導航到預覽頁面
    router.push("/previewnote");
  } catch (error) {
    await swalWithBootstrapButtons.fire({
      title: "錯誤！",
      text: error.message || "預覽失敗，請確保所有必要欄位都已填寫",
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};

// 修改存檔功能
const saveAndRedirect = async () => {
  try {
    const isEditingPublished = route.query.type === "published";
    const articleId = route.query.id;

    if (isEditingPublished && articleId) {
      // 如果是編輯已發布的文章，發送 PATCH 請求更新文章
      const updateData = {
        userId: auth.userData.sub,
        restaurantName: document.getElementById("restaurant").value,
        title: document.getElementById("title").value,
        content: props.getCurrentContent(),
        eatdate: document.getElementById("date").value,
      };

      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/articles/${articleId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        },
      );

      if (response.status === 200) {
        await swalWithBootstrapButtons.fire({
          title: "成功！",
          text: "文章更新成功",
          icon: "success",
          confirmButtonText: "確定",
        });
        router.push("/myarticle?status=published");
      }
    } else {
      // 如果是新建文章或編輯草稿，保存到 localStorage
      await emit("save");
      router.push("/myarticle?status=draft");
    }
  } catch (error) {
    await swalWithBootstrapButtons.fire({
      title: "錯誤！",
      text: "儲存文章失敗，請稍後再試",
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};

// 修改發送功能，需要檢查
const submitArticle = async () => {
  try {
    if (!auth.userData) {
      await swalWithBootstrapButtons.fire({
        title: "提醒",
        text: "請先登入後再發表食記",
        icon: "warning",
        confirmButtonText: "確定",
      });
      return;
    }

    // 先進行驗證
    if (!validateContent()) {
      return;
    }

    // 先觸發保存操作
    await emit("save");

    // 使用 props 中的 checkContent 函數進行驗證
    const isValid = props.checkContent();

    if (!isValid) {
      return;
    }

    // 從 localStorage 獲取資料
    const formData = JSON.parse(localStorage.getItem("formData"));

    // 準備文章資料
    const articleData = {
      userId: auth.userData._id,
      user: auth.userData.name,
      userPhoto: auth.userData.picture || "",
      restaurantName: formData.restaurantName,
      title: formData.title,
      content: formData.content,
      photo: formData.fileList?.[0]?.data || "default-image.jpg",
      eatdate: formData.date,
    };
    const subData = new FormData();
    subData.append("userId", auth.userData._id);
    subData.append("user", auth.userData.name);
    subData.append("restaurantName", formData.restaurantName);
    subData.append("title", formData.title);
    subData.append("content", formData.content);
    subData.append("eatdate", formData.date);
    subData.append("userPhoto", auth.userData.profilePicture || "");

    const base64Data = formData.fileList?.[0].data;
    // 如果 Base64 資料存在，將其轉為 File
    if (base64Data) {
      // 提取 Base64 的資料部分
      const [meta, base64Content] = base64Data.split(",");

      // 獲取 MIME 類型（例如 "image/jpeg"）
      const mimeType = meta.match(/:(.*?);/)[1];

      // 將 Base64 解碼為二進位數據
      const binaryData = atob(base64Content);

      // 將二進位數據轉換為 Uint8Array
      const byteNumbers = new Array(binaryData.length)
        .fill(0)
        .map((_, i) => binaryData.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);

      // 建立 File 物件
      const uniqueName = `photo_${Date.now()}.jpg`;
      const file = new File([byteArray], uniqueName, { type: mimeType });
      subData.append("photo", file);
    }

    // 檢查必要欄位
    if (
      !articleData.userId ||
      !articleData.restaurantName ||
      !articleData.title ||
      !articleData.content ||
      !articleData.eatdate
    ) {
      throw new Error("請確保已填寫所有必要欄位");
    }

    // 發送到後端 API
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/articles/`,
      subData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.token}`,
        },
      },
    );

    if (response.status === 200) {
      // 清除 localStorage
      localStorage.removeItem("formData");
      localStorage.removeItem("noteData");
      localStorage.removeItem("storeData");
      localStorage.removeItem("editingDraft");
      localStorage.removeItem("previewNoteData");

      // 顯示成功訊息
      await swalWithBootstrapButtons.fire({
        title: "成功！",
        text: "食記發表成功",
        icon: "success",
        confirmButtonText: "確定",
      });

      // 直接跳轉到文章列表頁面
      router.push("/articlelist");
    }
  } catch (error) {
    let errorMessage = "發表食記失敗，請稍後再試";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    await swalWithBootstrapButtons.fire({
      title: "錯誤！",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};
</script>

<template>
  <!-- 導覽列 -->
  <header
    class="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-orange-200 px-4 py-2 flex flex-wrap items-center gap-4 md:flex-nowrap md:gap-0"
  >
    <!-- 左側內容 -->
    <div class="flex items-center space-x-4">
      <router-link to="/">
        <img
          src="@/assets/logo.jpg"
          alt="Logo"
          class="w-auto min-w-[60px] max-w-[100px] md:max-w-[130px] h-auto"
        />
      </router-link>
      <router-link
        to="/myarticle"
        class="p-2 rounded-md hover:bg-amber-100 whitespace-nowrap text-amber-500"
      >
        回到文章列表
      </router-link>
      <router-link
        to="/user"
        class="p-2 rounded-md hover:bg-amber-100 whitespace-nowrap text-amber-500"
      >
        個人頁面
      </router-link>
    </div>

    <!-- 右側內容 -->
    <div class="flex items-center space-x-4 ml-auto">
      <button
        class="bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500 transition text-sm md:text-base whitespace-nowrap"
        @click="saveAndRedirect"
      >
        存檔
      </button>
      <button
        class="bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500 transition text-sm md:text-base whitespace-nowrap"
        @click="handlePreview"
      >
        預覽
      </button>
      <button
        class="bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500 transition text-sm md:text-base whitespace-nowrap"
        @click="submitArticle"
      >
        發送
      </button>
      <!-- 會員頭貼 -->
      <div class="relative inline-block text-left group">
        <div class="w-10 h-10 rounded-full cursor-pointer bg-slate-400">
          <img
            :src="currentProfilePicture"
            alt="avatar"
            class="w-full h-full object-cover rounded-full"
            @error="handleImageError"
          />
        </div>
      </div>
    </div>
  </header>

  <!-- 內容區域 -->
  <div class="mt-16 md:mt-20 p-2">
    <slot></slot>
  </div>
</template>

<style scoped></style>
