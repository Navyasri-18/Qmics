import { useState } from "react";
import { X, Save } from "lucide-react";
import api from "../services/api";

const CreateCAPAModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rootCause: "",
    dueDate: "",
    priority: "Medium",
    severityLevel: 3,
    assignedTo: "", // In real app, this would be a user ID from a dropdown
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/capa", formData);
      onSuccess();
      onClose();
      setFormData({
        title: "",
        description: "",
        rootCause: "",
        dueDate: "",
        priority: "Medium",
        severityLevel: 3,
        assignedTo: "",
      });
    } catch (error) {
      console.error(
        "CAPA Creation Error:",
        error.response?.data || error.message,
      );
      alert(
        `Error creating CAPA: ${error.response?.data?.message || error.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Log New CAPA</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Issue Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border rounded-lg p-2 h-20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Root Cause</label>
            <textarea
              value={formData.rootCause}
              onChange={(e) =>
                setFormData({ ...formData, rootCause: e.target.value })
              }
              className="w-full border rounded-lg p-2 h-24"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Severity (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.severityLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    severityLevel: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          {/* Placeholder for Assign User */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Assigned To (User ID for MVP)
            </label>
            <input
              type="text"
              placeholder="Enter User ID (Optional)"
              value={formData.assignedTo}
              onChange={(e) =>
                setFormData({ ...formData, assignedTo: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Save size={18} /> Save CAPA
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCAPAModal;
