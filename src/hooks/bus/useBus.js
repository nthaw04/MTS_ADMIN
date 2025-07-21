import { useEffect, useState } from "react";
import busApi from "@/apis/bus/busApi";
import { toast } from "react-toastify";

const useBus = () => {
  const [busRoutes, setBusRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBusRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await busApi.getList();
      setBusRoutes(res.data);
    } catch (err) {
      console.error("Error loading bus routes:", err);
      setError("Không thể tải dữ liệu bus routes");
      toast.error("Không thể tải dữ liệu bus routes");
    } finally {
      setLoading(false);
    }
  };

  const createBusRoute = async ({ passengerId, busNumber, terminalId }) => {
    try {
      setLoading(true);
      await busApi.create({ passengerId, busNumber, terminalId });
      await fetchBusRoutes();
      toast.success("Tạo tuyến bus thành công!");
    } catch (err) {
      console.error("Error creating bus route:", err);
      setError("Không thể tạo bus route");
      toast.error("Không thể tạo tuyến bus");
    } finally {
      setLoading(false);
    }
  };

  const updateBusRoute = async ({ busRouteId, busNumber, terminalId }) => {
    try {
      setLoading(true);
      await busApi.update({ busRouteId, busNumber, terminalId });
      await fetchBusRoutes();
      toast.success("Cập nhật tuyến bus thành công!");
    } catch (err) {
      console.error("Error updating bus route:", err);
      setError("Không thể cập nhật bus route");
      toast.error("Không thể cập nhật tuyến bus");
    } finally {
      setLoading(false);
    }
  };

  const deleteBusRoute = async (busRouteId) => {
    try {
      setLoading(true);
      await busApi.delete(busRouteId);
      await fetchBusRoutes();
      toast.success("Xóa tuyến bus thành công!");
    } catch (err) {
      console.error("Error deleting bus route:", err);
      setError("Không thể xóa bus route");
      toast.error("Không thể xóa tuyến bus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusRoutes();
  }, []);

  return {
    busRoutes,
    loading,
    error,
    createBusRoute,
    updateBusRoute,
    deleteBusRoute,
    refetch: fetchBusRoutes,
  };
};

export default useBus;
