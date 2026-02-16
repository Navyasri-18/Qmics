import { useState, useEffect } from "react";
import { Plus, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import api from "../services/api";
import CreateCAPAModal from "../components/CreateCAPAModal";
import { format } from "date-fns";

const CAPA = () => {
  const [capas, setCapas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCapas = async () => {
    try {
      const { data } = await api.get("/capa");
      setCapas(data);
    } catch (error) {
      console.error("Error fetching CAPAs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapas();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/capa/${id}/status`, { status });
      fetchCapas();
    } catch {
      alert("Error updating status (Only Managers/Admins)");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
            <AlertTriangle size={12} /> Open
          </span>
        );
      case "In Progress":
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
            <Clock size={12} /> In Progress
          </span>
        );
      case "Closed":
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
            <CheckCircle size={12} /> Closed
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">CAPA Management</h1>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                setLoading(true);
                await api.post("/capa/escalate");
                alert("Escalation check completed");
                fetchCapas();
              } catch (error) {
                alert("Error triggering escalation check");
              } finally {
                setLoading(false);
              }
            }}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Clock size={18} /> Check Overdue
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={18} /> Log CAPA
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p className="text-center text-slate-500">Loading...</p>
        ) : capas.length === 0 ? (
          <p className="text-center text-slate-500">No CAPA records found.</p>
        ) : (
          capas.map((capa) => (
            <div
              key={capa._id}
              className={`bg-white p-6 rounded-xl shadow-sm border ${
                capa.escalationLevel >= 2
                  ? "border-red-500 border-2"
                  : capa.isOverdue
                    ? "border-red-200 bg-red-50"
                    : "border-slate-100"
              } flex justify-between items-center hover:shadow-md transition-shadow`}
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg text-slate-800">
                    {capa.title}
                  </h3>
                  {getStatusBadge(capa.status)}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      capa.priority === "Critical"
                        ? "bg-red-100 text-red-800"
                        : capa.priority === "High"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {capa.priority}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        capa.riskScore >= 16
                          ? "bg-red-500 text-white"
                          : capa.riskScore >= 11
                            ? "bg-orange-500 text-white"
                            : capa.riskScore >= 6
                              ? "bg-yellow-500 text-slate-800"
                              : "bg-green-500 text-white"
                      }`}
                    >
                      Risk Score: {capa.riskScore}
                    </span>
                    {capa.riskScore >= 16 && (
                      <span className="animate-pulse text-red-600 font-bold text-xs uppercase">
                        High Risk!
                      </span>
                    )}
                  </div>
                  {capa.escalationLevel > 0 && (
                    <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Escalation Lvl {capa.escalationLevel}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 mb-1 font-medium">
                  {capa.description}
                </p>
                <p className="text-slate-500 mb-2 text-sm">
                  Root Cause: {capa.rootCause}
                </p>
                <div className="flex gap-6 text-sm text-slate-500">
                  <span>
                    Created: {format(new Date(capa.createdAt), "MMM dd, yyyy")}
                  </span>
                  <span
                    className={capa.isOverdue ? "text-red-600 font-bold" : ""}
                  >
                    Due: {format(new Date(capa.dueDate), "MMM dd, yyyy")}
                  </span>
                  <span>
                    Assigned: {capa.assignedTo?.username || "Unassigned"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {capa.status !== "Closed" && (
                  <>
                    <button
                      onClick={() => updateStatus(capa._id, "In Progress")}
                      className="px-3 py-1 text-sm border border-blue-200 text-blue-600 rounded hover:bg-blue-50"
                    >
                      Start
                    </button>
                    <button
                      onClick={() => updateStatus(capa._id, "Closed")}
                      className="px-3 py-1 text-sm border border-green-200 text-green-600 rounded hover:bg-green-50"
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <CreateCAPAModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCapas}
      />
    </div>
  );
};

export default CAPA;
