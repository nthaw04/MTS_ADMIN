import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useUsers from "@/hooks/user/useUsers";
import {
  Filter,
  MoreVertical,
  Plus,
  Search,
  Shield,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";
import AddStaffModal from "./components/AddStaffModal";
import { toast } from "react-toastify";
import { userApi } from "@/apis/user/userApi";

function User() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const { users: fetchedUsers, loading, refetch } = useUsers();

  useEffect(() => {
    if (!loading) {
      setUsers(fetchedUsers);
    }
  }, [fetchedUsers, loading]);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || ""} ${
      user.lastName || ""
    }`.toLowerCase();
    const email = user.email?.toLowerCase() || "";
    const keyword = searchTerm.toLowerCase();

    const matchesSearch = fullName.includes(keyword) || email.includes(keyword);
    const matchesRole =
      filterRole === "all" || user.roleId === parseInt(filterRole);

    return matchesSearch && matchesRole;
  });

  const getRoleInfo = (roleId) => {
    switch (roleId) {
      case 1:
        return { label: "Admin", className: "bg-red-100 text-red-800" };
      case 2:
        return { label: "Staff", className: "bg-blue-100 text-blue-800" };
      case 3:
        return {
          label: "Passenger",
          className: "bg-yellow-100 text-yellow-800",
        };
      default:
        return { label: "Unknown", className: "bg-gray-100 text-gray-800" };
    }
  };

  const getStatusColor = (isActive) => {
    return isActive === true
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const handleChangeStatus = async (userId, currentStatus) => {
    try {
      const response = await userApi.setUserActiveStatus(
        userId,
        !currentStatus
      );
      if (response?.status === 204) {
        toast.success(`${!currentStatus ? "Mở khóa" : "Ban"} thành công`);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, isActive: !currentStatus } : user
          )
        );
      } else {
        toast.warning("Thao tác có vẻ không thành công");
      }
    } catch (err) {
      console.log(err);
      toast.error("Thao tác thất bại");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý người dùng
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý tài khoản và phân quyền người dùng
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhân viên
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Tổng người dùng</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter((u) => u.isActive === true).length}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Không hoạt động</p>
              <p className="text-2xl font-bold text-gray-600">
                {users.filter((u) => u.isActive === false).length}
              </p>
            </div>
            <UserX className="w-8 h-8 text-gray-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Quản trị viên</p>
              <p className="text-2xl font-bold text-red-600">
                {users.filter((u) => u.roleId === 1).length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-red-600" />
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách người dùng</CardTitle>
              <CardDescription>
                Quản lý thông tin và quyền hạn của người dùng
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <DropdownMenu open={showFilter} onOpenChange={setShowFilter}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Lọc
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" sideOffset={8}>
                  <DropdownMenuLabel>Lọc theo vai trò</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterRole("all")}>
                    Tất cả vai trò
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("1")}>
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("2")}>
                    Staff
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterRole("3")}>
                    Passenger
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>

                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.roleId);

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {(user.firstName?.[0] || "") +
                                (user.lastName?.[0] || "")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {(user.lastName || "") +
                                " " +
                                (user.firstName || "")}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={roleInfo.className}>
                          {roleInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.isActive)}>
                          {user.isActive === true
                            ? "Hoạt động"
                            : "Không hoạt động"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            side="left"
                            align="start"
                            sideOffset={4}
                          >
                            {user.isActive ? (
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleChangeStatus(user.id, user.isActive)
                                }
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Ban người dùng
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-green-600"
                                onClick={() =>
                                  handleChangeStatus(user.id, user.isActive)
                                }
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Mở khóa người dùng
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <AddStaffModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={() => {
          setAddOpen(false);
          refetch();
        }}
      />
    </div>
  );
}

export default User;
