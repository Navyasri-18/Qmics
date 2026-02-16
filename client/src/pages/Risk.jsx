import { useState, useEffect } from "react";
import { Plus, ShieldAlert, BarChart } from "lucide-react";
import api from "../services/api";
import CreateRiskModal from "../components/CreateRiskModal";
import { format } from "date-fns";

const Risk = () => {
  const [risks, setRisks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchRisks = async () => {
    try {
      const { data } = await api.get("/risk");
      setRisks(data);
    } catch (error) {
      console.error("Error fetching Risks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisks();
  }, []);

  const getRiskLevel = (rpn) => {
    if (rpn >= 200)
      return { label: "Critical", color: "bg-red-100 text-red-800" };
    if (rpn >= 100)
      return { label: "High", color: "bg-orange-100 text-orange-800" };
    if (rpn >= 50)
      return { label: "Medium", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Low", color: "bg-green-100 text-green-800" };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Risk Management (FMEA)
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> New Assessment
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p className="text-center text-slate-500">Loading...</p>
        ) : risks.length === 0 ? (
          <p className="text-center text-slate-500">
            No Risk assessments found.
          </p>
        ) : (
          risks.map((risk) => {
            const level = getRiskLevel(risk.rpn);
            return (
              <div
                key={risk._id}
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800 mb-1">
                      {risk.description}
                    </h3>
                    <div className="flex gap-4 text-sm text-slate-500">
                      <span>
                        Evaluated by: {risk.createdBy?.username || "Unknown"}
                      </span>
                      <span>
                        Date: {format(new Date(risk.createdAt), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${level.color}`}
                  >
                    {level.label} (RPN: {risk.rpn})
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                      Severity
                    </p>
                    <div className="text-xl font-bold text-slate-700">
                      {risk.severity}
                    </div>
                  </div>
                  <div className="text-center border-l border-slate-100">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                      Occurrence
                    </p>
                    <div className="text-xl font-bold text-slate-700">
                      {risk.occurrence}
                    </div>
                  </div>
                  <div className="text-center border-l border-slate-100">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                      Detection
                    </p>
                    <div className="text-xl font-bold text-slate-700">
                      {risk.detection}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <CreateRiskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchRisks}
      />
    </div>
  );
};

export default Risk;
