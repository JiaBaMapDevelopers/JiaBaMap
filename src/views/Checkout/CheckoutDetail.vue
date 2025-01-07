<script setup>
const params = new URLSearchParams(window.location.search);
const status = params.get("status");
const transactionId = params.get("transactionId");
</script>

<template>
  <div
    class="flex flex-col items-center max-w-lg p-6 m-auto mt-16 mb-10 text-center bg-white border border-gray-200 rounded-lg shadow-lg"
  >
    <h1 class="mb-6 text-3xl font-semibold text-amber-500">訂單明細</h1>

    <div v-if="status == 'success'">
      <h2 class="mb-2 text-xl font-bold text-green-500">付款成功！</h2>
      <p class="mb-6 text-lg">請依照您指定的訂餐時間前往取餐。</p>
      <p class="mb-6 font-medium text-md">交易編號：{{ transactionId }}</p>

      <div class="p-4 mb-6 text-left rounded-md shadow-md bg-gray-50">
        <p class="text-sm font-semibold text-gray-700">品項名稱</p>
        <p class="text-sm text-gray-500">品項單價</p>
        <p class="text-sm text-gray-500">品項數量</p>
        <hr />
        <p class="py-1 text-lg font-bold text-gray-800">總金額</p>
      </div>
    </div>

    <div v-else>
      <h2 class="mb-2 text-xl font-bold text-red-500">付款失敗，請重新嘗試</h2>
      <p class="font-medium text-md">交易編號：{{ transactionId }}</p>
    </div>
  </div>
</template>
