import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar({ navItems }) {
  const location = useLocation();

  return (
    <aside className="w-60 min-h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                ${isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <Icon size={18} />
              <span className="flex-1">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}