import { refundApi } from "@/apis/refund/refundApi";
import { useEffect, useState } from "react";

const useRefundApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRefundApplications = async () => {
    try {
      const res = await refundApi.getAll();
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch refund applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatusRefund = async ({ requestId, status, adminNotes }) => {
    try {
      await refundApi.setStatusRefund({ requestId, status, adminNotes });
      await fetchRefundApplications();
    } catch (err) {
      console.error("Failed to update application status:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchRefundApplications();
  }, []);

  return {
    applications,
    loading,
    updateStatusRefund,
    refetch: fetchRefundApplications,
  };
};

export default useRefundApplication;
