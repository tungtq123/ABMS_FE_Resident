import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Bell,
  Wrench,
  MessageSquare,
  Building2,
} from "lucide-react";

export const residentNav  = [
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

export const managerNav = [
  { label: "Quản lý tòa nhà", icon: Building2, path: "/building" },
];