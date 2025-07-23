import { useEffect, useState } from "react";
import { transactionApi } from "@/apis/transaction/transactionApi";
import { toast } from "react-toastify";

const useTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await transactionApi.getAllTransactions();
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetch transactions:", err);
      setError("Không thể tải dữ liệu transactions");
      toast.error("Không thể tải dữ liệu transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
  };
};

export default useTransaction;
