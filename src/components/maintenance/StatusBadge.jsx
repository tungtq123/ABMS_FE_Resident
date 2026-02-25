import React from 'react';

const statusConfig = {
  PENDING: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700', icon: '🟡' },
  VERIFYING: { label: 'Đang xác minh', color: 'bg-blue-100 text-blue-700', icon: '🔵' },
  QUOTING: { label: 'Đang báo giá', color: 'bg-orange-100 text-orange-700', icon: '🟠' },
  WAITING_APPROVAL: { label: 'Chờ duyệt báo giá', color: 'bg-purple-100 text-purple-700', icon: '🟣' },
  APPROVED: { label: 'Đã duyệt', color: 'bg-green-100 text-green-700', icon: '🟢' },
  IN_PROGRESS: { label: 'Đang sửa chữa', color: 'bg-blue-200 text-blue-800', icon: '🔵' },
  COMPLETED: { label: 'Đã hoàn thành', color: 'bg-green-200 text-green-800', icon: '🟢' },
  RESIDENT_ACCEPTED: { label: 'Nghiệm thu xong', color: 'bg-green-500 text-white', icon: '✅' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-700', icon: '⚫' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-700', icon: '' };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${config.color}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}
