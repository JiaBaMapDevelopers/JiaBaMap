<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuth } from "@/stores/authStore";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const user = useAuth();
const userData = computed(() => user.userData);
const storeId = "677eadb14dabab3aff8878c2";
const categoryRefs = ref([]);
const selectedCategory = ref(0);
const cartItems = ref([]);
const menus = ref([]);

const placeId = route.params.storeId
(placeId);


// 店家資訊狀態
const storeInfo = ref({
  name: "",
  address: "",
  phone: "",
  description: "",
  businessHours: "",
});

// // 獲取店家資訊
// const fetchStoreInfo = async () => {
//   try {
//     const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/get:${placeId}/${storeId}`);
//     if (response.data) {
//       // 更新店家資訊
//       storeInfo.value = {
//         ...storeInfo.value,
//         ...response.data
//       };
//     }
//   } catch (error) {
//     console.error('獲取店家資訊失敗：', error);
//     Swal.fire({
//       title: '錯誤',
//       text: '無法獲取店家資訊',
//       icon: 'error'
//     });
//   }
// };

// 將菜單按分類整理的計算屬性
const categorizedMenu = computed(() => {
  // 獲取所有有效的分類（根據後端定義）
  const validCategories = ["飲料", "主食", "甜點", "湯品"];
  return validCategories
    .map((category) => ({
      name: category,
      // 只顯示該分類下可用的商品
      items: menus.value.filter(
        (item) => item.category === category && item.isAvailable !== false,
      ),
    }))
    .filter((category) => category.items.length > 0); // 只顯示有商品的分類
});

// 獲取菜單數據
const fetchMenus = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/menu`,
      {
        params: {
          placeId: placeId,
          limit: 50, // 設定較大的限制以確保獲取所有菜單項目
        },
      },
    );

    if (response.data && Array.isArray(response.data.menus)) {
      menus.value = response.data.menus;
    } else {
      console.error("菜單數據格式錯誤");
      menus.value = [];
    }
  } catch (error) {
    console.error("獲取菜單失敗：", error);
    Swal.fire({
      title: "錯誤",
      text: "無法獲取菜單數據",
      icon: "error",
    });
  }
};

const scrollToCategory = (index) => {
  selectedCategory.value = index;
  categoryRefs.value[index]?.scrollIntoView({ behavior: "smooth" });
};

// Intersection Observer for active category
onMounted(async () => {
  await fetchMenus();
  await fetchStoreInfo();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = categoryRefs.value.findIndex(
            (ref) => ref === entry.target,
          );
          if (index !== -1) {
            selectedCategory.value = index;
          }
        }
      });
    },
    { threshold: 0.5 },
  );

  setTimeout(() => {
    categoryRefs.value.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
  }, 100);
});

const calculateItemPrice = (item, options) => {
  let totalPrice = item.price;
  return totalPrice;
};

const openItemModal = async (item) => {
  if (!item.isAvailable) {
    Swal.fire({
      title: "商品未上架",
      text: "此商品目前無法購買",
      icon: "info",
    });
    return;
  }

  let quantity = 1;

  const { value: note } = await Swal.fire({
    title: item.name,
    html: `
      <div class='flex flex-col items-center'>
        <div class='mb-4'>
          <img src='${item.imageUrl}' alt='商品圖片' class='object-cover w-24 h-24'>
        </div>
        <div class='text-gray-600'>
          單價: <span class='text-red-500'>\$${item.price}</span>
        </div>
        <div class='mt-2 text-sm text-gray-600'>${item.description || ""}</div>
        <input type='text' id='note-input' placeholder='備註' 
          class='w-full p-2 mt-4 border border-gray-300 rounded-md' />
        <div class='flex items-center mt-4'>
          <button id='decrement-btn' class='px-2 py-1 bg-gray-300 rounded-md'>-</button>
          <div class='mx-4'><span id='quantity'>1</span></div>
          <button id='increment-btn' class='px-2 py-1 bg-gray-300 rounded-md'>+</button>
        </div>
        <div class='mt-2 text-gray-600'>總價: <span id='total-price' class='text-red-500'>\$${item.price}</span></div>
      </div>
    `,
    confirmButtonText: "加入購物車",
    showCancelButton: true,
    cancelButtonText: "取消",
    customClass: {
      confirmButton: "bg-amber-500 text-white",
      cancelButton: "bg-gray-300 text-gray-800",
    },
    didOpen: () => {
      const quantityElement = document.querySelector("#quantity");
      const totalPriceElement = document.querySelector("#total-price");
      const decrementBtn = document.querySelector("#decrement-btn");
      const incrementBtn = document.querySelector("#increment-btn");

      decrementBtn.addEventListener("click", () => {
        if (quantity > 1) {
          quantity -= 1;
          quantityElement.textContent = quantity;
          totalPriceElement.textContent = item.price * quantity;
        }
      });

      incrementBtn.addEventListener("click", () => {
        quantity += 1;
        quantityElement.textContent = quantity;
        totalPriceElement.textContent = item.price * quantity;
      });
    },
    preConfirm: () => {
      const noteInput = document.getElementById("note-input");
      return noteInput ? noteInput.value : "";
    },
  });

  if (note !== undefined) {
    cartItems.value.push({
      id: Date.now(),
      item,
      quantity,
      itemPrice: item.price * quantity,
      note,
    });

    const cartItem = {
      productId: item._id,
      productName: item.name,
      price: item.price,
      quantity,
    };

    const orderData = {
      customerId: userData.value._id,
      storeId: item.storeId,
      storeName: "12:59早午餐Brunch.Pasta.Coffee.Dessert",
      pickupTime: Date.now(),
      items: [cartItem],
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/order/`,
      orderData,
    );

    await Swal.fire({
      title: "成功",
      text: "已加入購物車",
      icon: "success",
      timer: 1500,
    });
  }
};

