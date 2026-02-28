const Document = require("../models/Document");
const Settings = require("../models/Settings");

/* Demo AI Auto Verification Logic*/
const autoVerifyByAI = (docType, filePath) => {
  if (!docType) return "rejected";

  const type = docType.toLowerCase();

  if (type.includes("aadhaar")) return "approved";
  if (type.includes("pan")) return "approved";

  return "rejected";
};

/* Upload Document (User)*/
const uploadDocument = async (req, res) => {
  try {
    const { docType, userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    let status = "pending";

    const settings = await Settings.findOne();
    if (settings?.aiVerification) {
      status = autoVerifyByAI(docType, req.file.path);
    }

    const doc = await Document.create({
      userId,
      docType,
      filePath: req.file.path,
      cloudinaryUrl: req.file.path,
      status,
    });

    res.status(201).json({
      message: "Document Uploaded Successfully",
      doc,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*  User My Documents*/
const getMyDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.params.userId });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*  Admin All Documents*/
const getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find().populate("userId", "name email");
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Admin Pending Documents*/
const getPendingDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ status: "pending" }).populate(
      "userId",
      "name email"
    );
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Admin Update Document Status */
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    doc.status = status;
    await doc.save();

    res.json({ message: "Status Updated Successfully", doc });
  } catch (error) {
    console.error("UPDATE STATUS ERROR ", error);
    res.status(500).json({ error: error.message });
  }
};

/*Admin - History Documents*/
const getHistoryDocuments = async (req, res) => {
  try {
    const docs = await Document.find({
      status: { $ne: "pending" },
    }).populate("userId", "name email");

    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*Delete Single Document*/
const deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*Delete Multiple Documents*/
const deleteMultipleDocuments = async (req, res) => {
  try {
    const { ids } = req.body;
    await Document.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Documents deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadDocument,
  getMyDocuments,
  getAllDocuments,
  getPendingDocuments,
  updateStatus,
  getHistoryDocuments,
  deleteDocument,
  deleteMultipleDocuments,
};
