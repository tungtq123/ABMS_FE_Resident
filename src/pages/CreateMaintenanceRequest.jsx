import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  ArrowLeft,
  Send,
  AlertTriangle,
  FileText,
  MapPin,
  Loader2,
  LayoutGrid,
  Building2,
  ImagePlus,
  X
} from 'lucide-react';
import { createMaintenanceRequest } from '../services/maintenanceRequestService';
import { getApartmentsByResidentEmail } from '../services/apartmentApi';
import { getBuildingByResidentEmail } from '../services/buildingApi';
import { uploadFile } from '../services/fileService';
import { addMaintenanceResource } from '../services/maintenanceWorkflowService';
import { useAuth } from '../context/AuthContext';
import AlertModal from '../components/common/AlertModal';
import { useEffect, useRef } from 'react';

export default function CreateMaintenanceRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [apartments, setApartments] = useState([]);
  const [residentBuilding, setResidentBuilding] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const hasFetched = useRef(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scope: 'PRIVATE',
    category: 'REPAIR',
    priority: 'NORMAL',
    isBillable: false,
    apartmentId: '',
    buildingId: '',
  });

  useEffect(() => {
    const fetchResidentData = async () => {
      if (!user?.email || hasFetched.current) return;
      hasFetched.current = true;

      setFetchingData(true);
      try {
        let bId = null;
        let bName = null;

        // 1. Lấy thông tin tòa nhà (Bọc try-catch riêng để không block bước sau)
        try {
          const buildingRes = await getBuildingByResidentEmail(user.email);
          console.log('[DEBUG] Building API response:', buildingRes);
          const bInfo = buildingRes?.result ?? buildingRes?.data ?? null;
          if (bInfo) {
            bId = bInfo.id ?? bInfo.buildingId;
            bName = bInfo.name ?? bInfo.buildingName;
            setResidentBuilding({ id: bId, name: bName });
            setFormData(prev => ({ ...prev, buildingId: bId }));
          }
        } catch (bErr) {
          console.warn('[DEBUG] Building API error:', bErr?.response?.status, bErr?.message);
        }

        // 2. Lấy danh sách căn hộ
        const apartmentResponse = await getApartmentsByResidentEmail(user.email);
        console.log('[DEBUG] Apartment API response:', apartmentResponse);
        const fetchedApartments = apartmentResponse?.result ?? apartmentResponse?.data ?? [];
        setApartments(fetchedApartments);
        console.log('[DEBUG] Apartments:', fetchedApartments);

        if (fetchedApartments.length > 0) {
          const firstApt = fetchedApartments[0];
          if (!bId) bId = firstApt.buildingId;
          if (!bName) bName = firstApt.buildingName;

          setResidentBuilding({ id: bId, name: bName });
          setFormData(prev => ({
            ...prev,
            buildingId: bId,
            apartmentId: fetchedApartments.length === 1 ? fetchedApartments[0].id : prev.apartmentId
          }));
        } else {
          console.warn('[DEBUG] No apartments for user:', user.email);
        }
      } catch (err) {
        console.error("Critical error fetching resident data:", err);
      } finally {
        setFetchingData(false);
      }
    };

    fetchResidentData();
  }, [user?.email]);

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

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setAttachments((prev) => [...prev, ...files].slice(0, 5));
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = { ...formData };
      if (!payload.apartmentId) payload.apartmentId = null;
      if (!payload.buildingId) payload.buildingId = null;

      const response = await createMaintenanceRequest(payload);
      if (response.code === 200) {
        const requestId = response?.result?.id;

        if (requestId && attachments.length > 0) {
          for (const file of attachments) {
            const uploadRes = await uploadFile(file, 'maintenance');
            const uploadedFile = uploadRes?.result;

            if (uploadedFile?.url) {
              await addMaintenanceResource(requestId, {
                name: file.name,
                url: uploadedFile.url,
                resourceType: file.type.startsWith('image/') ? 'IMAGE' : 'DOCUMENT'
              });
            }
          }
        }

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
                  <Building2 size={16} className="text-gray-400" />
                  Tòa nhà
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl font-bold text-gray-700 flex items-center gap-2">
                  {fetchingData ? (
                    <span className="text-blue-500 animate-pulse text-sm">Đang tải thông tin...</span>
                  ) : residentBuilding ? (
                    residentBuilding.name
                  ) : (
                    <span className="text-red-500 text-sm">Chưa gán tòa nhà</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <LayoutGrid size={16} className="text-gray-400" />
                  Căn hộ <span className="text-red-500">*</span>
                </label>
                <select
                  name="apartmentId"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer font-medium appearance-none"
                  value={formData.apartmentId}
                  onChange={handleChange}
                  disabled={fetchingData || !residentBuilding}
                >
                  <option value="">-- Chọn căn hộ --</option>
                  {apartments.filter(a => String(a.buildingId) === String(residentBuilding?.id)).map(a => (
                    <option key={a.id} value={a.id}>{a.code}</option>
                  ))}
                </select>
                {!residentBuilding && !fetchingData && <p className="text-xs text-red-500 mt-1">Không tìm thấy tòa nhà của bạn</p>}
              </div>
            </div>

            {/* Scope */}
            <div>
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


            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <ImagePlus size={16} className="text-gray-400" />
                Ảnh/Tài liệu đính kèm (tối đa 5 file)
              </label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleAttachmentChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
              {attachments.length > 0 && (
                <div className="space-y-2 mt-2">
                  {attachments.map((file, idx) => (
                    <div key={`${file.name}-${idx}`} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <span className="text-sm text-gray-700 truncate pr-3">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                disabled={loading || fetchingData}
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
