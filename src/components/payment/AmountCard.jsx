const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "decimal", minimumFractionDigits: 0 }).format(amount) + " đ";

export default function AmountCard({ totalAmount }) {
  return (
    <div className="bg-blue-600 rounded-2xl p-6 shadow-sm text-white">
      <p className="text-blue-100 text-sm mb-1">Số tiền cần thanh toán</p>
      <p className="text-3xl font-bold">{formatCurrency(totalAmount)}</p>
      <p className="text-blue-200 text-xs mt-2">* Vui lòng thanh toán toàn bộ số tiền</p>
    </div>
  );
}