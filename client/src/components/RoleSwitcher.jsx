import { useAuth } from "../context/AuthContext";
import { User, ChevronDown } from "lucide-react";

const RoleSwitcher = () => {
  const { user, setUser } = useAuth();
  const roles = [
    "CEO",
    "Director",
    "DeptHead",
    "Engineer",
    "Admin",
    "Quality Manager",
  ];

  const handleRoleChange = (e) => {
    // Simulated role switch by updating context state
    setUser({ ...user, role: e.target.value });
  };

  return (
    <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
      <User size={14} className="text-blue-400" />
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        Simulate Role:
      </span>
      <select
        value={user?.role || "Engineer"}
        onChange={handleRoleChange}
        className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer appearance-none pr-4"
      >
        {roles.map((role) => (
          <option key={role} value={role} className="bg-slate-900 text-white">
            {role}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoleSwitcher;
