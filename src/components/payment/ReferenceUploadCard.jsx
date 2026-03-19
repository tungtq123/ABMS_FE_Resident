import { useState, useRef } from "react";
import { Camera, X, Upload, CheckCircle, Clock, ImageIcon, AlertCircle } from "lucide-react";
import { uploadPaymentProof } from "../../services/paymentService";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

// Basic mode (no `bill` prop): controlled file picker for normal payment flow
// Proof mode (`bill` prop provided): standalone proof upload for unpaid bills
export default function ReferenceUploadCard({
  // basic mode props
  selectedFile,
  previewUrl,
  onFileSelect,
  onRemoveFile,
  // proof mode props
  bill,
  payment,
  rejectedReason,
  onProofUploaded,
}) {
  const isProofMode = !!bill;

  // proof mode state
  const [file, setFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadedProofUrl, setUploadedProofUrl] = useState(bill?.proofUrl || null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  // ── BASIC MODE ────────────────────────────────────────────────────────────
  if (!isProofMode) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          Bằng chứng thanh toán <span className="text-red-500">*</span>
        </label>

        {!selectedFile ? (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-100 transition-all">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
              <Camera className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-gray-600">Tải lên ảnh</span>
            <span className="text-xs text-gray-400 mt-0.5">PNG, JPG (Max 5MB)</span>
            <input type="file" accept="image/*" className="hidden" onChange={onFileSelect} />
          </label>
        ) : (
          <div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 mb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-xs font-medium text-gray-800 truncate max-w-30">{selectedFile.name}</p>
                  <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button onClick={onRemoveFile} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-36 object-contain rounded-xl border border-gray-200"
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // ── PROOF MODE ────────────────────────────────────────────────────────────
  // Chỉ hiện khi bill chưa được thanh toán
  if (bill?.status === "PAID") return null;

  const isRejected = !!rejectedReason;
  const alreadyUploaded = !!uploadedProofUrl && !isRejected;

  const validateFile = (f) => {
    if (!ALLOWED_TYPES.includes(f.type)) return "Chỉ chấp nhận file JPG hoặc PNG.";
    if (f.size > MAX_SIZE_BYTES) return "Kích thước file không được vượt quá 5MB.";
    return null;
  };

  const handleFileChange = (f) => {
    setError("");
    setSuccess(false);
    const validationError = validateFile(f);
    if (validationError) { setError(validationError); return; }
    setFile(f);
    setFilePreviewUrl(URL.createObjectURL(f));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileChange(f);
  };

  const handleRemoveProofFile = () => {
    setFile(null);
    setFilePreviewUrl(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file || !bill?.id) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadPaymentProof(payment.transactionId, formData);
      const proofUrl = res.result?.proofUrl || filePreviewUrl;
      setUploadedProofUrl(proofUrl);
      setSuccess(true);
      setFile(null);
      setFilePreviewUrl(null);
      if (onProofUploaded) onProofUploaded(res.result);
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("403")) {
        setError("Bạn không có quyền thực hiện thao tác này.");
      } else if (msg.includes("400")) {
        setError("Không thể upload: giao dịch không hợp lệ hoặc sai định dạng file.");
      } else {
        setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-amber-600" />
        </div>
        <h3 className="text-base font-bold text-gray-900">Upload bằng chứng thanh toán</h3>
      </div>

      {alreadyUploaded ? (
        <div>
          <div className="flex items-center gap-2 mb-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-sm font-medium text-amber-700">Đang chờ admin xác nhận</p>
          </div>
          <img
            src={uploadedProofUrl}
            alt="Bằng chứng thanh toán"
            className="w-full max-h-64 object-contain rounded-xl border border-gray-200 bg-gray-50"
          />
        </div>
      ) : (
        <div>
          {isRejected && (
            <div className="flex items-start gap-2 mb-4 p-3 bg-red-50 rounded-xl border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">Bằng chứng bị từ chối</p>
                <p className="text-xs text-red-600 mt-0.5">Lý do: {rejectedReason}</p>
                <p className="text-xs text-red-500 mt-1">Vui lòng upload lại ảnh hợp lệ.</p>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 mb-4">
            Nếu bạn đã thanh toán nhưng hệ thống chưa cập nhật, hãy upload ảnh chụp màn hình
            xác nhận chuyển khoản để admin duyệt thủ công.
          </p>

          {success && (
            <div className="flex items-center gap-2 mb-3 p-3 bg-green-50 rounded-xl border border-green-200">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              <p className="text-sm font-medium text-green-700">
                Gửi thành công! Đang chờ admin xác nhận.
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 mb-3 p-3 bg-red-50 rounded-xl border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {!file ? (
            <label
              className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                dragOver
                  ? "border-amber-400 bg-amber-50"
                  : "border-amber-200 bg-amber-50 hover:border-amber-400 hover:bg-amber-100"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                <Upload className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-sm font-medium text-gray-600">Kéo thả hoặc click để chọn ảnh</span>
              <span className="text-xs text-gray-400 mt-1">JPG, JPEG, PNG — tối đa 5MB</span>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
                onChange={(e) => { const f = e.target.files[0]; if (f) handleFileChange(f); }}
              />
            </label>
          ) : (
            <div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 mb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-800 truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveProofFile}
                  disabled={uploading}
                  className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {filePreviewUrl && (
                <img
                  src={filePreviewUrl}
                  alt="Preview"
                  className="w-full max-h-48 object-contain rounded-xl border border-gray-200 mb-3"
                />
              )}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold transition-all
              bg-amber-500 text-white hover:bg-amber-600
              disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Đang gửi...
              </span>
            ) : (
              "Gửi bằng chứng"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
