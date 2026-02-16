import { useState, useEffect } from "react";
import { Plus, FileText, Download, Eye } from "lucide-react";
import api from "../services/api";
import DocumentUploadModal from "../components/DocumentUploadModal";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";

const Documents = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("All");

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get(`/documents?status=${statusFilter}`);
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Superseded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (newStatus === "Approved") {
      if (
        !window.confirm(
          "Approving this version will supersede any previously approved version of this document. Continue?",
        )
      ) {
        return;
      }
    }

    try {
      await api.put(`/documents/${id}/status`, { status: newStatus });
      fetchDocuments();
    } catch (error) {
      console.error("Error updating status", error);
      alert("Failed to update status");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Documents</h1>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Superseded">Superseded</option>
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={18} /> Upload Document
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-600">Title</th>
              <th className="px-6 py-3 font-semibold text-slate-600">
                Version
              </th>
              <th className="px-6 py-3 font-semibold text-slate-600">Status</th>
              <th className="px-6 py-3 font-semibold text-slate-600">
                Created By
              </th>
              <th className="px-6 py-3 font-semibold text-slate-600">Date</th>
              <th className="px-6 py-3 font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-slate-500">
                  No documents found.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr
                  key={doc._id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                      <FileText size={18} />
                    </div>
                    <span className="font-medium text-slate-800">
                      {doc.title}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{doc.version}</td>
                  <td className="px-6 py-4">
                    {user &&
                    (user.role === "Admin" ||
                      user.role === "Quality Manager") ? (
                      <select
                        value={doc.status}
                        onChange={(e) =>
                          handleStatusChange(doc._id, e.target.value)
                        }
                        className={`px-2 py-1 rounded-full text-xs font-medium border-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${getStatusColor(doc.status)}`}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Superseded" disabled>
                          Superseded
                        </option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}
                      >
                        {doc.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {doc.createdBy?.username || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {format(new Date(doc.createdAt), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`http://localhost:5001/${doc.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DocumentUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={fetchDocuments}
      />
    </div>
  );
};

export default Documents;
