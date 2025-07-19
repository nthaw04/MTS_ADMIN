import { trainApi } from "@/apis/train/trainApi";
import { useEffect, useState } from "react";

const useTerminals = () => {
  const [terminals, setTerminals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTerminals = async () => {
    try {
      const res = await trainApi.getAllTerminal();
      setTerminals(res.data);
    } catch (err) {
      console.error("Error loading terminals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerminals();
  }, []);

  return { terminals, loading, refetch: fetchTerminals };
};
export default useTerminals;
