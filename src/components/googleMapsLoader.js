import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places", "marker", "maps"], 
  region: "TW", 
  language: "zh-TW", 
});

loader.load()
  .then((google) => {
    
  })
  .catch((error) => {
    console.error("Google Maps API 加載失敗:", error.message);
  });

export default loader;
