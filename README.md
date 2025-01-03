# JiaBaMap 呷飽地圖 🍽️ [![version](https://img.shields.io/badge/version-0.0.0-blue.svg?cacheSeconds=2592000)](https://hackmd.io/@juliewah/ByhvoZQMkg) [![build status](https://github.com/vuejs/core/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/vuejs/core/actions/workflows/ci.yml) [![Download](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://hackmd.io/@juliewah/ByhvoZQMkg)

- 一個由七人團隊開發的美食地圖平台，幫助使用者探索和分享美食體驗。

## ✨ 功能特點

- 📍 整合 Google Maps API 的互動式地圖
- 🔍 餐廳搜尋與篩選
- 📝 使用者評論與評分系統
- 📱 響應式設計，支援多種裝置
- 🖼️ 餐廳照片上傳與分享
- 👥 使用者互動功能

## ⚠️ 重要設置

在使用本專案前，請確保已在 Google Cloud Console 開啟以下 API：

1. **Places API (New)**

   - 用於地點搜尋和資訊獲取
   - 必須啟用才能使用地點搜尋功能

2. **Maps JavaScript API**
   - 用於地圖顯示和互動
   - 必須啟用才能顯示地圖介面

> **注意**：缺少任一 API 都會導致地圖功能無法正常運作。

## 🚀 快速開始

### 環境需求

- Node.js (推薦 v20.18.1 或更高版本)
- npm 或 yarn

### 安裝步驟

1. Clone 專案

```sh
git clone https://github.com/orangeCatGang/JiaBaMap.git
cd JiaBaMap
```

2. 安裝依賴

```sh
npm install
```

3. 環境設置

- 在專案根目錄建立 `.env.local` 檔案
- 添加以下內容：

```sh
VITE_GOOGLE_MAPS_API_KEY=<your google api key>
```

4. 啟動開發伺服器

```sh
npm run dev
```

5. 建立生產版本

```sh
npm run build
```

## 🛠️ 技術棧

- Vue 3
- Vite
- Tailwind CSS
- Google Maps API
- Axios
- Font Awesome
- DayJS

## 👥 開發團隊

> 團隊成員：7 人

### 廖冠韋

> jkk54623@gmail.com

- 搜尋頁切版
- 個人頁熱門餐廳切版
- 關鍵字與搜尋跳轉
- 訂餐頁後台

### 蕭國祥

> hsiaokuohsiang@gmail.com

- Google 地圖標記、API 串接
- 搜尋頁切版
- 相似與推薦餐廳輪播圖
- 食記後台切版
- 食記列表切版
- 食記評論、回覆與按讚功能

### 王婕瑜

> juliewah8785@gmail.com

- 專案管理、企劃書
- 線上訂餐結帳、金流 API
- 店家評論、按讚、分享
- 熱門餐廳
- 首頁切版
- 個人頁切版

### 吳宥蓁

> apple5964315@gmail.com

- 導覽列、頁尾切版
- 店家頁切板
- 編輯個人資料切版、功能
- 撰寫食記切版、功能

### 廖婉如

> wan0917ru@gmail.com

- 店家頁詳細資訊設置
- 後端 API 創建
- 串接 Google places API
- 後端測試
- 會員資訊與評論資料庫建立
- 串接 Google Cloud Storage
- 簡報製作、專案報告

### 陳文瀚

> qoo98471@gmail.com

- 串接 API
- 關鍵字搜尋
- 搜尋頁進階排序
- 串接 Google 第三方登入
- 頁面訪問驗證

### 張凱翔

> stu261426@gmail.com

## 🤝 貢獻

歡迎提出貢獻、問題和功能請求！
請查看 [issues page](https://github.com/orangeCatGang/JiaBaMap/issues).

## ⭐️ 支持我們

如果這個專案對你有幫助，請給我們一個星星 ⭐️

---

_This README was developed with ❤️ by the JiaBaMap Team_
