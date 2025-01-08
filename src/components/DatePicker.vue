<template>
  <div class="relative">
    <input
      type="text"
      readonly
      :value="formattedDateTime"
      @click="toggleDatepicker"
      class="w-full py-3 pl-4 pr-10 font-medium leading-none text-gray-600 rounded-lg shadow-sm focus:outline-none focus:shadow-outline"
      placeholder="Select date and time"
    />
    <div
      v-if="showDatepicker"
      class="absolute p-4 mt-2 bg-white rounded shadow"
    >
      <div class="flex items-center justify-between mb-2">
        <button @click="prevMonth" :disabled="month === 0" class="p-2">
          <svg
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <span class="text-lg font-bold"
            >{{ monthNames[month] }} {{ year }}</span
          >
        </div>
        <button @click="nextMonth" :disabled="month === 11" class="p-2">
          <svg
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <div class="grid grid-cols-7 gap-1 mb-4">
        <div
          v-for="day in days"
          :key="day"
          class="text-sm font-medium text-center"
        >
          {{ day }}
        </div>
        <div
          v-for="blank in blankDays"
          :key="blank"
          class="text-sm text-center"
        ></div>
        <div v-for="date in noOfDays" :key="date" class="text-sm text-center">
          <button
            @click="selectDate(date)"
            :class="{ 'bg-blue-500 text-white rounded-full': isToday(date) }"
            class="w-8 h-8"
          >
            {{ date }}
          </button>
        </div>
      </div>
      <div class="flex space-x-2">
        <select v-model="selectedHour" class="w-1/2 px-2 py-1 border rounded">
          <option v-for="hour in hours" :key="hour" :value="hour">
            {{ hour }}
          </option>
        </select>
        <select v-model="selectedMinute" class="w-1/2 px-2 py-1 border rounded">
          <option v-for="minute in minutes" :key="minute" :value="minute">
            {{ minute }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const showDatepicker = ref(false);
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const month = ref(currentMonth);
const year = ref(currentYear);
const selectedDate = ref(null); // 初始化為 null
const selectedHour = ref(today.getHours());
const selectedMinute = ref(Math.floor(today.getMinutes() / 15) * 15);

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = [0, 15, 30, 45];

const monthNames = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];
const days = ["日", "一", "二", "三", "四", "五", "六"];

const toggleDatepicker = () => {
  showDatepicker.value = !showDatepicker.value;
};

const prevMonth = () => {
  if (month.value === 0) {
    month.value = 11;
    year.value--;
  } else {
    month.value--;
  }
};

const nextMonth = () => {
  if (month.value === 11) {
    month.value = 0;
    year.value++;
  } else {
    month.value++;
  }
};

const isToday = (date) => {
  const d = new Date(year.value, month.value, date);
  return d.toDateString() === today.toDateString();
};

const selectDate = (date) => {
  selectedDate.value = new Date(year.value, month.value, date);
  showDatepicker.value = false;
};

const noOfDays = computed(() => {
  return new Array(new Date(year.value, month.value + 1, 0).getDate())
    .fill(null)
    .map((_, index) => index + 1);
});

const blankDays = computed(() => {
  const firstDay = new Date(year.value, month.value).getDay();
  return new Array(firstDay).fill(null);
});

const formattedDateTime = computed(() => {
  if (!selectedDate.value) {
    return "選擇日期與時段"; // 如果沒有選擇日期，顯示提示文字
  }

  const datePart = new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(selectedDate.value);

  return `${datePart} ${selectedHour.value}時${selectedMinute.value}分`;
});

// 使用v-bind將formattedDateTime傳遞給父元件
const emit = defineEmits(["update:formattedDateTime"]);

watch(formattedDateTime, (newValue) => {
  emit("update:formattedDateTime", newValue);
});
</script>
