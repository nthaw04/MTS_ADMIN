/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { decodeToken, setToken } from "@/utils/auth/auth";
import authApi from "@/apis/auth/authApi";
import {
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
  Lock,
  MapPin,
  Ticket,
  Train,
  User,
  UserRound,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authApi.login({ userName, password });
      const token = res.data.token;

      const decoded = decodeToken(token);
      console.log("decoded:", decoded);

      if (decoded.role !== "1") {
        toast.error("Bạn không có quyền truy cập admin");
        return;
      }

      setToken(token);
      toast.success("Đăng nhập thành công!");
      navigate("/admin");
    } catch (err) {
      toast.error("Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex">
      {/* Left Side - Metro Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
        {/* Metro Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Grid Pattern */}
            <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-white/20"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Metro Lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60"></div>
          <div className="absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-60"></div>

          <div className="absolute left-1/4 top-0 h-full w-1 bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-60"></div>
          <div className="absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-60"></div>
          <div className="absolute left-3/4 top-0 h-full w-1 bg-gradient-to-b from-transparent via-orange-400 to-transparent opacity-60"></div>
        </div>

        {/* Metro Stations */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full shadow-lg animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-green-400 rounded-full shadow-lg animate-pulse delay-100"></div>
        <div className="absolute top-3/4 left-3/4 w-4 h-4 bg-red-400 rounded-full shadow-lg animate-pulse delay-200"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                <Train className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">
                METRO TICKET SYSTEM
              </h1>
              <h2 className="text-2xl font-light text-blue-100">
                Hệ thống quản lý vé điện tử
              </h2>
            </div>

            {/* Features */}
            <div className="space-y-6 mt-12">
              <div className="flex items-center space-x-4 text-blue-100">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Ticket className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Quản lý vé điện tử</p>
                  <p className="text-sm opacity-80">Hệ thống bán vé tự động</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-blue-100">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Theo dõi tuyến đường</p>
                  <p className="text-sm opacity-80">
                    Giám sát toàn bộ hệ thống
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-blue-100">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Thời gian thực</p>
                  <p className="text-sm opacity-80">Cập nhật liên tục 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black/20 to-transparent"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="space-y-4 pt-2">
              {/* Mobile Logo */}
              <div className="flex justify-center lg:hidden">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <Train className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="text-center space-y-3">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Đăng nhập hệ thống
                </CardTitle>
                <CardDescription className="text-xl text-gray-600">
                  Hệ thống quản lý vé tàu Metro
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pb-2">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-md font-medium text-gray-700"
                  >
                    Tên đăng nhập
                  </Label>
                  <div className="relative">
                    <UserRound className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Nhập tên đăng nhập"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-md font-medium text-gray-700"
                  >
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-4 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Đang đăng nhập...
                    </div>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2025 Metro Ticket System. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
