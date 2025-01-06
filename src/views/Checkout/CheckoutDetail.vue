<script setup>
const params = new URLSearchParams(window.location.search);
const status = params.get("status");
const transactionId = params.get("transactionId");
</script>

<template>
  <div>
    <h1>訂單明細</h1>
    <div v-if="status == 'success'">
      <h2>完成結帳</h2>
      <p>訂單編號：{{ transactionId }}</p>
      <div>
        <p>品項名稱</p>
        <p>品項單價</p>
        <p>品項數量</p>
      </div>
      <p>總金額</p>
    </div>
    <div v-else>
      <h2>付款失敗，請重新嘗試</h2>
      <p>訂單編號：{{ transactionId }}</p>
    </div>
  </div>
</template>
