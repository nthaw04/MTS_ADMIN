import axiosConfig from "@/config/axiosConfig";

export const transactionApi = {
  getAllTransactions: () => axiosConfig.get("/Transaction/get-all"),
};
