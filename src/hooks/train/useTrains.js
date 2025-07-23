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

  const createTerminal = async ({ userId, name, location }) => {
    try {
      const res = await trainApi.createTerminal({ userId, name, location });
      setTerminals((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      console.error("Error loading terminals:", err);
    } finally {
      setLoading(false);
    }
  };

  const createTrainRoute = async ({
    userId,
    price,
    startTerminal,
    endTerminal,
  }) => {
    try {
      await trainApi.createTrainRoute({
        userId,
        price,
        startTerminal,
        endTerminal,
      });
      await fetchTerminals();
    } catch (err) {
      console.error("Error loading terminals:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateTrainRoute = async ({
    id,
    price,
    startTerminal,
    endTerminal,
  }) => {
    try {
      await trainApi.updateTrainRoute({
        id,
        price,
        startTerminal,
        endTerminal,
      });
      console.log("Sending update data:", {
        id,
        price,
        startTerminal,
        endTerminal,
      });

      await fetchTerminals();
    } catch (err) {
      console.error("Error loading terminals:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRoutePriceBetween = async (startTerminal, endTerminal) => {
    try {
      const res = await trainApi.getRouteBetween({
        startTerminal,
        endTerminal,
      });
      return res.data;
    } catch (err) {
      console.error("Error fetching route price:", err);
      return null;
    }
  };

  useEffect(() => {
    fetchTerminals();
  }, []);

  return {
    terminals,
    loading,
    createTrainRoute,
    createTerminal,
    updateTrainRoute,
    getRoutePriceBetween,
    refetch: fetchTerminals,
  };
};

export default useTerminals;
