import axiosConfig from "@/config/axiosConfig";

export const trainApi = {
  getAllTerminal: () => axiosConfig.get("/Terminal/all"),
};
