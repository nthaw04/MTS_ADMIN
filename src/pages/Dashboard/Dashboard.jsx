import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Route,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";

function Dashboard() {
  const stats = [
    {
      title: "Tổng người dùng",
      value: "12,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      title: "Vé đã bán hôm nay",
      value: "3,421",
      change: "+8.2%",
      trend: "up",
      icon: Ticket,
      color: "green",
    },
    {
      title: "Tuyến đường hoạt động",
      value: "24",
      change: "0%",
      trend: "stable",
      icon: Route,
      color: "purple",
    },
    {
      title: "Doanh thu hôm nay",
      value: "₫2.4M",
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
      color: "orange",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "user",
      message: "Người dùng mới đăng ký: nguyen.van.a@email.com",
      time: "2 phút trước",
      status: "success",
    },
    {
      id: 2,
      type: "ticket",
      message: "Vé tháng được mua cho tuyến Line 1",
      time: "5 phút trước",
      status: "success",
    },
    {
      id: 3,
      type: "system",
      message: "Trạm Bến Thành tạm ngừng hoạt động",
      time: "10 phút trước",
      status: "warning",
    },
    {
      id: 4,
      type: "route",
      message: "Tuyến Line 2 hoạt động bình thường",
      time: "15 phút trước",
      status: "success",
    },
  ];

  const routeStatus = [
    { name: "Line 1", status: "active", passengers: 1247, delay: 0 },
    { name: "Line 2", status: "active", passengers: 892, delay: 2 },
    { name: "Line 3", status: "maintenance", passengers: 0, delay: 0 },
    { name: "Line 4", status: "active", passengers: 1534, delay: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Tổng quan hệ thống Metro Ticket</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-green-600 border-green-200">
            <Activity className="w-3 h-3 mr-1" />
            Hệ thống hoạt động
          </Badge>
          <Button>
            <TrendingUp className="w-4 h-4 mr-2" />
            Xem báo cáo
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {stat.trend === "up" && (
                        <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                      )}
                      {stat.trend === "down" && (
                        <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : stat.trend === "down"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      stat.color === "blue"
                        ? "bg-blue-100"
                        : stat.color === "green"
                        ? "bg-green-100"
                        : stat.color === "purple"
                        ? "bg-purple-100"
                        : "bg-orange-100"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        stat.color === "blue"
                          ? "text-blue-600"
                          : stat.color === "green"
                          ? "text-green-600"
                          : stat.color === "purple"
                          ? "text-purple-600"
                          : "text-orange-600"
                      }`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Route className="w-5 h-5 mr-2" />
              Trạng thái tuyến đường
            </CardTitle>
            <CardDescription>
              Theo dõi hoạt động của các tuyến tàu điện ngầm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routeStatus.map((route, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        route.status === "active"
                          ? "bg-green-500"
                          : route.status === "maintenance"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900">{route.name}</p>
                      <p className="text-sm text-gray-600">
                        {route.passengers} hành khách
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        route.status === "active"
                          ? "default"
                          : route.status === "maintenance"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {route.status === "active"
                        ? "Hoạt động"
                        : route.status === "maintenance"
                        ? "Bảo trì"
                        : "Dừng"}
                    </Badge>
                    {route.delay > 0 && (
                      <p className="text-xs text-orange-600 mt-1">
                        Trễ {route.delay} phút
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Hoạt động gần đây
            </CardTitle>
            <CardDescription>
              Các sự kiện mới nhất trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === "success"
                        ? "bg-green-500"
                        : activity.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
          <CardDescription>Các chức năng thường sử dụng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Users className="w-6 h-6" />
              <span className="text-xs">Thêm người dùng</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Ticket className="w-6 h-6" />
              <span className="text-xs">Tạo vé mới</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Route className="w-6 h-6" />
              <span className="text-xs">Quản lý tuyến</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <AlertTriangle className="w-6 h-6" />
              <span className="text-xs">Báo cáo sự cố</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <CheckCircle className="w-6 h-6" />
              <span className="text-xs">Kiểm tra hệ thống</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs">Xem thống kê</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
