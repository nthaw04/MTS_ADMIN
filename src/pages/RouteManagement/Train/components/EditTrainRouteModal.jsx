/* eslint-disable react/prop-types */
import { Modal, Form, Input } from "antd";
import { useEffect } from "react";

const EditTrainRouteModal = ({
  visible,
  onCancel,
  onSubmit,
  terminals,
  routeData,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (routeData) {
      form.setFieldsValue({
        price: routeData.price,
      });
    }
  }, [routeData, form]);

  const startTerminal = terminals.find(
    (t) => t.id === routeData?.startTerminal
  );
  const endTerminal = terminals.find((t) => t.id === routeData?.endTerminal);

  return (
    <Modal
      title="Chỉnh sửa tuyến tàu"
      open={visible}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          onSubmit({
            id: routeData.trainRouteId,
            price: values.price,
            startTerminal: routeData.startTerminal,
            endTerminal: routeData.endTerminal,
          });
        });
      }}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Ga bắt đầu">
          <Input value={routeData?.startTerminalName || ""} readOnly />
        </Form.Item>

        <Form.Item label="Ga kết thúc">
          <Input value={routeData?.endTerminalName || ""} readOnly />
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá vé (nghìn VND)"
          rules={[{ required: true }]}
        >
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTrainRouteModal;
