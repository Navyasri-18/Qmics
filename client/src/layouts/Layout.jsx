import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import NotificationPanel from "../components/NotificationPanel";
import RoleSwitcher from "../components/RoleSwitcher";

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            Internal Governance System
          </div>
          <div className="flex items-center gap-6">
            <RoleSwitcher />
            <div className="h-6 w-[1px] bg-slate-100"></div>
            <NotificationPanel />
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
