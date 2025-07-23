import dayjs from "dayjs";
import PropTypes from "prop-types";
import { formatMoney } from "@/utils/formatCurrency";

const CustomTooltip = ({ active, payload, label, chartType }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;

        return (
            <div className="bg-white p-3 rounded shadow text-sm space-y-1">
                <p className="font-medium">{dayjs(label).format("DD/MM/YYYY")}</p>

                {chartType === "ticket" ? (
                    <>
                        <p>
                            <span className="text-[#4F46E5]">Vé bán được: </span>
                            <span className="font-semibold">{data.soldTickets || 0}</span>
                        </p>
                        <p>
                            <span className="text-[#DC2626]">Vé bị hoàn: </span>
                            <span className="font-semibold">{data.refundedTickets || 0}</span>
                        </p>
                    </>
                ) : (
                    <>
                        <p>
                            <span className="text-green-700">DT Mua vé: </span>
                            <span className="font-semibold">
                                {formatMoney(data.purchaseRevenue)}
                            </span>
                        </p>
                        <p>
                            <span className="text-green-700">Số GD Mua vé: </span>
                            <span className="font-semibold">{data.purchaseCount}</span>
                        </p>
                        <p>
                            <span className="text-red-700">DT Hoàn tiền: </span>
                            <span className="font-semibold">
                                {formatMoney(data.refundRevenue)}
                            </span>
                        </p>
                        <p>
                            <span className="text-red-700">Số GD Hoàn tiền: </span>
                            <span className="font-semibold">{data.refundCount}</span>
                        </p>
                    </>
                )}
            </div>
        );
    }

    return null;
};

CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
    label: PropTypes.string,
    chartType: PropTypes.string,
};

export default CustomTooltip;
