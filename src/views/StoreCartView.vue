<script setup>
import { ref, onMounted, computed } from 'vue';
import Swal from 'sweetalert2';
import axios from 'axios';

const storeId = '67720e635123faace157e5b3';
const categoryRefs = ref([]);
const selectedCategory = ref(0);
const cartItems = ref([]);
const menus = ref([]);


// 店家資訊狀態
const storeInfo = ref({
  name: '',
  address: '',
  phone: '',
  description: '',
  businessHours: ''
});

// 獲取店家資訊
const fetchStoreInfo = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/get:${placeId}/${storeId}`);
    if (response.data) {
      // 更新店家資訊
      storeInfo.value = {
        ...storeInfo.value,
        ...response.data
      };
    }
  } catch (error) {
    console.error('獲取店家資訊失敗：', error);
    Swal.fire({
      title: '錯誤',
      text: '無法獲取店家資訊',
      icon: 'error'
    });
  }
};


// 將菜單按分類整理的計算屬性
const categorizedMenu = computed(() => {
  // 獲取所有有效的分類（根據後端定義）
  const validCategories = ['飲料', '主食', '甜點', '湯品'];
  return validCategories.map(category => ({
    name: category,
    // 只顯示該分類下可用的商品
    items: menus.value.filter(item => item.category === category && item.isAvailable !== false)
  })).filter(category => category.items.length > 0); // 只顯示有商品的分類
});

// 獲取菜單數據
const fetchMenus = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/menu`, {
      params: {
        storeId,
        limit: 50  // 設定較大的限制以確保獲取所有菜單項目
      }
    });
    
    if (response.data && Array.isArray(response.data.menus)) {
      menus.value = response.data.menus;
    } else {
      console.error('菜單數據格式錯誤');
      menus.value = [];
    }
  } catch (error) {
    console.error('獲取菜單失敗：', error);
    Swal.fire({
      title: '錯誤',
      text: '無法獲取菜單數據',
      icon: 'error'
    });
  }
};

const scrollToCategory = (index) => {
  selectedCategory.value = index;
  categoryRefs.value[index]?.scrollIntoView({ behavior: 'smooth' });
};

// Intersection Observer for active category
onMounted( async () => {
  await fetchMenus();
  await fetchStoreInfo();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = categoryRefs.value.findIndex(ref => ref === entry.target);
          if (index !== -1) {
            selectedCategory.value = index;
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  setTimeout(() => {
    categoryRefs.value.forEach(ref => {
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
      title: '商品未上架',
      text: '此商品目前無法購買',
      icon: 'info'
    });
    return;
  }

  const { value: formValues } = await Swal.fire({
    title: item.name,
    html: `
      <div class='flex flex-col items-center'>
        <div class='mb-4'>
          <img src='${item.imageUrl }' alt='商品圖片' class='w-24 h-24 object-cover'>
        </div>
        <div class='text-sm text-gray-600'>
          價格: <span class='text-red-500'>\$${item.price}</span>
        </div>
        ${item.description ? `<div class='mt-2 text-sm text-gray-600'>${item.description}</div>` : ''}
      </div>
    `,
    confirmButtonText: '加入購物車',
    showCancelButton: true,
    cancelButtonText: '取消',
    customClass: {
      confirmButton: 'bg-amber-500 text-white',
      cancelButton: 'bg-gray-300 text-gray-800',
    },
    didOpen: () => {
      const groups = document.querySelectorAll('[data-required="true"]');
      groups.forEach(group => {
        const buttons = group.querySelectorAll('.option-btn');
        buttons.forEach(button => {
          button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('bg-amber-500', 'text-white'));
            button.classList.add('bg-amber-500', 'text-white');
          });
        });
      });
    }
  });

  if (formValues === true) {
    const cartItem = {
      id: Date.now(),
      item,
      quantity: 1,
      itemPrice: calculateItemPrice(item)
    };
    cartItems.value.push(cartItem);
    
    await Swal.fire({
      title: '成功',
      text: '已加入購物車',
      icon: 'success',
      timer: 1500
    });
  }
};

