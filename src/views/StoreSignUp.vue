<script setup>
import { ref, onMounted, shallowRef } from "vue";
import googleMapsLoader from "../components/googleMapsLoader.js";
import Swal from "sweetalert2";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const username = ref("");
const password = ref("");
const storeName = ref("");
const storeAddress = ref("");
const storePhone = ref("");
const storeIntro = ref("");
const storeTaxId = ref("");
const contactName = ref("");
const contactEmail = ref("");
const contactPhone = ref("");
const predictions = shallowRef([]);
const placeId = ref("");

let AutocompleteSessionToken;
let AutocompleteSuggestion;
let request = {
    input: "",
    includedPrimaryTypes: ["establishment"],
    region: "tw",
    language: "zh-TW",
    includedRegionCodes: ["tw"],
};

async function initGoogleAutocomplete(){
    ({AutocompleteSessionToken, AutocompleteSuggestion} = await googleMapsLoader.importLibrary("places"));
    request.sessionToken = new AutocompleteSessionToken();
}

async function fetchSuggestions(){
    if(storeAddress.value){
        request.input = storeAddress.value;
        const {suggestions} = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
        predictions.value = suggestions.map((ele) => ele.placePrediction);
    }
}

function clickPrediction(predict) {
    storeAddress.value = `${predict.mainText.text}: ${predict.secondaryText.text}`;
    placeId.value = predict.placeId;
    predictions.value = [];
    request.sessionToken = new AutocompleteSessionToken();
}

function handleEnter(event){
    if(event.target.tagName === "TEXTAREA"){
        return;
    }
    event.preventDefault();
}

function clear(){
    storeAddress.value = "";
}

