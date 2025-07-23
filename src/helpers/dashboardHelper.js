import dayjs from "dayjs";

/**
 * Group data theo ngày (YYYY-MM-DD)
 */
export const groupByDate = (data, dateKey) => {
  return data.reduce((acc, item) => {
    const date = dayjs(item[dateKey]).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
};

/**
 * Xử lý Ticket: tổng vé bán được và vé bị refund mỗi ngày
 */
export const processTickets = (tickets) => {
  // Lọc vé bị refund
  const refundedTickets = tickets.filter(
    (ticket) => ticket.status === "Refunded"
  );
  const soldTickets = tickets.filter((ticket) => ticket.status !== "Refunded");

  // Tổng số vé refund
  const totalRefundedTickets = refundedTickets.reduce(
    (sum, ticket) => sum + (ticket.numberOfTicket || 0),
    0
  );

  // Tổng vé bán được = tổng tất cả - tổng refund
  const totalTickets = tickets.reduce(
    (sum, ticket) => sum + (ticket.numberOfTicket || 0),
    0
  );
  const totalSoldTickets = totalTickets - totalRefundedTickets;

  // Group sold tickets by date
  const groupedSoldTickets = groupByDate(soldTickets, "purchaseTime");
  const dailySoldTicketCount = Object.entries(groupedSoldTickets).map(
    ([date, items]) => ({
      date,
      soldTickets: items.reduce(
        (sum, ticket) => sum + (ticket.numberOfTicket || 0),
        0
      ),
    })
  );

  // Group refunded tickets by date
  const groupedRefundedTickets = groupByDate(refundedTickets, "purchaseTime");
  const dailyRefundedTicketCount = Object.entries(groupedRefundedTickets).map(
    ([date, items]) => ({
      date,
      refundedTickets: items.reduce(
        (sum, ticket) => sum + (ticket.numberOfTicket || 0),
        0
      ),
    })
  );

  // Merge 2 mảng theo date để vẽ chart chung
  const allDates = Array.from(
    new Set([
      ...dailySoldTicketCount.map((item) => item.date),
      ...dailyRefundedTicketCount.map((item) => item.date),
    ])
  ).sort((a, b) => new Date(a) - new Date(b));

  const dailyMerged = allDates.map((date) => {
    const sold = dailySoldTicketCount.find((item) => item.date === date);
    const refunded = dailyRefundedTicketCount.find(
      (item) => item.date === date
    );
    return {
      date,
      soldTickets: sold ? sold.soldTickets : 0,
      refundedTickets: refunded ? refunded.refundedTickets : 0,
    };
  });

  return {
    totalTickets,
    totalRefundedTickets,
    totalSoldTickets,
    dailyTicketSummary: dailyMerged,
  };
};

/**
 * Xử lý Transaction: tổng doanh thu + doanh thu và số lượng giao dịch mỗi ngày
 * Purchase cộng vào tổng, Refund trừ đi, và tách 2 mảng riêng cho chart
 */
export const processTransactions = (transactions) => {
  // Tách thành 2 mảng
  const purchaseTransactions = transactions.filter(
    (txn) => txn.type === "Purchase"
  );
  const refundTransactions = transactions.filter(
    (txn) => txn.type === "Refund"
  );

  // Tính tổng
  const totalPurchase = purchaseTransactions.reduce(
    (sum, txn) => sum + (txn.amount || 0),
    0
  );
  const totalRefund = refundTransactions.reduce(
    (sum, txn) => sum + (txn.amount || 0),
    0
  );

  const totalRevenue = totalPurchase - totalRefund;

  // Group Purchase
  const groupedPurchase = groupByDate(purchaseTransactions, "createdAt");
  const dailyPurchaseSummary = Object.entries(groupedPurchase).map(
    ([date, items]) => ({
      date,
      purchaseRevenue: items.reduce((sum, txn) => sum + (txn.amount || 0), 0),
      purchaseCount: items.length,
    })
  );

  // Group Refund
  const groupedRefund = groupByDate(refundTransactions, "createdAt");
  const dailyRefundSummary = Object.entries(groupedRefund).map(
    ([date, items]) => ({
      date,
      refundRevenue: items.reduce((sum, txn) => sum + (txn.amount || 0), 0),
      refundCount: items.length,
    })
  );

  // Merge Purchase & Refund theo date
  const purchaseMap = new Map(
    dailyPurchaseSummary.map((item) => [item.date, item])
  );
  const refundMap = new Map(
    dailyRefundSummary.map((item) => [item.date, item])
  );

  const allDates = Array.from(
    new Set([
      ...dailyPurchaseSummary.map((item) => item.date),
      ...dailyRefundSummary.map((item) => item.date),
    ])
  ).sort((a, b) => new Date(a) - new Date(b));

  const dailyTransactionSummary = allDates.map((date) => ({
    date,
    purchaseRevenue: purchaseMap.get(date)?.purchaseRevenue || 0,
    purchaseCount: purchaseMap.get(date)?.purchaseCount || 0,
    refundRevenue: refundMap.get(date)?.refundRevenue || 0,
    refundCount: refundMap.get(date)?.refundCount || 0,
  }));

  return {
    totalRevenue,
    totalPurchase,
    totalRefund,
    dailyPurchaseSummary,
    dailyRefundSummary,
    dailyTransactionSummary, 
  };
};
