import Sidebar from "../layouts/Sidebar";
import { managerNav } from "../layouts/Navigation";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
export default function ManagerLayout() {

    return (
        <div>
          {/* Header */}
          <Header />
    
          {/* Content */}
          {/* Sidebar: fixed, ben trai, ben duoi header */}
          <aside className="fixed top-16 left-0 w-60 h-[calc(100vh-4rem)] overflow-y-auto z-40 bg-white border-r border-gray-200 shadow-sm">
      <Sidebar navItems={managerNav} />
          </aside>
          <div className="pt-16 pl-60 min-h-screen flex flex-col">
            <main className="flex-1 p-6">
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
      );

}