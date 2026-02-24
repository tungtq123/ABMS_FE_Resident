import React from 'react';
import { Calendar, Clock, Wrench, Building } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function MaintenanceRequestCard({ request, onClick }) {
  const formatDate = (dateString) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const priorityConfig = {
    LOW: { label: 'Thấp', color: 'text-green-600' },
    NORMAL: { label: 'Bình thường', color: 'text-blue-600' },
    HIGH: { label: 'Cao', color: 'text-orange-600' },
    CRITICAL: { label: 'Khẩn cấp', color: 'text-red-600' }
  };

  return (
    <div
      onClick={() => onClick(request.id)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
            <Wrench size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {request.title}
            </h3>
            <p className="text-xs text-gray-500 font-medium">#{request.code}</p>
          </div>
        </div>
        <StatusBadge status={request.requestStatus} />
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
        {request.description}
      </p>

      <div className="grid grid-cols-2 gap-y-3 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={14} className="text-gray-400" />
          <span>Ngày tạo: <span className="text-gray-700 font-medium">{formatDate(request.createdAt)}</span></span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={14} className="text-gray-400" />
          <span>Mong muốn: <span className="text-gray-700 font-medium">{formatDate(request.preferredTime)}</span></span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Building size={14} className="text-gray-400" />
          <span>Căn hộ: <span className="text-gray-700 font-medium">{request.apartmentCode || '---'}</span></span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className={`w-1.5 h-1.5 rounded-full bg-current ${priorityConfig[request.priority]?.color}`} />
          <span>Ưu tiên: <span className={`font-medium ${priorityConfig[request.priority]?.color}`}>{priorityConfig[request.priority]?.label || request.priority}</span></span>
        </div>
      </div>
    </div>
  );
}
