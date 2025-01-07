<script setup>
import axios from 'axios';
import {useAuth} from "@/stores/authStore"
import {ref, onMounted} from "vue"

const user = useAuth();
const orders = ref([])


const getOrder = async() => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/order/${user.userData._id}`)
  orders.value = response.data
}

const delOrder = async(orderId) => {
  await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/order/${orderId}`)
  await getOrder()
}
console.log(orders);

onMounted(() => {
  getOrder()
})
</script>

<template>
  <div class="p-6">
    <div class="min-h-screen bg-gray-100 py-8">
      <div v-if="orders.length > 0">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        <div v-for="order in orders" class="bg-white p-4 rounded-lg shadow-md">
          <p class="text-gray-500 text-sm text-right">{{ order.orderTime.slice(0, 10) }}</p>

          <div class="flex justify-center my-4">
            <img
              class="w-16 h-16 rounded-full"
              src=""
              alt="商品圖片"
            />
          </div>

          <p class="text-center text-gray-700">{{ 0 }} 項商品</p>
          <p class="text-center text-gray-500">{{ order.restaurantName }}</p>

          <div class="my-4 border-t"></div>

          <p class="text-center text-lg font-bold text-gray-800">
            共 {{ order.totalAmount }} 元
          </p>

          <div class="flex items-center justify-between mt-4">
            <!-- 空白填充，使中間對齊 -->
            <div class="h-6 w-6 ml-4 text-red-500 hover:text-red-600"></div>

            <button
              class="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              立刻結帳
            </button>

            <button @click="delOrder(order.orderId)" class="ml-4 text-red-500 hover:text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 4h6m-7 0a1 1 0 00-1 1v1h10V5a1 1 0 00-1-1m-4 0V3a1 1 0 00-2 0v1z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>購物車是空的</p>
    </div>
  </div>
</div>
</template>
