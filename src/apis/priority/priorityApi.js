import axiosConfig from "@/config/axiosConfig";

export const priorityApi = {
  getAll: () => axiosConfig.get("/PriorityApplication/get-all"),

  getDetail: (applicationId) =>
    axiosConfig.get(`/PriorityApplication/detail/${applicationId}`),

  setStatus: ({ applicationId, applicationStatus, note }) => {
    if (applicationStatus === "Rejected" && (!note || note.trim() === "")) {
      throw new Error("Rejected application must include a note.");
    }

    const params = {
      applicationId,
      applicationStatus,
      ...(applicationStatus === "Rejected" ? { note } : {}),
    };

    return axiosConfig.patch("/PriorityApplication/set-status", null, {
      params,
    });
  },
};
