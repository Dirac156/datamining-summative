import axios from "axios";
import { toast } from "react-hot-toast";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API || "http://127.0.0.1:8000",
  // baseURL: "http://localhost:6000",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      if (response.data.error) {
        toast.error(response.data.error); // handle error message with toast
      } else {
        return response.data;
      }
    } else {
      if (response.status === 403) {
        window.location.href = "/"; // redirect to home page for forbidden error
      } else if (response.status === 301 || response.status === 302) {
        window.location.href = response.data.location;
      } else {
        toast.error(`Request failed`); // handle other status codes with toast
      }
      throw new Error(`Request failed`);
    }
  },
  (error) => {
    if (error.response && error.response.data) {
      toast.error(error.response.data.message); // handle error message with toast
    } else if (error.request) {
      toast.error("Network error occurred, please try again later."); // handle network error with toast
    } else {
      toast.error("An unexpected error occurred."); // handle other errors with toast
    }
    return Promise.reject(error);
  }
);

export default instance;
