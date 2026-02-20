const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "decimal", minimumFractionDigits: 0 }).format(amount) + " đ";

export default function ChargeDetailCard({ items = [] }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-4">Chi tiết các khoản phí</h3>
      <div className="space-y-3">
        {items.map((charge, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{charge.description}</span>
            <span className="font-semibold text-gray-900">{formatCurrency(charge.unitPrice)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}