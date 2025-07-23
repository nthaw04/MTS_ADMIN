import axiosConfig from "@/config/axiosConfig";

export const refundApi = {
  getAll: () => axiosConfig.get("/Refund/requests-for-admin"),

  setStatusRefund: ({ requestId, status, adminNotes }) => {
    if (!adminNotes || adminNotes.trim() === "") {
      throw new Error("Lý do phê duyệt hoặc từ chối không được để trống.");
    }

    const data = {
      requestId,
      status,
      adminNotes,
    };

    return axiosConfig.patch(`/Refund/process/${requestId}`, data);
  },
};
