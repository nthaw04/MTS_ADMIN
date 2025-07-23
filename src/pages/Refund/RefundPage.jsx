/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Eye, Check, X, Clock, MoreHorizontal } from "lucide-react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import useRefundApplication from "@/hooks/refund/useRefundApplication";

function RefundPage() {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { applications, loading, updateStatusRefund } = useRefundApplication();

  const stats = [
    {
      title: "Tổng đơn hoàn vé",
      value: applications.length,
      icon: FileText,
      color: "blue",
    },
    {
      title: "Chờ duyệt",
      value: applications.filter((app) => app.status === "Pending").length,
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Đã duyệt",
      value: applications.filter((app) => app.status === "Approved").length,
      icon: Check,
      color: "green",
    },
    {
      title: "Từ chối",
      value: applications.filter((app) => app.status === "Rejected").length,
      icon: X,
      color: "red",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Pending":
        return "Chờ duyệt";
      case "Approved":
        return "Đã duyệt";
      case "Rejected":
        return "Từ chối";
      default:
        return status;
    }
  };

  const handleViewDetail = (application) => {
    setSelectedApplication(application);
    setAdminNotes(application.adminNotes || "");
    setIsDetailModalOpen(true);
  };

  const handleApprove = async (requestId) => {
    if (!adminNotes.trim()) {
      toast.warn("Vui lòng nhập lý do trước khi phê duyệt đơn.");
      return;
    }

    try {
      await updateStatusRefund({
        requestId,
        status: "Approved",
        adminNotes,
      });
      toast.success("Đã phê duyệt hoàn vé.");
      setIsDetailModalOpen(false);
    } catch (error) {
      toast.error("Lỗi khi phê duyệt.");
    }
  };

  const handleReject = async (requestId) => {
    if (!adminNotes.trim()) {
      toast.warn("Vui lòng nhập lý do trước khi từ chối đơn.");
      return;
    }

    try {
      await updateStatusRefund({ requestId, status: "Rejected", adminNotes });
      toast.success("Đã từ chối đơn hoàn vé.");
      setIsDetailModalOpen(false);
    } catch (error) {
      toast.error("Lỗi khi từ chối.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý hoàn vé</h1>
          <p className="text-gray-600 mt-1">
            Xét duyệt các đơn yêu cầu hoàn tiền vé
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <Icon
                    className={`w-8 h-8 ${
                      stat.color === "blue"
                        ? "text-blue-600"
                        : stat.color === "yellow"
                        ? "text-yellow-600"
                        : stat.color === "green"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hoàn vé</CardTitle>
          <CardDescription>
            Xem và xử lý các yêu cầu hoàn tiền vé
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người yêu cầu</TableHead>

                  <TableHead>Số tiền</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.passengerName}</TableCell>
                    <TableCell>{app.ticketAmount.toLocaleString()}đ</TableCell>
                    <TableCell>
                      {format(new Date(app.requestedAt), "dd/MM/yyyy - HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(app.status)}>
                        {getStatusText(app.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetail(app)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="overflow-y-auto max-h-[90vh] w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Chi tiết hoàn vé
            </DialogTitle>
            <DialogDescription>Xét duyệt đơn hoàn tiền</DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-600">Họ tên</Label>
                <p className="text-gray-900 font-medium">
                  {selectedApplication.passengerName}
                </p>
              </div>

              <div>
                <Label className="text-sm text-gray-600">Lý do hoàn vé</Label>
                <p className="text-gray-900">{selectedApplication.reason}</p>
              </div>

              <div>
                <Label className="text-sm text-gray-600">Số tiền</Label>
                <p className="text-gray-900">
                  {selectedApplication.ticketAmount.toLocaleString()}đ
                </p>
              </div>

              <div>
                <Label className="text-sm text-gray-600">
                  Thời gian yêu cầu
                </Label>
                <p className="text-gray-900">
                  {format(
                    new Date(selectedApplication.requestedAt),
                    "dd/MM/yyyy - HH:mm"
                  )}
                </p>
              </div>

              {selectedApplication.status === "Pending" && (
                <div className="space-y-3">
                  <Label>Ghi chú xử lý</Label>
                  <Textarea
                    placeholder="Điền lý do tại đây"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                  />
                  <div className="flex space-x-3">
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(selectedApplication.id)}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Phê duyệt
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(selectedApplication.id)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Từ chối
                    </Button>
                  </div>
                </div>
              )}

              {selectedApplication.adminNotes &&
                selectedApplication.status !== "Pending" && (
                  <div>
                    <Label className="text-sm">Ghi chú đã xử lý</Label>
                    <div className="p-3 bg-gray-50 rounded">
                      {selectedApplication.adminNotes}
                    </div>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RefundPage;
