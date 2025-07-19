/* eslint-disable react/prop-types */
import { userApi } from "@/apis/user/userApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const AddStaffModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await userApi.createStafAccount(form);
      onSuccess();
      onClose();
    } catch (err) {
      const message =
        err?.response?.data?.message || "Có lỗi xảy ra khi tạo tài khoản";
      setError(message);
      console.error("Fail to create staff account:", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm nhân viên mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Tên người dùng"
            name="userName"
            required
            value={form.userName}
            onChange={handleChange}
          />
          <Input
            placeholder="Họ"
            name="lastName"
            required
            value={form.lastName}
            onChange={handleChange}
          />
          <Input
            placeholder="Tên"
            name="firstName"
            required
            value={form.firstName}
            onChange={handleChange}
          />
          <Input
            placeholder="Email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
          />
          <Input
            placeholder="Mật khẩu"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffModal;
