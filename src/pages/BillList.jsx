import React, { useState } from 'react';
import { FileText, Search, Filter, ChevronRight } from 'lucide-react';

export default function BillList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [bills] = useState([
    {
      id: 1,
      billId: 'INV-2024-001234',
      title: 'Hóa đơn chung cư tháng 7/2023',
      amount: 685960,
      issueDate: '01/07/2023',
      dueDate: '15/07/2023',
      status: 'unpaid'
    },
    {
      id: 2,
      billId: 'INV-2024-001233',
      title: 'Hóa đơn chung cư tháng 6/2023',
      amount: 677460,
      issueDate: '01/06/2023',
      dueDate: '15/06/2023',
      status: 'paid',
      paidDate: '10/06/2023'
    },
    {
      id: 3,
      billId: 'INV-2024-001232',
      title: 'Hóa đơn chung cư tháng 5/2023',
      amount: 695250,
      issueDate: '01/05/2023',
      dueDate: '15/05/2023',
      status: 'paid',
      paidDate: '08/05/2023'
    },
    {
      id: 4,
      billId: 'INV-2024-001231',
      title: 'Hóa đơn chung cư tháng 4/2023',
      amount: 702180,
      issueDate: '01/04/2023',
      dueDate: '15/04/2023',
      status: 'paid',
      paidDate: '12/04/2023'
    },
    {
      id: 5,
      billId: 'INV-2024-001230',
      title: 'Hóa đơn chung cư tháng 3/2023',
      amount: 689430,
      issueDate: '01/03/2023',
      dueDate: '15/03/2023',
      status: 'paid',
      paidDate: '14/03/2023'
    }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(amount) + ' đ';
  };

  const filteredBills = bills.filter(bill => {
    const matchesStatus = filterStatus === 'all' || bill.status === filterStatus;
    const matchesSearch = bill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bill.billId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: bills.length,
    paid: bills.filter(b => b.status === 'paid').length,
    unpaid: bills.filter(b => b.status === 'unpaid').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">Hóa đơn</h1>
                <p className="text-blue-100 text-sm">Quản lý các hóa đơn thanh toán</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
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

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo mã hóa đơn hoặc tháng..."
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
                  <option value="paid">Đã thanh toán</option>
                  <option value="unpaid">Chưa thanh toán</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bill List */}
        <div className="space-y-4">
          {filteredBills.map((bill) => (
            <div 
              key={bill.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden group cursor-pointer"
            >
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
                          {bill.title}
                        </h3>
                        <p className="text-gray-600 text-sm">Mã hóa đơn: <span className="font-medium">{bill.billId}</span></p>
                      </div>
                      {bill.status === 'paid' ? (
                        <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full whitespace-nowrap">
                          Đã thanh toán
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
                        <p className="text-gray-900 font-medium text-sm">{bill.issueDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Hạn thanh toán</p>
                        <p className="text-gray-900 font-medium text-sm">{bill.dueDate}</p>
                      </div>
                      {bill.paidDate && (
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Ngày thanh toán</p>
                          <p className="text-green-600 font-medium text-sm">{bill.paidDate}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Tổng tiền</p>
                        <p className="text-2xl font-bold text-blue-700">{formatCurrency(bill.amount)}</p>
                      </div>
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 group-hover:scale-105 transition-transform">
                        {bill.status === 'unpaid' ? 'Thanh toán ngay' : 'Xem chi tiết'}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBills.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-16 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy hóa đơn</h3>
            <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </div>
    </div>
  );
}