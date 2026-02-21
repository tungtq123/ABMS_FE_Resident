export default function BillInfoCard({ bill }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{bill?.title}</h2>
      <div className="space-y-2 text-sm text-gray-600">
        <p>Mã hóa đơn: <span className="font-medium text-gray-900">{bill?.billId}</span></p>
        <p>Ngày phát hành: <span className="font-medium text-gray-900">
          {/* {bill?.issueDate} */}
          {new Date().toLocaleDateString("vi-VN")}
          </span>
        </p>
        <p>Hạn thanh toán: <span className="font-medium text-gray-900">
          {/* {bill?.dueDate} */}
          {new Date().toLocaleDateString("vi-VN")}
          </span>
        </p>
      </div>
    </div>
  );
}