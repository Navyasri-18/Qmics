const Document = require("../models/Document");
const ActivityLog = require("../models/ActivityLog");

// @desc    Upload a document
// @route   POST /api/documents
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    const { title, version } = req.body;
    const fileUrl = req.file.path;

    const document = await Document.create({
      title,
      fileUrl,
      version,
      createdBy: req.user._id,
      history: [{ action: "Created", user: req.user._id }],
    });

    await ActivityLog.create({
      user: req.user._id,
      action: "Created Document",
      module: "Documents",
      details: `Document ${title} created`,
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status && status !== "All") {
      query.status = status;
    }

    const documents = await Document.find(query).populate(
      "createdBy",
      "username",
    );
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update document status
// @route   PUT /api/documents/:id/status
// @access  Private (Quality Manager, Admin)
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const document = await Document.findById(req.params.id);

    if (document) {
      // 1. If status is changing to "Approved", find all OTHER documents with same title and mark them "Superseded"
      if (status === "Approved" && document.status !== "Approved") {
        const otherDocs = await Document.find({
          title: document.title,
          status: "Approved",
          _id: { $ne: document._id }, // Exclude current doc
        });

        for (const doc of otherDocs) {
          doc.status = "Superseded";
          doc.history.push({
            action: `Automatically superseded by version ${document.version}`,
            user: req.user._id,
          });
          await doc.save();

          // Log the automatic action
          await ActivityLog.create({
            user: req.user._id,
            action: "System Update",
            module: "Documents",
            details: `Document ${doc.title} (v${doc.version}) superseded by v${document.version}`,
          });
        }
      }

      document.status = status;
      document.history.push({
        action: `Status updated to ${status}`,
        user: req.user._id,
      });
      await document.save();

      await ActivityLog.create({
        user: req.user._id,
        action: "Updated Status",
        module: "Documents",
        details: `Document ${document.title} status updated to ${status}`,
      });

      res.json(document);
    } else {
      res.status(404).json({ message: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  updateStatus,
};
