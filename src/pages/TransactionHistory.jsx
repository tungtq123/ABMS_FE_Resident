import { useState, useEffect, useContext, useRef } from "react";
import {
  CreditCard, CheckCircle, Calendar, Home, DollarSign,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { getBillsByUser } from "../services/billService";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "decimal", minimumFractionDigits: 0 }).format(amount || 0) + " đ";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const toCode = ({ year, month }) =>
  `${year}-${String(month + 1).padStart(2, "0")}`;

function MonthPicker({ value, onChange }) {
  const now = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    value ? parseInt(value.split("-")[0]) : now.getFullYear()
  );
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayLabel = value
    ? `${MONTHS[parseInt(value.split("-")[1]) - 1]} ${value.split("-")[0]}`
    : "-- ----";

  return (
    <div className="relative" ref={ref}>
      <label className="text-xs text-gray-500 block mb-1">Tháng (Kỳ cước)</label>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all min-w-40"
      >
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="flex-1 text-left">{displayLabel}</span>
        <Calendar className="w-4 h-4 text-gray-400" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 min-w-60">
          {/* Year navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setViewYear((y) => y - 1)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <span className="text-sm font-semibold text-gray-800">{viewYear}</span>
            <button
              onClick={() => setViewYear((y) => y + 1)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-4 gap-1 mb-3">
            {MONTHS.map((m, i) => {
              const code = toCode({ year: viewYear, month: i });
              const isSelected = code === value;
              return (
                <button
                  key={m}
                  onClick={() => { onChange(code); setOpen(false); }}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <button
              onClick={() => { onChange(null); setOpen(false); }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear
            </button>
            <button
              onClick={() => {
                onChange(toCode({ year: now.getFullYear(), month: now.getMonth() }));
                setOpen(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              This month
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TransactionRow({ bill }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Main row */}
      <div className="p-5 flex items-center gap-5">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Kỳ hóa đơn</p>
            <p className="text-sm font-semibold text-gray-900">{bill.periodCode}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Căn hộ</p>
            <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Home className="w-3 h-3" />
              {bill.apartmentCode}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Ngày phát hành</p>
            <p className="text-sm text-gray-700 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(bill.issuedAt)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Số tiền</p>
            <p className="text-sm font-bold text-green-600">{formatCurrency(bill.totalAmount)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            Đã thanh toán
          </span>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            {expanded
              ? <><ChevronUp className="w-4 h-4" /> Ẩn</>
              : <><ChevronDown className="w-4 h-4" /> Chi tiết</>}
          </button>
        </div>
      </div>

      {/* Detail panel */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Chi tiết các khoản phí</p>
          <div className="space-y-2 mb-4">
            {(bill.details || []).map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-100">
                <div>
                  <p className="text-sm text-gray-800 font-medium">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.quantity} × {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.totalLine)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Hạn thanh toán: <span className="font-medium text-gray-700">{formatDate(bill.dueDate)}</span>
            </div>
            <div className="text-right">
              {bill.taxTotal > 0 && (
                <p className="text-xs text-gray-500">Thuế: {formatCurrency(bill.taxTotal)}</p>
              )}
              <p className="text-sm font-bold text-green-700">Tổng: {formatCurrency(bill.totalAmount)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TransactionHistory() {
  const { user } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    const load = async () => {
      try {
        const res = await getBillsByUser(user.id, { status: "PAID", size: 100 });
        setBills(res.result?.data || []);
      } catch (err) {
        console.error("Failed to load transaction history", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const filtered = selectedMonth
    ? bills.filter((b) => b.periodCode === selectedMonth)
    : bills;

  const totalAmount = filtered.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-linear-to-r from-green-600 to-green-700 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">Lịch sử giao dịch</h1>
              <p className="text-green-100 text-sm">Các hóa đơn đã thanh toán thành công</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Filter */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5">
          <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />
        </div>

        {/* Summary */}
        {!loading && (
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Số giao dịch</p>
                <p className="text-2xl font-bold text-gray-900">{filtered.length}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">Tổng đã thanh toán</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-16 text-gray-500">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Không có giao dịch nào</h3>
            <p className="text-gray-500">Thử chọn tháng khác</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((bill) => (
              <TransactionRow key={bill.id} bill={bill} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
