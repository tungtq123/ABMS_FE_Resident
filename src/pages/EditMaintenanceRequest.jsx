import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Save
} from 'lucide-react';
import { fetchMaintenanceRequestDetail, updateMaintenanceRequest } from '../services/maintenanceRequestService';
import AlertModal from '../components/common/AlertModal';

export default function EditMaintenanceRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scope: 'PRIVATE',
    category: 'REPAIR',
    priority: 'NORMAL',
    preferredTime: '',
    isBillable: false,
  });

  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const showAlert = (title, message, type = 'info') => {
    setAlertConfig({ isOpen: true, title, message, type });
  };

  const closeAlert = () => setAlertConfig(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    loadRequest();
  }, [id]);

  const loadRequest = async () => {
    try {
      const response = await fetchMaintenanceRequestDetail(id);
      if (response.code === 200) {
        const data = response.result;
        setFormData({
          title: data.title || '',
          description: data.description || '',
          scope: data.scope || 'PRIVATE',
          category: data.category || 'REPAIR',
          priority: data.priority || 'NORMAL',
          preferredTime: data.preferredTime ? data.preferredTime.substring(0, 16) : '',
          isBillable: data.isBillable || false,
        });
      }
    } catch (err) {
      console.error(err);
      showAlert('Lỗi tải dữ liệu', 'Không thể tải thông tin yêu cầu', 'error');
    } finally {
      setLoading(false);
    }
  };

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
      setSubmitting(true);
      const response = await updateMaintenanceRequest(id, formData);
      if (response.code === 200) {
        // Lưu xong reload danh sách và về trang detail
        showAlert('Thành công', 'Đã lưu thông tin yên cầu', 'success');
        setTimeout(() => navigate(`/maintenance/${id}`), 1500);
      } else {
        showAlert('Cập nhật thất bại', response.message || 'Có lỗi xảy ra khi cập nhật', 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert('Lỗi kết nối', 'Đã xảy ra lỗi khi kết nối máy chủ', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Đang tải thông tin...</p>
      </div>
    );
  }

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
            onClick={() => navigate(`/maintenance/${id}`)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Chỉnh sửa yêu cầu</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
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
                  <FileText size={16} className="text-gray-400" />
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
                disabled={submitting}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
              >
                {submitting ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
