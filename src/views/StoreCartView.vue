<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';

const menus = ref([
  { 
    id: 1,
    name: '甘蔗春烏龍',
    imgUrl: 'https://cdn-order-v3.nidin.shop/product/images/1879/b1879_650bbcf9_cfX7tDFL.jpg',
    price: 55,
  }
])

function showSwal(index) {
  if(window.innerWidth >= 768){
    Swal.fire({
      title: menus.value[index].name,
      imageUrl: menus.value[index].imgUrl,
      imageWidth: 400,
      imageHeight: 320,
      imageAlt: `${menus.value[index].name}`,
      html: `<div>價格: ${menus.value[index].price} </div>`,
      confirmButtonText: '加入購物車',
    });
  }
}


</script>

<template>
<div class="box-border w-full my-4 flex flex-col sm:mx-16 relative">
  <div class="flex flex-nowrap relative">

    <div class="absolute w-12 h-12 top-0 left-4 shadow-md rounded-md sm:relative sm:w-28 sm:h-28 ">
    <img class="w-full h-full rounded-md object-cover" src="https://ap-south-1.linodeobjects.com/nidin-production-v3/store/icons/s_15961_icon_20230725_145324_87a73.jpg" alt="店家品牌">
    </div>

    <div class="mt-16 mx-4 flex item-center flex-col space-y-2 ">
      <div class="flex items-center space-x-2">
        <h2 class="text-base sm:text-xl">得正 台北東湖計劃</h2>
        <font-awesome-icon :icon="['fas', 'heart']" 
        class="text-sm text-gray-400"
        />
      </div>
    
      <div class="flex items-center space-x-2">
        <font-awesome-icon :icon="['fas', 'star']" 
        class="text-sm text-yellow-400"
        />
        <p class="text-sm text-gray-500">3.6</p>
        <p class="text-sm text-gray-500">(6)</p>
        <font-awesome-icon :icon="['fas', 'clock']" 
        class="text-sm text-gray-500"
        />
        <p class="text-sm text-gray-500">11:00 ~ 20:00</p>
      </div>

      <div class="flex items-center space-x-2">
        <font-awesome-icon :icon="['fas', 'location-dot']" 
        class="text-sm text-gray-500"
        />
        <p class="text-sm text-gray-500">3.1公里</p>
        <a href="#" class="text-sm text-amber-500">台北市內湖區東湖路133號</a>
        <font-awesome-icon :icon="['fas', 'phone']" 
        class="text-sm text-gray-500"
        />
        <p class="text-sm text-amber-500">02-2345-6789</p>
      </div>
      <div class="flex items-center space-x-2">
        <font-awesome-icon :icon="['fas', 'circle-question']" class="text-sm text-gray-500"/>
        <a href="#" class="text-sm text-gray-400">訂購資訊</a>
      </div>
    </div>
  </div>
  <div class="sticky my-4 py-2 flex flex-row items-center justify-start overflow-x-auto scrollbar-hide bg-amber-500 text-white w-full">
    <div class="flex-shrink-0 mx-4 text-md"><a href="#clickedOnce">曾經點過</a></div>
    <div class="flex-shrink-0 mx-4 text-md"><a href="#new">雙柚新品</a></div>
    <div class="flex-shrink-0 mx-4 text-md"><a href="#tea">Original Tea</a></div>
    <div class="flex-shrink-0 mx-4 text-md"><a href="#fruit">Double Fruit</a></div>
    <div class="flex-shrink-0 mx-4 text-md"><a href="#cheese">Cheese Milk Foam</a></div>
    <div class="flex-shrink-0 mx-4 text-md"><a href="#milkTea">Classic Milk Tea</a></div>
    <div class="flex-shrink-0 mx-4 text-md"><a href="#freshMilk">Fresh Milk</a></div>
    <div class="flex-shrink-0 mx-4 text-md"><a href="#bag">購物袋</a></div>
  </div>

  <div class="mb-8 border-amber-500" v-for="(menu, index) in menus" :key="id" @click="showSwal(index)">
    <div id="clickedOnce" class="mx-4 mb-4 text-amber-500 text-md">曾經點過</div>
    <div class="flex flex-row justify-between items-center mx-4">
      <div class="flex flex-row items-center justify-center">
        <div class="w-8 h-8">
          <img class="object-cover h-full w-full" :src=menu.imgUrl  alt="甘蔗春烏龍">
        </div>
        <div class="mx-4 text-sm text-gray-500">{{ menu.name }}</div>
      </div>
      <div class="text-sm font-thin">
        <font-awesome-icon :icon="['fas', 'dollar-sign']" 
        class="text-sm text-gray-500"
        /> 
        {{ menu.price }}
      </div>
    </div>
  </div>

  <div class="mb-8">
    <div id="new" class="mx-4 mb-4 text-amber-500 text-md">雙柚新品</div>
    <div class="flex flex-row justify-between items-center mx-4">
      <div class="flex flex-row items-center justify-center">
        <div class="w-8 h-8">
          <img class="object-cover h-full w-full" src="https://cdn-order-v3.nidin.shop/product/images/1879/b1879_650bbcf9_cfX7tDFL.jpg" alt="甘蔗春烏龍">
        </div>
        <div class="mx-4 text-sm text-gray-500">甘蔗春烏龍</div>
      </div>
      <div class="text-sm font-thin">
        <font-awesome-icon :icon="['fas', 'dollar-sign']" 
        class="text-sm text-gray-500"
        /> 
        55
      </div>
    </div>
  </div>
  
  <div class="mb-8">
    <div id="tea" class="mx-4 mb-4 text-amber-500 text-md">Original Tea</div>
    <div class="flex flex-row justify-between items-center mx-4">
      <div class="flex flex-row items-center justify-center">
        <div class="w-8 h-8">
          <img class="object-cover h-full w-full" src="https://cdn-order-v3.nidin.shop/product/images/1879/b1879_650bbcf9_cfX7tDFL.jpg" alt="甘蔗春烏龍">
        </div>
        <div class="mx-4 text-sm text-gray-500">甘蔗春烏龍</div>
      </div>
      <div class="text-sm font-thin">
        <font-awesome-icon :icon="['fas', 'dollar-sign']" 
        class="text-sm text-gray-500"
        /> 
        55
      </div>
    </div>
  </div>

  <div class="mb-8">
    <div id="fruit" class="mx-4 mb-4 text-amber-500 text-md">Double Fruit</div>
    <div class="flex flex-row justify-between items-center mx-4">
      <div class="flex flex-row items-center justify-center">
        <div class="w-8 h-8">
          <img class="object-cover h-full w-full" src="https://cdn-order-v3.nidin.shop/product/images/1879/b1879_650bbcf9_cfX7tDFL.jpg" alt="甘蔗春烏龍">
        </div>
        <div class="mx-4 text-sm text-gray-500">甘蔗春烏龍</div>
      </div>
      <div class="text-sm font-thin">
        <font-awesome-icon :icon="['fas', 'dollar-sign']" 
        class="text-sm text-gray-500"
        /> 
        55
      </div>
    </div>
  </div>

  <div class="mb-8">
    <div id="cheese" class="mx-4 mb-4 text-amber-500 text-md">Cheese Milk Foam</div>
    <div class="flex flex-row justify-between items-center mx-4">
      <div class="flex flex-row items-center justify-center">
        <div class="w-8 h-8">
          <img class="object-cover h-full w-full" src="https://cdn-order-v3.nidin.shop/product/images/1879/b1879_650bbcf9_cfX7tDFL.jpg" alt="甘蔗春烏龍">
        </div>
        <div class="mx-4 text-sm text-gray-500">甘蔗春烏龍</div>
      </div>
      <div class="text-sm font-thin">
        <font-awesome-icon :icon="['fas', 'dollar-sign']" 
        class="text-sm text-gray-500"
        /> 
        55
      </div>
    </div>
  </div>

  <div class="mb-8">
    <div id="milkTea" class="mx-4 mb-4 text-amber-500 text-md">Classic Milk Tea</div>
    <div class="flex flex-row justify-between items-center mx-4">
      <div class="flex flex-row items-center justify-center">
        <div class="w-8 h-8">
          <img class="object-cover h-full w-full" src="https://cdn-order-v3.nidin.shop/product/images/1879/b1879_650bbcf9_cfX7tDFL.jpg" alt="甘蔗春烏龍">
        </div>
        <div class="mx-4 text-sm text-gray-500">甘蔗春烏龍</div>
      </div>
      <div class="text-sm font-thin">
        <font-awesome-icon :icon="['fas', 'dollar-sign']" 
        class="text-sm text-gray-500"
        /> 
        55
      </div>
    </div>
  </div>

  <div class="mb-8">
    <div id="freshMilk" class="mx-4 mb-4 text-amber-500 text-md">Fresh Milk</div>
    <div class="flex flex-row justify-between items-center mx-4">
      <div class="flex flex-row items-center justify-center">
        <div class="w-8 h-8">
          <img class="object-cover h-full w-full" src="https://cdn-order-v3.nidin.shop/product/images/1879/b1879_650bbcf9_cfX7tDFL.jpg" alt="甘蔗春烏龍">
        </div>
        <div class="mx-4 text-sm text-gray-500">甘蔗春烏龍</div>
      </div>
      <div class="text-sm font-thin">
        <font-awesome-icon :icon="['fas', 'dollar-sign']" 
        class="text-sm text-gray-500"
        /> 
        55
      </div>
    </div>
  </div>

  <div class="mb-8">
    <div id="bag" class="mx-4 mb-4 text-amber-500 text-md">購物袋</div>
    <div class="flex flex-row justify-between items-center mx-4">
      <div class="flex flex-row items-center justify-center">
        <div class="w-8 h-8">
          <img class="object-cover h-full w-full" src="https://cdn-order-v3.nidin.shop/product/images/1879/b1879_650bbcf9_cfX7tDFL.jpg" alt="甘蔗春烏龍">
        </div>
        <div class="mx-4 text-sm text-gray-500">甘蔗春烏龍</div>
      </div>
      <div class="text-sm font-thin">
        <font-awesome-icon :icon="['fas', 'dollar-sign']" 
        class="text-sm text-gray-500"
        /> 
        55
      </div>
    </div>
  </div>

</div>

</template>