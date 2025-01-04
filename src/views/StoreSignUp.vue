<script setup>
import { ref, onMounted } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import Swal from "sweetalert2";

const username = ref("");
const password = ref("");
const storeName = ref("");
const storeAddress = ref("");
const storePhone = ref("");
const storeTaxId = ref("");
const contactName = ref("");
const contactEmail = ref("");
const contactPhone = ref("");
const autocomplete = ref(null);

function handlePlaceChanged() {
  const place = autocomplete.value.getPlace();
  storeAddress.value = place?.formatted_address || "";
}

async function initAutocomplete() {
  try {
    const loader = new Loader({
      apiKey: "import.meta.env.VITE_GOOGLE_MAPS_API_KEY",
      version: "weekly",
      libraries: ["places"],
    });
    const { Autocomplete } = await loader.importLibrary("places");
    const autocompleteInput = document.getElementById("storeAddress");
    autocomplete.value = new Autocomplete(autocompleteInput, {
      types: ["geocode"],
    });
    autocomplete.value.addListener("place_changed", handlePlaceChanged);
  } catch (err) {
    console.error("Google Maps API 加載失敗: ", err);
  }
}

function handleSubmit() {
  const form = {
    username: username.value,
    password: password.value,
    storeName: storeName.value,
    storeAddress: storeAddress.value,
    storePhone: storePhone.value,
    storeTaxId: storeTaxId.value,
    contactName: contactName.value,
    contactEmail: contactEmail.value,
    contactPhone: contactPhone.value,
    autoComplete: autocomplete.value,
  };
  if (form) {
    console.log(form);
    Swal.fire({
      title: "Success",
      text: "註冊成功",
      icon: "success",
      confirmButtonText: "OK",
    });
  } else {
    Swal.fire({
      title: "Error",
      text: "註冊失敗",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}
onMounted(() => {
  initAutocomplete();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div
      class="contentBox bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-2xl mt-20"
    >
      <div class="titleBox flex w-full justify-center mb-4">
        <h2 class="font-bold text-2xl">成為我們的合作夥伴，</h2>
        <h2 class="font-bold text-2xl">拓展更多可能！</h2>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="username"
            >✨ 帳號名稱:</label
          >
          <input
            v-model="username"
            id="username"
            type="text"
            placeholder="請輸入帳號"
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password"
            >✨ 密碼:</label
          >
          <input
            v-model="password"
            id="password"
            type="text"
            placeholder="請輸入密碼"
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="storeName"
            >✨ 店家名稱:</label
          >
          <input
            v-model="storeName"
            id="storeName"
            type="text"
            placeholder="請輸入店家名稱"
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="storeAddress"
            >✨ 店家地址:</label
          >
          <input
            ref="autocomplete"
            v-model="storeAddress"
            id="storeAddress"
            type="text"
            placeholder="請輸入店家地址"
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="storePhone"
            >✨ 店家電話:</label
          >
          <input
            v-model="storePhone"
            id="storePhone"
            type="tel"
            placeholder="請輸入店家電話"
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="storeTaxId"
            >✨ 店家統一編號:</label
          >
          <input
            v-model="storeTaxId"
            id="storeTaxId"
            type="text"
            placeholder="請輸入店家統一編號"
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="contactName"
            >✨ 聯絡人姓名:</label
          >
          <input
            v-model="contactName"
            id="contactName"
            type="text"
            placeholder="請輸入聯絡人姓名"
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="contactEmail"
            >✨ 聯絡人信箱:</label
          >
          <input
            v-model="contactEmail"
            id="contactEmail"
            type="text"
            placeholder="請輸入聯絡人信箱"
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300"
          />
        </div>
        <div class="mb-8">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="contactPhone"
            >✨ 聯絡人電話:</label
          >
          <input
            v-model="contactPhone"
            id="contactPhone"
            type="tel"
            placeholder="請輸入聯絡人電話"
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300"
          />
        </div>
        <div class="flex items-center justify-center">
          <button
            type="submit"
            class="bg-orange-400 hover:bg-orange-500 hover:shadow-lg text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            註冊成為 JiaBaMap 的合作夥伴
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scope>
@media (max-width: 768px) {
  .contentBox {
    margin-right: 10px;
    margin-left: 10px;
  }
  .titleBox {
    flex-wrap: wrap;
  }
}
</style>
