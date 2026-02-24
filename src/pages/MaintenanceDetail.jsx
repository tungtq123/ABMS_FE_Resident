import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Wrench,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Building,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  FileText,
  DollarSign,
  Loader2,
  Camera,
  History
} from 'lucide-react';
import {
  fetchMaintenanceRequestDetail,
  cancelMaintenanceRequest
} from '../services/maintenanceRequestService';
import {
  fetchMaintenanceQuotations,
  respondToQuotation
} from '../services/maintenanceQuotationService';
import {
  fetchSchedules,
  respondToSchedule,
  fetchMaintenanceProgress,
  fetchMaintenanceLogs
} from '../services/maintenanceWorkflowService';
import StatusBadge from '../components/maintenance/StatusBadge';
import ReviewModal from "../components/maintenance/ReviewModal";
import ScheduleModal from "../components/maintenance/ScheduleModal";
import { Edit2, Trash2 } from 'lucide-react';

export default function MaintenanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [progress, setProgress] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('detail');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    loadAllData();
  }, [id]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [reqRes, quoRes, schRes, proRes, logRes] = await Promise.all([
        fetchMaintenanceRequestDetail(id),
        fetchMaintenanceQuotations(id),
        fetchSchedules(id),
        fetchMaintenanceProgress(id),
        fetchMaintenanceLogs(id)
      ]);

      if (reqRes.code === 200) setRequest(reqRes.result);
      if (quoRes.code === 200) setQuotations(quoRes.result);
      if (schRes.code === 200) setSchedules(schRes.result);
      if (proRes.code === 200) setProgress(proRes.result);
      if (logRes.code === 200) setLogs(logRes.result);
    } catch (err) {
      setError('Không thể tải thông tin chi tiết');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy yêu cầu này?')) {
      try {
        const res = await cancelMaintenanceRequest(id, 'Hủy bởi cư dân');
        if (res.code === 200) {
          loadAllData();
        }
      } catch (err) {
        alert('Có lỗi xảy ra khi hủy yêu cầu');
      }
    }
  };

  const handleQuotationResponse = async (qId, status) => {
    try {
      const res = await respondToQuotation(qId, status);
      if (res.code === 200) {
        loadAllData();
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi xử lý báo giá');
    }
  };

  const handleScheduleResponse = async (sId, action) => {
    try {
      const res = await respondToSchedule(id, sId, { action });
      if (res.code === 200) {
        loadAllData();
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi xử lý lịch');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Đang tải thông tin chi tiết...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-8 text-center">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Không tìm thấy yêu cầu</h2>
        <button onClick={() => navigate('/maintenance')} className="text-blue-600 mt-2">Quay lại danh sách</button>
      </div>
    );
  }

  const latestQuotation = quotations.find(q => q.status === 'SENT');
  const latestSchedule = schedules.find(s => s.status === 'PROPOSED');

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/maintenance')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900">{request.title}</h1>
                <StatusBadge status={request.requestStatus} />
              </div>
              <p className="text-xs text-gray-500 font-medium">Mã yêu cầu: {request.code}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {['PENDING', 'VERIFYING'].includes(request.requestStatus) && (
              <>
                <button
                  onClick={() => navigate(`/maintenance/edit/${id}`)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  title="Chỉnh sửa"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Hủy yêu cầu"
                >
                  <Trash2 size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          {[
            { id: 'detail', label: 'Chi tiết', icon: FileText },
            { id: 'quotation', label: 'Báo giá', icon: DollarSign, count: quotations.length },
            { id: 'progress', label: 'Tiến độ', icon: History, count: progress.length },
            { id: 'logs', label: 'Nhật ký', icon: MessageSquare }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 border-b-2 transition-all font-bold text-sm px-1 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'detail' && (
            <>
              {/* Resident Action: Review (COMPLETED status) */}
              {request.requestStatus === 'COMPLETED' && (
                <div className="bg-green-50 border border-green-100 rounded-2xl p-6 shadow-sm mb-8 animate-pulse-slow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-900">Nghiệm thu công việc</h3>
                      <p className="text-xs text-green-600 font-medium">Nhân viên đã báo cáo hoàn thành. Vui lòng kiểm tra và nghiệm thu.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-95"
                  >
                    Nghiệm thu ngay
                  </button>
                </div>
              )}

              {/* Resident Action: Propose Schedule (APPROVED status) */}
              {request.requestStatus === 'APPROVED' && !latestSchedule && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900">Đề xuất lịch sửa chữa</h3>
                      <p className="text-xs text-blue-600 font-medium">Báo giá đã được duyệt. Vui lòng chọn thời gian bạn có thể tiếp nhận nhân viên.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                  >
                    Đề xuất lịch ngay
                  </button>
                </div>
              )}

              {/* Description */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Mô tả vấn đề</h3>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {request.description}
                </p>
              </div>

              {/* Resident Action: Quotation */}
              {latestQuotation && (
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-900">Báo giá cần duyệt</h3>
                      <p className="text-xs text-purple-600 font-medium">Nhân viên đã gửi báo giá, vui lòng phản hồi</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 mb-4 border border-purple-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-900">{latestQuotation.title}</span>
                      <span className="text-lg font-black text-blue-600">{latestQuotation.totalAmount?.toLocaleString()} đ</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{latestQuotation.note}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleQuotationResponse(latestQuotation.id, 'APPROVED')}
                      className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg font-bold text-sm shadow-md hover:bg-purple-700 transition-all"
                    >
                      Đồng ý báo giá
                    </button>
                    <button
                      onClick={() => handleQuotationResponse(latestQuotation.id, 'REJECTED')}
                      className="flex-1 bg-white text-purple-600 border border-purple-200 py-2.5 rounded-lg font-bold text-sm hover:bg-purple-50 transition-all"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              )}

              {/* Resident Action: Schedule */}
              {latestSchedule && latestSchedule.proposedByRole === 'STAFF' && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900">Xác nhận lịch sửa chữa</h3>
                      <p className="text-xs text-blue-600 font-medium">Nhân viên đề xuất thời gian thực hiện</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 mb-4 border border-blue-100">
                    <div className="flex items-center gap-4 text-sm font-bold text-gray-900">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} className="text-blue-600" />
                        {new Date(latestSchedule.proposedTime).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-blue-600" />
                        {new Date(latestSchedule.proposedTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {latestSchedule.note && (
                      <p className="text-xs text-gray-500 mt-2 italic">"{latestSchedule.note}"</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleScheduleResponse(latestSchedule.id, 'ACCEPT')}
                      className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-all"
                    >
                      Xác nhận lịch
                    </button>
                    <button
                      onClick={() => handleScheduleResponse(latestSchedule.id, 'REJECT')}
                      className="flex-1 bg-white text-blue-600 border border-blue-200 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-50 transition-all"
                    >
                      Đổi lịch khác
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'quotation' && (
            <div className="space-y-4">
              {quotations.length > 0 ? quotations.map(q => (
                <div key={q.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">{q.title}</h4>
                      <p className="text-xs text-gray-400">Ngày tạo: {formatDate(q.createdAt)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      q.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      q.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {q.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {q.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name} x{item.quantity}</span>
                        <span className="font-medium">{(item.unitPrice * item.quantity).toLocaleString()} đ</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900">Tổng cộng</span>
                    <span className="text-lg font-black text-blue-600">{q.totalAmount?.toLocaleString()} đ</span>
                  </div>
                </div>
              )) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200 text-gray-400">
                  Chưa có báo giá nào được tạo
                </div>
              )}
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-100">
                {progress.length > 0 ? progress.map((p, idx) => (
                  <div key={p.id} className="relative">
                    <div className={`absolute -left-8 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                      idx === 0 ? 'bg-blue-600' : 'bg-blue-400'
                    }`}>
                      {idx === 0 && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-900">{p.progressPercent}% Hoàn thành</span>
                        <span className="text-[10px] font-medium text-gray-400">{formatDate(p.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{p.note}</p>
                    </div>
                  </div>
                )) : (
                  <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200 text-gray-400 ml-[-2rem]">
                    Chưa có cập nhật tiến độ nào
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Thời gian</th>
                    <th className="px-6 py-4">Hoạt động</th>
                    <th className="px-6 py-4">Người thực hiện</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {logs.map(log => (
                    <tr key={log.id} className="text-sm">
                      <td className="px-6 py-4 text-gray-400">{formatDate(log.createdAt)}</td>
                      <td className="px-6 py-4 font-bold text-gray-700">{log.action}</td>
                      <td className="px-6 py-4 text-gray-500">{log.actorName || 'Hệ thống'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar Info */}
        <div className="space-y-6">
          {/* Status Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Thông tin chung</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  <Building size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Căn hộ</p>
                  <p className="text-sm font-bold text-gray-900">{request.apartmentCode} - {request.buildingName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nhân viên phụ trách</p>
                  <p className="text-sm font-bold text-gray-900">{request.staffName || 'Chưa giao việc'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thời gian mong muốn</p>
                  <p className="text-sm font-bold text-gray-900">{formatDate(request.preferredTime)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  <AlertCircle size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mức độ ưu tiên</p>
                  <p className={`text-sm font-bold ${
                    request.priority === 'CRITICAL' ? 'text-red-600' :
                    request.priority === 'HIGH' ? 'text-orange-600' :
                    'text-blue-600'
                  }`}>{request.priority}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Summary Card */}
          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
            <h3 className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-4">Trạng thái hiện tại</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl font-black">
                {progress.length > 0 ? progress[0].progressPercent : 0}%
              </div>
              <div className="flex-1">
                <div className="h-2 bg-blue-400/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-1000"
                    style={{ width: `${progress.length > 0 ? progress[0].progressPercent : 0}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-sm font-medium text-blue-50 leading-relaxed">
              {progress.length > 0 ? progress[0].note : 'Đang chờ xử lý yêu cầu...'}
            </p>
          </div>
        </div>
      </div>

      {showReviewModal && (
        <ReviewModal
          requestId={id}
          onSuccess={() => {
            setShowReviewModal(false);
            loadAllData();
          }}
          onClose={() => setShowReviewModal(false)}
        />
      )}

      {showScheduleModal && (
        <ScheduleModal
          requestId={id}
          onSuccess={() => {
            setShowScheduleModal(false);
            loadAllData();
          }}
          onClose={() => setShowScheduleModal(false)}
        />
      )}
    </div>
  );
}
