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

function TrainPage() {
  const { terminals, loading, refetch } = useTerminals();
  const routes = [
    {
      id: 1,
      name: "Line 1",
      color: "bg-blue-500",
      stations: 12,
      status: "active",
      passengers: 1247,
      avgTime: "45 phút",
      lastUpdate: "2 phút trước",
    },
    {
      id: 2,
      name: "Line 2",
      color: "bg-green-500",
      stations: 8,
      status: "active",
      passengers: 892,
      avgTime: "32 phút",
      lastUpdate: "1 phút trước",
    },
    {
      id: 3,
      name: "Line 3",
      color: "bg-red-500",
      stations: 15,
      status: "maintenance",
      passengers: 0,
      avgTime: "0 phút",
      lastUpdate: "30 phút trước",
    },
    {
      id: 4,
      name: "Line 4",
      color: "bg-purple-500",
      stations: 10,
      status: "active",
      passengers: 1534,
      avgTime: "38 phút",
      lastUpdate: "3 phút trước",
    },
  ];

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
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Cài đặt tuyến
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm tuyến mới
          </Button>
        </div>
      </div>

      {/* Route Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {routes.map((route) => (
          <Card
            key={route.id}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${route.color}`}></div>
                  <h3 className="font-bold text-lg">{route.name}</h3>
                </div>
                <Badge
                  variant={route.status === "active" ? "default" : "secondary"}
                >
                  {route.status === "active" ? "Hoạt động" : "Bảo trì"}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trạm dừng</span>
                  <span className="font-medium">{route.stations}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hành khách</span>
                  <span className="font-medium">{route.passengers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Thời gian TB</span>
                  <span className="font-medium">{route.avgTime}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Cập nhật: {route.lastUpdate}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Route Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Route className="w-5 h-5 mr-2" />
              Sơ đồ tuyến đường
            </CardTitle>
            <CardDescription>
              Bản đồ tổng quan các tuyến tàu điện ngầm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg p-6 h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Route className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Sơ đồ tuyến đường sẽ được hiển thị tại đây</p>
                <p className="text-sm">
                  Tích hợp với Google Maps hoặc OpenStreetMap
                </p>
              </div>
            </div>
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
            Hiệu suất tuyến đường
          </CardTitle>
          <CardDescription>
            Thống kê hiệu suất và lưu lượng hành khách
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">3,673</p>
              <p className="text-sm text-gray-600">Tổng hành khách hôm nay</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">38.5</p>
              <p className="text-sm text-gray-600">
                Thời gian trung bình (phút)
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Route className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">96.2%</p>
              <p className="text-sm text-gray-600">Tỷ lệ đúng giờ</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TrainPage;
