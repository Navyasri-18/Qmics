import { useEffect, useState } from "react";
import {
  GitBranch,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  User,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProjectTracker = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    client: "",
    description: "",
  });
  const { user } = useAuth();

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/projects", newProject);
      setNewProject({ name: "", client: "", description: "" });
      setShowCreate(false);
      fetchProjects();
    } catch (error) {
      console.error("Error creating project", error);
    }
  };

  const updateStage = async (projectId, stageName, status) => {
    try {
      await api.put(`/projects/${projectId}/stage`, { stageName, status });
      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.message || "Error updating stage");
    }
  };

  const STAGES = [
    "Requirement",
    "Analysis",
    "Design",
    "Development",
    "Testing",
    "Deployment",
    "Closed",
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="text-green-500" size={18} />;
      case "In Progress":
        return <Clock className="text-blue-500 animate-pulse" size={18} />;
      case "Blocked":
        return <AlertTriangle className="text-red-500" size={18} />;
      case "Risk Identified":
        return <AlertTriangle className="text-orange-500" size={18} />;
      default:
        return <Circle className="text-slate-300" size={18} />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Project Lifecycle Tracker
          </h1>
          <p className="text-slate-500 mt-1">
            Enterprise SDLC Workflow Monitoring
          </p>
        </div>
        {(user?.role === "Admin" ||
          user?.role === "Director" ||
          user?.role === "CEO") && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm"
          >
            <Plus size={20} />
            New Project
          </button>
        )}
      </div>

      {showCreate && (
        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-md animate-in fade-in zoom-in duration-200">
          <h3 className="text-lg font-bold mb-4">Initialize Project</h3>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input
              type="text"
              placeholder="Project Name"
              className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Client Name"
              className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={newProject.client}
              onChange={(e) =>
                setNewProject({ ...newProject, client: e.target.value })
              }
              required
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Description"
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-2xl border border-dashed border-slate-300">
            <GitBranch size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-400">
              No projects found
            </h3>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row"
            >
              {/* Project Info Panel */}
              <div className="p-6 md:w-80 bg-slate-50 border-r border-slate-100 shrink-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <GitBranch size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 line-clamp-1">
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-500">{project.client}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-6">
                  {project.description}
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Overall Progress</span>
                    <span className="font-bold text-blue-600">
                      {Math.round(
                        (project.stages.filter((s) => s.status === "Completed")
                          .length /
                          STAGES.length) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-700"
                      style={{
                        width: `${(project.stages.filter((s) => s.status === "Completed").length / STAGES.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="pt-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${project.overallStatus === "Completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                    >
                      {project.overallStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Workflow Timeline */}
              <div className="p-6 flex-1 overflow-x-auto">
                <div className="flex items-start min-w-[800px] h-full">
                  {project.stages.map((stage, idx) => (
                    <div key={stage._id} className="flex-1 relative group">
                      {/* Connector Line */}
                      {idx < STAGES.length - 1 && (
                        <div
                          className={`absolute left-1/2 top-4 w-full h-[2px] ${stage.status === "Completed" ? "bg-green-500" : "bg-slate-200"}`}
                        ></div>
                      )}

                      <div className="relative flex flex-col items-center z-10 px-2">
                        <div className="mb-2 bg-white rounded-full p-1 ring-1 ring-slate-100">
                          {getStatusIcon(stage.status)}
                        </div>
                        <p className="text-[11px] font-bold text-slate-700 text-center mb-1">
                          {stage.stageName}
                        </p>

                        {stage.status === "In Progress" && (
                          <div className="flex flex-col gap-1 w-full mt-2">
                            <button
                              onClick={() =>
                                updateStage(
                                  project._id,
                                  stage.stageName,
                                  "Completed",
                                )
                              }
                              className="text-[10px] bg-green-500 text-white px-2 py-1 rounded shadow-sm hover:bg-green-600 font-bold transition-all"
                            >
                              Complete
                            </button>
                            {(user?.role === "CEO" ||
                              user?.role === "Director") && (
                              <button
                                onClick={() =>
                                  updateStage(
                                    project._id,
                                    stage.stageName,
                                    "Blocked",
                                  )
                                }
                                className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 font-bold"
                              >
                                Block
                              </button>
                            )}
                          </div>
                        )}

                        {stage.status === "Completed" && stage.approvedBy && (
                          <div className="mt-2 group-hover:block hidden absolute top-full left-1/2 -translate-x-1/2 bg-slate-800 text-white p-2 rounded text-[10px] whitespace-nowrap shadow-xl">
                            <div className="flex items-center gap-1 mb-1">
                              <ShieldCheck
                                size={12}
                                className="text-green-400"
                              />
                              Approved by {stage.approvedBy.username}
                            </div>
                            <div className="flex items-center gap-1 opacity-60">
                              <Clock size={10} />
                              {new Date(stage.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        )}

                        {stage.status === "Pending" &&
                          idx > 0 &&
                          project.stages[idx - 1].status === "Completed" && (
                            <button
                              onClick={() =>
                                updateStage(
                                  project._id,
                                  stage.stageName,
                                  "In Progress",
                                )
                              }
                              className="text-[10px] text-blue-600 hover:underline mt-2 flex items-center gap-1"
                            >
                              Start <ChevronRight size={10} />
                            </button>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectTracker;
