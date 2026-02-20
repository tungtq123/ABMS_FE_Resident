export default function ReferenceCard({ referenceNumber, setReferenceNumber }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <label className="block text-sm font-semibold text-gray-800 mb-3">
        Mã giao dịch
      </label>
      <input
        type="text"
        value={referenceNumber}
        onChange={(e) => setReferenceNumber(e.target.value)}
        placeholder="Nhập mã giao dịch (nếu có)"
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
      />
    </div>
  );
}