import axios from "axios";
import Cookies from "js-cookie";
import {config} from "./config";

const axiosClient = axios.create({
  // baseURL: config.BASE_URL,
  baseURL: config.BASE_URL_LOCAL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  function (config) {
    const token = Cookies.get("cookieLogin");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosClient;
