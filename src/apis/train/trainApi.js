import axiosConfig from "@/config/axiosConfig";

export const trainApi = {
  getAllTerminal: () => axiosConfig.get("/Terminal/all"),

  createTerminal: (data) => {
    return axiosConfig.post("/Terminal/create-terminal", data);
  },

  getAllTrainRoute: () => {
    return axiosConfig.get("/TrainRoutes/GetAll");
  },

  createTrainRoute: (data) => {
    axiosConfig.post("/TrainRoutes/Create", data);
  },

  updateTrainRoute: (data) => {
    axiosConfig.put("/TrainRoutes/Update", data);
  },

  getRouteBetween: ({ startTerminal, endTerminal }) => {
    return axiosConfig.post("/TrainRoutes/GetTrainRoute", {
      startTerminal,
      endTerminal,
    });
  },
};
