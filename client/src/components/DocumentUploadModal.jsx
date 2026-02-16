import { useState } from "react";
import { X, Upload } from "lucide-react";
import api from "../services/api";

const DocumentUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("1.0");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("version", version);
    formData.append("file", file);

    try {
      await api.post("/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onUploadSuccess();
      onClose();
      setTitle("");
      setVersion("1.0");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Error uploading document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload Document</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Version</label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              File (PDF Only)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              "Uploading..."
            ) : (
              <>
                <Upload size={18} /> Upload
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DocumentUploadModal;
