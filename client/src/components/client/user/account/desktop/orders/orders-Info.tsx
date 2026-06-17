import React, { useEffect, useState } from "react";
import { useOrderInfo } from "./useOrderInfo";

interface OrderInfoProps {
  orderCode: string;
}

const statusMapping: Record<string, string> = {
  ready_to_pick: "English content normalized from the original source text.",
  picking: "English content normalized from the original source text.",
  cancel: "English content normalized from the original source text.",
  money_collect_picking: "English content normalized from the original source text.",
  picked: "English content normalized from the original source text.",
  storing: "English content normalized from the original source text.",
  transporting: "English content normalized from the original source text.",
  sorting: "English content normalized from the original source text.",
  delivering: "English content normalized from the original source text.",
  money_collect_delivering: "English content normalized from the original source text.",
  delivered: "English content normalized from the original source text.",
  delivery_fail: "English content normalized from the original source text.",
  waiting_to_return: "English content normalized from the original source text.",
  return: "English content normalized from the original source text.",
  return_transporting: "English content normalized from the original source text.",
  return_sorting: "English content normalized from the original source text.",
  returning: "English content normalized from the original source text.",
  return_fail: "English content normalized from the original source text.",
  returned: "English content normalized from the original source text.",
  exception: "English content normalized from the original source text.",
  damage: "English content normalized from the original source text.",
  lost: "English content normalized from the original source text.",
};

const OrderInfo: React.FC<OrderInfoProps> = ({ orderCode }) => {
  const { orderInfo, fetchOrderInfo, loading } = useOrderInfo();
  const [visibleCount, setVisibleCount] = useState(5);
  useEffect(() => {
    if (orderCode) {
      fetchOrderInfo(orderCode);
    }
  }, [orderCode, fetchOrderInfo]);

  if (loading) {
    return (
      <p className="text-center text-gray-500">English content normalized from the original source text.</p>
    );
  }

  if (!orderInfo) {
    return (
      <p className="text-center text-gray-500">English content normalized from the original source text.</p>
    );
  }

  const currentStatus = orderInfo.log?.length
  ? orderInfo.log[orderInfo.log.length - 1]?.status
  : undefined;

  // English content normalized from the original source text.
  const logs = orderInfo.log ? [...orderInfo.log].reverse() : [];
  const visibleLogs = logs.slice(0, visibleCount);

  return (
    <div className="bg-white p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">English content normalized from the original source text.</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* English content normalized from the original source text. */}
        <div className="flex-1 bg-white p-4 space-y-4">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-700 border-b pb-2">English content normalized from the original source text.</h3>

          <p className="flex items-center justify-between gap-2">
            <span className="text-gray-600 font-medium flex-shrink-0">English content normalized from the original source text.</span>
            <span
              className={`font-bold flex-1 text-right ${
                currentStatus === "delivered"
                  ? "text-green-600"
                  : "text-blue-500"
              }`}
            >
              {statusMapping[orderInfo.status] ?? orderInfo.status}
            </span>
          </p>

          <p className="flex items-center justify-between gap-2">
            <span className="text-gray-600 font-medium flex-shrink-0">English content normalized from the original source text.</span>
            <span className="flex-1 text-right text-gray-800 break-words">
              {orderInfo.to_name}
            </span>
          </p>

          <p className="flex items-center justify-between gap-2">
            <span className="text-gray-600 font-medium flex-shrink-0">English content normalized from the original source text.</span>
            <span className="flex-1 text-right text-gray-800 break-words">
              {orderInfo.to_address}
            </span>
          </p>

          <p className="flex items-center justify-between gap-2">
            <span className="text-gray-600 font-medium flex-shrink-0">English content normalized from the original source text.</span>
            <span className="flex-1 text-right text-gray-800">
              {orderInfo.to_phone}
            </span>
          </p>
        </div>

        {/* English content normalized from the original source text. */}
        <div className="flex-1 bg-white p-4">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-700 mb-4">English content normalized from the original source text.</h3>
          <div className="relative border-l-2 border-dashed border-gray-200 ml-4">
            {visibleLogs.length > 0 ? (
              visibleLogs.map((item, index) => {
                const isLatest = index === 0;
                const date = new Date(item.updated_date);
                const formattedDate = date.toLocaleDateString("vi-VN");
                const formattedTime = date.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={index}
                    className="mb-6 ml-4 flex items-start relative"
                  >
                    <span
                      className={`absolute -left-4 top-2 w-3 h-3 rounded-full transform -translate-x-1/2 ${
                        isLatest
                          ? "bg-green-500 ring-4 ring-green-200"
                          : "bg-gray-400"
                      }`}
                    ></span>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-sm text-gray-500">
                        {formattedTime}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formattedDate}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          isLatest ? "text-green-600" : "text-gray-700"
                        }`}
                      >
                        {statusMapping[item.status] || item.status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="ml-4 text-gray-500">English content normalized from the original source text.</p>
            )}
          </div>

          {/* English content normalized from the original source text. */}
          {logs.length > 5 && (
            <div className="mt-2 text-center">
              {visibleCount < logs.length ? (
                <button
                  onClick={() => setVisibleCount((prev) => prev + 5)}
                  className="text-blue-500 hover:underline"
                >English content normalized from the original source text.</button>
              ) : (
                <button
                  onClick={() => setVisibleCount(5)}
                  className="text-blue-500 hover:underline"
                >English content normalized from the original source text.</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
