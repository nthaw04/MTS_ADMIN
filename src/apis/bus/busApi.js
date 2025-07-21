import axiosConfig from "@/config/axiosConfig";

const busApi = {
  getList: () => axiosConfig.get("/BusRoutes/GetAll"),
  create: (data) => axiosConfig.post("/BusRoutes/Create", data),
  update: (data) => axiosConfig.put("/BusRoutes/Update", data),
  delete: (id) => axiosConfig.delete(`/BusRoutes/${id}`),
};

export default busApi;
