const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {
  protect,
  isVerifierAdmin,
  isSuperAdmin,
} = require("../middleware/authMiddleware");

const documentController = require("../controllers/documentController");

/* ================= USER ================= */

// Upload document (USER)
router.post(
  "/upload",
  protect,
  upload.single("document"),
  documentController.uploadDocument
);

// User's own documents
router.get(
  "/my/:userId",
  protect,
  documentController.getMyDocuments
);

/* ================= VERIFIER ADMIN ================= */

// Pending documents
router.get(
  "/pending",
  protect,
  isVerifierAdmin,
  documentController.getPendingDocuments
);

// Approve / Reject
router.put(
  "/status/:id",
  protect,
  isVerifierAdmin,
  documentController.updateStatus
);

// History (approved + rejected)
router.get(
  "/history",
  protect,
  isVerifierAdmin,
  documentController.getHistoryDocuments
);

/* ================= SUPER ADMIN ================= */

// Delete single
router.delete(
  "/delete/:id",
  protect,
  isSuperAdmin,
  documentController.deleteDocument
);

// Delete multiple
router.post(
  "/delete-multiple",
  protect,
  isSuperAdmin,
  documentController.deleteMultipleDocuments
);

module.exports = router;
