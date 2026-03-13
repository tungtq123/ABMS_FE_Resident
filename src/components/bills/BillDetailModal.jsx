import React from 'react';
import { X, FileText } from 'lucide-react';

export default function BillDetailModal({ isOpen, onClose, bill }) {
  if (!isOpen || !bill) return null;

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Chi tiết hóa đơn</h2>
              <p className="text-gray-500 text-sm">Kỳ: {bill.periodCode}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* General Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-gray-500 text-xs mb-1">Căn hộ</p>
              <p className="font-bold text-gray-900">{bill.apartmentCode || '---'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-gray-500 text-xs mb-1">Trạng thái</p>
              <div className="mt-1">
                {bill.status === 'PAID' ? (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md">Đã thanh toán</span>
                ) : bill.status === 'PARTIAL' ? (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-md">Thanh toán 1 phần</span>
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-md">Chưa thanh toán</span>
                )}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-gray-500 text-xs mb-1">Ngày phát hành</p>
              <p className="font-semibold text-gray-900">{formatDate(bill.issuedAt)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-gray-500 text-xs mb-1">Hạn thanh toán</p>
              <p className="font-semibold text-gray-900">{formatDate(bill.dueDate)}</p>
            </div>
          </div>

          {/* Details Table */}
          {bill.details && bill.details.length > 0 ? (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-700 text-sm">Danh sách khoản thu</h3>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nội dung</th>
                    <th className="px-4 py-3 font-medium text-right">Số lượng</th>
                    <th className="px-4 py-3 font-medium text-right">Đơn giá</th>
                    <th className="px-4 py-3 font-medium text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bill.details.map((detail, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-900">{detail.description || '---'}</td>
                      <td className="px-4 py-3 text-gray-600 text-right">{detail.quantity || 1}</td>
                      <td className="px-4 py-3 text-gray-600 text-right">{formatCurrency(detail.unitPrice)}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium text-right">{formatCurrency(detail.totalLine != null ? detail.totalLine : detail.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 border border-gray-200 rounded-xl bg-gray-50/50">
              Không có chi tiết khoản thu.
            </div>
          )}

          {/* Summary */}
          <div className="flex justify-end pt-4">
            <div className="w-full md:w-1/2 space-y-3">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Tổng trước thuế</span>
                <span>{formatCurrency(bill.subtotal || bill.totalAmount)}</span>
              </div>
              {(bill.taxTotal != null && bill.taxTotal > 0) && (
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Tiền thuế</span>
                  <span>{formatCurrency(bill.taxTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-100 pt-3 mt-3">
                <span>Tổng thanh toán</span>
                <span className="text-blue-600">{formatCurrency(bill.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
          {bill.status !== 'PAID' && (
            <button className="px-6 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">
              Thanh toán ngay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
