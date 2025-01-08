<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const imageFile = ref(null); // 儲存上傳的檔案
const storeId = "67720e635123faace157e5b3";
const menus = ref([]);
const showModal = ref(false);
const isEditing = ref(false);
const menuForm = ref({
  name: "",
  price: "",
  category: "",
});
const editingId = ref(null);
// 搜尋與分頁狀態管理
const searchQuery = ref("");
const selectedCategory = ref("");
const minPrice = ref("");
const maxPrice = ref("");
const currentPage = ref(1);
const totalPages = ref(1);

// 開啟新增彈窗
const openAddModal = () => {
  isEditing.value = false; // 確保是新增模式
  menuForm.value = { name: "", price: "", category: "" };
  showModal.value = true; // 打開彈窗
};

// 驗證函數
const validateForm = () => {
  if (!menuForm.value.name.trim()) {
    alert("名稱不能為空！");
    return false;
  }
  if (!menuForm.value.category.trim()) {
    alert("分類不能為空！");
    return false;
  }
  if (!menuForm.value.price || menuForm.value.price <= 0) {
    alert("價格必須大於 0！");
    return false;
  }
  return true;
};

// 處理圖片選擇
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  menuForm.value.image = file; // 暫存圖片檔案
};

// 更新 fetchMenus 支援搜尋與分頁
const fetchMenus = async (page = 1) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/menu`,
      {
        params: {
          page,
          limit: 10, // 每頁 10 筆資料
          name: searchQuery.value,
          category: selectedCategory.value,
          minPrice: minPrice.value || undefined,
          maxPrice: maxPrice.value || undefined,
          storeId: "67720e635123faace157e5b3", // 確保這裡傳的是正確的 ObjectId
        },
      },
    );

    // 更新資料與分頁狀態
    menus.value = Array.isArray(response.data.menus) ? response.data.menus : [];
    totalPages.value = response.data.totalPages;
    currentPage.value = response.data.currentPage;

    console.log("查詢結果：", menus.value);
  } catch (error) {
    console.error("取得菜單資料失敗：", error);
    alert("無法取得菜單資料，請檢查後端連線！");
  }
};

const addMenu = async () => {
  if (!validateForm()) return;

  try {
    const formData = new FormData();
    formData.append("name", menuForm.value.name);
    formData.append("description", menuForm.value.description); // 新增描述
    formData.append("price", menuForm.value.price);
    formData.append("category", menuForm.value.category);
    formData.append("storeId", storeId);

    // 檢查圖片並加入
    if (menuForm.value.image) {
      formData.append("image", menuForm.value.image); // 圖片檔案
    }

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/menu`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.status === 200 && response.data._id) {
      menus.value.push(response.data); // 更新畫面
      closeModal();
      alert("新增成功！");
    }
  } catch (error) {
    console.error("新增菜單失敗：", error);
    alert("新增失敗！");
  }
};

// 開啟編輯彈窗
const openEditModal = (menu) => {
  isEditing.value = true;
  editingId.value = menu._id;
  menuForm.value = { ...menu };
  showModal.value = true;
};

const updateMenu = async () => {
  try {
    const formData = new FormData();
    formData.append("name", menuForm.value.name);
    formData.append("description", menuForm.value.description); // 新增描述
    formData.append("price", menuForm.value.price);
    formData.append("category", menuForm.value.category);

    // 檢查是否有新的圖片需要更新
    if (menuForm.value.image) {
      formData.append("image", menuForm.value.image); // 圖片檔案
    }

    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/menu/${editingId.value}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.status === 200) {
      const index = menus.value.findIndex(
        (menu) => menu._id === editingId.value,
      );
      menus.value[index] = response.data; // 更新畫面
      closeModal();
      alert("更新成功！");
    }
  } catch (error) {
    console.error("更新菜單失敗：", error);
    alert("更新失敗！");
  }
};

