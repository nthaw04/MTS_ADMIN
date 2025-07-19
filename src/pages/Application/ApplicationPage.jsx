import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  MoreHorizontal,
  Image as ImageIcon,
  Download,
} from "lucide-react";
import usePriorityApplications from "@/hooks/priority/usePriorityApplications";
import { toast } from "react-toastify";
import ModalImageViewer from "./components/ModalImageViewer";
import { format } from "date-fns";

function ApplicationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const {
    applications,
    loading,
    refetch,
    updateStatus,
    selectedApplication,
    detailLoading,
    fetchDetail,
  } = usePriorityApplications();

  //   const filteredApplications = applications.filter(
  //     (app) =>
  //       app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       app.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       app.email.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

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

  const getTypeColor = (type) => {
    return type === "Student"
      ? "bg-blue-100 text-blue-800"
      : "bg-purple-100 text-purple-800";
  };

  const getTypeText = (type) => {
    return type === "Student" ? "Sinh viên" : "Ưu tiên";
  };

  const handleViewDetail = (id) => {
    fetchDetail(id);
    setIsDetailModalOpen(true);
  };

  const handleApprove = async (applicationId) => {
    try {
      await updateStatus({
        applicationId,
        applicationStatus: "Approved",
        note: "",
      });
      toast.success("Đơn đã được phê duyệt");
      setIsDetailModalOpen(false);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleReject = async (applicationId) => {
    if (!reviewNote.trim()) {
      toast.warn("Vui lòng nhập lý do trước khi từ chối đơn.");
      return;
    }

    try {
      await updateStatus({
        applicationId,
        applicationStatus: "Rejected",
        note: reviewNote,
      });
      toast.success("Đơn đã được từ chối thành công");
      setIsDetailModalOpen(false);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const openModal = (url) => {
    setSelectedImageUrl(url);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImageUrl(null);
  };

  const stats = [
    {
      title: "Tổng đơn xét duyệt",
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý đơn xét duyệt
          </h1>
          <p className="text-gray-600 mt-1">
            Xét duyệt đơn ưu tiên cho sinh viên và đối tượng ưu tiên
          </p>
        </div>
        {/* <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Xuất báo cáo
        </Button> */}
      </div>

      {/* Stats Cards */}
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

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách đơn xét duyệt</CardTitle>
              <CardDescription>
                Quản lý và xét duyệt các đơn ưu tiên từ sinh viên và đối tượng
                ưu tiên
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm đơn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Lọc
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người nộp đơn</TableHead>
                  <TableHead>Loại đơn</TableHead>
                  <TableHead>Ngày nộp</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                            {application.passengerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">
                            {application.passengerName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(application.type)}>
                        {getTypeText(application.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {format(
                        new Date(application.createdTime),
                        "dd/MM/yyyy - HH:mm"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(application.status)}>
                        {getStatusText(application.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          side="left"
                          align="start"
                          sideOffset={4}
                        >
                          <DropdownMenuItem
                            onClick={() => handleViewDetail(application.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
        <DialogContent
          className="overflow-y-auto"
          style={{
            width: "60vw",
            maxWidth: "none",
            maxHeight: "90vh",
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Chi tiết đơn xét duyệt
            </DialogTitle>
            <DialogDescription>
              Xem thông tin chi tiết và hình ảnh đính kèm của đơn xét duyệt
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Application Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Họ và tên
                    </Label>
                    <p className="text-gray-900 font-medium">
                      {selectedApplication.passengerName}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Email
                    </Label>
                    <p className="text-gray-900">
                      {selectedApplication.user.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Ngày sinh
                    </Label>
                    <p className="text-gray-900">
                      {selectedApplication.user.dateOfBirth}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Ngày nộp
                    </Label>
                    <p className="text-gray-900">
                      {format(
                        new Date(selectedApplication.createdTime),
                        "dd/MM/yyyy - HH:mm"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Hình ảnh đính kèm
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Front ID Card */}
                  {selectedApplication.frontIdCardImageUrl && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Mặt trước CCCD/CMND
                      </Label>
                      <div className="relative border rounded-lg overflow-hidden">
                        <img
                          src={selectedApplication.frontIdCardImageUrl}
                          alt="Mặt trước CCCD"
                          className="w-full h-60 object-cover"
                        />
                        <button
                          onClick={() =>
                            openModal(selectedApplication.frontIdCardImageUrl)
                          }
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 shadow"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Back ID Card */}
                  {selectedApplication.backIdCardImageUrl && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Mặt sau CCCD/CMND
                      </Label>
                      <div className="relative border rounded-lg overflow-hidden">
                        <img
                          src={selectedApplication.backIdCardImageUrl}
                          alt="Mặt sau CCCD"
                          className="w-full h-60 object-cover"
                        />
                        <button
                          onClick={() =>
                            openModal(selectedApplication.backIdCardImageUrl)
                          }
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 shadow"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Student Card */}
                  {selectedApplication.studentCardImageUrl && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Thẻ sinh viên
                      </Label>
                      <div className="relative border rounded-lg overflow-hidden">
                        <img
                          src={selectedApplication.studentCardImageUrl}
                          alt="Thẻ sinh viên"
                          className="w-full h-60 object-cover"
                        />
                        <button
                          onClick={() =>
                            openModal(selectedApplication.studentCardImageUrl)
                          }
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 shadow"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Revolutionary Contributor */}
                  {selectedApplication.revolutionaryContributorImageUrl && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Giấy tờ ưu tiên
                      </Label>
                      <div className="relative border rounded-lg overflow-hidden">
                        <img
                          src={
                            selectedApplication.revolutionaryContributorImageUrl
                          }
                          alt="Giấy tờ ưu tiên"
                          className="w-full h-60 object-cover"
                        />
                        <button
                          onClick={() =>
                            openModal(
                              selectedApplication.revolutionaryContributorImageUrl
                            )
                          }
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 shadow"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Section */}
              {selectedApplication.status === "Pending" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Xét duyệt đơn</h3>
                  <div className="space-y-2">
                    <Label htmlFor="reviewNote">Ghi chú xét duyệt</Label>
                    <Textarea
                      id="reviewNote"
                      placeholder="Nhập ghi chú cho quyết định xét duyệt..."
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleApprove(selectedApplication.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Phê duyệt
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedApplication.id)}
                      variant="destructive"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Từ chối
                    </Button>
                  </div>
                </div>
              )}

              {/* Existing Review Note */}
              {selectedApplication.reviewNote && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">
                    Ghi chú xét duyệt
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">
                      {selectedApplication.reviewNote}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <ModalImageViewer
            isOpen={isModalOpen}
            onClose={closeModal}
            imageUrl={selectedImageUrl}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ApplicationPage;
