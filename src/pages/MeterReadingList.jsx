import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { getApartmentsByResidentEmail } from "../services/apartmentApi";
import meterReadingService from "../services/meterReadingService";
import toast from "react-hot-toast";
import {
  Gauge,
  Zap,
  Droplets,
  Flame,
  Wifi,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Search,
  Filter,
  Activity,
  Eye,
  Info,
  Camera,
  X,
  Image as ImageIcon,
  ZoomIn,
} from "lucide-react";

/* ─── Image URL resolver ───────────────────────────────── */
const BASE_API = "http://localhost:8080/building-management";
function resolveImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("blob:")) return url;
  return url.startsWith("/") ? `${BASE_API}${url}` : `${BASE_API}/${url}`;
}

/* ─── Helpers ───────────────────────────────────────────── */
const SERVICE_ICONS = {
  điện: Zap,
  nước: Droplets,
  gas: Flame,
  internet: Wifi,
  default: Gauge,
};

const SERVICE_COLORS = {
  điện: { gradient: "from-amber-400 to-orange-500", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", ring: "ring-amber-100" },
  nước: { gradient: "from-blue-400 to-cyan-500", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", ring: "ring-blue-100" },
  gas: { gradient: "from-rose-400 to-red-500", bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", ring: "ring-rose-100" },
  internet: { gradient: "from-violet-400 to-purple-500", bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200", ring: "ring-violet-100" },
  default: { gradient: "from-emerald-400 to-teal-500", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", ring: "ring-emerald-100" },
};

const STATUS_CONFIG = {
  DRAFT: { label: "Nháp", bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  CONFIRMED: { label: "Chưa thanh toán", bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-400" },
  LOCKED: { label: "Đã thanh toán", bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400" },
  UNRECORDED: { label: "Chưa ghi", bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
};

function getServiceColor(name) {
  if (!name) return SERVICE_COLORS.default;
  const lower = name.toLowerCase();
  for (const key of Object.keys(SERVICE_COLORS)) {
    if (key !== "default" && lower.includes(key)) return SERVICE_COLORS[key];
  }
  return SERVICE_COLORS.default;
}

function getServiceIcon(name) {
  if (!name) return SERVICE_ICONS.default;
  const lower = name.toLowerCase();
  for (const key of Object.keys(SERVICE_ICONS)) {
    if (key !== "default" && lower.includes(key)) return SERVICE_ICONS[key];
  }
  return SERVICE_ICONS.default;
}

function formatPeriod(period) {
  if (!period) return "";
  const [year, month] = period.split("-");
  return `Tháng ${parseInt(month)}/${year}`;
}

/* ─── Component ─────────────────────────────────────────── */
export default function MeterReadingList() {
  const { user } = useAuth();
  const [apartments, setApartments] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("ALL");
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);
  const [lightbox, setLightbox] = useState(null); // { url, title }

  // 1. Load apartments for resident
  useEffect(() => {
    if (!user?.email) return;
    const loadApartments = async () => {
      try {
        const res = await getApartmentsByResidentEmail(user.email);
        const aptList = res?.result || res?.data?.result || res || [];
        const list = Array.isArray(aptList) ? aptList : [aptList];
        setApartments(list);
        if (list.length > 0) setSelectedApartment(list[0]);
      } catch (err) {
        console.error("Error loading apartments:", err);
        toast.error("Không thể tải danh sách căn hộ");
      }
    };
    loadApartments();
  }, [user]);

  // 2. Load services
  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await meterReadingService.getServices();
        const svcList = res?.result || res?.data?.result || [];
        setServices(Array.isArray(svcList) ? svcList : []);
      } catch (err) {
        console.error("Error loading services:", err);
      }
    };
    loadServices();
  }, []);

  // 3. Load readings when apartment or period changes
  useEffect(() => {
    if (!selectedApartment?.id) return;
    const loadReadings = async () => {
      setLoading(true);
      try {
        const res = await meterReadingService.getByApartment(selectedApartment.id);
        const data = res?.result || res?.data?.result || [];
        setReadings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading readings:", err);
        toast.error("Không thể tải dữ liệu chỉ số");
      } finally {
        setLoading(false);
      }
    };
    loadReadings();
  }, [selectedApartment]);

  // Filter readings by period, service & status (only show confirmed/locked to residents)
  const filteredReadings = useMemo(() => {
    let result = readings.filter(
      (r) => r.period === period && (r.status === "CONFIRMED" || r.status === "LOCKED")
    );
    if (selectedService !== "ALL") {
      result = result.filter((r) => r.serviceId === selectedService);
    }
    return result;
  }, [readings, period, selectedService]);

  // Group by service
  const groupedByService = useMemo(() => {
    const groups = {};
    filteredReadings.forEach((r) => {
      const svc = services.find((s) => s.id === r.serviceId);
      const svcName = svc?.name || "Dịch vụ khác";
      if (!groups[r.serviceId]) {
        groups[r.serviceId] = {
          serviceId: r.serviceId,
          serviceName: svcName,
          serviceUnit: svc?.unit || "",
          billingMethod: svc?.billingMethod || "",
          readings: [],
        };
      }
      groups[r.serviceId].readings.push(r);
    });
    return Object.values(groups);
  }, [filteredReadings, services]);

  // Stats for the summary
  const stats = useMemo(() => {
    const totalServices = groupedByService.length;
    const totalUsage = filteredReadings.reduce((sum, r) => {
      const usage = r.usage ?? (r.newIndex != null ? r.newIndex - (r.oldIndex || 0) : 0);
      return sum + (usage || 0);
    }, 0);
    const confirmedCount = filteredReadings.filter(
      (r) => r.status === "CONFIRMED" || r.status === "LOCKED"
    ).length;
    return { totalServices, totalUsage, confirmedCount, totalReadings: filteredReadings.length };
  }, [filteredReadings, groupedByService]);

  // Previous period for comparison
  const prevPeriodReadings = useMemo(() => {
    const [year, month] = period.split("-").map(Number);
    const prevDate = new Date(year, month - 2, 1);
    const prevPeriod = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
    return readings.filter((r) => r.period === prevPeriod);
  }, [readings, period]);

  function getUsageTrend(serviceId) {
    const current = filteredReadings.find((r) => r.serviceId === serviceId);
    const prev = prevPeriodReadings.find((r) => r.serviceId === serviceId);
    if (!current || !prev) return null;
    const curUsage = current.usage ?? (current.newIndex - (current.oldIndex || 0));
    const prevUsage = prev.usage ?? (prev.newIndex - (prev.oldIndex || 0));
    if (prevUsage === 0) return null;
    return ((curUsage - prevUsage) / prevUsage) * 100;
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-2xl px-8 py-7 overflow-hidden shadow-lg">
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/10 rounded-full" />
        <div className="absolute bottom-0 right-24 w-32 h-32 bg-white/5 rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Gauge className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-xl font-extrabold">Chỉ số dịch vụ</h1>
              <p className="text-blue-200 text-xs font-medium">
                Theo dõi chỉ số tiêu thụ điện, nước, gas theo tháng
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-wrap items-end gap-4">
          {/* Apartment Picker */}
          {apartments.length > 1 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3 h-3" /> Căn hộ
              </label>
              <select
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all min-w-[160px]"
                value={selectedApartment?.id || ""}
                onChange={(e) => {
                  const apt = apartments.find((a) => a.id === e.target.value);
                  setSelectedApartment(apt);
                }}
              >
                {apartments.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    {apt.code}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Period Picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <CalendarDays className="w-3 h-3" /> Kỳ thanh toán
            </label>
            <input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all min-w-[160px]"
            />
          </div>

          {/* Service Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3" /> Loại dịch vụ
            </label>
            <select
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all min-w-[200px]"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="ALL">Tất cả dịch vụ</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.unit})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Stats Summary ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={BarChart3}
          label="Dịch vụ ghi nhận"
          value={stats.totalServices}
          sub={`Tổng ${stats.totalReadings} chỉ số`}
          color="bg-blue-500"
        />
        <StatCard
          icon={Activity}
          label="Tổng tiêu thụ"
          value={stats.totalUsage.toLocaleString("vi-VN")}
          sub={formatPeriod(period)}
          color="bg-emerald-500"
        />
        <StatCard
          icon={Eye}
          label="Đã xác nhận"
          value={stats.confirmedCount}
          sub={`/${stats.totalReadings} bản ghi`}
          color="bg-indigo-500"
        />
        <StatCard
          icon={CalendarDays}
          label="Kỳ hiện tại"
          value={formatPeriod(period)}
          sub={selectedApartment?.code || ""}
          color="bg-purple-500"
        />
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Đang tải dữ liệu...</p>
        </div>
      ) : groupedByService.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
            <Search className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-600">Không có dữ liệu</p>
          <p className="text-xs text-gray-400">Chưa có chỉ số nào được ghi cho {formatPeriod(period)}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedByService.map((group) => {
            const colorScheme = getServiceColor(group.serviceName);
            const ServiceIcon = getServiceIcon(group.serviceName);
            const isExpanded = expandedCard === group.serviceId;
            const trend = getUsageTrend(group.serviceId);

            return (
              <div
                key={group.serviceId}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${isExpanded ? "ring-2 " + colorScheme.ring : ""
                  }`}
              >
                {/* Card Header */}
                <div
                  className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-gray-50/50 transition-all"
                  onClick={() => setExpandedCard(isExpanded ? null : group.serviceId)}
                >
                  {/* Service Icon */}
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${colorScheme.gradient} rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0`}
                  >
                    <ServiceIcon className="w-6 h-6 text-white" />
                  </div>

                  {/* Service Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-800">{group.serviceName}</h3>
                      {group.serviceUnit && (
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${colorScheme.bg} ${colorScheme.text}`}>
                          {group.serviceUnit}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {group.readings.length} bản ghi · {group.billingMethod === "TIER" ? "Theo bậc" : group.billingMethod === "AREA" ? "Theo diện tích" : "Cố định"}
                    </p>
                  </div>

                  {/* Usage Summary */}
                  <div className="flex items-center gap-4 mr-2">
                    {group.billingMethod === "TIER" && group.readings.length > 0 && (
                      <div className="text-right">
                        <p className="text-lg font-extrabold text-gray-800">
                          {group.readings.reduce((sum, r) => {
                            const usage = r.usage ?? (r.newIndex != null ? r.newIndex - (r.oldIndex || 0) : 0);
                            return sum + (usage || 0);
                          }, 0).toLocaleString("vi-VN")}
                        </p>
                        <div className="flex items-center gap-1 justify-end">
                          <span className="text-[11px] text-gray-400">{group.serviceUnit}</span>
                          {trend !== null && (
                            <TrendBadge trend={trend} />
                          )}
                        </div>
                      </div>
                    )}
                    <div className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-100">
                    {group.readings.map((reading, idx) => (
                      <ReadingRow
                        key={reading.id}
                        reading={reading}
                        colorScheme={colorScheme}
                        billingMethod={group.billingMethod}
                        unit={group.serviceUnit}
                        isLast={idx === group.readings.length - 1}
                        onViewPhoto={(url, title) => setLightbox({ url, title })}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Info Note ── */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-semibold text-blue-700">Lưu ý</p>
          <p className="text-xs text-blue-600 mt-0.5">
            Các chỉ số được ghi nhận bởi ban quản lý tòa nhà. Nếu phát hiện sai sót, vui lòng liên hệ ban quản lý để kiểm tra lại.
          </p>
        </div>
      </div>

      {/* ── Photo Lightbox Modal ── */}
      {lightbox && (
        <PhotoLightbox
          url={lightbox.url}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Sub-components                                            */
/* ────────────────────────────────────────────────────────── */

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-extrabold text-gray-900 leading-tight truncate">{value}</p>
        <p className="text-[11px] text-gray-400 font-medium">{label}</p>
        {sub && <p className="text-[10px] text-gray-300 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

function TrendBadge({ trend }) {
  if (trend === null || trend === undefined) return null;
  const isUp = trend > 0;
  const isFlat = Math.abs(trend) < 1;

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isFlat
        ? "bg-gray-100 text-gray-500"
        : isUp
          ? "bg-red-50 text-red-500"
          : "bg-green-50 text-green-600"
        }`}
    >
      {isFlat ? (
        <Minus className="w-2.5 h-2.5" />
      ) : isUp ? (
        <TrendingUp className="w-2.5 h-2.5" />
      ) : (
        <TrendingDown className="w-2.5 h-2.5" />
      )}
      {Math.abs(trend).toFixed(0)}%
    </span>
  );
}

function ReadingRow({ reading, colorScheme, billingMethod, unit, isLast, onViewPhoto }) {
  const usage = reading.usage ?? (reading.newIndex != null ? reading.newIndex - (reading.oldIndex || 0) : 0);
  const statusCfg = STATUS_CONFIG[reading.status] || STATUS_CONFIG.DRAFT;
  const photoUrl = resolveImageUrl(reading.photoUrl);

  return (
    <div className={`px-6 py-4 ${!isLast ? "border-b border-gray-50" : ""} hover:bg-gray-50/50 transition-colors`}>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        {/* Apartment Info */}
        <div className="min-w-[120px]">
          <p className="text-xs text-gray-400 font-medium">Căn hộ</p>
          <p className="text-sm font-bold text-gray-800">{reading.apartmentCode || "—"}</p>
        </div>

        {billingMethod === "TIER" ? (
          <>
            {/* Old Index */}
            <div className="text-center min-w-[80px]">
              <p className="text-xs text-gray-400 font-medium">Chỉ số cũ</p>
              <p className="text-sm font-semibold text-gray-600">{reading.oldIndex?.toLocaleString("vi-VN") ?? "—"}</p>
            </div>

            {/* New Index */}
            <div className="text-center min-w-[80px]">
              <p className="text-xs text-gray-400 font-medium">Chỉ số mới</p>
              <p className="text-sm font-bold text-gray-800">{reading.newIndex?.toLocaleString("vi-VN") ?? "—"}</p>
            </div>

            {/* Usage */}
            <div className="text-center min-w-[100px]">
              <p className="text-xs text-gray-400 font-medium">Tiêu thụ</p>
              <p className={`text-base font-extrabold ${usage < 0 ? "text-red-500" : colorScheme.text}`}>
                {usage.toLocaleString("vi-VN")} <span className="text-[10px] font-medium text-gray-400">{unit}</span>
              </p>
            </div>
          </>
        ) : (
          <div className="min-w-[120px]">
            <p className="text-xs text-gray-400 font-medium">Hình thức tính</p>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${colorScheme.bg} ${colorScheme.text}`}>
              {billingMethod === "AREA" ? "Theo diện tích" : "Cố định"}
            </span>
          </div>
        )}

        {/* Status */}
        <div className="text-center min-w-[100px]">
          <p className="text-xs text-gray-400 font-medium">Trạng thái</p>
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full mt-0.5 ${statusCfg.bg} ${statusCfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            {statusCfg.label}
          </span>
        </div>

        {/* Photo Evidence */}
        <div className="min-w-[80px] text-center">
          <p className="text-xs text-gray-400 font-medium">Ảnh bằng chứng</p>
          {photoUrl ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewPhoto?.(photoUrl, `${reading.apartmentCode} – ${reading.period}`);
              }}
              className="group relative mt-1 inline-block rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-md"
              title="Xem ảnh bằng chứng"
            >
              <img
                src={photoUrl}
                alt="Ảnh bằng chứng"
                className="w-14 h-14 object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="w-14 h-14 bg-gray-100 items-center justify-center hidden">
                <ImageIcon className="w-5 h-5 text-gray-400" />
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ) : (
            <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-gray-300">
              <Camera className="w-3.5 h-3.5" />
              <span>Không có</span>
            </div>
          )}
        </div>

        {/* Note */}
        {reading.note && (
          <div className="flex-1 min-w-[120px]">
            <p className="text-xs text-gray-400 font-medium">Ghi chú</p>
            <p className="text-xs text-gray-500 mt-0.5">{reading.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Photo Lightbox ────────────────────────────────────── */
function PhotoLightbox({ url, title, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Content */}
      <div
        className="relative z-10 max-w-3xl w-full mx-4 animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-white/70" />
            <span className="text-sm font-semibold text-white/90">
              {title || "Ảnh bằng chứng"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Image */}
        <div className="bg-black/40 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <img
            src={url}
            alt="Ảnh bằng chứng"
            className="w-full max-h-[75vh] object-contain"
            onError={(e) => {
              e.target.src = "";
              e.target.alt = "Không thể tải ảnh";
              e.target.className = "w-full h-64 flex items-center justify-center text-gray-400";
            }}
          />
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-white/40 mt-3">
          Nhấn ESC hoặc click bên ngoài để đóng
        </p>
      </div>

      {/* Animation style */}
      <style>{`
        .animate-in {
          animation: lightbox-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes lightbox-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
