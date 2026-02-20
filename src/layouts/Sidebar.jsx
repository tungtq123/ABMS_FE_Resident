import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Bell,
  Wrench,
  MessageSquare,
  ChevronRight,
  Building2,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  {
    label: "Tổng quan",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Hóa đơn",
    icon: FileText,
    path: "payment/bill-list",
    badge: 3, // số hóa đơn chưa thanh toán
  },
  {
    label: "Thanh toán",
    icon: CreditCard,
    path: "/payments",
  },
  {
    label: "Thông báo",
    icon: Bell,
    path: "/notifications",
    badge: 2,
  },
  {
    label: "Yêu cầu sửa chữa",
    icon: Wrench,
    path: "/maintenance",
  },
  {
    label: "Liên hệ & Hỗ trợ",
    icon: MessageSquare,
    path: "/support",
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 min-h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">

      {/* Unit info card */}
      <div className="mx-3 mt-4 mb-2 bg-blue-600 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-4 h-4 text-blue-200" />
          <span className="text-blue-200 text-xs font-medium">Căn hộ của bạn</span>
        </div>
        <p className="text-white font-bold text-base leading-tight">Tầng 5 - Phòng 502</p>
        <p className="text-blue-200 text-xs mt-0.5">Tòa nhà The Manor</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150 group
                ${isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              <Icon
                className={`w-4.5 h-4.5 flex-shrink-0 transition-colors ${
                  isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                }`}
                size={18}
              />
              <span className="flex-1">{item.label}</span>

              {/* Badge */}
              {item.badge && (
                <span className="w-5 h-5 bg-red-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item?.badge}
                </span>
              )}

              {/* Active indicator chevron */}
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom divider */}
      <div className="border-t border-gray-100 mx-3 mb-3" />

      {/* Version info */}
      <div className="px-4 pb-4 text-center">
        <p className="text-[10px] text-gray-300 font-medium">v1.0.0 • Building Management</p>
      </div>
    </aside>
  );
}