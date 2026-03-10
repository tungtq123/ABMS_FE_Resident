import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';

export default function BillItem({ bill }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(amount || 0) + ' đ';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden group cursor-pointer">
      <div className="p-6">
        <div className="flex items-center gap-6">
          {/* Icon */}
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-gray-900 font-bold text-lg mb-1">
                  Hóa đơn kỳ: {bill.periodCode}
                </h3>
                <p className="text-gray-600 text-sm">Căn hộ: <span className="font-medium">{bill.apartmentCode}</span></p>
              </div>
              {bill.status === 'PAID' ? (
                <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full whitespace-nowrap">
                  Đã thanh toán
                </span>
              ) : bill.status === 'PARTIAL' ? (
                <span className="px-4 py-2 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full whitespace-nowrap">
                  Thanh toán 1 phần
                </span>
              ) : (
                <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-full whitespace-nowrap">
                  Chưa thanh toán
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <p className="text-gray-500 text-xs mb-1">Ngày phát hành</p>
                <p className="text-gray-900 font-medium text-sm">{formatDate(bill.issuedAt)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Hạn thanh toán</p>
                <p className="text-gray-900 font-medium text-sm">{formatDate(bill.dueDate)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Tổng tiền</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(bill.totalAmount)}</p>
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 group-hover:scale-105 transition-transform">
                {bill.status !== 'PAID' ? 'Thanh toán ngay' : 'Xem chi tiết'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
