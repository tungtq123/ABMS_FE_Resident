import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBillDetail, createPayment } from "../services/paymentService";
import BillInfoCard from "../components/payment/BillInfoCard";
import AmountCard from "../components/payment/AmountCard";
import ChargeDetailCard from "../components/payment/ChargeDetailCard";
import QRPaymentCard from "../components/payment/QRPaymentCard";
import BankInfoCard from "../components/payment/BankInfoCard";
import NoteCard from "../components/payment/NoteCard";
import InfoNotice from "../components/payment/InfoNotice";
import PaymentActions from "../components/payment/PaymentActions";
import ReferenceUploadCard from "../components/payment/ReferenceUploadCard";
import ReferenceCard from "../components/payment/ReferenceCard";

export default function MakePayment() {
  const { billId } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const billData = await fetchBillDetail(billId);
        const paymentData = await createPayment(billId);
        setBill(billData);
        setPayment(paymentData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [billId]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleConfirm = () => {
    // TODO: submit payment logic
    console.log({ referenceNumber, note, selectedFile });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!bill) return <div className="p-10 text-center">Bill not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page sub-header - white with left blue accent bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-4 shadow-sm">
        {/* Back button */}
        <button
          onClick={handleCancel}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-gray-500" />
        </button>

        {/* Blue accent + Title */}
        <div className="flex items-center gap-3">
          <div className="w-1 h-10 bg-blue-600 rounded-full" />
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Thanh toán hóa đơn</h1>
            <p className="text-xs text-gray-400">Hoàn tất thanh toán hóa đơn của bạn</p>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Status badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-200">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          Chưa thanh toán
        </span>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <BillInfoCard bill={bill} />
          <AmountCard totalAmount={bill?.totalAmount} />
          <ChargeDetailCard items={bill?.items} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">Phương thức thanh toán</h3>
            <p className="text-sm text-blue-600 font-semibold mb-4">Chuyển khoản ngân hàng</p>
            <QRPaymentCard payment={payment} />
          </div>

          <BankInfoCard bill={bill} />

          {/* Reference + Upload side by side */}
          <div className="grid grid-cols-2 gap-4">
            <ReferenceCard
              referenceNumber={referenceNumber}
              setReferenceNumber={setReferenceNumber}
            />
            <ReferenceUploadCard
              selectedFile={selectedFile}
              previewUrl={previewUrl}
              onFileSelect={handleFileSelect}
              onRemoveFile={handleRemoveFile}
            />
          </div>

          <NoteCard note={note} setNote={setNote} />
          <InfoNotice />
          <PaymentActions onConfirm={handleConfirm} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
}