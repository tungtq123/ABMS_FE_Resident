import React, { useState } from 'react';
import { Star, Send, Loader2, RotateCcw, CheckCircle2 } from 'lucide-react';
import { submitMaintenanceReview } from '../../services/maintenanceWorkflowService';
import AlertModal from '../common/AlertModal';

export default function ReviewModal({ requestId, on处Success, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [outcome, setOutcome] = useState('ACCEPTED');
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const showAlert = (title, message, type = 'info') => {
    setAlertConfig({ isOpen: true, title, message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await submitMaintenanceReview(requestId, {
        rating,
        comment,
        outcome
      });

      if (response.code === 200) {
        on处Success();
      } else {
        // Hiển thị thông báo lỗi từ Backend (như mã 1009: Yêu cầu đã đánh giá)
        showAlert('Thông báo', response.message || 'Không thể gửi đánh giá', 'warning');
      }
    } catch (err) {
      console.error(err);
      showAlert('Lỗi', 'Có lỗi xảy ra khi kết nối máy chủ', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 border-b border-gray-100 bg-blue-50/30">
          <h3 className="text-xl font-bold text-gray-900">Nghiệm thu & Đánh giá</h3>
          <p className="text-sm text-gray-500 font-medium mt-1">Vui lòng phản hồi kết quả sửa chữa của nhân viên</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Outcome Selection */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">Kết quả nghiệm thu</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setOutcome('ACCEPTED')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-bold text-sm ${outcome === 'ACCEPTED'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                  }`}
              >
                <CheckCircle2 size={18} />
                Hoàn thành
              </button>
              <button
                type="button"
                onClick={() => setOutcome('REDO')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all font-bold text-sm ${outcome === 'REDO'
                  ? 'border-orange-600 bg-orange-50 text-orange-700'
                  : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                  }`}
              >
                <RotateCcw size={18} />
                Yêu cầu làm lại
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3 text-center">
            <label className="text-sm font-bold text-gray-700">Đánh giá chất lượng</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    size={32}
                    className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                      } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Nhận xét thêm</label>
            <textarea
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium resize-none text-sm"
              rows={3}
              placeholder="Nhập ý kiến của bạn về quá trình sửa chữa..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Để sau
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${outcome === 'ACCEPTED' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200'
                }`}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              Gửi phản hồi
            </button>
          </div>
        </form>
      </div>

      <AlertModal
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </div>
  );
}