const deleteMenu = async (id) => {
  if (confirm("確定要刪除嗎？")) {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/menu/${id}`);
      menus.value = menus.value.filter((menu) => menu._id !== id);
    } catch (error) {
      console.error("刪除失敗：", error);
      alert("刪除失敗！");
    }
  }
};

const closeModal = () => {
  showModal.value = false;
  isEditing.value = false;
  menuForm.value = { name: "", description: "", price: "", category: "" };
};

onMounted(fetchMenus);
</script>

<template>
  <div class="p-6 mt-10">
    <!-- 標題 -->
    <div class="flex justify-between">
      <h1 class="mb-4 text-2xl font-bold">菜單管理</h1>
      <button>
        <router-link
          to="/dashboard"
          class="px-4 py-2 mb-4 text-white transition rounded bg-amber-400 hover:bg-amber-500"
          >首頁</router-link
        >
      </button>
    </div>

    <!-- 新增按鈕 -->
    <button
      @click="openAddModal"
      class="px-4 py-2 mb-4 text-white transition rounded bg-amber-400 hover:bg-amber-500"
    >
      新增菜單
    </button>

    <!-- 搜尋與篩選功能 -->
    <div class="flex items-center gap-4 mb-4">
      <!-- 名稱搜尋 -->
      <input
        v-model="searchQuery"
        @keyup.enter="fetchMenus(1)"
        placeholder="搜尋名稱..."
        class="p-2 border rounded w-60"
      />

      <!-- 分類篩選 -->
      <select v-model="selectedCategory" class="p-2 border rounded">
        <option value="">所有分類</option>
        <option value="飲料">飲料</option>
        <option value="主食">主食</option>
        <option value="甜點">甜點</option>
        <option value="湯品">湯品</option>
      </select>

      <!-- 價格範圍 -->
      <input
        v-model.number="minPrice"
        placeholder="最低價格"
        class="p-2 border rounded w-28"
      />
      <input
        v-model.number="maxPrice"
        placeholder="最高價格"
        class="p-2 border rounded w-28"
      />

      <!-- 搜尋按鈕 -->
      <button
        @click="fetchMenus(1)"
        class="px-4 py-2 text-white transition rounded bg-amber-400 hover:bg-amber-500"
      >
        搜尋
      </button>
    </div>

    <!-- 分頁按鈕 -->
    <div class="flex justify-center gap-2 my-4">
      <!-- 上一頁 -->
      <button
        @click="fetchMenus(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
      >
        上一頁
      </button>

      <!-- 頁碼按鈕 -->
      <button
        v-for="page in totalPages"
        :key="page"
        @click="fetchMenus(page)"
        :class="[
          'px-4 py-2 rounded',
          page === currentPage
            ? 'bg-amber-400 text-white'
            : 'bg-amber-300 hover:bg-amber-400 text-white',
        ]"
      >
        {{ page }}
      </button>

      <!-- 下一頁 -->
      <button
        @click="fetchMenus(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-200"
      >
        下一頁
      </button>
    </div>

    <!-- 菜單列表 -->
    <table class="min-w-full border border-collapse border-gray-300 table-auto">
      <thead>
        <tr class="bg-gray-100">
          <th class="px-4 py-2 border border-gray-300">圖片</th>
          <!-- 新增圖片欄 -->
          <th class="px-4 py-2 border border-gray-300">名稱</th>
          <th class="px-4 py-2 border border-gray-300">描述</th>
          <!-- 標題 -->
          <th class="px-4 py-2 border border-gray-300">價格</th>
          <th class="px-4 py-2 border border-gray-300">分類</th>
          <th class="px-4 py-2 border border-gray-300">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="menu in menus" :key="menu._id">
          <td class="px-4 py-2 text-center border border-gray-300">
            <div class="flex items-center justify-center">
              <img
                v-if="menu.imageUrl"
                :src="menu.imageUrl"
                alt="圖片"
                class="object-cover w-16 h-16 rounded"
              />
            </div>
          </td>
          <td class="px-4 py-2 border border-gray-300">{{ menu.name }}</td>
          <td class="px-4 py-2 border border-gray-300">
            {{ menu.description }}
          </td>
          <td class="px-4 py-2 border border-gray-300">${{ menu.price }}</td>
          <td class="px-4 py-2 border border-gray-300">{{ menu.category }}</td>
          <td class="px-4 py-2 border border-gray-300">
            <button
              @click="openEditModal(menu)"
              class="px-3 py-1 mr-2 text-white transition rounded bg-amber-400 hover:bg-amber-500"
            >
              編輯
            </button>
            <button
              @click="deleteMenu(menu._id)"
              class="px-3 py-1 text-white transition bg-gray-400 rounded hover:bg-gray-500"
            >
              刪除
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 新增/編輯菜單彈窗 -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
    >
      <div class="p-6 bg-white rounded shadow-lg w-96">
        <h2 class="mb-4 text-xl font-bold">
          {{ isEditing ? "編輯菜單" : "新增菜單" }}
        </h2>
        <form @submit.prevent="isEditing ? updateMenu() : addMenu()">
          <div class="mb-4">
            <label class="block mb-1">圖片</label>
            <input
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              class="w-full p-2 border rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block mb-1">名稱</label>
            <input
              v-model="menuForm.name"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block mb-1">描述</label>
            <textarea
              v-model="menuForm.description"
              rows="3"
              placeholder="請輸入描述"
              class="w-full p-2 border rounded"
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block mb-1">價格</label>
            <input
              v-model.number="menuForm.price"
              type="number"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block mb-1">分類</label>
            <select
              v-model="menuForm.category"
              class="w-full p-2 border rounded"
              required
            >
              <option value="">請選擇分類</option>
              <option value="飲料">飲料</option>
              <option value="主食">主食</option>
              <option value="甜點">甜點</option>
              <option value="湯品">湯品</option>
            </select>
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 mr-2 text-white transition bg-gray-400 rounded hover:bg-gray-500"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-white transition rounded bg-amber-400 hover:bg-amber-500"
            >
              {{ isEditing ? "更新" : "新增" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
