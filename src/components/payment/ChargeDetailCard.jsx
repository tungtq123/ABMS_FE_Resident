const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "decimal", minimumFractionDigits: 0 }).format(amount) + " đ";

export default function ChargeDetailCard({ items = [] }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-4">Chi tiết các khoản phí</h3>
      <div className="space-y-3">
        {items.map((charge, index) => (
          <div key={index} className="flex justify-between items-start text-sm gap-4">
            <div className="text-gray-600">
              <div>{charge.description}</div>
              {Number(charge.quantity || 0) > 0 && (
                <div className="text-xs text-gray-400 mt-0.5">
                  {Number(charge.quantity)} x {formatCurrency(Number(charge.unitPrice || 0))}
                </div>
              )}
            </div>
            <span className="font-semibold text-gray-900 whitespace-nowrap">
              {formatCurrency(Number(charge.totalLine ?? charge.unitPrice ?? 0))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}