import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white opacity-50 flex items-center justify-center z-50">
      <div className="flex fixed items-center space-x-3 z-60">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-lg text-gray-600">Đang tải dữ liệu...</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
