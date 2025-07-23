import dashboardRepository from "@/repositories/dashboardRepository";
import { processTickets, processTransactions } from "@/helpers/dashboardHelper";

const dashboardService = {
  /**
   * Gọi tất cả API và trả về dữ liệu tổng hợp
   */
  getDashboardData: async () => {
    const [trainRoutesRes, transactionsRes, usersRes, ticketsRes] =
      await Promise.all([
        dashboardRepository.getAllTrainRoutes(),
        dashboardRepository.getAllTransactions(),
        dashboardRepository.getAllUsers(),
        dashboardRepository.getAllTickets(),
      ]);

    const tickets = ticketsRes.data || [];
    const transactionsRaw = transactionsRes.data || [];
    const transactions = transactionsRaw.filter(
      (txn) => txn.status === "Succeed"
    );

    const ticketSummary = processTickets(tickets);
    const transactionSummary = processTransactions(transactions);

    return {
      trainRoutes: trainRoutesRes.data || [],
      transactions: transactions || [],
      users: usersRes.data || [],
      tickets: ticketsRes.data || [],
      ticketSummary,
      transactionSummary,
    };
  },
};

export default dashboardService;
