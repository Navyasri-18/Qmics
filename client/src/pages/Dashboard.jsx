import { useEffect, useState, useCallback } from "react";
import {
  FileText,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  Clock,
  Briefcase,
  TrendingUp,
  Activity,
  Users as UsersIcon,
} from "lucide-react";
import api from "../services/api";
import StatCard from "../components/dashboard/StatCard";
import RiskDistributionChart from "../components/dashboard/RiskDistributionChart";
import MonthlyTrendChart from "../components/dashboard/MonthlyTrendChart";
import EscalationAlertPanel from "../components/dashboard/EscalationAlertPanel";
import CAPAStatusChart from "../components/dashboard/CAPAStatusChart";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [riskData, setRiskData] = useState({});
  const [trends, setTrends] = useState({});
  const [criticalItems, setCriticalItems] = useState({
    highRisk: [],
    escalated: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      const [metricsRes, riskRes, trendsRes, capaRes] = await Promise.all([
        api.get("/dashboard/metrics"),
        api.get("/dashboard/risk-distribution"),
        api.get("/dashboard/monthly-trends"),
        api.get("/capa"),
      ]);

      setMetrics(metricsRes.data);
      setRiskData(riskRes.data);
      setTrends(trendsRes.data);

      const escalated = capaRes.data.filter(
        (c) => c.status === "Escalated" || c.escalationLevel >= 2,
      );
      const highRisk = capaRes.data
        .filter((c) => c.riskScore >= 16)
        .sort((a, b) => b.riskScore - a.riskScore);

      setCriticalItems({
        highRisk: highRisk.slice(0, 5),
        escalated: escalated.slice(0, 5),
      });

      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
      setError("Failed to load dashboard data. Please try again later.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const renderDashboardByRole = () => {
    switch (user?.role) {
      case "CEO":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Overall Health"
                value={
                  metrics?.totalCapa > 0
                    ? Math.round(
                        (1 - metrics?.overdueCapa / metrics?.totalCapa) * 100,
                      )
                    : 100
                }
                suffix="%"
                icon={<TrendingUp className="text-purple-600" />}
                color="bg-purple-100"
              />
              <StatCard
                title="Total CAPA"
                value={metrics?.totalCapa}
                icon={<FileText className="text-blue-500" />}
                color="bg-blue-100"
              />
              <StatCard
                title="Overdue Items"
                value={metrics?.overdueCapa}
                icon={<Clock className="text-red-500" />}
                color="bg-red-100"
              />
              <StatCard
                title="Escalations"
                value={metrics?.escalatedCapa}
                icon={<ShieldAlert className="text-red-800" />}
                color="bg-red-200"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 font-inter">
                <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                  <TrendingUp size={18} className="text-green-500" /> Enterprise
                  Performance Trends
                </h3>
                <MonthlyTrendChart data={trends} />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                  <ShieldAlert size={18} className="text-orange-500" /> Global
                  Risk Heatmap
                </h3>
                <RiskDistributionChart data={riskData} />
              </div>
            </div>
            <EscalationAlertPanel
              highRiskCapas={criticalItems.highRisk}
              escalatedCapas={criticalItems.escalated}
            />
          </div>
        );
      case "Director":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Escalation Rate"
                value={
                  metrics?.totalCapa > 0
                    ? Math.round(
                        (metrics?.escalatedCapa / metrics?.totalCapa) * 100,
                      )
                    : 0
                }
                suffix="%"
                icon={<ShieldAlert className="text-red-800" />}
                color="bg-red-100"
              />
              <StatCard
                title="Avg Closure Time"
                value={metrics?.avgTimeToClose || 0}
                suffix=" Days"
                icon={<CheckCircle className="text-green-600" />}
                color="bg-green-100"
              />
              <StatCard
                title="High Risk Count"
                value={metrics?.highRiskCapaCount}
                icon={<AlertTriangle className="text-orange-500" />}
                color="bg-orange-100"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-700 mb-6">
                  CAPA Status Summary
                </h3>
                <CAPAStatusChart data={metrics} />
              </div>
              <div className="lg:col-span-1">
                <EscalationAlertPanel
                  highRiskCapas={criticalItems.highRisk}
                  escalatedCapas={criticalItems.escalated}
                />
              </div>
            </div>
          </div>
        );
      case "DeptHead":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                title="Team CAPAs"
                value={metrics?.totalCapa}
                icon={<UsersIcon size={20} className="text-blue-500" />}
                color="bg-blue-50"
              />
              <StatCard
                title="Pending Review"
                value={metrics?.openCapa}
                icon={<Clock size={20} className="text-orange-500" />}
                color="bg-orange-50"
              />
              <StatCard
                title="Approved Docs"
                value={metrics?.approvedDocuments}
                icon={<CheckCircle size={20} className="text-green-500" />}
                color="bg-green-50"
              />
              <StatCard
                title="Drafts"
                value={metrics?.draftDocuments}
                icon={<FileText size={20} className="text-slate-500" />}
                color="bg-slate-50"
              />
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-700 mb-6">
                Department Status Distribution
              </h3>
              <CAPAStatusChart data={metrics} />
            </div>
          </div>
        );
      default: // Engineer
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="My Assignments"
                value={metrics?.totalCapa}
                icon={<Briefcase size={20} className="text-indigo-500" />}
                color="bg-indigo-50"
              />
              <StatCard
                title="My Due Tasks"
                value={metrics?.openCapa}
                icon={<Clock size={20} className="text-amber-500" />}
                color="bg-amber-50"
              />
              <StatCard
                title="Overdue"
                value={metrics?.overdueCapa}
                icon={<AlertTriangle size={20} className="text-red-500" />}
                color="bg-red-50"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-700 mb-6">
                  My Tasks Progress
                </h3>
                <CAPAStatusChart data={metrics} />
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center py-10">
                <Activity size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium">
                  Engineer Daily Activity Visualization
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 uppercase tracking-tight">
            Governance Dashboard{" "}
            <span className="text-blue-500">/ {user?.role}</span>
          </h1>
          <p className="text-slate-500 mt-1">
            {user?.role === "CEO"
              ? "Strategic Enterprise Overview"
              : "Operational Management System"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
          <Activity size={14} className="text-green-500 animate-pulse" />
          Live updates every 60s
        </div>
      </div>
      {renderDashboardByRole()}
    </div>
  );
};

export default Dashboard;
