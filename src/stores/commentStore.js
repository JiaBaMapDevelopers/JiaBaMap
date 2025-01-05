import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { useStore } from "@/stores/storePage";

export const useCommentStore = defineStore("commentStore", () => {
  const store = useStore();
  const comments = ref([]);
  // const addComment = (newComment) => {
  //     comments.value.unshift(newComment)
  // }

  const getComment = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/comments/restaurant/${
        store.placesId
      }`,
    );
    comments.value = response.data;

    const userRes = await Promise.all(
      comments.value.map((comment) =>
        axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/user/${comment.userId}`,
        ),
      ),
    );
    comments.value = comments.value.map((comment, index) => {
      const user = userRes[index].data; // 假設 userRes 每個元素是完整的用戶數據
      return {
        ...comment, // 保留原有的 comment 屬性
        name: user.name, // 添加用戶的名稱
        avatar: user.profilePicture, // 添加用戶的頭像
      };
    });
  };
  return {
    comments,
    getComment,
    // addComment,
  };
});
