import { useNavigate } from "react-router-dom";
import {
  FileText, CreditCard, Wrench, Bell,
  ChevronRight, AlertCircle, CheckCircle2,
  Clock, TrendingUp, Home, Zap, Droplets, Flame,
  Calendar, ArrowUpRight,
} from "lucide-react";

/* ─── mock data ─────────────────────────────────────── */
const user = { name: "Nguyễn Văn A", unit: "Phòng 502", floor: "Tầng 5", building: "The Manor" };

const stats = [
  { label: "Hóa đơn chưa trả", value: "2", sub: "Cần thanh toán", color: "bg-red-500", icon: FileText },
  { label: "Tổng tiền cần trả", value: "3.200.000đ", sub: "2 hóa đơn", color: "bg-orange-500", icon: CreditCard },
  { label: "Yêu cầu đang xử lý", value: "1", sub: "Sửa chữa", color: "bg-blue-500", icon: Wrench },
  { label: "Thông báo mới", value: "3", sub: "Chưa đọc", color: "bg-purple-500", icon: Bell },
];

const bills = [
  { id: "HD-2025-02", name: "Hóa đơn tháng 2/2025", amount: "1.500.000đ", due: "28/02/2025", status: "unpaid" },
  { id: "HD-2025-01", name: "Hóa đơn tháng 1/2025", amount: "1.700.000đ", due: "31/01/2025", status: "pending" },
  { id: "HD-2024-12", name: "Hóa đơn tháng 12/2024", amount: "1.600.000đ", due: "31/12/2024", status: "paid" },
];

