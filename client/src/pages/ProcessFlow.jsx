import { useState } from "react";
import {
  ArrowRight,
  Info,
  CheckCircle,
  Clock,
  AlertCircle,
  ShieldCheck,
  Package,
  Users,
  Search,
  PenTool,
  Code,
  TestTube,
  Eye,
  Truck,
  Handshake,
  MessageSquare,
} from "lucide-react";

const ProcessFlow = () => {
  const [selectedStage, setSelectedStage] = useState(null);

  const sections = [
    {
      title: "1️⃣ INWARD",
      color: "blue",
      stages: [
        {
          id: "mr",
          name: "Material Requirement",
          status: "Completed",
          count: 12,
          icon: <Package />,
          dept: "Planning",
          role: "Planning Manager",
          risk: "Low",
        },
        {
          id: "vs",
          name: "Vendor Selection",
          status: "Approved",
          count: 3,
          icon: <Search />,
          dept: "Procurement",
          role: "Purchase Officer",
          risk: "Medium",
        },
        {
          id: "pa",
          name: "Procurement Approval",
          status: "In Progress",
          count: 5,
          icon: <CheckCircle />,
          dept: "Finance",
          role: "Director",
          risk: "Low",
        },
        {
          id: "iqi",
          name: "Incoming Quality Inspection",
          status: "Pending",
          count: 8,
          icon: <ShieldCheck />,
          dept: "Quality",
          role: "QA Engineer",
          risk: "High",
        },
        {
          id: "ie",
          name: "Inventory Entry",
          status: "Pending",
          count: 0,
          icon: <ArrowRight />,
          dept: "Warehouse",
          role: "Store Keeper",
          risk: "Low",
        },
      ],
    },
    {
      title: "2️⃣ IN PROCESS",
      color: "emerald",
      stages: [
        {
          id: "cr",
          name: "Client Requirement",
          status: "Completed",
          progress: 100,
          icon: <Handshake />,
          dept: "Sales",
          role: "Account Manager",
          risk: "Low",
        },
        {
          id: "an",
          name: "Analysis",
          status: "Completed",
          progress: 100,
          icon: <Search />,
          dept: "Analysis",
          role: "Business Analyst",
          risk: "Medium",
        },
        {
          id: "ds",
          name: "Design",
          status: "In Progress",
          progress: 65,
          icon: <PenTool />,
          dept: "Design",
          role: "UI/UX Designer",
          risk: "Low",
        },
        {
          id: "dv",
          name: "Development",
          status: "Pending",
          progress: 0,
          icon: <Code />,
          dept: "Engineering",
          role: "Full Stack Developer",
          risk: "Medium",
        },
        {
          id: "ts",
          name: "Testing",
          status: "Blocked",
          progress: 0,
          icon: <TestTube />,
          dept: "QA",
          role: "Test Engineer",
          risk: "High",
        },
        {
          id: "qr",
          name: "QA Review",
          status: "Risk Identified",
          progress: 0,
          icon: <Eye />,
          dept: "Quality",
          role: "Quality Head",
          risk: "Critical",
        },
      ],
    },
    {
      title: "3️⃣ OUTWARD",
      color: "indigo",
      stages: [
        {
          id: "fqa",
          name: "Final QA Approval",
          status: "Pending",
          icon: <ShieldCheck />,
          dept: "Quality",
          role: "QA Director",
        },
        {
          id: "df",
          name: "Documentation Freeze",
          status: "Pending",
          icon: <FileText />,
          dept: "Operations",
          role: "Compliance Officer",
        },
        {
          id: "dl",
          name: "Delivery",
          status: "Pending",
          icon: <Truck />,
          dept: "Logistics",
          role: "Delivery Lead",
        },
        {
          id: "ca",
          name: "Client Acceptance",
          status: "Pending",
          icon: <Handshake />,
          dept: "Sales",
          role: "Account Manager",
        },
        {
          id: "pdr",
          name: "Post Delivery Review",
          status: "Pending",
          icon: <MessageSquare />,
          dept: "Support",
          role: "Support Head",
        },
      ],
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
      case "Approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Blocked":
        return "bg-red-100 text-red-700 border-red-200";
      case "Risk Identified":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  return (
    <div className="space-y-12 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            QMS Process Flow Architecture
          </h1>
          <p className="text-slate-500 mt-1">
            End-to-End Operational Lifecycle Visualization
          </p>
        </div>
      </div>

      {sections.map((section, sIdx) => (
        <div key={sIdx} className="space-y-4">
          <h3 className="text-lg font-bold text-slate-700 ml-2">
            {section.title}
          </h3>
          <div className="flex flex-wrap items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            {section.stages.map((stage, idx) => (
              <div key={stage.id} className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedStage(stage)}
                  className={`group relative flex flex-col items-center p-4 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 w-48 ${getStatusColor(stage.status)}`}
                >
                  <div className="mb-2 p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                    {stage.icon}
                  </div>
                  <span className="text-xs font-bold text-center line-clamp-2 h-8 leading-tight">
                    {stage.name}
                  </span>

                  {stage.count !== undefined && (
                    <span className="absolute -top-2 -right-2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                      {stage.count}
                    </span>
                  )}

                  {stage.progress !== undefined && (
                    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${stage.status === "Blocked" ? "bg-red-500" : "bg-green-500"}`}
                        style={{ width: `${stage.progress}%` }}
                      ></div>
                    </div>
                  )}

                  <div className="mt-1 flex items-center gap-1 opacity-60">
                    <span className="text-[10px] uppercase tracking-wider font-bold">
                      {stage.status}
                    </span>
                  </div>
                </button>
                {idx < section.stages.length - 1 && (
                  <ArrowRight className="text-slate-300 shrink-0" size={20} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Side Modal */}
      {selectedStage && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 p-8">
            <div className="flex justify-between items-start mb-8">
              <div
                className={`p-4 rounded-2xl ${getStatusColor(selectedStage.status)}`}
              >
                {selectedStage.icon}
              </div>
              <button
                onClick={() => setSelectedStage(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowRight className="rotate-180" size={24} />
              </button>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {selectedStage.name}
            </h2>
            <div
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-8 ${getStatusColor(selectedStage.status)}`}
            >
              {selectedStage.status}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-slate-600">
                <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-lg border border-slate-100">
                  <Package size={20} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Department
                  </p>
                  <p className="font-semibold">{selectedStage.dept}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-600">
                <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-lg border border-slate-100">
                  <Users size={20} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Assigned Role
                  </p>
                  <p className="font-semibold">{selectedStage.role}</p>
                </div>
              </div>

              {selectedStage.risk && (
                <div className="flex items-center gap-4 text-slate-600">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border ${selectedStage.risk === "High" || selectedStage.risk === "Critical" ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"}`}
                  >
                    <AlertCircle
                      size={20}
                      className={
                        selectedStage.risk === "High" ||
                        selectedStage.risk === "Critical"
                          ? "text-red-500"
                          : "text-slate-400"
                      }
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Identified Risk
                    </p>
                    <p
                      className={`font-bold ${selectedStage.risk === "High" || selectedStage.risk === "Critical" ? "text-red-600" : "text-slate-700"}`}
                    >
                      {selectedStage.risk}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-slate-100">
                <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Info size={16} className="text-blue-500" />
                  Description
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  This stage involves comprehensive verification of{" "}
                  {selectedStage.name.toLowerCase()} processing to ensure
                  compliance with organization standards and quality benchmarks.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FileText = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export default ProcessFlow;
