import { defineStore } from "pinia";
import { ref } from "vue";

export const useCommentStore = defineStore("commentStore", () => {
  const comments = ref([]);
  const addComment = (newComment) => {
    comments.value.unshift(newComment);
  };
  return {
    comments,
    addComment,
  };
});