const utilities = [
  { label: "Điện", value: "248 kWh", amount: "620.000đ", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50" },
  { label: "Nước", value: "18 m³", amount: "180.000đ", icon: Droplets, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Gas", value: "8 kg", amount: "280.000đ", icon: Flame, color: "text-red-500", bg: "bg-red-50" },
];

const notifications = [
  { id: 1, title: "Hóa đơn tháng 2 đã đến hạn", time: "2 giờ trước", type: "warning", read: false },
  { id: 2, title: "Thanh toán tháng 12 đã được duyệt", time: "1 ngày trước", type: "success", read: false },
  { id: 3, title: "Bảo trì thang máy ngày 25/02", time: "2 ngày trước", type: "info", read: true },
];

const quickActions = [
  { label: "Thanh toán hóa đơn", icon: CreditCard, color: "bg-blue-600 hover:bg-blue-700", path: "/bills" },
  { label: "Xem tất cả hóa đơn", icon: FileText, color: "bg-white hover:bg-gray-50 border border-gray-200 !text-gray-700", path: "/bills" },
  { label: "Yêu cầu sửa chữa", icon: Wrench, color: "bg-white hover:bg-gray-50 border border-gray-200 !text-gray-700", path: "/maintenance" },
];

/* ─── helpers ────────────────────────────────────────── */
const statusConfig = {
  unpaid:  { label: "Chưa thanh toán", bg: "bg-red-50",     text: "text-red-600",    dot: "bg-red-400",    icon: AlertCircle },
  pending: { label: "Chờ xác nhận",    bg: "bg-yellow-50",  text: "text-yellow-600", dot: "bg-yellow-400", icon: Clock },
  paid:    { label: "Đã thanh toán",   bg: "bg-green-50",   text: "text-green-600",  dot: "bg-green-400",  icon: CheckCircle2 },
};

const notifConfig = {
  warning: { dot: "bg-orange-400", bg: "bg-orange-50" },
  success: { dot: "bg-green-400",  bg: "bg-green-50" },
  info:    { dot: "bg-blue-400",   bg: "bg-blue-50" },
};

/* ─── component ──────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Chào buổi sáng";
    if (h < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <div className="space-y-6">

      {/* ── Welcome Banner ── */}
      <div className="relative bg-blue-600 rounded-2xl px-8 py-7 overflow-hidden shadow-lg">
        {/* decorative circles */}
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-blue-500 rounded-full opacity-40" />
        <div className="absolute bottom-0 right-24 w-32 h-32 bg-blue-700 rounded-full opacity-30" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">{greeting()},</p>
            <h1 className="text-white text-2xl font-extrabold mb-1">{user.name} 👋</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <Home className="w-3.5 h-3.5 text-blue-200" />
                <span className="text-white text-xs font-medium">{user.unit} · {user.floor} · {user.building}</span>
              </div>
            </div>
          </div>

          {/* Quick actions on banner */}
          <div className="hidden md:flex flex-col gap-2">
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.path)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm ${a.color}`}
              >
                <a.icon className="w-4 h-4" />
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 leading-tight">{s.value}</p>
                <p className="text-xs text-gray-400 font-medium">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Main content: 2 columns ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT: Bills + Utilities (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">

          {/* Bills */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h2 className="font-bold text-gray-900 text-sm">Hóa đơn gần đây</h2>
              </div>
              <button
                onClick={() => navigate("/bills")}
                className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
              >
                Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-gray-50">
              {bills.map((bill) => {
                const cfg = statusConfig[bill.status];
                const Icon = cfg.icon;
                return (
                  <div
                    key={bill.id}
                    onClick={() => navigate(`/bills/${bill.id}/payment`)}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-all group"
                  >
                    <div className={`w-9 h-9 ${cfg.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${cfg.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{bill.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-400">Hạn: {bill.due}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900">{bill.amount}</p>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 ${cfg.bg} ${cfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors ml-1" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Utilities this month */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h2 className="font-bold text-gray-900 text-sm">Chi tiêu tháng này</h2>
              </div>
              <span className="text-xs text-gray-400 font-medium">Tháng 2/2025</span>
            </div>

            <div className="grid grid-cols-3 divide-x divide-gray-100">
              {utilities.map((u) => {
                const Icon = u.icon;
                return (
                  <div key={u.label} className="px-6 py-5 flex flex-col items-center gap-2 text-center">
                    <div className={`w-11 h-11 ${u.bg} rounded-2xl flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${u.color}`} />
                    </div>
                    <p className="text-xs font-semibold text-gray-500">{u.label}</p>
                    <p className="text-sm font-bold text-gray-800">{u.amount}</p>
                    <p className="text-xs text-gray-400">{u.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Notifications (1/3 width) */}
        <div className="space-y-6">

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <h2 className="font-bold text-gray-900 text-sm">Thông báo</h2>
              </div>
              <span className="w-5 h-5 bg-red-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {notifications.map((n) => {
                const cfg = notifConfig[n.type];
                return (
                  <div
                    key={n.id}
                    className={`px-5 py-3.5 flex gap-3 items-start hover:bg-gray-50 cursor-pointer transition-all ${!n.read ? cfg.bg + "/40" : ""}`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? cfg.dot : "bg-gray-200"}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-snug ${!n.read ? "font-semibold text-gray-800" : "font-medium text-gray-500"}`}>
                        {n.title}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-3 border-t border-gray-100 text-center">
              <button
                onClick={() => navigate("/notifications")}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Xem tất cả thông báo
              </button>
            </div>
          </div>

          {/* Apartment Info Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 shadow-md text-white relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-blue-500 rounded-full opacity-30" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-4 h-4 text-blue-200" />
                <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider">Thông tin căn hộ</p>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Căn hộ", value: user.unit },
                  { label: "Tầng", value: user.floor },
                  { label: "Tòa nhà", value: user.building },
                  { label: "Trạng thái", value: "Đang cư trú" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-blue-200 text-xs">{row.label}</span>
                    <span className="text-white text-xs font-bold">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile quick actions */}
          <div className="md:hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Thao tác nhanh</p>
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${a.color}`}
              >
                <a.icon className="w-4 h-4" />
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}