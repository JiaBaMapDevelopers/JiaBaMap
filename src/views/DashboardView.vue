<script setup>
import { ref } from "vue";
import router from "../router";

const navigation = ref([
  { name: "首頁", link: "/dashboard" },
  { name: "餐廳資訊", link: "/storesignup" },
  { name: "菜單管理", link: "/menu-management" },
  { name: "訂單管理", link: "/" },
]);

const overviewCards = ref([
  { title: "總訂單數", value: 122 },
  { title: "今日營收", value: "$1,200" },
  { title: "顧客評分", value: "4.8 / 5" },
  { title: "活躍訂單", value: 3 },
]);

const recentOrders = ref([
  {
    id: "001",
    customer: "王小明",
    total: 350,
    status: "已完成",
    pickupTime: "2024-12-24 18:00",
  },
  {
    id: "002",
    customer: "李小花",
    total: 150,
    status: "進行中",
    pickupTime: "2024-12-24 19:00",
  },
  {
    id: "003",
    customer: "陳大文",
    total: 200,
    status: "已取消",
    pickupTime: "2024-12-24 17:30",
  },
]);

const currency = (value) => {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
  }).format(value);
};

const logout = () => localStorage.removeItem("storeToken");

// localStorage.setItem("storeToken", resToken.data.token);
//     if (resToken) {
//       Swal.fire({
//         title: "登入成功",
//         icon: "success",
//         timer: 2000,
//         timerProgressBar: true,
//       });
//       //token解碼後可取得店家id
//       storeId.value = jose.decodeJwt(resToken.data.token).id;
//     }
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <aside class="w-64 bg-white shadow-md">
      <div class="p-6 text-lg font-semibold text-center text-gray-800">
        餐廳後台
      </div>
      <nav>
        <ul>
          <li v-for="item in navigation" :key="item.name">
            <router-link
              :to="item.link"
              class="block px-4 text-gray-700 hover:bg-amber-400"
            >
              {{ item.name }}
            </router-link>
          </li>
        </ul>
      </nav>
      <button
        class="px-4 mt-24 text-lg font-semibold text-center text-gray-800 rounded hover:bg-amber-400"
        @click="logout"
      >
        登出
      </button>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6">
      <!-- Header -->
      <header class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">餐廳管理首頁</h1>
      </header>

      <!-- Overview Cards -->
      <section class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="card in overviewCards"
          :key="card.title"
          class="p-4 bg-white rounded shadow-md"
        >
          <h2 class="text-sm font-semibold text-gray-600">{{ card.title }}</h2>
          <p class="mt-2 text-2xl font-bold text-gray-800">{{ card.value }}</p>
        </div>
      </section>

      <!-- Recent Orders -->
      <section class="mt-8">
        <h2 class="mb-4 text-xl font-semibold text-gray-800">最近訂單</h2>
        <div class="overflow-x-auto bg-white rounded shadow-md">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th
                  class="px-4 py-2 text-sm font-semibold text-left text-gray-600"
                >
                  訂單編號
                </th>
                <th
                  class="px-4 py-2 text-sm font-semibold text-left text-gray-600"
                >
                  顧客名稱
                </th>
                <th
                  class="px-4 py-2 text-sm font-semibold text-left text-gray-600"
                >
                  總金額
                </th>
                <th
                  class="px-4 py-2 text-sm font-semibold text-left text-gray-600"
                >
                  狀態
                </th>
                <th
                  class="px-4 py-2 text-sm font-semibold text-left text-gray-600"
                >
                  取貨時間
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="order in recentOrders" :key="order.id">
                <td class="px-4 py-2 text-sm text-gray-800">{{ order.id }}</td>
                <td class="px-4 py-2 text-sm text-gray-800">
                  {{ order.customer }}
                </td>
                <td class="px-4 py-2 text-sm text-gray-800">
                  {{ order.total | currency }}
                </td>
                <td class="px-4 py-2 text-sm">
                  <span
                    :class="{
                      'text-green-500': order.status === '已完成',
                      'text-yellow-500': order.status === '進行中',
                      'text-red-500': order.status === '已取消',
                    }"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-4 py-2 text-sm text-gray-800">
                  {{ order.pickupTime }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
body {
  font-family: "TaipeiSans", sans-serif;
}
</style>
