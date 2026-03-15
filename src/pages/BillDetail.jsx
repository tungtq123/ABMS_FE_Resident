import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getBillDetails } from "../services/billService";
import BillInfoCard from "../components/payment/BillInfoCard";
import AmountCard from "../components/payment/AmountCard";
import ChargeDetailCard from "../components/payment/ChargeDetailCard";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "decimal", minimumFractionDigits: 0 }).format(amount || 0) + " đ";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export default function BillDetail() {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBillDetails(billId)
      .then((res) => setBill(res.result))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [billId]);

  if (loading) return <div className="p-10 text-center">Đang tải...</div>;
  if (!bill) return <div className="p-10 text-center">Không tìm thấy hóa đơn</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-1 h-10 bg-green-600 rounded-full" />
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Chi tiết giao dịch</h1>
            <p className="text-xs text-gray-400">Thông tin hóa đơn đã thanh toán</p>
          </div>
        </div>
        <div className="flex-1" />
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-200">
          <CheckCircle className="w-3.5 h-3.5" />
          Đã thanh toán
        </span>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-8 py-8 space-y-6">
        <BillInfoCard bill={bill} />
        <AmountCard totalAmount={bill?.totalAmount} />
        <ChargeDetailCard items={bill?.details} />
      </div>
    </div>
  );
}
