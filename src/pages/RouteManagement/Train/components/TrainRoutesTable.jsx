import { useEffect, useState } from "react";
import { Table, Spin, message } from "antd";
import { trainApi } from "@/apis/train/trainApi";
import useTerminals from "@/hooks/train/useTrains";

const TrainRoutesTable = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const { loading: terminalLoading } = useTerminals();

  const fetchTrainRoutes = async () => {
    setLoading(true);
    try {
      const res = await trainApi.getAllTrainRoute();
      console.log("Train routes data:", res.data);
      setRoutes(res.data);
    } catch (err) {
      message.error("Không thể lấy dữ liệu tuyến tàu!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainRoutes();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "trainRouteId",
      key: "trainRouteId",
    },
    {
      title: "Ga xuất phát",
      dataIndex: "startTerminalName",
      key: "startTerminalName",
    },
    {
      title: "Ga đến",
      dataIndex: "endTerminalName",
      key: "endTerminalName",
    },
    {
      title: "Giá vé (VND)",
      dataIndex: "price",
      key: "price",
      render: (price) => price.toLocaleString("vi-VN"),
    },
  ];

  return (
    <div style={{ padding: 10 }}>
      {loading || terminalLoading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={routes}
          rowKey="trainRouteId"
          bordered
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default TrainRoutesTable;
