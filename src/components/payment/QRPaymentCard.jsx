import { QRCodeCanvas } from "qrcode.react";

export default function QRPaymentCard({ payment }) {
  if (!payment) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-5 flex flex-col items-center gap-3">
      <p className="text-sm font-semibold text-gray-700">Thanh toán qua QR Code</p>
      <QRCodeCanvas value={payment.qrCode || payment.orderCode} size={180} />
      <p className="text-xs text-gray-500">
        Mã đơn hàng: <span className="font-bold text-gray-800">{payment.orderCode}</span>
      </p>
    </div>
  );
}