import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  ArrowLeft,
  Send,
  Calendar,
  AlertTriangle,
  FileText,
  MapPin,
  Clock,
  Loader2,
  LayoutGrid
} from 'lucide-react';
import { createMaintenanceRequest } from '../services/maintenanceRequestService';
import AlertModal from '../components/common/AlertModal';

export default function CreateMaintenanceRequest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const MOCK_BUILDINGS = [
    { id: '1ba6cfce-0331-4179-883a-4da233de796e', name: 'Tòa nhà Tower A' } // ID tương đối hoặc lấy từ state/Context thực tế
  ];

  const MOCK_APARTMENTS = [
    { id: 'd2e2b95c-5353-485a-8b80-ecf7ce2e8e3d', name: 'A-0101', buildingId: '1ba6cfce-0331-4179-883a-4da233de796e' },
    { id: 'e2a8657f-fc8c-48be-a6b1-0960fafe052b', name: 'A-0103', buildingId: '1ba6cfce-0331-4179-883a-4da233de796e' }
  ];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scope: 'PRIVATE',
    category: 'REPAIR',
    priority: 'NORMAL',
    preferredTime: '',
    isBillable: false,
    apartmentId: 'uuid-apartment', // TODO: Get from context
    buildingId: 'uuid-building',   // TODO: Get from context
  });

  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const showAlert = (title, message, type = 'info') => {
    setAlertConfig({ isOpen: true, title, message, type });
  };

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Tạm thời comment validate để test dễ dàng
      // if (!formData.apartmentId || !formData.buildingId) {
      //   showAlert('Lỗi dữ liệu', 'Vui lòng chọn hoặc có thông tin Căn hộ/Tòa nhà', 'warning');
      //   setLoading(false);
      //   return;
      // }

      const response = await createMaintenanceRequest(formData);
      if (response.code === 200) {
        // Có thể redirect hoặc thông báo tạo thành công trước khi redirect
        navigate(`/maintenance/${response.result.id}`);
      } else {
        showAlert('Tạo thất bại', response.message || 'Có lỗi xảy ra khi tạo yêu cầu', 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert('Lỗi kết nối', 'Đã xảy ra lỗi khi kết nối máy chủ', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <AlertModal
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/maintenance')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Tạo yêu cầu sửa chữa mới</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-blue-50/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                <Send size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Thông tin yêu cầu</h2>
                <p className="text-sm text-gray-500 font-medium">Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Title & Description */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <FileText size={16} className="text-gray-400" />
                  Tiêu đề yêu cầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="VD: Rò rỉ nước bồn rửa bát, Hỏng bóng đèn hành lang..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Wrench size={16} className="text-gray-400" />
                  Mô tả chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  placeholder="Vui lòng mô tả vị trí, hiện trạng và thời gian phát hiện vấn đề..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium resize-none"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            {/* Category & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <LayoutGrid size={16} className="text-gray-400" />
                  Danh mục
                </label>
                <select
                  name="category"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer font-medium appearance-none"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="REPAIR">Sửa chữa</option>
                  <option value="MAINTENANCE">Bảo trì</option>
                  <option value="SERVICE">Dịch vụ</option>
                  <option value="CLEANING">Vệ sinh</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-gray-400" />
                  Mức độ ưu tiên
                </label>
                <select
                  name="priority"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer font-medium appearance-none"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="LOW">Thấp</option>
                  <option value="NORMAL">Bình thường</option>
                  <option value="HIGH">Cao</option>
                  <option value="CRITICAL">Khẩn cấp</option>
                </select>
              </div>
            </div>

            {/* Building & Apartment Allocation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  Tòa nhà
                </label>
                <select
                  name="buildingId"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer font-medium appearance-none"
                  value={formData.buildingId}
                  onChange={handleChange}
                >
                  {MOCK_BUILDINGS.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <LayoutGrid size={16} className="text-gray-400" />
                  Căn hộ
                </label>
                <select
                  name="apartmentId"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer font-medium appearance-none"
                  value={formData.apartmentId}
                  onChange={handleChange}
                >
                  <option value="">-- Chọn căn hộ --</option>
                  {MOCK_APARTMENTS.filter(a => a.buildingId === formData.buildingId).map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Scope & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  Phạm vi
                </label>
                <div className="flex gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 transition-all has-[:checked]:bg-blue-600 has-[:checked]:text-white has-[:checked]:border-blue-600">
                    <input
                      type="radio"
                      name="scope"
                      value="PRIVATE"
                      className="hidden"
                      checked={formData.scope === 'PRIVATE'}
                      onChange={handleChange}
                    />
                    <span className="text-sm font-bold">Căn hộ</span>
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 transition-all has-[:checked]:bg-blue-600 has-[:checked]:text-white has-[:checked]:border-blue-600">
                    <input
                      type="radio"
                      name="scope"
                      value="PUBLIC"
                      className="hidden"
                      checked={formData.scope === 'PUBLIC'}
                      onChange={handleChange}
                    />
                    <span className="text-sm font-bold">Công cộng</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  Thời gian mong muốn
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="datetime-local"
                    name="preferredTime"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium"
                    value={formData.preferredTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isBillable"
                  name="isBillable"
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
                  checked={formData.isBillable}
                  onChange={handleChange}
                />
                <label htmlFor="isBillable" className="text-sm font-medium text-gray-600 cursor-pointer">
                  Đây là dịch vụ có tính phí
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
                Gửi yêu cầu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
