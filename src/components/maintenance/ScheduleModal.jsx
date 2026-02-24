import React, { useState } from 'react';
import { Calendar, Clock, Send, Loader2, MessageSquare } from 'lucide-react';
import { proposeSchedule } from '../../services/maintenanceWorkflowService';

export default function ScheduleModal({ requestId, onSuccess, onClose }) {
  const [proposedTime, setProposedTime] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proposedTime) return alert('Vui lòng chọn thời gian');

    try {
      setLoading(true);
      const response = await proposeSchedule(requestId, {
        proposedTime,
        note,
        estimatedDuration: 60 // Default 1 hour
      });
      if (response.code === 200) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi đề xuất lịch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 bg-blue-50/30">
          <h3 className="text-lg font-bold text-gray-900">Đề xuất lịch sửa chữa</h3>
          <p className="text-xs text-gray-500 font-medium mt-1">Chọn thời gian bạn có thể ở nhà để nhân viên đến</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              Thời gian đề xuất
            </label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="datetime-local"
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-sm"
                value={proposedTime}
                onChange={(e) => setProposedTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <MessageSquare size={16} className="text-gray-400" />
              Ghi chú thêm
            </label>
            <textarea
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium resize-none text-sm"
              rows={3}
              placeholder="VD: Vui lòng đến trước 10h sáng..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-100 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all text-sm"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 text-sm"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Gửi đề xuất
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
