// src/api/goongClient.js
import axios from "axios";

const GOONG_API_KEY = process.env.REACT_APP_GOONG_API_KEY;

if (!GOONG_API_KEY) {
  console.warn("REACT_APP_GOONG_API_KEY not found – Goong Maps APIs will fail. Add to .env file.");
}

const goongClient = axios.create({
  baseURL: "https://rsapi.goong.io",
  params: { api_key: GOONG_API_KEY },
  timeout: 5000,
});

export default goongClient;