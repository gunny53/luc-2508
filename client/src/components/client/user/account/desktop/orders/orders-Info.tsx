import React, { useEffect, useState } from 'react'
import { useOrderInfo } from './use-order-info'

interface OrderInfoProps {
  orderCode: string
}

const statusMapping: Record<string, string> = {
  ready_to_pick: '??n h?ng',
  picking: '??n h?ng',
  cancel: '??n h?ng',
  money_collect_picking: '??n h?ng',
  picked: '??n h?ng',
  storing: '??n h?ng',
  transporting: '??n h?ng',
  sorting: '??n h?ng',
  delivering: '??n h?ng',
  money_collect_delivering: '??n h?ng',
  delivered: '??n h?ng',
  delivery_fail: '??n h?ng',
  waiting_to_return: '??n h?ng',
  return: '??n h?ng',
  return_transporting: '??n h?ng',
  return_sorting: '??n h?ng',
  returning: '??n h?ng',
  return_fail: '??n h?ng',
  returned: '??n h?ng',
  exception: '??n h?ng',
  damage: '??n h?ng',
  lost: '??n h?ng'
}

const OrderInfo: React.FC<OrderInfoProps> = ({ orderCode }) => {
  const { orderInfo, fetchOrderInfo, loading } = useOrderInfo()
  const [visibleCount, setVisibleCount] = useState(5)
  useEffect(() => {
    if (orderCode) {
      fetchOrderInfo(orderCode)
    }
  }, [orderCode, fetchOrderInfo])

  if (loading) {
    return <p className="text-center text-gray-500">??n h?ng</p>
  }

  if (!orderInfo) {
    return <p className="text-center text-gray-500">??n h?ng</p>
  }

  const currentStatus = orderInfo.log?.length ? orderInfo.log[orderInfo.log.length - 1]?.status : undefined
  const logs = orderInfo.log ? [...orderInfo.log].reverse() : []
  const visibleLogs = logs.slice(0, visibleCount)

  return (
    <div className="bg-white p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          ??n h?ng
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white p-4 space-y-4">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-700 border-b pb-2">
            ??n h?ng
          </h3>

          <p className="flex items-center justify-between gap-2">
            <span className="text-gray-600 font-medium flex-shrink-0">
              ??n h?ng
            </span>
            <span
              className={`font-bold flex-1 text-right ${
                currentStatus === 'delivered' ? 'text-green-600' : 'text-blue-500'
              }`}
            >
              {statusMapping[orderInfo.status] ?? orderInfo.status}
            </span>
          </p>

          <p className="flex items-center justify-between gap-2">
            <span className="text-gray-600 font-medium flex-shrink-0">
              ??n h?ng
            </span>
            <span className="flex-1 text-right text-gray-800 break-words">{orderInfo.to_name}</span>
          </p>

          <p className="flex items-center justify-between gap-2">
            <span className="text-gray-600 font-medium flex-shrink-0">
              ??n h?ng
            </span>
            <span className="flex-1 text-right text-gray-800 break-words">{orderInfo.to_address}</span>
          </p>

          <p className="flex items-center justify-between gap-2">
            <span className="text-gray-600 font-medium flex-shrink-0">
              ??n h?ng
            </span>
            <span className="flex-1 text-right text-gray-800">{orderInfo.to_phone}</span>
          </p>
        </div>

        <div className="flex-1 bg-white p-4">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-700 mb-4">
            ??n h?ng
          </h3>
          <div className="relative border-l-2 border-dashed border-gray-200 ml-4">
            {visibleLogs.length > 0 ? (
              visibleLogs.map((item, index) => {
                const isLatest = index === 0
                const date = new Date(item.updated_date)
                const formattedDate = date.toLocaleDateString('vi-VN')
                const formattedTime = date.toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })

                return (
                  <div key={index} className="mb-6 ml-4 flex items-start relative">
                    <span
                      className={`absolute -left-4 top-2 w-3 h-3 rounded-full transform -translate-x-1/2 ${
                        isLatest ? 'bg-green-500 ring-4 ring-green-200' : 'bg-gray-400'
                      }`}
                    ></span>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-sm text-gray-500">{formattedTime}</span>
                      <span className="text-sm text-gray-500">{formattedDate}</span>
                      <span className={`text-sm font-semibold ${isLatest ? 'text-green-600' : 'text-gray-700'}`}>
                        {statusMapping[item.status] || item.status}
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="ml-4 text-gray-500">??n h?ng</p>
            )}
          </div>

          {logs.length > 5 && (
            <div className="mt-2 text-center">
              {visibleCount < logs.length ? (
                <button onClick={() => setVisibleCount((prev) => prev + 5)} className="text-blue-500 hover:underline">
                  ??n h?ng
                </button>
              ) : (
                <button onClick={() => setVisibleCount(5)} className="text-blue-500 hover:underline">
                  ??n h?ng
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderInfo
