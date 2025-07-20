import axiosConfig from "@/config/axiosConfig";

export const trainApi = {
  getAllTerminal: () => axiosConfig.get("/Terminal/all"),

  createTerminal: (data) => {
    return axiosConfig.post("/Terminal/create-terminal", data);
  },

  createTrainRoute: (data) => {
    axiosConfig.post("/TrainRoutes/Create", data);
  },

  getRouteBetween: ({ startTerminal, endTerminal }) => {
    return axiosConfig.get("/TrainRoutes/GetTrainRoute", {
      data: startTerminal,
      endTerminal,
    });
  },
};
