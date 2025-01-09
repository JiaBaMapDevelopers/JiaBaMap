<template>
  <footer class="px-4 py-6 text-center text-white bg-amber-500 md:text-left">
    <div
      class="container mx-auto md:w-[70%] w-full flex flex-col md:flex-row justify-between"
    >
      <!-- 第一欄 -->
      <div class="mb-4 md:mb-0">
        <h4 class="mb-2 font-bold text-base">相關連結</h4>
        <ul class="space-y-1 md:space-y-2 text-sm">
          <li><router-link to="/terms" class="custom-underline">服務條款</router-link></li>
          <li><router-link to="/privacy" class="custom-underline">隱私政策</router-link></li>
        </ul>
      </div>
      <!-- 第二欄 -->
      <div class="mb-4 md:mb-0">
        <h4 class="mb-2 font-bold text-base">關於 JiaBaMap</h4>
        <ul class="space-y-1 md:space-y-2 text-sm">
          <li>
            <a href="https://www.canva.com/design/DAGY3pLD_zg/1ZokMVpM61N9hjnGItUVsg/view?utm_content=DAGY3pLD_zg&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h6f6850c528" target="_blank" class="custom-underline">
              開發團隊介紹
            </a>
          </li>
          <li>
            <a
              href="https://github.com/orangeCatGang/JiaBaMap"
              class="custom-underline"
              target="_blank"
              >GitHub Repository</a
            >
          </li>
        </ul>
      </div>
      <!-- 第三欄 -->
      <div>
        <h4 class="mb-2 font-bold text-base">店家專區</h4>
        <ul class="space-y-1 md:space-y-2 text-sm">
          <li><router-link to="/storesignup" class="custom-underline">店家註冊</router-link></li>
          <li><router-link to="/storesignin" class="custom-underline">店家登入</router-link></li>
        </ul>
        <p class="mt-2 text-xs md:text-sm text-amber-100">version: 1.0.0</p>
      </div>
    </div>

    <!-- 底部版權 -->
    <div class="mt-2 md:mt-4 text-center text-xs md:text-sm text-amber-100">
      <p>Copyright © JiaBaMap 開發團隊 2024-2025 🐈</p>
    </div>
  </footer>
</template>

<style scoped>
.custom-underline:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}
</style>
