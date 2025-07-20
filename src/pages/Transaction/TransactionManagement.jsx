"use client";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  CreditCard,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";

// Dữ liệu giao dịch giả định (nhiều hơn để minh họa phân trang)
const ALL_TRANSACTIONS = [
  {
    id: "TRX001",
    date: "2024-07-19",
    description: "Thanh toán hóa đơn điện",
    amount: 550000,
    status: "completed",
    type: "payment",
  },
  {
    id: "TRX002",
    date: "2024-07-18",
    description: "Mua sắm trực tuyến",
    amount: 1200000,
    status: "pending",
    type: "purchase",
  },
  {
    id: "TRX003",
    date: "2024-07-17",
    description: "Nạp tiền điện thoại",
    amount: 100000,
    status: "completed",
    type: "top-up",
  },
  {
    id: "TRX004",
    date: "2024-07-16",
    description: "Hoàn tiền đơn hàng #12345",
    amount: -350000,
    status: "refunded",
    type: "refund",
  },
  {
    id: "TRX005",
    date: "2024-07-15",
    description: "Thanh toán dịch vụ internet",
    amount: 250000,
    status: "failed",
    type: "payment",
  },
  {
    id: "TRX006",
    date: "2024-07-14",
    description: "Chuyển khoản cho bạn bè",
    amount: 700000,
    status: "completed",
    type: "transfer",
  },
  {
    id: "TRX007",
    date: "2024-07-13",
    description: "Mua vé xem phim",
    amount: 180000,
    status: "completed",
    type: "purchase",
  },
  {
    id: "TRX008",
    date: "2024-07-12",
    description: "Thanh toán hóa đơn nước",
    amount: 150000,
    status: "completed",
    type: "payment",
  },
  {
    id: "TRX009",
    date: "2024-07-11",
    description: "Nạp tiền game",
    amount: 200000,
    status: "pending",
    type: "top-up",
  },
  {
    id: "TRX010",
    date: "2024-07-10",
    description: "Hoàn tiền dịch vụ",
    amount: -100000,
    status: "refunded",
    type: "refund",
  },
  {
    id: "TRX011",
    date: "2024-07-09",
    description: "Mua sách online",
    amount: 450000,
    status: "completed",
    type: "purchase",
  },
  {
    id: "TRX012",
    date: "2024-07-08",
    description: "Chuyển khoản ngân hàng",
    amount: 1500000,
    status: "completed",
    type: "transfer",
  },
  {
    id: "TRX013",
    date: "2024-07-07",
    description: "Thanh toán phí dịch vụ",
    amount: 300000,
    status: "failed",
    type: "payment",
  },
  {
    id: "TRX014",
    date: "2024-07-06",
    description: "Nạp data 4G",
    amount: 50000,
    status: "completed",
    type: "top-up",
  },
  {
    id: "TRX015",
    date: "2024-07-05",
    description: "Mua ứng dụng",
    amount: 75000,
    status: "completed",
    type: "purchase",
  },
  {
    id: "TRX016",
    date: "2024-07-04",
    description: "Hoàn tiền sản phẩm lỗi",
    amount: -200000,
    status: "refunded",
    type: "refund",
  },
  {
    id: "TRX017",
    date: "2024-07-03",
    description: "Thanh toán tiền nhà",
    amount: 3000000,
    status: "completed",
    type: "payment",
  },
  {
    id: "TRX018",
    date: "2024-07-02",
    description: "Mua đồ ăn online",
    amount: 120000,
    status: "pending",
    type: "purchase",
  },
  {
    id: "TRX019",
    date: "2024-07-01",
    description: "Nạp tiền ví điện tử",
    amount: 500000,
    status: "completed",
    type: "top-up",
  },
  {
    id: "TRX020",
    date: "2024-06-30",
    description: "Chuyển tiền quốc tế",
    amount: 5000000,
    status: "completed",
    type: "transfer",
  },
];