const openCart = async () => {
  if (cartItems.value.length === 0) {
    await Swal.fire({
      title: '購物車是空的',
      icon: 'info'
    });
    return;
  }

  const totalAmount = cartItems.value.reduce(
    (sum, cartItem) => sum + cartItem.itemPrice * cartItem.quantity,
    0
  );

  const cartHtml = cartItems.value.map((cartItem, index) => `
    <div class="flex items-center justify-between border-b py-2">
      <div>
        <h3 class="font-semibold">${cartItem.item.name}</h3>
        <p class="text-sm text-gray-600">
        </p>
        <p class="text-sm text-gray-600">
          單價: $${cartItem.itemPrice}
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <button class="quantity-btn px-2" data-action="decrease" data-index="${index}">-</button>
        <span class="quantity-display" data-index="${index}">${cartItem.quantity}</span>
        <button class="quantity-btn px-2" data-action="increase" data-index="${index}">+</button>
        <button class="delete-btn text-red-500 ml-2" data-index="${index}">×</button>
      </div>
    </div>
  `).join('');

  await Swal.fire({
    title: '購物車',
    html: `
      <div class="max-h-96 overflow-y-auto">
        ${cartHtml}
      </div>
      <div class="mt-4 text-right font-semibold text-lg">
        總金額: <span class="total-amount text-red-500">\$${totalAmount.toFixed(2)}</span>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: '結帳',
    cancelButtonText: '繼續購物',
    didOpen: () => {
      document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(btn.dataset.index);
          const action = btn.dataset.action;

          if (action === 'increase') {
            cartItems.value[index].quantity++;
          } else if (action === 'decrease' && cartItems.value[index].quantity > 1) {
            cartItems.value[index].quantity--;
          }

          document.querySelector(`.quantity-display[data-index="${index}"]`).textContent = 
            cartItems.value[index].quantity;

          const newTotal = cartItems.value.reduce(
            (sum, cartItem) => sum + cartItem.itemPrice * cartItem.quantity,
            0
          );
          document.querySelector('.total-amount').textContent = `\$${newTotal.toFixed(2)}`;
        });
      });

      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(btn.dataset.index);
          cartItems.value.splice(index, 1);

          if (cartItems.value.length > 0) {
            openCart();
          } else {
            Swal.close();
          }
        });
      });
    }
  });
};

</script>

<template>
  <div class="container mx-auto mt-8 sm:mt-16">
    <!-- Header Section -->
    <header class="mb-8 px-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-600">{{ storeInfo.name }}</h1>
            <div class="text-sm text-gray-600">
              
              <span>{{ storeInfo.businessHours }}</span>
            </div>
            <div class="text-sm text-gray-600">
              <i class="fas fa-map-marker-alt"></i>
              {{ storeInfo.address }} &nbsp;
              <i class="fas fa-phone-alt"></i> {{ storeInfo.phone }}
            </div>
            <div v-if="storeInfo.description" class="text-sm text-gray-600 mt-2">
              {{ storeInfo.description }}
            </div>
          </div>
        </div>
        <button 
          @click="openCart"
          class="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-400"
        >
          購物車 ({{ cartItems.length }})
        </button>
      </div>
    </header>

    <!-- Mobile Navigation -->
    <nav class="md:hidden sticky top-0 z-10 bg-white rounded-md shadow overflow-x-auto no-scrollbar">
      <div class="flex whitespace-nowrap">
        <button 
          v-for="(category, index) in categorizedMenu" 
          :key="index"
          :class="[
            'px-4 py-2 text-sm font-semibold',
            selectedCategory === index ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-600'
          ]"
          @click="scrollToCategory(index)"
        >
          {{ category.name }}
        </button>
      </div>
    </nav>


    <!-- Main Content -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 mt-8">
      <div 
        v-for="(category, index) in categorizedMenu" 
        :key="index" 
        :ref="el => categoryRefs[index] = el"
        class="scroll-mt-16"
      >
        <h2 class="text-amber-500 font-bold text-lg mb-4">{{ category.name }}</h2>
        <ul class="space-y-4">
          <li 
            v-for="item in category.items" 
            :key="item._id" 
            class="flex items-center justify-between cursor-pointer hover:bg-amber-100 p-2 rounded"
            @click="openItemModal(item)"
          >
            <div class="flex items-center space-x-4">
              <img :src="item.imageUrl" 
                   alt="商品圖片" 
                   class="w-16 h-16 object-cover rounded">
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