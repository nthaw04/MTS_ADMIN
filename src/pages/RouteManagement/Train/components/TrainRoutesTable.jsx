/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { Table, Spin, message, Popconfirm, Space } from "antd";
import { trainApi } from "@/apis/train/trainApi";
import useTerminals from "@/hooks/train/useTrains";
import { Button } from "@/components/ui/button";
import EditTrainRouteModal from "./EditTrainRouteModal";

const TrainRoutesTable = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { terminals, updateTrainRoute } = useTerminals();
  const [editingRoute, setEditingRoute] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

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

  const handleEdit = (route) => {
    setEditingRoute(route);
    setEditModalVisible(true);
  };

  const handleUpdate = async (data) => {
    try {
      await updateTrainRoute({
        ...data,
        price: parseInt(data.price),
      });
      message.success("Cập nhật tuyến thành công!");
      setEditModalVisible(false);
      fetchTrainRoutes();
    } catch (err) {
      console.error("Update error:", err);
      message.error("Cập nhật thất bại!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await trainApi.deleteTrainRoute(id);
      console.log("Xoá thành công");
      await fetchTrainRoutes();
    } catch (error) {
      console.error("Xoá thất bại:", error);
    }
  };
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
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Chỉnh sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc chắn muốn xoá tuyến tàu này không?"
            onConfirm={() => handleDelete(record.trainRouteId)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 10 }}>
      {loading || terminalLoading ? (
        <Spin />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={routes}
            rowKey="trainRouteId"
            bordered
            pagination={{ pageSize: 10 }}
          />
          <EditTrainRouteModal
            visible={editModalVisible}
            onCancel={() => setEditModalVisible(false)}
            onSubmit={handleUpdate}
            terminals={terminals}
            routeData={editingRoute}
          />
        </>
      )}
    </div>
  );
};

export default TrainRoutesTable;