// Hàm định dạng số tiền thành VND
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Hàm ánh xạ trạng thái sang văn bản và biểu tượng
const getStatusDisplay = (status) => {
  switch (status) {
    case "completed":
      return {
        text: "Hoàn thành",
        icon: <CheckCircle className="h-3 w-3" />,
        className: "bg-green-100 text-green-700 border-green-200",
      };
    case "pending":
      return {
        text: "Đang chờ",
        icon: <Clock className="h-3 w-3" />,
        className: "bg-yellow-100 text-yellow-700 border-yellow-200",
      };
    case "failed":
      return {
        text: "Thất bại",
        icon: <XCircle className="h-3 w-3" />,
        className: "bg-red-100 text-red-700 border-red-200",
      };
    case "refunded":
      return {
        text: "Đã hoàn tiền",
        icon: <DollarSign className="h-3 w-3" />,
        className: "bg-blue-100 text-blue-700 border-blue-200",
      };
    default:
      return { text: status, icon: null, className: "" };
  }
};

// Hàm ánh xạ loại giao dịch sang văn bản
const getTypeDisplayName = (type) => {
  switch (type) {
    case "payment":
      return "Thanh toán";
    case "purchase":
      return "Mua sắm";
    case "top-up":
      return "Nạp tiền";
    case "refund":
      return "Hoàn tiền";
    case "transfer":
      return "Chuyển khoản";
    default:
      return type;
  }
};

export default function TransactionManagement({
  initialTransactions = ALL_TRANSACTIONS,
  itemsPerPageOptions = [5, 10, 20],
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState(undefined);

  // Lọc giao dịch dựa trên loại và khoảng thời gian
  const filteredTransactions = useMemo(() => {
    let filtered = initialTransactions;

    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    if (dateRange?.from) {
      const fromDate = dateRange.from.setHours(0, 0, 0, 0);
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.date).setHours(0, 0, 0, 0);
        return transactionDate >= fromDate;
      });
    }
    if (dateRange?.to) {
      const toDate = dateRange.to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.date).setHours(0, 0, 0, 0);
        return transactionDate <= toDate;
      });
    }

    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ); // Sắp xếp theo ngày mới nhất
  }, [initialTransactions, filterType, dateRange]);

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi số lượng mục
  };

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi bộ lọc
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi bộ lọc
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-start bg-gray-50 p-4 sm:p-6 lg:p-8">
      <Card className="w-full mx-auto shadow-lg rounded-lg">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-gray-700" />
            Lịch sử Giao dịch
          </CardTitle>
          <CardDescription className="text-gray-600">
            Xem và quản lý tất cả các giao dịch thanh toán của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            {/* Bộ lọc theo loại */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-5 w-5 text-gray-500" />
              <Select onValueChange={handleFilterTypeChange} value={filterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="payment">Thanh toán</SelectItem>
                  <SelectItem value="purchase">Mua sắm</SelectItem>
                  <SelectItem value="top-up">Nạp tiền</SelectItem>
                  <SelectItem value="refund">Hoàn tiền</SelectItem>
                  <SelectItem value="transfer">Chuyển khoản</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bộ lọc theo ngày */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full sm:w-[280px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Chọn khoảng ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Mã Giao dịch</TableHead>
                  <TableHead className="w-[120px]">Ngày</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="w-[120px]">Loại</TableHead>
                  <TableHead className="text-right">Số tiền</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((transaction) => {
                    const statusDisplay = getStatusDisplay(transaction.status);
                    const amountClass =
                      transaction.amount < 0
                        ? "text-red-600"
                        : "text-green-600";
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.id}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {format(new Date(transaction.date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          {getTypeDisplayName(transaction.type)}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-semibold",
                            amountClass
                          )}
                        >
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={cn(
                              "flex items-center justify-center gap-1",
                              statusDisplay.className
                            )}
                          >
                            {statusDisplay.icon} {statusDisplay.text}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-gray-500"
                    >
                      Không tìm thấy giao dịch nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Phân trang và lựa chọn số mục trên mỗi trang */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Số mục mỗi trang:</span>
              <Select
                onValueChange={handleItemsPerPageChange}
                value={String(itemsPerPage)}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent>
                  {itemsPerPageOptions.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-disabled={currentPage === 1}
                    tabIndex={currentPage === 1 ? -1 : undefined}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => handlePageChange(currentPage + 1)}
                    aria-disabled={currentPage === totalPages}
                    tabIndex={currentPage === totalPages ? -1 : undefined}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
