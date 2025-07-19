import { useEffect, useState } from "react";
import { priorityApi } from "@/apis/priority/priorityApi";

const usePriorityApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchApplications = async () => {
    try {
      const res = await priorityApi.getAll();
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch priority applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (applicationId) => {
    try {
      setDetailLoading(true);
      const res = await priorityApi.getDetail(applicationId);
      setSelectedApplication(res.data);
    } catch (err) {
      console.error("Failed to fetch application detail:", err);
      setSelectedApplication(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const updateStatus = async ({ applicationId, applicationStatus, note }) => {
    try {
      await priorityApi.setStatus({ applicationId, applicationStatus, note });
      await fetchApplications();
    } catch (err) {
      console.error("Failed to update application status:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    loading,
    refetch: fetchApplications,
    updateStatus,
    selectedApplication,
    fetchDetail,
    detailLoading,
  };
};

export default usePriorityApplications;
