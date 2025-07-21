import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { dashboardApi } from "@/apis/dashboard/dashboardApi";

const useDashboard = () => {
  const [trainRoutes, setTrainRoutes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [busRoutes, setBusRoutes] = useState([]);
  const [users, setUsers] = useState([]);
  const [terminals, setTerminals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        trainRoutesRes,
        transactionsRes,
        busRoutesRes,
        usersRes,
        terminalsRes,
      ] = await Promise.all([
        dashboardApi.getAllTrainRoutes(),
        dashboardApi.getAllTransactions(),
        dashboardApi.getAllBusRoutes(),
        dashboardApi.getAllUsers(),
        dashboardApi.getAllTerminals(),
      ]);

      setTrainRoutes(trainRoutesRes.data);
      setTransactions(transactionsRes.data);
      setBusRoutes(busRoutesRes.data);
      setUsers(usersRes.data);
      setTerminals(terminalsRes.data);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Không thể tải dữ liệu dashboard");
      toast.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    trainRoutes,
    transactions,
    busRoutes,
    users,
    terminals,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};

export default useDashboard;
