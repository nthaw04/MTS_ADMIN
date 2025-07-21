/* eslint-disable no-unused-vars */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useTerminals from "@/hooks/train/useTrains";
import { getUserInfo } from "@/utils/auth/auth";
import { formatVND } from "@/utils/formatCurrency";
import {
  AlertTriangle,
  Clock,
  Loader2,
  MapPin,
  Plus,
  Route,
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import AddTerminalModal from "./components/AddTerminalModal";
import TrainRoutesTable from "./components/TrainRoutesTable";
function TrainPage() {
  const {
    terminals,
    loading,
    createTrainRoute,
    createTerminal,
    getRoutePriceBetween,
    refetch,
  } = useTerminals();
  const user = getUserInfo();
  const [showModal, setShowModal] = useState(false);
  //form TẠO tuyến
  const [createStart, setCreateStart] = useState("");
  const [createEnd, setCreateEnd] = useState("");
  const [createPrice, setCreatePrice] = useState("");
  //form TRA giá
  const [searchStart, setSearchStart] = useState("");
  const [searchEnd, setSearchEnd] = useState("");
  const [foundPrice, setFoundPrice] = useState(null);

  const handleCreateTrainRoute = async (e) => {
    e.preventDefault();
    if (createStart === createEnd) {
      toast.warn("Ga bắt đầu và kết thúc không được trùng nhau!");
      return;
    }
    const body = {
      userId: user.id,
      price: parseInt(createPrice) * 1000,
      startTerminal: parseInt(createStart),
      endTerminal: parseInt(createEnd),
    };
    console.log("Sending createTrainRoute body:", body);
    try {
      await createTrainRoute(body);
      toast.success("Tạo giá tuyến thành công");
      setCreateStart("");
      setCreateEnd("");
      setCreatePrice("");
    } catch (err) {
      console.error("Create train route error:", err);
      toast.error("Tạo tuyến thất bại!");
    }
  };

  const handleSearchPrice = async (e) => {
    e.preventDefault();
    if (!searchStart || !searchEnd || searchStart === searchEnd) {
      toast.warn("Vui lòng chọn 2 ga khác nhau!");
      return;
    }
    try {
      const res = await getRoutePriceBetween(
        parseInt(searchStart),
        parseInt(searchEnd)
      );
      if (res?.price) {
        toast.success("Tìm thấy giá tuyến!");
        setFoundPrice(res.price);
      } else {
        toast.error("Không có tuyến phù hợp!");
        setFoundPrice(null);
      }
    } catch (err) {
      console.error("Lỗi khi tra giá:", err);
      toast.error("Lỗi khi tra giá tuyến!");
      setFoundPrice(null);
    }
  };

  const handleCreateTerminal = async ({ name, location }) => {
    try {
      await createTerminal({
        userId: user.id,
        name,
        location,
      });
      toast.success("Tạo ga mới thành công!");
      setShowModal(false);
      refetch();
    } catch (err) {
      toast.error("Tạo ga mới thất bại!");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý tuyến đường
          </h1>

          <p className="text-gray-600 mt-1">
            Quản lý các tuyến tàu và trạm dừng
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm tuyến mới
          </Button>
        </div>
      </div>

      {/* Route Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Route className="w-5 h-5 mr-2" /> Thiết lập giá giữa các chặng
            </CardTitle>

            <CardDescription>Thiết lập giá vé giữa các ga</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleCreateTrainRoute} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ga bắt đầu
                  </label>

                  <select
                    value={createStart}
                    onChange={(e) => setCreateStart(e.target.value)}
                    className="mt-1 block w-full border rounded-md p-2"
                    required
                  >
                    <option value="">-- Chọn ga bắt đầu --</option>

                    {terminals.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ga kết thúc
                  </label>

                  <select
                    value={createEnd}
                    onChange={(e) => setCreateEnd(e.target.value)}
                    className="mt-1 block w-full border rounded-md p-2"
                    required
                  >
                    <option value="">-- Chọn ga kết thúc --</option>

                    {terminals
                      .filter((t) => t.id !== parseInt(createStart))
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.location})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giá vé
                  </label>

                  <select
                    value={createPrice}
                    onChange={(e) => setCreatePrice(e.target.value)}
                    className="mt-1 block w-full border rounded-md p-2"
                    required
                  >
                    <option value="">-- Chọn giá vé --</option>
                    {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20].map(
                      (p) => (
                        <option key={p} value={p}>
                          {formatVND(p)}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
              <Button type="submit" className="mt-4">
                Tạo tuyến
              </Button>
            </form>
          </CardContent>
        </Card>
        {/* Station Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Dánh sách ga tàu
            </CardTitle>

            <CardDescription>
              Theo dõi hoạt động của các trạm dừng
            </CardDescription>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span>Đang tải dữ liệu...</span>
              </div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                {terminals.map((terminal) => (
                  <div
                    key={terminal.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-green-500" />

                      <div>
                        <p className="font-medium text-gray-900">
                          {terminal.location}
                        </p>

                        <Badge variant="defaut" className="font-bold mt-1">
                          {terminal.name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Route Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Tra cứu giá tuyến
          </CardTitle>

          <CardDescription>Tìm giá vé giữa 2 ga bất kỳ</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSearchPrice}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ga bắt đầu
              </label>

              <select
                value={searchStart}
                onChange={(e) => setSearchStart(e.target.value)}
                className="mt-1 block w-full border rounded-md p-2"
              >
                <option value="">-- Chọn ga bắt đầu --</option>

                {terminals.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ga kết thúc
              </label>

              <select
                value={searchEnd}
                onChange={(e) => setSearchEnd(e.target.value)}
                className="mt-1 block w-full border rounded-md p-2"
              >
                <option value="">-- Chọn ga kết thúc --</option>

                {terminals
                  .filter((t) => t.id !== parseInt(searchStart))
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.location})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <Button type="submit" className="w-full">
                Tra giá
              </Button>
            </div>
          </form>

          {foundPrice !== null && (
            <div className="mt-4 text-green-700 font-semibold text-lg">
              Giá tuyến: {foundPrice.toLocaleString("vi-VN")}₫
            </div>
          )}
        </CardContent>
      </Card>
      <AddTerminalModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateTerminal}
        nextTerminalId={terminals.length + 1}
      />
      <TrainRoutesTable />
    </div>
  );
}
export default TrainPage;
