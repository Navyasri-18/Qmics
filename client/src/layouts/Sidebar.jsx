import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  ShieldAlert,
  GitBranch,
  Layers,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { path: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/documents", icon: <FileText size={20} />, label: "Documents" },
    { path: "/capa", icon: <AlertTriangle size={20} />, label: "CAPA" },
    { path: "/risk", icon: <ShieldAlert size={20} />, label: "Risk Mgmt" },
    {
      path: "/process-flow",
      icon: <Layers size={20} />,
      label: "Process Flow",
    },
    { path: "/projects", icon: <GitBranch size={20} />, label: "Projects" },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-blue-400">Qmics</h1>
        <p className="text-xs text-slate-400 mt-1">Quality Management System</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="mb-4 px-4">
          <p className="text-sm font-semibold text-white">
            {user?.username || "User"}
          </p>
          <p className="text-xs text-slate-500 capitalize">
            {user?.role || "Guest"}
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
