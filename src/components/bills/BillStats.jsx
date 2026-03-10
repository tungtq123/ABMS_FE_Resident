import React from 'react';
import { FileText } from 'lucide-react';

export default function BillStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Tổng hóa đơn</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
            <FileText className="w-7 h-7 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Đã thanh toán</p>
            <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
          </div>
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
            <span className="text-2xl">✓</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Chưa thanh toán</p>
            <p className="text-3xl font-bold text-red-600">{stats.unpaid}</p>
          </div>
          <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
            <span className="text-2xl">!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
