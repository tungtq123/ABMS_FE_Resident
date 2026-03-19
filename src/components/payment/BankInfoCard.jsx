import { Building2 } from "lucide-react";

export default function BankInfoCard({ bill }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-5 h-5 text-blue-600" />
        <h3 className="text-base font-bold text-gray-900">Thông tin tài khoản nhận</h3>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Ngân hàng</span>
          <span className="font-semibold text-gray-900">MB Bank</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Số tài khoản</span>
          <span className="font-semibold text-gray-900">0969064150</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Chủ tài khoản</span>
          <span className="font-semibold text-gray-900 text-right">TO QUOC TUNG</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Nội dung CK</span>
          <span className="font-semibold text-gray-900">{bill?.billId}</span>
        </div>
      </div>
    </div>
  );
}