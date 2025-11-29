// src/api/goongClientMap.jsx
import axios from "axios";

const GOONG_API_MAPTILE_KEY = process.env.REACT_APP_GOONG_API_KEY;  // Thống nhất với key chung

if (!GOONG_API_MAPTILE_KEY) {
  console.warn("REACT_APP_GOONG_API_KEY not found – Goong Map Tiles will fail. Add to .env file.");
}

const goongClientMap = axios.create({
  baseURL: "https://rsapi.goong.io",
  params: { api_key: GOONG_API_MAPTILE_KEY },
  timeout: 5000,
});

export default goongClientMap;