export default function NoteCard({ note, setNote }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Ghi chú</label>
      <textarea
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Nhập ghi chú bổ sung (nếu có)..."
        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none transition-all"
      />
    </div>
  );
}