import React from 'react';
import { Search, Filter, Home, Calendar } from 'lucide-react';

export default function BillFilter({ periodCode, setPeriodCode, apartmentCode, setApartmentCode, filterStatus, setFilterStatus }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Tháng (Kỳ cước)</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="month"
              value={periodCode}
              onChange={(e) => setPeriodCode(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Mã Tòa Nhà / Căn Hộ</label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={apartmentCode}
              onChange={(e) => setApartmentCode(e.target.value)}
              placeholder="Nhập mã (VD: A1-01)..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Trạng thái</label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">Tất cả hóa đơn</option>
              <option value="PAID">Đã thanh toán (PAID)</option>
              <option value="UNPAID">Chưa thanh toán (UNPAID)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
