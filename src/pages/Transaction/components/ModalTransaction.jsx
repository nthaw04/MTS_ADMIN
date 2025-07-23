import PropTypes from "prop-types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/utils/formatCurrency";
import { formatTransactionType, formatTransactionStatus } from "@/utils/formatTransaction";
import { getTypeColor, getStatusBadge } from "@/utils/formatTransaction";
import { CheckCircle, XCircle } from "lucide-react";

const ModalTransaction = ({ selectedTx, setSelectedTx }) => {
    return (
        <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="border-b border-gray-300 pb-4">
                    <DialogTitle>Chi tiết giao dịch</DialogTitle>
                    <DialogDescription>
                        Thông tin chi tiết của giao dịch đã chọn.
                    </DialogDescription>
                </DialogHeader>

                {selectedTx && (
                    <div className="grid gap-3 text-sm">
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="font-medium text-[16px]">Mã giao dịch:</span>
                            <span className="text-[16px]">{selectedTx.id}</span>
                        </div>

                        <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="font-medium text-[16px]">Ngày tạo:</span>
                            <span className="text-[16px]">{format(new Date(selectedTx.createdAt), "dd/MM/yyyy HH:mm:ss")}</span>
                        </div>

                        <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="font-medium text-[16px]">Mô tả:</span>
                            <span className="text-[16px]">{selectedTx.description}</span>
                        </div>

                        <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="font-medium text-[16px]">Loại:</span>
                            <span className={cn("w-fit", getTypeColor(selectedTx.type))}>
                                {formatTransactionType(selectedTx.type)}
                            </span>
                        </div>

                        <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="font-medium text-[16px]">Số tiền:</span>
                            <span className="font-semibold text-[16px]">{formatMoney(selectedTx.amount)}</span>
                        </div>

                        <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="font-medium text-[16px]">Trạng thái:</span>
                            <Badge className={cn("w-fit", getStatusBadge(selectedTx.status))}>
                                {formatTransactionStatus(selectedTx.status)}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="font-medium text-[16px]">Họ và tên:</span>
                            <span className="text-[16px]">{`${selectedTx.lastName} ${selectedTx.firstName}`}</span>
                        </div>

                        <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="font-medium text-[16px]">Email:</span>
                            <span className="text-[16px]">{selectedTx.email}</span>
                        </div>

                        <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="font-medium text-[16px]">Ngày sinh:</span>
                            <span className="text-[16px]">
                                {selectedTx.dateOfBirth
                                    ? format(new Date(selectedTx.dateOfBirth), "dd/MM/yyyy")
                                    : "N/A"}
                            </span>
                        </div>

                        <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
                            <span className="font-medium text-[16px]">Sinh viên:</span>
                            <span>
                                {selectedTx.isStudent ? (
                                    <CheckCircle className="text-green-600 w-6 h-6" />
                                ) : (
                                    <XCircle className="text-red-600 w-6 h-6" />
                                )}
                            </span>
                        </div>

                        <div className="grid grid-cols-[120px_1fr] gap-2 items-center">
                            <span className="font-medium text-[16px]">Người có công:</span>
                            <span>
                                {selectedTx.isRevolutionaryContributor ? (
                                    <CheckCircle className="text-green-600 w-6 h-6" />
                                ) : (
                                    <XCircle className="text-red-600 w-6 h-6" />
                                )}
                            </span>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

ModalTransaction.propTypes = {
    selectedTx: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        createdAt: PropTypes.string,
        description: PropTypes.string,
        type: PropTypes.string,
        amount: PropTypes.number,
        status: PropTypes.string,
        userName: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        email: PropTypes.string,
        dateOfBirth: PropTypes.string,
        isStudent: PropTypes.bool,
        isRevolutionaryContributor: PropTypes.bool,
    }),
    setSelectedTx: PropTypes.func.isRequired,
};

export default ModalTransaction;
