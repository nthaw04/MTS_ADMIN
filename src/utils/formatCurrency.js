export const formatVND = (value) => {
  if (!value || isNaN(value)) return "0 ₫";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value * 1000);
};

export const formatMoney = (value) => {
  if (!value || isNaN(value)) return "0 VND";

  return new Intl.NumberFormat("vi-VN", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(value) + " VND";
};
