import { useState, useEffect } from "react";
import { X } from "lucide-react";
import PropTypes from "prop-types";

export const BusModal = ({
  isOpen,
  onClose,
  onSubmit,
  busRoute,
  terminals,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    busNumber: "",
    terminalId: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (busRoute) {
      setFormData({
        busNumber: busRoute.busNumber,
        terminalId: [...busRoute.terminalId],
      });
    } else {
      setFormData({
        busNumber: "",
        terminalId: [],
      });
    }
    setErrors({});
  }, [busRoute, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.busNumber.trim()) {
      newErrors.busNumber = "Số xe buýt là bắt buộc";
    }

    if (formData.terminalId.length < 1) {
      newErrors.terminals = "Phải chọn ít nhất 1 ga";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleTerminalChange = (terminalId, checked) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        terminalId: [...prev.terminalId, terminalId],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        terminalId: prev.terminalId.filter((id) => id !== terminalId),
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50 flex items-center justify-center p-4 z-50"></div>

      <div className="fixed bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden z-60">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {busRoute ? "Chỉnh sửa tuyến xe" : "Thêm tuyến xe mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="busNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Số xe buýt
              </label>
              <input
                type="text"
                id="busNumber"
                value={formData.busNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    busNumber: e.target.value,
                  }))
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.busNumber ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập số xe buýt (ví dụ: Bus 01)"
              />
              {errors.busNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.busNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Chọn các ga trên tuyến
              </label>
              <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
                {terminals.map((terminal) => (
                  <label
                    key={terminal.id}
                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={formData.terminalId.includes(terminal.id)}
                      onChange={(e) =>
                        handleTerminalChange(terminal.id, e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900">
                        {terminal.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {terminal.location}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.terminals && (
                <p className="mt-1 text-sm text-red-600">{errors.terminals}</p>
              )}
            </div>

            {formData.terminalId.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Các ga đã chọn ({formData.terminalId.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.terminalId.map((terminalId) => {
                    const terminal = terminals.find((t) => t.id === terminalId);
                    return terminal ? (
                      <span
                        key={terminalId}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {terminal.name}
                        <button
                          type="button"
                          onClick={() =>
                            handleTerminalChange(terminalId, false)
                          }
                          className="ml-1 hover:text-blue-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? "Đang xử lý..." : busRoute ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

BusModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  busRoute: PropTypes.shape({
    busNumber: PropTypes.string.isRequired,
    terminalId: PropTypes.arrayOf(PropTypes.number).isRequired,
  }),
  terminals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default BusModal;
