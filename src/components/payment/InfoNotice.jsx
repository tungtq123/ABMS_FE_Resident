import { AlertCircle } from "lucide-react";

export default function InfoNotice() {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-blue-900 font-bold text-base mb-2">Lưu ý quan trọng</p>
          <p className="text-blue-700 text-sm leading-relaxed">
            Sau khi gửi, hóa đơn sẽ chuyển sang trạng thái{" "}
            <span className="font-bold">"Chờ duyệt"</span>. Admin sẽ kiểm tra và xác nhận thanh toán
            của bạn trong vòng <span className="font-bold">24-48 giờ</span>. Bạn sẽ nhận được thông
            báo qua email khi thanh toán được duyệt.
          </p>
        </div>
      </div>
    </div>
  );
}