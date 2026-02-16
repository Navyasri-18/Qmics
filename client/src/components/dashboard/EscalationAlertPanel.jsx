import React from "react";
import { AlertCircle, ChevronRight, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const EscalationAlertPanel = ({ highRiskCapas = [], escalatedCapas = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <AlertCircle className="text-red-500" size={20} />
          High Priority Alerts
        </h3>
        <Link
          to="/capa"
          className="text-xs text-blue-600 hover:underline flex items-center"
        >
          View All <ChevronRight size={12} />
        </Link>
      </div>

      <div className="p-4 space-y-4">
        {/* Escalated Items */}
        {escalatedCapas.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Escalated ({escalatedCapas.length})
            </p>
            <div className="space-y-2">
              {escalatedCapas.slice(0, 5).map((capa) => (
                <div
                  key={capa._id}
                  className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3"
                >
                  <ShieldAlert className="text-red-600 shrink-0" size={18} />
                  <div>
                    <h4 className="text-sm font-semibold text-red-900 line-clamp-1">
                      {capa.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 bg-red-200 text-red-800 rounded">
                        Level {capa.escalationLevel}
                      </span>
                      <span className="text-[10px] text-red-600">
                        Due: {new Date(capa.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* High Risk Items */}
        {highRiskCapas.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              High Risk ({highRiskCapas.length})
            </p>
            <div className="space-y-2">
              {highRiskCapas.slice(0, 5).map((capa) => (
                <div
                  key={capa._id}
                  className="p-3 bg-orange-50 border border-orange-100 rounded-lg flex items-start gap-3"
                >
                  <AlertCircle className="text-orange-600 shrink-0" size={18} />
                  <div>
                    <h4 className="text-sm font-semibold text-orange-900 line-clamp-1">
                      {capa.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 bg-orange-200 text-orange-800 rounded">
                        Risk: {capa.riskScore}
                      </span>
                      <span className="text-[10px] text-orange-600">
                        Priority: {capa.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {escalatedCapas.length === 0 && highRiskCapas.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-3">
              <ShieldAlert size={24} />
            </div>
            <p className="text-sm text-slate-500 font-medium">
              No critical alerts found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EscalationAlertPanel;