const goToCart = () => {
  // 跳轉到指定路由
  router.push({ name: "Cart" });
};
</script>

<template>
  <div class="container mx-auto mt-8 sm:mt-16">
    <!-- Header Section -->
    <header class="px-4 mb-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div>
            <!-- <h1 class="text-2xl font-bold text-gray-600">{{ storeInfo.name }}</h1> -->
            <h1 class="text-2xl font-bold text-gray-600">
              12:59早午餐Brunch.Pasta.Coffee.Dessert
            </h1>
            <div class="text-sm text-gray-600">
              <!-- <span>{{ storeInfo.businessHours }}</span> -->
              <span>11:00-16:00</span>
            </div>
            <!-- <div class="text-sm text-gray-600">
              <font-awesome-icon :icon="['fas', 'location-dot']" class="text-orange-400" />
              {{ storeInfo.address }} &nbsp;
              <font-awesome-icon :icon="['fas', 'phone']" class="text-orange-400" /> {{ storeInfo.phone }}
            </div> -->
            <div class="text-sm text-gray-600">
              <font-awesome-icon
                :icon="['fas', 'location-dot']"
                class="text-orange-400"
              />
              108台灣台北市萬華區昆明街257巷14號1樓 &nbsp;
              <font-awesome-icon
                :icon="['fas', 'phone']"
                class="text-orange-400"
              />
              02 2302 6163
            </div>
            <div
              v-if="storeInfo.description"
              class="mt-2 text-sm text-gray-600"
            >
              {{ storeInfo.description }}
            </div>
          </div>
        </div>
        <button
          @click="goToCart"
          class="px-4 py-2 text-white rounded bg-amber-500 hover:bg-amber-400"
        >
          購物車 ({{ cartItems.length }})
        </button>
      </div>
    </header>

    <!-- Mobile Navigation -->
    <nav
      class="sticky top-0 z-10 overflow-x-auto bg-white rounded-md shadow md:hidden no-scrollbar"
    >
      <div class="flex whitespace-nowrap">
        <button
          v-for="(category, index) in categorizedMenu"
          :key="index"
          :class="[
            'px-4 py-2 text-sm font-semibold',
            selectedCategory === index
              ? 'text-amber-500 border-b-2 border-amber-500'
              : 'text-gray-600',
          ]"
          @click="scrollToCategory(index)"
        >
          {{ category.name }}
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="grid grid-cols-1 gap-8 px-4 mt-8 md:grid-cols-3">
      <div
        v-for="(category, index) in categorizedMenu"
        :key="index"
        :ref="(el) => (categoryRefs[index] = el)"
        class="scroll-mt-16"
      >
        <h2 class="mb-4 text-lg font-bold text-amber-500">
          {{ category.name }}
        </h2>
        <ul class="space-y-4">
          <li
            v-for="item in category.items"
            :key="item._id"
            class="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-amber-100"
            @click="openItemModal(item)"
          >
            <div class="flex items-center space-x-4">
              <img
                :src="item.imageUrl"
                alt="商品圖片"
                class="object-cover w-16 h-16 rounded"
              />
              <div>
                <span class="text-gray-800">{{ item.name }}</span>
                <p class="text-sm text-gray-600">{{ item.description }}</p>
              </div>
            </div>
            <span class="text-gray-800">${{ item.price }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.option-btn {
  transition: all 0.3s ease;
}

.quantity-btn {
  @apply bg-gray-100 rounded;
}

.quantity-btn:hover {
  @apply bg-amber-200;
}

.delete-btn:hover {
  @apply text-red-700;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
