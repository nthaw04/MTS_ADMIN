import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Bus, MapPin } from "lucide-react";
import useBus from "@/hooks/bus/useBus";
import useTerminals from "@/hooks/train/useTrains";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import ErrorScreen from "@/components/Error/ErrorScreen";
import BusModal from "@/pages/RouteManagement/Bus/components/BusModal";
import DeleteConfirmModal from "@/pages/RouteManagement/Bus/components/DeleteConfirmModal";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const BusPage = () => {
  const {
    busRoutes,
    loading,
    error,
    createBusRoute,
    updateBusRoute,
    deleteBusRoute,
    refetch: refetchBus,
  } = useBus();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const passengerId = userInfo?.id;
  const { terminals, refetch: refetchTerminal } = useTerminals();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBusRoute, setSelectedBusRoute] = useState(null);

  const handleCreate = () => {
    setSelectedBusRoute(null);
    setIsModalOpen(true);
  };

  const handleEdit = (busRoute) => {
    setSelectedBusRoute(busRoute);
    setIsModalOpen(true);
  };

  const handleDelete = (busRoute) => {
    setSelectedBusRoute(busRoute);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data) => {
    if (selectedBusRoute) {
      await updateBusRoute({
        busRouteId: selectedBusRoute.busRouteId,
        ...data,
      });
    } else {

      if (!passengerId) {
        toast.error("Không tìm thấy passengerId trong localStorage");
        return;
      }

      await createBusRoute({
        passengerId,
        ...data,
      });
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBusRoute) return;
    await deleteBusRoute(selectedBusRoute.busRouteId);
    setIsDeleteModalOpen(false);
    setSelectedBusRoute(null);
  };

  const getTerminalsByIds = (terminalIds) => {
    return terminalIds
      .map((id) => terminals.find((t) => t.id === id))
      .filter(Boolean);
  };

  const handleRetry = () => {
    refetchBus();
    refetchTerminal();
  }

  if (error) {
    return <ErrorScreen message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="">
      <div className="relative">
        {loading && <LoadingScreen />}
        <div className="mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  Quản lý tuyến xe buýt
                </h1>
                <p className="text-gray-600 mt-2">
                  Quản lý thông tin các tuyến xe buýt và ga dừng
                </p>
              </div>
              <Button
                onClick={handleCreate}
                className=" text-white px-6 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center space-x-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm tuyến mới</span>
              </Button>
            </div>
          </div>

          {!loading && busRoutes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bus className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có tuyến xe buýt nào
              </h3>
              <p className="text-gray-600 mb-6">
                Bắt đầu bằng cách thêm tuyến xe buýt đầu tiên của bạn
              </p>
              <Button
                onClick={handleCreate}
                className="text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Thêm tuyến đầu tiên
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {busRoutes.map((busRoute) => {
                const routeTerminals = getTerminalsByIds(busRoute.terminalId);
                return (
                  <div
                    key={busRoute.busRouteId}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Bus className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {busRoute.busNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {routeTerminals.length} ga
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(busRoute)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(busRoute)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Lộ trình
                        </h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                          {routeTerminals.map((terminal, index) => (
                            <div key={terminal.id} className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                                  {index + 1}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 text-sm">
                                  {terminal.name}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {terminal.location}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        busRoute={selectedBusRoute}
        terminals={terminals}
        isLoading={loading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        busNumber={selectedBusRoute?.busNumber || ""}
        isLoading={loading}
      />
    </div>
  );
}

export default BusPage;
