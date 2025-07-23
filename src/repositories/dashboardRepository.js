import axiosConfig from "@/config/axiosConfig";

const dashboardRepository = {
  getAllTrainRoutes: () => axiosConfig.get("/TrainRoutes/GetAll"),
  getAllTransactions: () => axiosConfig.get("/Transaction/get-all"),
  getAllUsers: () => axiosConfig.get("/User/get-all-user-accounts"),
  getAllTickets: () => axiosConfig.get("/Ticket/GetAllTicket"),
};

export default dashboardRepository;
