<script setup>
import axios from "axios";
import Swal from "sweetalert2";

const VITE_BACKEND_NGROK_URL = import.meta.env.VITE_BACKEND_NGROK_URL;

const handelPayment = async () => {
  try {
    const url = `${VITE_BACKEND_NGROK_URL}/payment`;
    const payload = {
      packages: {
        id: "1",
        amount: 150,
        products: [
          {
            id: "PEN-B-001",
            name: "Pen Brown",
            imageUrl: "https://reurl.cc/86D48R",
            quantity: 2,
            price: 50,
          },
          {
            id: "PEN-B-002",
            name: "Pen Red",
            imageUrl: "https://reurl.cc/86D48R",
            quantity: 1,
            price: 50,
          },
        ],
      },
      orderId: "EXAMPLE_ORDER_20230422_1000015",
    };

    const { data } = await axios.post(url, payload);
    const paymentUrl = data?.response?.info?.paymentUrl?.web;
    const returnCode = data?.response?.returnCode;

    if (returnCode === "0000") {
      window.location.href = paymentUrl;
    } else {
      Swal.fire({
        title: "Error!",
        text: data.response.returnMessage,
        icon: "error",
        confirmButtonText: "好",
      }).then(() => {
        window.location.href = "/checkout";
      });
    }
  } catch (err) {
    Swal.fire({
      title: "Error!",
      text: "建立付款請求失敗，請稍後再試",
      icon: "error",
      confirmButtonText: "好",
    }).then(() => {
      window.location.href = "/checkout";
    });
  }
};
</script>

