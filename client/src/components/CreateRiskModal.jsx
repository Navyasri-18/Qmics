import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import api from "../services/api";

const CreateRiskModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    description: "",
    severity: 5,
    occurrence: 5,
    detection: 5,
  });
  const [rpn, setRpn] = useState(125); // 5 * 5 * 5
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRpn(formData.severity * formData.occurrence * formData.detection);
  }, [formData.severity, formData.occurrence, formData.detection]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/risk", formData);
      onSuccess();
      onClose();
      setFormData({
        description: "",
        severity: 5,
        occurrence: 5,
        detection: 5,
      });
    } catch (error) {
      console.error(error);
      alert("Error creating Risk assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseInt(e.target.value) || e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">New FMEA Risk Assessment</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Risk Description (Failure Mode)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 h-20"
              placeholder="e.g. Server downtime leading to data loss"
              required
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium">
                  Severity (1-10)
                </label>
                <span className="text-sm font-bold text-blue-600">
                  {formData.severity}
                </span>
              </div>
              <input
                type="range"
                name="severity"
                min="1"
                max="10"
                value={formData.severity}
                onChange={handleChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium">
                  Occurrence (1-10)
                </label>
                <span className="text-sm font-bold text-blue-600">
                  {formData.occurrence}
                </span>
              </div>
              <input
                type="range"
                name="occurrence"
                min="1"
                max="10"
                value={formData.occurrence}
                onChange={handleChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium">
                  Detection (1-10)
                </label>
                <span className="text-sm font-bold text-blue-600">
                  {formData.detection}
                </span>
              </div>
              <input
                type="range"
                name="detection"
                min="1"
                max="10"
                value={formData.detection}
                onChange={handleChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg text-center border border-slate-200">
            <p className="text-sm text-slate-500 mb-1">
              Risk Priority Number (RPN)
            </p>
            <p
              className={`text-4xl font-bold ${rpn > 100 ? "text-red-500" : "text-green-500"}`}
            >
              {rpn}
            </p>
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
                <Save size={18} /> Save Assessment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRiskModal;
