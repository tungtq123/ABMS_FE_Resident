import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { fetchMaintenanceRequests } from '../services/maintenanceRequestService';
import MaintenanceRequestCard from '../components/maintenance/MaintenanceRequestCard';

export default function MaintenanceList() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await fetchMaintenanceRequests({ pagination: false });
      if (response.code === 200) {
        setRequests(response.result);
      } else {
        setError(response.message || 'Không thể tải danh sách yêu cầu');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi kết nối máy chủ');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.requestStatus === filterStatus;
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => ['PENDING', 'VERIFYING', 'QUOTING', 'WAITING_APPROVAL'].includes(r.requestStatus)).length,
    inProgress: requests.filter(r => r.requestStatus === 'IN_PROGRESS').length,
    completed: requests.filter(r => r.requestStatus === 'RESIDENT_ACCEPTED').length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Đang tải danh sách yêu cầu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Wrench className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Yêu cầu sửa chữa</h1>
                <p className="text-gray-500 text-sm font-medium">Quản lý và theo dõi các yêu cầu bảo trì của bạn</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/maintenance/create')}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Plus size={20} />
              Tạo yêu cầu mới
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Tổng số</p>
            <p className="text-2xl font-black text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-yellow-600 text-xs font-bold uppercase tracking-wider mb-1">Đang xử lý</p>
            <p className="text-2xl font-black text-gray-900">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">Đang sửa</p>
            <p className="text-2xl font-black text-gray-900">{stats.inProgress}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-green-600 text-xs font-bold uppercase tracking-wider mb-1">Hoàn thành</p>
            <p className="text-2xl font-black text-gray-900">{stats.completed}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề hoặc mã yêu cầu..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative md:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm font-medium appearance-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="WAITING_APPROVAL">Chờ duyệt báo giá</option>
              <option value="IN_PROGRESS">Đang sửa chữa</option>
              <option value="COMPLETED">Chờ nghiệm thu</option>
              <option value="RESIDENT_ACCEPTED">Đã hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl flex items-center gap-3 mb-8">
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Requests Grid */}
        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((req) => (
              <MaintenanceRequestCard
                key={req.id}
                request={req}
                onClick={(id) => navigate(`/maintenance/${id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wrench className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy yêu cầu nào</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Bạn chưa có yêu cầu sửa chữa nào hoặc không có yêu cầu nào khớp với bộ lọc hiện tại.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
