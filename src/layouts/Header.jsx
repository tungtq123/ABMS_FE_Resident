import { Bell, ChevronDown, Building2, LogOut, User, Settings, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../services/authApi";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  // Dữ liệu mẫu thông báo
  const notifications = [
    { id: 1, title: "Hóa đơn tháng 2 đã đến hạn", time: "2 giờ trước", unread: true },
    { id: 2, title: "Thanh toán đã được duyệt", time: "1 ngày trước", unread: true },
    { id: 3, title: "Bảo trì thang máy", time: "3 ngày trước", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMyProfile(token);
        // Map đúng vào trường "result" của JSON bạn đưa
        console.log(response);
        if (response && response.result) {
          setUserData(response.result);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-blue-600 h-16 flex items-center px-6 shadow-lg z-50 fixed top-0 left-0 right-0">
      <div className="flex items-center justify-between w-full">

        {/* Left: Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => navigate("/")}>
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-md">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="leading-tight">
            <p className="text-white font-bold text-[15px] tracking-wide uppercase">Building Pro</p>
            <p className="text-blue-200 text-[11px]">Hệ thống quản lý thông minh</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          
          {/* Bell */}
          <div className="relative">
            <button onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }} className="p-2.5 rounded-xl hover:bg-blue-500 transition-all">
              <Bell className="w-5 h-5 text-white" />
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-400 rounded-full text-white text-[9px] font-bold flex items-center justify-center border-2 border-blue-600">{unreadCount}</span>}
            </button>
            {/* ... Dropdown thông báo giữ nguyên ... */}
          </div>

          <div className="w-px h-7 bg-blue-400 mx-1" />

          {/* User dropdown trigger */}
          <div className="relative">
            <button
              onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-500 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm overflow-hidden text-blue-600 font-bold">
                {userData?.fullName?.charAt(0) || <User className="w-4 h-4" />}
              </div>
              
              <div className="text-left leading-tight hidden sm:block">
                <p className="text-white text-sm font-semibold">
                  {loading ? "Đang tải..." : userData?.fullName || "Người dùng"}
                </p>
                {/* LOGIC HIỂN THỊ MỚI Ở ĐÂY */}
                <p className="text-blue-100 text-[10px] opacity-90">
                  {loading ? "..." : (
                    userData ? (
                      `${userData.role} • ${userData.buildingName} • Tầng ${userData.floorNumber} (P.${userData.apartmentCode})`
                    ) : "Chưa đăng nhập"
                  )}
                </p>
              </div>

              <ChevronDown className={`w-4 h-4 text-blue-200 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20">
                  <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-blue-100 border-b border-blue-100">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{userData?.role}</p>
                    <p className="text-sm font-black text-gray-800 truncate">{userData?.fullName}</p>
                    <p className="text-[11px] text-gray-500 truncate">{userData?.email}</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all">
                      <User className="w-4 h-4 text-gray-400" /> Hồ sơ cá nhân
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all">
                      <Settings className="w-4 h-4 text-gray-400" /> Cài đặt hệ thống
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all">
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}