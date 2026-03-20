import { useEffect, useState } from "react";
import { ArrowLeft, FileDown } from "lucide-react";
import { exportBillPdf } from "../utils/exportBillPdf";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { createPayment } from "../services/paymentService";
import { fetchMaintenanceQuotations } from "../services/maintenanceQuotationService";
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
import { getBillDetails } from "../services/billService";

export default function MakePayment() {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const maintenanceRequestId = searchParams.get("maintenanceRequestId");
  const maintenanceRequestCode = searchParams.get("maintenanceRequestCode");

  const [bill, setBill] = useState(null);
  const [payment, setPayment] = useState(null);
  const [quotationItems, setQuotationItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // const [selectedFile, setSelectedFile] = useState(null);
  // const [previewUrl, setPreviewUrl] = useState(null);
  // const [referenceNumber, setReferenceNumber] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const billData = await getBillDetails(billId);
        const paymentData = await createPayment(billId, maintenanceRequestId || undefined);
        if (maintenanceRequestId) {
          const quotationRes = await fetchMaintenanceQuotations(maintenanceRequestId, true);
          const approvedQuotation = (quotationRes?.result || []).find((q) => q.status === "APPROVED");
          setQuotationItems(approvedQuotation?.items || []);
        } else {
          setQuotationItems([]);
        }
        setBill(billData.result);
        setPayment(paymentData.result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [billId, maintenanceRequestId]);

  const maintenanceItems = (bill?.details || []).filter((item) => {
    if (!maintenanceRequestId) return true;
    if (!maintenanceRequestCode) return true;
    const desc = (item?.description || "").toLowerCase();
    return desc.includes(maintenanceRequestCode.toLowerCase());
  });

  const quotationDetailItems = quotationItems.map((item) => {
    const quantity = Number(item?.quantity || 0);
    const unitPrice = Number(item?.unitPrice || 0);
    return {
      description: item?.description || item?.name || "Hạng mục bảo trì",
      quantity,
      unitPrice,
      totalLine: quantity * unitPrice,
    };
  });

  const displayItems = maintenanceRequestId
    ? (quotationDetailItems.length > 0 ? quotationDetailItems : maintenanceItems)
    : (bill?.details || []);
  const displayAmount = maintenanceRequestId
    ? (payment?.amount || maintenanceItems.reduce((sum, item) => sum + Number(item?.totalLine || item?.unitPrice || 0), 0))
    : bill?.totalAmount;

  // const handleFileSelect = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setSelectedFile(file);
  //     setPreviewUrl(URL.createObjectURL(file));
  //   }
  // };

  // const handleRemoveFile = () => {
  //   setSelectedFile(null);
  //   setPreviewUrl(null);
  // };

  // const handleConfirm = () => {
  //   // TODO: submit payment logic
  //   console.log({ referenceNumber, note, selectedFile });
  // };

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
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              {maintenanceRequestId ? "Thanh toán phiếu bảo trì" : "Thanh toán hóa đơn"}
            </h1>
            <p className="text-xs text-gray-400">
              {maintenanceRequestId
                ? "Chỉ thanh toán khoản phí bảo trì của yêu cầu này"
                : "Hoàn tất thanh toán hóa đơn của bạn"}
            </p>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Export PDF button */}
        <button
          onClick={() => exportBillPdf(bill, displayItems, displayAmount)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-all text-sm font-semibold"
        >
          <FileDown className="w-4 h-4" />
          Xuất PDF
        </button>


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
          <AmountCard totalAmount={displayAmount} />
          <ChargeDetailCard items={displayItems} />
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
          {/* <div className="grid grid-cols-2 gap-4">
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
          </div> */}

          <NoteCard note={note} setNote={setNote} />
          <InfoNotice />
          {/* <PaymentActions onConfirm={handleConfirm} onCancel={handleCancel} /> */}

          {bill?.status !== "PAID" && (
            <ReferenceUploadCard
              bill={bill}
              payment={payment}
              rejectedReason={payment?.rejectedReason}
              onProofUploaded={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
}