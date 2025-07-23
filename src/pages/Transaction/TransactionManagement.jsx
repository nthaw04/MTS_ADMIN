import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  CreditCard,
  Filter,
  Search,
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

import useTransaction from "@/hooks/transaction/useTransaction";
import { formatMoney } from "@/utils/formatCurrency";
import {
  formatTransactionStatus,
  formatTransactionType,
  getStatusBadge,
  getTypeColor,
} from "@/utils/formatTransaction";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import ErrorScreen from "@/components/Error/ErrorScreen";
import ModalTransaction from "@/pages/Transaction/components/ModalTransaction";
import { Input } from "@/components/ui/input";


const TransactionManagement = () => {

  const { transactions: initialTransactions, loading, error, refetch } = useTransaction();
  const [selectedTx, setSelectedTx] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc giao dịch dựa trên loại và khoảng thời gian
  const filteredTransactions = useMemo(() => {
    let filtered = initialTransactions;

    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    if (dateRange?.from) {
      const fromDate = dateRange.from.setHours(0, 0, 0, 0);
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.createdAt).setHours(0, 0, 0, 0);
        return transactionDate >= fromDate;
      });
    }
    if (dateRange?.to) {
      const toDate = dateRange.to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.createdAt).setHours(0, 0, 0, 0);
        return transactionDate <= toDate;
      });
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((t) =>
        t.id.toString().includes(term) ||
        t.email?.toLowerCase().includes(term) ||
        t.userName?.toLowerCase().includes(term) ||
        t.lastName?.toLowerCase().includes(term)
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [initialTransactions, filterType, dateRange, searchTerm]);


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

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi bộ lọc
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi bộ lọc
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onRetry={refetch} />;

  return (
    <div className="w-full flex justify-center items-center bg-gray-50">
      <Card className="w-full mx-auto shadow-lg rounded-lg">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-gray-700" />
            Quản lý giao dịch
          </CardTitle>
          <CardDescription className="text-gray-600">
            Xem và quản lý tất cả các giao dịch thanh toán của hệ thống.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            {/* Search + Filter Type */}
            <div className="flex flex-col sm:flex-row items-center gap-8 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm ID, Email, Họ tên"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 w-full sm:w-64"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="h-5 w-5 text-gray-500" />
                <Select onValueChange={handleFilterTypeChange} value={filterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Lọc theo loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="Purchase">Mua vé</SelectItem>
                    <SelectItem value="TopUp">Nạp tiền</SelectItem>
                    <SelectItem value="Refund">Hoàn tiền</SelectItem>
                    <SelectItem value="Correction">Điều chỉnh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filter Date */}
            <div className="w-full sm:w-auto">
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
          </div>

          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Mã GD</TableHead>
                  <TableHead className="w-[110px]">Ngày</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Người dùng</TableHead>
                  <TableHead className="w-[120px]">Loại</TableHead>
                  <TableHead className="text-right">Số tiền</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.id} onClick={() => setSelectedTx(transaction)} className="cursor-pointer hover:bg-gray-100">
                      <TableCell className="font-medium text-[16px]">{transaction.id}</TableCell>
                      <TableCell className="text-sm text-gray-500 text-[16px]">
                        {format(new Date(transaction.createdAt), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="text-[16px]">{transaction.description}</TableCell>
                      <TableCell className="text-[16px]">
                        <div className="text-[16px] font-medium">
                          {transaction.lastName} {transaction.firstName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.email}
                        </div>
                      </TableCell>
                      <TableCell className={getTypeColor(transaction.type)}>{formatTransactionType(transaction.type)}</TableCell>
                      <TableCell className="text-right font-semibold text-[16px]">
                        {formatMoney(transaction.amount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getStatusBadge(transaction.status)}>
                          {formatTransactionStatus(transaction.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                      Không tìm thấy giao dịch nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Phân trang */}
          <div className="flex justify-center items-center mt-6">
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
          {/* Modal */}
          <ModalTransaction selectedTx={selectedTx} setSelectedTx={setSelectedTx} />
        </CardContent>
      </Card>
    </div>
  );
}

export default TransactionManagement;