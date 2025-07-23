import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import PropTypes from "prop-types";

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  busNumber,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50 flex items-center justify-center p-4 z-50"></div>

      <div className="fixed bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden z-60">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Xác nhận xóa</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Bạn có chắc chắn muốn xóa?
              </h3>
              <p className="text-gray-600">
                Tuyến xe <span className="font-semibold">{busNumber}</span> sẽ
                bị xóa vĩnh viễn.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="outline"
            className="py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-3 bg-red-600 text-sm text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Đang xóa..." : "Xóa"}
          </Button>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  busNumber: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default DeleteConfirmModal;
