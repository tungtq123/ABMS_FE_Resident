export default function PaymentActions({ onConfirm, onCancel }) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onConfirm}
        className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
      >
        Xác nhận thanh toán
      </button>
      <button
        onClick={onCancel}
        className="px-12 bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
      >
        Hủy bỏ
      </button>
    </div>
  );
}