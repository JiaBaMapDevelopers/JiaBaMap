<script setup>
import { ref } from 'vue';
</script>


<template>
    <footer class="px-4 py-6 text-center text-white bg-amber-500 md:text-left">
        <div class="container mx-auto w-[70%] flex flex-col md:flex-row  justify-between">
            <!-- 第一欄 -->
            <div class="mb-8 md:mb-0">
                <h4 class="mb-4 font-bold">相關連結</h4>
                <ul class="space-y-2">
                    
                    <li><a href="#" class="custom-underline">常見問題</a></li>
                    <li><a href="#" class="custom-underline">聯絡我們</a></li>
                    <li><a href="#" class="custom-underline">服務條款</a></li>
                    <li><a href="#" class="custom-underline">隱私政策</a></li>
                    
                </ul>
            </div>
            <!-- 第二欄 -->
            <div class="mb-8 md:mb-0">
                <h4 class="mb-4 font-bold">關於 JiaBaMap</h4>
                <ul class="space-y-2">
                    <li><router-link to="/about" class="custom-underline">開發團隊介紹</router-link> </li>
                    <li><a href="https://github.com/orangeCatGang/JiaBaMap" class="custom-underline" target="_blank">GitHub Repository</a></li>
                </ul>
            </div>
            <!-- 第三欄 -->
            <div>
                <h4 class="mb-4 font-bold">店家專區</h4>
                <ul class="space-y-2">
                    <li><a href="#" class="custom-underline">如何加入愛食記？</a></li>
                    <li><a href="#" class="custom-underline">聯繫部落客</a></li>
                </ul>
                <p class="mt-4 text-sm text-amber-100">v: 1.8.3, 67</p>
            </div>
        </div>
        <!-- 底部版權 -->
        <div class="mt-4 text-center text-amber-100">
            <p>Copyright © JiaBaMap 開發團隊 2024-2025 🐈</p>
        </div>
    </footer>
</template>

<style scoped>
.custom-underline:hover {
    text-decoration: underline;
    text-underline-offset: 4px; /* 你可以調整這個值來改變底線的距離 */
}
</style>