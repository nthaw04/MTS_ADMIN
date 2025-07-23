import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dashboardService from "@/services/dashboardService";
import { generateTwoWeekSlots } from "@/helpers/dateHelper";
import dayjs from "dayjs";

const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    trainRoutes: [],
    transactions: [],
    users: [],
    tickets: [],
    ticketSummary: {
      totalTicket: 0,
      dailyTicketSummary: [],
    },
    transactionSummary: {
      totalRevenue: 0,
      totalPurchase: 0,
      totalRefund: 0,
      dailyPurchaseSummary: [],
      dailyRefundSummary: [],
      dailyTransactionSummary: [],
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slots, setSlots] = useState([]);
  const [years, setYears] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await dashboardService.getDashboardData();

      setDashboardData({
        trainRoutes: data.trainRoutes,
        transactions: data.transactions,
        users: data.users,
        tickets: data.tickets,
        ticketSummary: data.ticketSummary,
        transactionSummary: data.transactionSummary,
      });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Không thể tải dữ liệu dashboard");
      toast.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const { ticketSummary, transactionSummary } = dashboardData;

    const ticketCount = ticketSummary?.dailyTicketSummary || [];
    const transactionCount = transactionSummary?.dailyTransactionSummary || [];

    if (ticketCount.length || transactionCount.length) {
      const minTicketDate = ticketCount.length > 0 ? ticketCount[0].date : null;
      const minTransactionDate =
        transactionCount.length > 0 ? transactionCount[0].date : null;

      let minDate = null;
      if (minTicketDate && minTransactionDate) {
        minDate = dayjs(minTicketDate).isBefore(dayjs(minTransactionDate))
          ? minTicketDate
          : minTransactionDate;
      } else {
        minDate = minTicketDate || minTransactionDate;
      }

      if (!minDate) {
        setSlots([]);
        setYears([]);
        return;
      }

      const slotsGenerated = generateTwoWeekSlots(minDate, dayjs());

      const slotsWithData = slotsGenerated.filter((slot) => {
        const hasTicket = ticketCount.some((ticket) =>
          dayjs(ticket.date).isBetween(slot.start, slot.end, null, "[]")
        );

        const hasTransaction = transactionCount.some((txn) =>
          dayjs(txn.date).isBetween(slot.start, slot.end, null, "[]")
        );

        return hasTicket || hasTransaction;
      });

      setSlots(slotsWithData);

      const yearSet = Array.from(
        new Set(slotsWithData.map((slot) => slot.year))
      );
      setYears(yearSet);
    } else {
      // No data case
      setSlots([]);
      setYears([]);
    }
  }, [dashboardData]);

  return {
    ...dashboardData,
    loading,
    error,
    refetch: fetchDashboardData,
    slots,
    years,
  };
};

export default useDashboard;
