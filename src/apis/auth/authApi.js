import axiosConfig from "@/config/axiosConfig";

const authApi = {
  login: (data) => axiosConfig.post("/User/login", data),
};

export default authApi;
