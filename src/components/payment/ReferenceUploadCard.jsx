import { Camera, X } from "lucide-react";

export default function ReferenceUploadCard({ selectedFile, previewUrl, onFileSelect, onRemoveFile }) {
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
                <p className="text-xs font-medium text-gray-800 truncate max-w-[120px]">{selectedFile.name}</p>
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