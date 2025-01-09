import { defineStore } from "pinia";
import { inject, ref, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import * as jose from "jose";

export const useAuth = defineStore("auth", () => {
  const userData = ref(JSON.parse(localStorage.getItem("userData")) || null);
  const router = useRouter();
  const Swal = inject("$swal");
  const userId = ref("");

  // 監聽資料變化並更新 localStorage
  watch(
    userData,
    (newValue) => {
      if (newValue) {
        localStorage.setItem("userData", JSON.stringify(newValue));
      } else {
        localStorage.removeItem("userData"); // 清除資料
      }
    },
    { deep: true },
  );

  // 新增更新大頭貼的方法
  const setPicture = (newPicture) => {
    if (userData.value) {
      userData.value.profilePicture = newPicture; // 更新圖片資料
      localStorage.setItem("userData", JSON.stringify(userData.value)); // 更新 localStorage
    }
  };

  const initializeGoogleButton = () => {
    const buttonContainer = document.querySelector("#googleButton");

    if (buttonContainer) {
      buttonContainer.innerHTML = ""; // 防止重複渲染
    }

    if (window.google && window.google.accounts) {
      // 初始化 Google 登錄
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_LOGIN_KEY,
        callback: handleCredentialResponse,
      });
    }

    // 渲染 Google 按鈕到綁定的容器
    window.google.accounts.id.renderButton(buttonContainer, {
      type: "standard",
      shape: "pill",
      theme: "outline",
      size: "large",
    });
  };
  // 將Google的回覆送到後端驗證，後端回傳包裝好的jwt，將回傳的token存入local storage
  const handleCredentialResponse = async (response) => {
    const resToken = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/user/login/google`,
      response,
    );
    localStorage.setItem("userToken", resToken.data.token);
    if (resToken) {
      Swal.fire({
        title: "登入成功",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
      });
      //token解碼後可取得使用者id
      userId.value = jose.decodeJwt(resToken.data.token).id;
      getUserdata();
    }
    
  };

  const getUserdata = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/user/${userId.value}`,
    );
    userData.value = response.data;
  };

  const logout = () => {
    userData.value = null;
    localStorage.removeItem("userData"); // 清除 localStorage
    router.push({ name: "home" });
  };

  return {
    useAuth,
    initializeGoogleButton,
    userData,
    setPicture, // 新增 setPicture 方法
    logout,
    getUserdata,
    userId,
  };
});
