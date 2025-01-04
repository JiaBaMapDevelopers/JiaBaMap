import { defineStore } from "pinia";
import { ref } from "vue";

export const useRestaurantStore = defineStore("restaurant", () => {
  const hoveredPlaceId = ref(null);

  const setHoveredPlace = (placedId) => {
    hoveredPlaceId.value = placedId;
  };

  return {
    hoveredPlaceId,
    setHoveredPlace,
  };
});