async function handleSubmit() {
    const form = {
        username: username.value,
        password: password.value,
        storeName: storeName.value,
        storeAddress: storeAddress.value,
        storePhone: storePhone.value,
        storeIntro: storeIntro.value,
        storeTaxId: storeTaxId.value,
        contactName: contactName.value,
        contactEmail: contactEmail.value,
        contactPhone: contactPhone.value,
        placeId: placeId.value,
    }
    const registerSchema = z.object({
        username: z.string().min(5, "帳號至少需要5個字元"),
        password: z.string().min(8, "密碼至少需要8個字元"),
        storeName: z.string().min(1, "店名至少需要1個字元"),
        placeId: z.string().min(1, "地址需自選單中選取"),
        storePhone: z.string().regex(/^0\d{1,9}$/, "請輸入正確電話格式"),
        storeIntro: z.string().max(50, "店家簡介最多50字元"),
        storeTaxId: z.string().regex(/\d{8}/, "請輸入正確統一編號格式"),
        contactName: z.string().min(1, "姓名至少需1個字元"),
        contactEmail: z.string().email("請輸入正確的email"),
        contactPhone: z.string().regex(/^09\d{8}$/, "請輸入正確手機號碼"),
    })

    try{
        registerSchema.parse(form);

        await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/store/`, {
            form,
        })

        Swal.fire({
        title: 'Success',
        text: '註冊成功',
        icon: 'success',
        confirmButtonText: 'OK'
        })

        router.push({ name: "storesignin" });
        
    }catch(err){
        if(err instanceof z.ZodError){
            Swal.fire({
                title: 'Error',
                html: err.errors.map(error => error.message).join("<br>"),
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }else{
            Swal.fire({
                title: 'Error',
                text: "請再試一次",
                icon: 'error',
                confirmButtonText: 'OK'
            })
            console.log(err);
        }
        
    }
}

onMounted(
    initGoogleAutocomplete
)

</script>

<template>
<div class="min-h-screen flex items-center justify-center animated-gradient">
    <div class="contentBox bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-2xl mt-20">
        <div class="titleBox flex w-full justify-center mb-4">
            <h2 class="font-bold text-2xl">成為我們的合作夥伴，</h2>
            <h2 class="font-bold text-2xl">拓展更多可能！</h2>
        </div>
        <form @submit.prevent="handleSubmit" @keydown.enter="handleEnter">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="username">✨ 帳號名稱: <span class=" text-red-600 font-normal text-xs">*至少需5個字元</span></label>
                <input v-model="username" id="username" type="text" placeholder="請輸入帳號" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300">
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">✨ 密碼: <span class=" text-red-600 font-normal text-xs">*至少需8個字元</span></label>
                <input v-model="password" id="password" type="text" placeholder="請輸入密碼" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300">
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="storeName">✨ 店家名稱: <span class=" text-red-600 font-normal text-xs">*</span></label>
                <input v-model="storeName" id="storeName" type="text" placeholder="請輸入店家名稱" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300">
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="storeAddress">✨ 店家地址: <span class=" text-red-600 font-normal text-xs">*地址輸入後需自選單中選取</span></label>
                <div class="relative w-full border rounded hover:shadow-md">
                    <input v-model="storeAddress" @input="fetchSuggestions" id="storeAddress" type="text" placeholder="請輸入店家地址" class="appearance-none py-2 px-3 text-gray-700 leading-tight w-full pr-10 focus:outline-orange-300">
                    <font-awesome-icon :icon="['fa', 'circle-xmark']" @click="clear" class="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 cursor-pointer w-5 h-5"/>
                </div>
                <div v-if="predictions.length !== 0" class=" mt-1">
                    <ul class=" border w-full rounded">
                        <li @click="clickPrediction(predict)" v-for="predict in predictions" :key="predict.placeId" class="border w-full px-3 text-gray-700 leading-tight cursor-pointer hover:bg-gray-200">{{ `${predict.mainText.text}: ${predict.secondaryText.text}` }}</li>
                    </ul>
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="storePhone">✨ 店家電話: <span class=" text-red-600 font-normal text-xs">*</span></label>
                <input v-model="storePhone" id="storePhone" type="tel" placeholder="請輸入店家電話" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300">
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="storeIntro">✨ 店家簡介: <span class=" text-red-600 font-normal text-xs">*最多50個字元</span></label>
                <textarea v-model="storeIntro" id="storeIntro" type="text" placeholder="請輸入店家簡介" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300"></textarea>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="storeTaxId">✨ 店家統一編號: <span class=" text-red-600 font-normal text-xs">*</span></label>
                <input v-model="storeTaxId" id="storeTaxId" type="text" placeholder="請輸入店家統一編號" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300">
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="contactName">✨ 聯絡人姓名: <span class=" text-red-600 font-normal text-xs">*</span></label>
                <input v-model="contactName" id="contactName" type="text" placeholder="請輸入聯絡人姓名" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300">
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="contactEmail">✨ 聯絡人信箱: <span class=" text-red-600 font-normal text-xs">*</span></label>
                <input v-model="contactEmail" id="contactEmail" type="text" placeholder="請輸入聯絡人信箱" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300">
            </div>
            <div class="mb-8">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="contactPhone">✨ 聯絡人手機號碼: <span class=" text-red-600 font-normal text-xs">*</span></label>
                <input v-model="contactPhone" id="contactPhone" type="tel" placeholder="請輸入聯絡人手機號碼" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:shadow-md focus:outline-orange-300">
            </div>
            <div class="flex items-center justify-center">
                <button type="submit" class="bg-orange-400 hover:bg-orange-500 hover:shadow-lg text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    註冊成為 JiaBaMap 的合作夥伴
                </button>
            </div>
        </form>
    </div>
</div>
</template>

<style scope>
.animated-gradient {
  background: linear-gradient(45deg, #ff9a9e, #fad0c4, #fbc2eb, #a18cd1, #efd170, #ff9a9e);
  background-size: 300% 300%;
  animation: gradientAnimation 15s ease infinite;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@media (max-width: 768px) {
    .contentBox{
        margin-right: 10px;
        margin-left: 10px;
    }
    .titleBox{
        flex-wrap: wrap;
    }
}
</style>