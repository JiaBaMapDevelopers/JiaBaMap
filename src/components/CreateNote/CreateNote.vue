<template>
  <div class="min-h-screen w-full bg-white">
    <CreateNoteNavbar @save="saveNote" @preview="goToPreview" />
    <div class="max-w-4xl mx-auto mt-6 m-11 p-4 md:p-4 bg-white rounded-lg shadow-lg
    ">
      <div class="mb-4 flex items-center">
        <label for="date" class="block text-sm font-medium text-gray-700 mr-2">用餐日期：</label>
        <input
          type="date"
          id="date"
          v-model="date"
          class="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">文章標題</label>
        <input
          id="title"
          type="text"
          v-model="title"
          placeholder="輸入文章標題"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">文章內容</label>
        <div
          contenteditable="true"
          ref="editor"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-base h-100 overflow-y-auto"
          @input="updateContent"
        ></div>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">插入圖片</label>
        <input
          type="file"
          @change="onImageSelect"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md  file:bg-amber-400 file:text-white hover:file:bg-amber-500 file:transition file:cursor-pointer"
        />
        <!-- 顯示已插入的檔案名稱 -->
        <ul class="mt-2">
          <li
            v-for="file in fileList"
            :key="file.name"
            class="text-sm text-gray-600"
          >
            已插入檔案：{{ file.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CreateNoteNavbar from "@/components/CreateNote/CreateNoteNavbar.vue";
import { useRouter } from "vue-router";

const router = useRouter(); // 使用 Vue 3 router

// 定義響應式變數
const date = ref("");
const title = ref("");
const content = ref("");
const fileList = ref([]); // 儲存檔案清單
const editor = ref(null); // 綁定編輯器

// 初始化草稿資料
onMounted(() => {
  const noteData = localStorage.getItem("noteData");
  if (noteData) {
    const parsedData = JSON.parse(noteData);
    date.value = parsedData.date || "";
    title.value = parsedData.title || "";
    content.value = parsedData.content || "";
    fileList.value = parsedData.fileList || []; // 恢復檔案清單

    // 填充 contenteditable 區域
    if (editor.value) {
      editor.value.innerHTML = content.value; // 確保初始化內容
    }
  }
});

// 更新內容時檢查圖片是否仍然存在
const updateContent = () => {
  if (editor.value) {
    // 1. 更新內容
    content.value = editor.value.innerHTML;

    // 2. 檢查內容中仍存在的圖片
    const imgTags = editor.value.querySelectorAll("img");
    const existingImages = Array.from(imgTags).map((img) => img.src);

    // 3. 過濾 fileList，只保留仍在內容中的圖片
    fileList.value = fileList.value.filter((file) =>
      existingImages.includes(file.data)
    );
  }
};

// 處理圖片插入
const onImageSelect = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    editor.value.focus(); // 確保聚焦輸入框

    // 插入圖片 HTML
    const imageHtml = `
      <div class="my-4">
        <img src="${e.target.result}" alt="插入圖片" 
          class="max-w-full mx-auto block rounded" 
          style="max-width: auto; height: 300px;">
      </div>
    `;
    insertHtmlAtCursor(imageHtml); // 插入圖片

    // 更新檔案清單
    fileList.value.push({
      name: file.name,
      data: e.target.result,
    });

    // 確保內容更新
    updateContent();
  };
  reader.readAsDataURL(file);
};

// 強制插入 HTML 到游標位置
const insertHtmlAtCursor = (html) => {
  const selection = window.getSelection(); // 選取範圍
  const editorElement = editor.value;

  // 若未選取範圍或未聚焦，將游標移動到內容末尾
  if (!selection || selection.rangeCount === 0) {
    editorElement.focus(); // 聚焦內容框
    const range = document.createRange();
    range.selectNodeContents(editorElement); // 設置選取內容
    range.collapse(false); // 游標設置到最後
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // 插入 HTML
  const range = selection.getRangeAt(0);
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const fragment = document.createDocumentFragment();
  let node;
  while ((node = tempDiv.firstChild)) {
    fragment.appendChild(node);
  }
  range.insertNode(fragment);
  range.collapse(false); // 保持游標在插入圖片後

  // 更新內容
  updateContent();
};

// 儲存筆記
const saveNote = () => {
  // 更新內容並檢查圖片是否仍存在
  updateContent();

  // 檢查內容是否為空
  if (!content.value.trim()) {
    alert("請填寫內容後再存檔！");
    fileList.value = []; // 清空檔案清單
    localStorage.removeItem("noteData"); // 清除本地存檔資料
    return;
  }

  // 儲存筆記資料
  const noteData = {
    date: date.value,
    title: title.value,
    content: content.value,
    fileList: fileList.value, // 僅保留存在內容中的圖片
  };
  localStorage.setItem("noteData", JSON.stringify(noteData));
  alert("文章已存檔！");
};

// 預覽筆記
const goToPreview = () => {
  // 更新內容並檢查圖片是否仍存在
  updateContent();

  // 檢查內容是否為空
  if (!content.value.trim()) {
    alert("請填寫內容後再預覽！");
    fileList.value = []; // 清空檔案清單
    localStorage.removeItem("noteData"); // 清除本地存檔資料
    return;
  }

  // 儲存筆記資料並跳轉到預覽頁面
  const noteData = {
    date: date.value,
    title: title.value,
    content: content.value,
    fileList: fileList.value, // 僅保留存在內容中的圖片
  };
  localStorage.setItem("noteData", JSON.stringify(noteData));
  router.push("/previewnote");
};
</script>


<style scoped>
/* 圖片樣式 */
img {
  display: block;
  margin: auto;
  max-width: 100%;
  border-radius: 0.375rem; /* 圓角 */
}

input[type="file"]::-webkit-file-upload-button {
  border: none;
}
</style>
