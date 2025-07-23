import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useDashboard from "@/hooks/dashboard/useDashboard";
import {
  Activity,
  TrendingUp,
  Ticket,
  Users,
  Route,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "@/pages/Dashboard/components/CustomToolTip";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { formatMoney } from "@/utils/formatCurrency";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import ErrorScreen from "@/components/Error/ErrorScreen";

function Dashboard() {
  dayjs.extend(isBetween);
  const {
    trainRoutes,
    users,
    ticketSummary,
    transactionSummary,
    loading,
    error,
    refetch,
    slots,
    years,
  } = useDashboard();

  const [activeChart, setActiveChart] = useState("ticket");

  const stats = [
    {
      title: "Tổng người dùng",
      value: users?.length || 0,
      icon: Users,
      color: "blue",
    },
    {
      title: "Vé đã bán",
      value: ticketSummary.totalTickets || 0,
      icon: Ticket,
      color: "green",
    },
    {
      title: "Tuyến đường hoạt động",
      value: trainRoutes?.length || 0,
      icon: Route,
      color: "purple",
    },
    {
      title: "Tổng doanh thu",
      value: formatMoney(transactionSummary?.totalRevenue || 0),
      icon: TrendingUp,
      color: "orange",
    },
  ];

  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedSlot, setSelectedSlot] = useState(null);

  const parsedSlot = selectedSlot ? JSON.parse(selectedSlot) : null;
  const slotStart = parsedSlot?.start;
  const slotEnd = parsedSlot?.end;

  const filteredTicketData = selectedSlot
    ? ticketSummary.dailyTicketSummary.filter((item) =>
      dayjs(item.date).isBetween(slotStart, slotEnd, null, "[]")
    )
    : ticketSummary.dailyTicketSummary;

  const filteredTransactionData = selectedSlot
    ? transactionSummary.dailyTransactionSummary.filter((item) =>
      dayjs(item.date).isBetween(slotStart, slotEnd, null, "[]")
    )
    : transactionSummary.dailyTransactionSummary;

  useEffect(() => {
    if (slots.length > 0 && !selectedSlot) {
      const newestSlot = slots[0];
      setSelectedSlot(
        JSON.stringify({
          start: newestSlot.start,
          end: newestSlot.end,
          label: newestSlot.label,
        })
      );
      setSelectedYear(newestSlot.year);
    }
  }, [slots, selectedSlot]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onRetry={refetch} />;

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
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color === "blue"
                        ? "bg-blue-100"
                        : stat.color === "green"
                          ? "bg-green-100"
                          : stat.color === "purple"
                            ? "bg-purple-100"
                            : "bg-orange-100"
                      }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${stat.color === "blue"
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

      {/* Chart Section */}
      <Card className="mt-10">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              {activeChart === "ticket"
                ? "Thống kê vé theo ngày"
                : "Doanh thu và giao dịch theo ngày"}
            </CardTitle>
            <CardDescription>
              {activeChart === "ticket"
                ? "Số lượng vé bán mỗi ngày"
                : "Tổng doanh thu và số giao dịch mỗi ngày"}
            </CardDescription>
            <div className="flex items-center space-x-3 mt-2">
              <span className="text-sm text-gray-700">Năm:</span>
              <Select value={selectedYear} onValueChange={(value) => setSelectedYear(value)}>
                <SelectTrigger className="w-[100px]">
                  <span>{selectedYear}</span>
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className="text-sm text-gray-700">Tuần:</span>
              <Select value={selectedSlot} onValueChange={(value) => setSelectedSlot(value)}>
                <SelectTrigger className="w-[150px]">
                  <span>{parsedSlot?.label || "Chọn tuần"}</span>
                </SelectTrigger>
                <SelectContent>
                  {slots
                    .filter((slot) => slot.year == selectedYear)
                    .map((slot, index) => (
                      <SelectItem
                        key={index}
                        value={JSON.stringify({
                          start: slot.start,
                          end: slot.end,
                          label: slot.label,
                        })}
                      >
                        {slot.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 lg:mt-0">
            <Button
              variant={activeChart === "ticket" ? "default" : "outline"}
              onClick={() => setActiveChart("ticket")}
              className="mr-2"
            >
              Vé
            </Button>
            <Button
              variant={activeChart === "transaction" ? "default" : "outline"}
              onClick={() => setActiveChart("transaction")}
            >
              Giao dịch
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {(activeChart === "ticket" && filteredTicketData.length === 0) ||
            (activeChart === "transaction" && filteredTransactionData.length === 0) ? (
            <div className="flex items-center justify-center h-[400px] text-gray-500 text-lg">
              Không có dữ liệu để hiển thị
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={
                  activeChart === "ticket"
                    ? filteredTicketData
                    : filteredTransactionData
                }
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => dayjs(date).format("DD/MM/YYYY")}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip chartType={activeChart} />} />
                {activeChart === "ticket" ? (
                  <>
                    <Line
                      type="monotone"
                      dataKey="soldTickets"
                      stroke="#4F46E5"
                      name="Vé bán được"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="refundedTickets"
                      stroke="#DC2626"
                      name="Vé bị hoàn"
                      activeDot={{ r: 8 }}
                    />
                  </>
                ) : (
                  <>
                    <Line
                      type="monotone"
                      dataKey="purchaseRevenue"
                      stroke="#16A34A"
                      name="DT Mua vé"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="refundRevenue"
                      stroke="#DC2626"
                      name="DT Hoàn tiền"
                      activeDot={{ r: 8 }}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