<template>
  <div class="w-[70vw] lg:w-[50vw] flex flex-col gap-6">
    <h1 class="text-2xl font-bold text-amber-500">
      <font-awesome-icon :icon="['fas', 'file-invoice-dollar']" /> 購物車結帳
    </h1>
    <!-- Stepper -->
    <div data-hs-stepper="">
      <!-- Stepper Nav -->
      <ul class="relative flex flex-row gap-x-2">
        <li
          class="flex items-center flex-1 gap-x-2 shrink basis-0 group"
          data-hs-stepper-nav-item='{
            "index": 1
          }'
        >
          <span
            class="inline-flex items-center text-xs align-middle min-w-7 min-h-7 group"
          >
            <span
              class="flex items-center justify-center font-medium text-gray-800 bg-gray-100 rounded-full size-7 shrink-0 group-focus:bg-gray-200 hs-stepper-active:bg-amber-500 hs-stepper-active:text-white hs-stepper-success:bg-amber-500 hs-stepper-success:text-white hs-stepper-completed:bg-teal-500 hs-stepper-completed:group-focus:bg-teal-600"
            >
              <span
                class="hs-stepper-success:hidden hs-stepper-completed:hidden"
                >1</span
              >
              <svg
                class="hidden shrink-0 size-3 hs-stepper-success:block"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span class="text-sm font-medium text-gray-800 ms-2">
              確認明細
            </span>
          </span>
          <div
            class="flex-1 w-full h-px bg-gray-200 group-last:hidden hs-stepper-success:bg-amber-500 hs-stepper-completed:bg-teal-600"
          ></div>
        </li>

        <li
          class="flex items-center flex-1 gap-x-2 shrink basis-0 group"
          data-hs-stepper-nav-item='{
            "index": 2
          }'
        >
          <span
            class="inline-flex items-center text-xs align-middle min-w-7 min-h-7 group"
          >
            <span
              class="flex items-center justify-center font-medium text-gray-800 bg-gray-100 rounded-full size-7 shrink-0 group-focus:bg-gray-200 hs-stepper-active:bg-amber-500 hs-stepper-active:text-white hs-stepper-success:bg-amber-500 hs-stepper-success:text-white hs-stepper-completed:bg-teal-500 hs-stepper-completed:group-focus:bg-teal-600"
            >
              <span
                class="hs-stepper-success:hidden hs-stepper-completed:hidden"
                >2</span
              >
              <svg
                class="hidden shrink-0 size-3 hs-stepper-success:block"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span class="text-sm font-medium text-gray-800 ms-2">
              確認付款
            </span>
          </span>
          <div
            class="flex-1 w-full h-px bg-gray-200 group-last:hidden hs-stepper-success:bg-amber-500 hs-stepper-completed:bg-teal-600"
          ></div>
        </li>

        <li
          class="flex items-center flex-1 gap-x-2 shrink basis-0 group"
          data-hs-stepper-nav-item='{
              "index": 3
            }'
        >
          <span
            class="inline-flex items-center text-xs align-middle min-w-7 min-h-7 group"
          >
            <span
              class="flex items-center justify-center font-medium text-gray-800 bg-gray-100 rounded-full size-7 shrink-0 group-focus:bg-gray-200 hs-stepper-active:bg-amber-500 hs-stepper-active:text-white hs-stepper-success:bg-amber-500 hs-stepper-success:text-white hs-stepper-completed:bg-teal-500 hs-stepper-completed:group-focus:bg-teal-600"
            >
              <span
                class="hs-stepper-success:hidden hs-stepper-completed:hidden"
                >3</span
              >
              <svg
                class="hidden shrink-0 size-3 hs-stepper-success:block"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span class="text-sm font-medium text-gray-800 ms-2">
              確認結帳
            </span>
          </span>
          <div
            class="flex-1 w-full h-px bg-gray-200 group-last:hidden hs-stepper-success:bg-amber-500 hs-stepper-completed:bg-teal-600"
          ></div>
        </li>
        <!-- End Item -->
      </ul>
      <!-- End Stepper Nav -->

      <!-- Stepper Content -->
      <div class="mt-5 leading-relaxed sm:mt-8">
        <!-- First Content -->
        <div data-hs-stepper-content-item='{"index": 1}'>
          <div
            class="flex flex-col justify-center gap-4 p-4 border border-gray-200 border-dashed bg-gray-50 rounded-xl"
          >
            <div class="flex flex-col text-left">
              <h3 class="mb-1 font-bold text-amber-500">迷客夏 臺北南陽店</h3>
              <div class="flex gap-2 my-2">
                <font-awesome-icon
                  :icon="['fas', 'phone-flip']"
                  style="color: #f59e0b"
                  class="fa-lg"
                />
                <p>02-23119011</p>
              </div>
              <div class="flex gap-2 my-2 cursor-pointer">
                <font-awesome-icon
                  :icon="['fas', 'location-dot']"
                  class="fa-lg"
                  style="color: #f59e0b"
                />
                <p>門市地址</p>
              </div>
            </div>
            <div class="text-left">
              <h2 class="mb-1 font-bold">取貨方式</h2>
              <p class="p-2 my-2 text-sm tracking-widest bg-rose-50">
                <font-awesome-icon
                  :icon="['fas', 'circle-exclamation']"
                  style="color: #ff5e7d"
                />
                尖峰時段取餐時間需視現場狀況，請多包涵，建議可使用數位支付，並綁定手機載具，可節省取餐時間。
              </p>
              <div class="grid gap-2 my-2 sm:grid-cols-2">
                <label
                  for="hs-radio-in-form"
                  class="flex w-full p-3 text-sm bg-white border border-gray-200 rounded-lg focus:border-amber-500"
                >
                  <input
                    type="radio"
                    name="hs-radio-in-form"
                    class="shrink-0 mt-0.5 border-gray-200 rounded-full text-amber-600 disabled:opacity-50 disabled:pointer-events-none"
                    id="hs-radio-in-form"
                    checked=""
                  />
                  <span class="text-sm text-gray-500 ms-3">到店自取</span>
                </label>
                <label
                  for="hs-radio-checked-in-form"
                  class="flex w-full p-3 text-sm bg-white border border-gray-200 rounded-lg focus:border-amber-500"
                >
                  <input
                    type="radio"
                    name="hs-radio-in-form"
                    class="shrink-0 mt-0.5 border-gray-200 rounded-full text-amber-600 disabled:opacity-50 disabled:pointer-events-none"
                    id="hs-radio-checked-in-form"
                  />
                  <span class="text-sm text-gray-500 ms-3"
                    >外送（尚未開放）</span
                  >
                </label>
              </div>
              <h2 class="mb-1 font-bold">預計取貨時間</h2>

              <button
                type="button"
                data-modal-target="timepicker-modal"
                data-modal-toggle="timepicker-modal"
                class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  class="h-4 w4 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                    clip-rule="evenodd"
                  />
                </svg>
                選擇日期與時段
              </button>
              <!-- Main modal -->
              <div
                id="timepicker-modal"
                tabindex="-1"
                aria-hidden="true"
                class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
              >
                <div class="relative p-4 w-full max-w-[23rem] max-h-full">
                  <!-- Modal content -->
                  <div
                    class="relative bg-white rounded-lg shadow dark:bg-gray-800"
                  >
                    <!-- Modal header -->
                    <div
                      class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600"
                    >
                      <h3
                        class="text-lg font-semibold text-gray-900 dark:text-white"
                      >
                        選擇預計取貨時間
                      </h3>
                      <button
                        type="button"
                        class="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 ms-auto dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-toggle="timepicker-modal"
                      >
                        <font-awesome-icon :icon="['fas', 'xmark']" />
                        <span class="sr-only">關閉</span>
                      </button>
                    </div>
                    <!-- Modal body -->
                    <div class="p-4 pt-0">
                      <div
                        inline-datepicker
                        datepicker-autoselect-today
                        class="mx-auto sm:mx-0 flex justify-center my-5 [&>div>div]:shadow-none [&>div>div]:bg-gray-50 [&_div>button]:bg-gray-50"
                      ></div>
                      <label
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        選擇時段
                      </label>
                      <ul
                        id="timetable"
                        class="grid w-full grid-cols-3 gap-2 mb-5"
                      >
                        <li>
                          <input
                            type="radio"
                            id="10-am"
                            value=""
                            class="hidden peer"
                            name="timetable"
                          />
                          <label
                            for="10-am"
                            class="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:peer-checked:border-blue-500 peer-checked:border-blue-700 dark:hover:border-gray-600 dark:peer-checked:text-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600 dark:peer-checked:bg-blue-900"
                          >
                            10:00 AM
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            id="10-30-am"
                            value=""
                            class="hidden peer"
                            name="timetable"
                          />
                          <label
                            for="10-30-am"
                            class="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:peer-checked:border-blue-500 peer-checked:border-blue-700 dark:hover:border-gray-600 dark:peer-checked:text-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600 dark:peer-checked:bg-blue-900"
                          >
                            10:30 AM
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            id="11-am"
                            value=""
                            class="hidden peer"
                            name="timetable"
                          />
                          <label
                            for="11-am"
                            class="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:peer-checked:border-blue-500 peer-checked:border-blue-700 dark:hover:border-gray-600 dark:peer-checked:text-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600 dark:peer-checked:bg-blue-900"
                          >
                            11:00 AM
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            id="11-30-am"
                            value=""
                            class="hidden peer"
                            name="timetable"
                          />
                          <label
                            for="11-30-am"
                            class="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:peer-checked:border-blue-500 peer-checked:border-blue-700 dark:hover:border-gray-600 dark:peer-checked:text-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600 dark:peer-checked:bg-blue-900"
                          >
                            11:30 AM
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            id="12-am"
                            value=""
                            class="hidden peer"
                            name="timetable"
                            checked
                          />
                          <label
                            for="12-am"
                            class="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:peer-checked:border-blue-500 peer-checked:border-blue-700 dark:hover:border-gray-600 dark:peer-checked:text-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600 dark:peer-checked:bg-blue-900"
                          >
                            12:00 AM
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            id="12-30-pm"
                            value=""
                            class="hidden peer"
                            name="timetable"
                          />
                          <label
                            for="12-30-pm"
                            class="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:peer-checked:border-blue-500 peer-checked:border-blue-700 dark:hover:border-gray-600 dark:peer-checked:text-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600 dark:peer-checked:bg-blue-900"
                          >
                            12:30 PM
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            id="1-pm"
                            value=""
                            class="hidden peer"
                            name="timetable"
                          />
                          <label
                            for="1-pm"
                            class="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:peer-checked:border-blue-500 peer-checked:border-blue-700 dark:hover:border-gray-600 dark:peer-checked:text-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600 dark:peer-checked:bg-blue-900"
                          >
                            01:00 PM
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            id="1-30-pm"
                            value=""
                            class="hidden peer"
                            name="timetable"
                          />
                          <label
                            for="1-30-pm"
                            class="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:peer-checked:border-blue-500 peer-checked:border-blue-700 dark:hover:border-gray-600 dark:peer-checked:text-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600 dark:peer-checked:bg-blue-900"
                          >
                            01:30 PM
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            id="2-pm"
                            value=""
                            class="hidden peer"
                            name="timetable"
                          />
                          <label
                            for="2-pm"
                            class="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:peer-checked:border-blue-500 peer-checked:border-blue-700 dark:hover:border-gray-600 dark:peer-checked:text-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600 dark:peer-checked:bg-blue-900"
                          >
                            02:00 PM
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            id="2-30-pm"
                            value=""
                            class="hidden peer"
                            name="timetable"
                          />
                          <label
                            for="2-30-pm"
                            class="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:peer-checked:border-blue-500 peer-checked:border-blue-700 dark:hover:border-gray-600 dark:peer-checked:text-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600 dark:peer-checked:bg-blue-900"
                          >
                            02:30 PM
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            id="3-pm"
                            value=""
                            class="hidden peer"
                            name="timetable"
                          />
                          <label
                            for="3-pm"
                            class="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:peer-checked:border-blue-500 peer-checked:border-blue-700 dark:hover:border-gray-600 dark:peer-checked:text-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600 dark:peer-checked:bg-blue-900"
                          >
                            03:00 PM
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            id="3-30-pm"
                            value=""
                            class="hidden peer"
                            name="timetable"
                          />
                          <label
                            for="3-30-pm"
                            class="inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer hover:text-gray-900 dark:hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:peer-checked:border-blue-500 peer-checked:border-blue-700 dark:hover:border-gray-600 dark:peer-checked:text-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600 dark:peer-checked:bg-blue-900"
                          >
                            03:30 PM
                          </label>
                        </li>
                      </ul>
                      <div class="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                          確定
                        </button>
                        <button
                          type="button"
                          data-modal-hide="timepicker-modal"
                          class="py-2.5 px-5 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-left">
              <h2 class="mb-1 font-bold">訂購內容</h2>
              <p class="text-right">$65 / 1 份</p>
              <div class="flex justify-between p-4 bg-white">
                <div>
                  <h3>柚蜜白玉</h3>
                  <p class="text-gray-400">L / 去冰 / $65 / 1份</p>
                </div>
                <div class="flex gap-6">
                  <font-awesome-icon
                    :icon="['fas', 'pen']"
                    style="color: #f59e0b"
                  />
                  <font-awesome-icon
                    :icon="['fas', 'trash']"
                    style="color: #898989"
                  />
                </div>
              </div>
            </div>
            <div class="leading-loose text-left">
              <h2 class="mb-1 font-bold">結帳明細</h2>
              <hr />
              <div class="flex justify-between my-5">
                <p>商品 x 1</p>
                <p>$65</p>
              </div>
              <hr />
              <div class="flex justify-between my-5 font-bold text-orange-500">
                <p>應付金額</p>
                <p>$65</p>
              </div>
            </div>
          </div>
        </div>
        <!-- End First Content -->

        <!-- First Content -->
        <div
          data-hs-stepper-content-item='{
            "index": 2
          }'
          style="display: none"
        >
          <div
            class="flex flex-col items-center justify-center gap-4 p-4 border border-gray-200 border-dashed rounded-lg bg-gray-50"
          >
            <div
              class="flex justify-between w-full p-4 font-bold text-white rounded-lg bg-amber-500"
            >
              <div class="flex gap-4">
                <p class="px-3 py-1 bg-white rounded-lg text-amber-500">2 份</p>
                <p class="flex items-center justify-center text-white">
                  應付金額
                </p>
              </div>
              <p class="flex items-center justify-center">$135</p>
            </div>
            <div class="w-full text-left">
              <h2 class="mb-1 font-bold">取貨人資訊</h2>
              <div class="max-w-sm">
                <label for="input-label" class="block mb-2 text-sm font-medium"
                  >姓名</label
                >
                <input
                  type="email"
                  id="input-label"
                  class="block w-full px-4 py-3 mb-2 text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="請輸入取貨人姓名"
                />
              </div>
              <div class="max-w-sm">
                <label for="input-label" class="block mb-2 text-sm font-medium"
                  >聯絡電話</label
                >
                <input
                  type="email"
                  id="input-label"
                  class="block w-full px-4 py-3 mb-2 text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="請輸入取貨人聯絡電話"
                />
              </div>
            </div>
            <div class="w-full text-left">
              <h2 class="mb-1 font-bold">付款方式</h2>
              <div class="grid mb-2 space-y-2">
                <label
                  for="payment-form"
                  class="flex w-full max-w-xs p-3 text-sm bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                >
                  <input
                    type="radio"
                    name="payment-form"
                    class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none mb-2"
                    id="payment-form"
                  />
                  <span class="text-sm text-gray-500 ms-3">現金</span>
                </label>
                <label
                  for="payment-form"
                  class="flex w-full max-w-xs p-3 text-sm bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                >
                  <input
                    type="radio"
                    name="payment-form"
                    class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none mb-2"
                    id="payment-form"
                    checked=""
                  />
                  <span class="text-sm text-gray-500 ms-3">
                    <img src="/LINEPay.png" alt="LINEPay" />
                  </span>
                </label>
              </div>
            </div>
            <div class="w-full text-left">
              <h3 class="mb-1 font-bold">開立發票</h3>
              <div class="grid mb-2 space-y-2">
                <label
                  for="hs-vertical-radio-in-form"
                  class="flex w-full max-w-xs p-3 text-sm bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                >
                  <input
                    type="radio"
                    name="hs-vertical-radio-in-form"
                    class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none mb-2"
                    id="hs-vertical-radio-in-form"
                  />
                  <span class="text-sm text-gray-500 ms-3">紙本發票</span>
                </label>
                <label
                  for="hs-vertical-radio-checked-in-form"
                  class="flex w-full max-w-xs p-3 text-sm bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                >
                  <input
                    type="radio"
                    name="hs-vertical-radio-in-form"
                    class="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none mb-2"
                    id="hs-vertical-radio-checked-in-form"
                    checked=""
                  />
                  <span class="text-sm text-gray-500 ms-3">手機載具</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <!-- End First Content -->

        <!-- First Content -->
        <div
          data-hs-stepper-content-item='{
            "index": 3
          }'
          style="display: none"
        >
          <div
            class="flex flex-col items-center justify-center p-4 text-left border border-gray-200 border-dashed bg-gray-50 rounded-xl"
          >
            <h3 class="mb-1 font-bold text-left">確認訂單明細</h3>
            <table class="w-full">
              <tbody>
                <tr class="h-12 px-4 py-2 border-b border-gray-300">
                  <td>訂購門市</td>
                  <td>迷客夏 臺北南陽店</td>
                </tr>
                <tr class="h-12 px-4 py-2 border-b border-gray-300">
                  <td>取貨人</td>
                  <td>婕瑜</td>
                </tr>
                <tr class="h-12 px-4 py-2 border-b border-gray-300">
                  <td>聯絡電話</td>
                  <td>0912345678</td>
                </tr>
                <tr class="h-12 px-4 py-2 border-b border-gray-300">
                  <td>取貨方式</td>
                  <td>自取</td>
                </tr>
                <tr class="h-12 px-4 py-2 border-b border-gray-300">
                  <td>預計取貨時間</td>
                  <td>預約 2024-12-31 09:50</td>
                </tr>
                <tr class="h-12 px-4 py-2 border-b border-gray-300">
                  <td>付款方式</td>
                  <td>LINE PAY</td>
                </tr>
                <tr class="h-12 px-4 py-2 border-b border-gray-300">
                  <td>開立發票方式</td>
                  <td>紙本發票</td>
                </tr>
                <tr class="h-12 px-4 py-2">
                  <td>應付金額</td>
                  <td>$135</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- End First Content -->

        <!-- Final Content -->
        <div
          data-hs-stepper-content-item='{
            "isFinal": true
          }'
          style="display: none"
        >
          <div
            class="flex flex-col items-center justify-center h-48 p-4 border border-gray-200 border-dashed bg-gray-50 rounded-xl"
          >
            <font-awesome-icon
              :icon="['fas', 'spinner']"
              spin-pulse
              class="fa-3x"
            />
            <h3 class="my-3 text-lg text-gray-500">付款中...</h3>
          </div>
        </div>
        <!-- End Final Content -->

        <!-- Button Group -->
        <div class="flex items-center justify-between mt-5 gap-x-2">
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm gap-x-1 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            data-hs-stepper-back-btn=""
          >
            <svg
              class="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            上一步
          </button>
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-white border border-transparent rounded-lg bg-amber-500 gap-x-1 disabled:pointer-events-none"
            data-hs-stepper-next-btn=""
          >
            下一步
            <svg
              class="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-white border border-transparent rounded-lg bg-amber-500 gap-x-1 disabled:pointer-events-none"
            data-hs-stepper-finish-btn=""
            style="display: none"
            @click.prevent="handelPayment"
          >
            點我付款
          </button>
        </div>
        <!-- End Button Group -->
      </div>
      <!-- End Stepper Content -->
    </div>
    <!-- End Stepper -->
    <!-- <a href="#" @click.prevent="handelPayment">點我付款</a> -->
  </div>
</template>
