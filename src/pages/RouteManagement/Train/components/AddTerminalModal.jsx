/* eslint-disable react/prop-types */
// src/components/train/AddTerminalModal.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "react-toastify";

function AddTerminalModal({ open, onClose, onSubmit, nextTerminalId }) {
  const [location, setLocation] = useState("");

  const handleCreate = () => {
    if (!location.trim()) {
      toast.warn("Vui lòng nhập địa chỉ ga!");
      return;
    }

    const newTerminal = {
      name: `Ga ${nextTerminalId}`,
      location: location.trim(),
    };

    onSubmit(newTerminal);
    setLocation("");
  };

  const handleClose = () => {
    setLocation("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm ga mới</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 font-medium">Tên ga</label>
            <Input disabled value={`Ga ${nextTerminalId}`} />
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">
              Địa điểm
            </label>
            <Input
              placeholder="Nhập địa điểm ga"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button onClick={handleCreate}>Tạo</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddTerminalModal;
