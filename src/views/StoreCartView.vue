<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import menuData from '../../data/menu.json';

const categoryRefs = ref([]);
const selectedCategory = ref(0);
const cartItems = ref([]);

const categorizedMenu = [
  {
    name: '新品上市 - 緋烏龍系列',
    items: menuData.filter(item => item.category === '新品上市')
  },
  {
    name: '雙柚新品',
    items: menuData.filter(item => item.category === '雙柚新品')
  },
  {
    name: 'Double FRUIT',
    items: menuData.filter(item => item.category === 'Double FRUIT')
  },
  {
    name: 'Original TEA',
    items: menuData.filter(item => item.category === 'Original TEA')
  },
  {
    name: 'Cheese MILK FOAM',
    items: menuData.filter(item => item.category === 'Cheese MILK FOAM')
  },
  {
    name: 'Classic MILK TEA',
    items: menuData.filter(item => item.category === 'Classic MILK TEA')
  }
];

const scrollToCategory = (index) => {
  selectedCategory.value = index;
  categoryRefs.value[index]?.scrollIntoView({ behavior: 'smooth' });
};

// Intersection Observer for active category
onMounted(() => {
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

  categoryRefs.value.forEach(ref => {
    if (ref) observer.observe(ref);
  });
});

const openItemModal = async (item) => {
  const { value: formValues } = await Swal.fire({
    title: item.name,
    html: `
      <div class='flex flex-col items-center'>
        <div class='mb-4'>
          <img src='${item.image}' alt='商品圖片' class='w-24 h-24 object-cover'>
        </div>
        <div class='text-sm text-gray-600'>
          價格: <span class='text-red-500'>\$${item.price}</span>
        </div>
        <div class='mt-4'>
          <h3 class='text-lg font-semibold'>杯型選擇 <span class="text-red-500">*</span></h3>
          <div class="cup-size-group" data-required="true">
            <button class='option-btn cup-size bg-gray-100 hover: px-3 py-2 rounded m-1' data-value="中杯">中杯</button>
            <button class='option-btn cup-size bg-gray-100 hover: px-3 py-2 rounded m-1' data-value="大杯">大杯 +10元</button>
          </div>
        </div>
        <div class='mt-4'>
          <h3 class='text-lg font-semibold'>加料選擇</h3>
          <div class="toppings-group">
            <button class='option-btn topping bg-gray-100 hover: px-3 py-2 rounded m-1' data-value="珍珠">珍珠 +10元</button>
            <button class='option-btn topping bg-gray-100 hover: px-3 py-2 rounded m-1' data-value="椰果">椰果 +10元</button>
          </div>
        </div>
        <div class='mt-4'>
          <h3 class='text-lg font-semibold'>甜度選擇 <span class="text-red-500">*</span></h3>
          <div class="sweetness-group" data-required="true">
            <button class='option-btn sweetness bg-gray-100 hover: px-3 py-2 rounded m-1' data-value="正常糖">正常糖</button>
            <button class='option-btn sweetness bg-gray-100 hover: px-3 py-2 rounded m-1' data-value="半糖">半糖</button>
            <button class='option-btn sweetness bg-gray-100 hover: px-3 py-2 rounded m-1' data-value="微糖">微糖</button>
          </div>
        </div>
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

      const toppingButtons = document.querySelectorAll('.topping');
      toppingButtons.forEach(button => {
        button.addEventListener('click', () => {
          button.classList.toggle('bg-amber-500');
          button.classList.toggle('text-white');
        });
      });
    },
    preConfirm: () => {
      const cupSize = document.querySelector('.cup-size.bg-amber-500')?.dataset.value;
      const sweetness = document.querySelector('.sweetness.bg-amber-500')?.dataset.value;
      const toppings = Array.from(document.querySelectorAll('.topping.bg-amber-500'))
        .map(el => el.dataset.value);

      if (!cupSize || !sweetness) {
        Swal.showValidationMessage('請選擇必填項目');
        return false;
      }

      return {
        cupSize,
        sweetness,
        toppings
      };
    }
  });

  if (formValues) {
    const cartItem = {
      id: Date.now(),
      item,
      options: formValues,
      quantity: 1
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
    (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
    0
  );

  const cartHtml = cartItems.value.map((cartItem, index) => `
    <div class="flex items-center justify-between border-b py-2">
      <div>
        <h3 class="font-semibold">${cartItem.item.name}</h3>
        <p class="text-sm text-gray-600">
          ${cartItem.options.cupSize} | 
          ${cartItem.options.sweetness}
          ${cartItem.options.toppings.length ? ` | ${cartItem.options.toppings.join(', ')}` : ''}
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
      // 更新數量的按鈕事件
      document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(btn.dataset.index);
          const action = btn.dataset.action;

          if (action === 'increase') {
            cartItems.value[index].quantity++;
          } else if (action === 'decrease' && cartItems.value[index].quantity > 1) {
            cartItems.value[index].quantity--;
          }

          // 更新 DOM 的數量顯示
          document.querySelector(`.quantity-display[data-index="${index}"]`).textContent = cartItems.value[index].quantity;

          // 更新總金額顯示
          const newTotal = cartItems.value.reduce(
            (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
            0
          );
          document.querySelector('.total-amount').textContent = `\$${newTotal.toFixed(2)}`;
        });
      });

      // 刪除項目的按鈕事件
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(btn.dataset.index);
          cartItems.value.splice(index, 1);

          // 重新開啟購物車（或手動刪除該行）
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
          <img 
            src="https://ap-south-1.linodeobjects.com/nidin-production-v3/store/icons/s_15961_icon_20230725_145324_87a73.jpg" 
            alt="Logo" 
            class="h-12"
          >
          <div>
            <h1 class="text-2xl font-bold text-gray-600">得正 台北東湖計劃</h1>
            <div class="text-sm text-gray-600">
              <span class="flex items-center mr-2">
                <span class="text-yellow-400">★</span>3.4 (7)
              </span>
              <span>11:00 ~ 20:00</span>
            </div>
            <div class="text-sm text-gray-600">
              <i class="fas fa-map-marker-alt"></i>
              台北市內湖區東湖路133號 &nbsp;
              <i class="fas fa-phone-alt"></i> 02-2633533
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
            :key="item.id" 
            class="flex items-center justify-between cursor-pointer hover:bg-amber-100 p-2 rounded"
            @click="openItemModal(item)"
          >
            <div class="flex items-center space-x-4">
              <img :src="item.image" alt="商品圖片" class="w-16 h-16 object-cover rounded">
              <span class="text-gray-800">{{ item.name }}</span>
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