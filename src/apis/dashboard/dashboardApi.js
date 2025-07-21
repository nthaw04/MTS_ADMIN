import axiosConfig from "@/config/axiosConfig";

export const dashboardApi = {
  getAllTrainRoutes: () => axiosConfig.get("/TrainRoutes/GetAll"),
  getAllTransactions: () => axiosConfig.get("/Transaction/get-all"),
  getAllBusRoutes: () => axiosConfig.get("/BusRoutes/GetAll"),
  getAllUsers: () => axiosConfig.get("/User/get-all-user-accounts"),
  getAllTerminals: () => axiosConfig.get("/Terminal/all"),
};
