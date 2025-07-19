import axiosConfig from "@/config/axiosConfig";

export const userApi = {
  getAllUser: () => axiosConfig.get("/User/get-all-user-accounts"),
  createStafAccount: (data) =>
    axiosConfig.post("/User/create-staff-account", data),
  setUserActiveStatus: (userId, result) =>
    axiosConfig.patch(`/User/set-user-account-isActive-status`, null, {
      params: { userId, result },
    }),
};
