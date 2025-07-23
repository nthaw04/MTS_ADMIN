/**
 * Format transaction status to Vietnamese
 * @param {string} status
 * @returns {string}
 */
export const formatTransactionStatus = (status) => {
  switch (status) {
    case "Pending":
      return "Đang xử lý";
    case "Succeed":
      return "Thành công";
    case "Failed":
      return "Thất bại";
    default:
      return status;
  }
};

/**
 * Format transaction type to Vietnamese
 * @param {string} type
 * @returns {string}
 */
export const formatTransactionType = (type) => {
  switch (type) {
    case "Purchase":
      return "Mua vé";
    case "TopUp":
      return "Nạp tiền";
    case "Refund":
      return "Hoàn tiền";
    case "Correction":
      return "Điều chỉnh";
    default:
      return type;
  }
};

export const getStatusBadge = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 text-[16px]";
    case "Succeed":
      return "bg-green-100 text-green-800 text-[16px]";
    case "Failed":
      return "bg-red-100 text-red-800 text-[16px]";
    default:
      return "bg-gray-100 text-gray-800 text-[16px]";
  }
};

export const getTypeColor = (type) => {
  switch (type) {
    case "Purchase":
      return "text-green-800 font-medium text-[16px]";
    case "TopUp":
      return "text-yellow-700 font-medium text-[16px]";
    case "Refund":
      return "text-red-800 font-medium text-[16px]";
    case "Correction":
      return "text-blue-800 font-medium text-[16px]";
    default:
      return "text-gray-800 font-medium text-[16px]";
  }
};
