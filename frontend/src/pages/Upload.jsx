import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Upload.css";

function Upload() {
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);
  const [reason, setReason] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const wordCount = reason.trim().split(/\s+/).length;
    if (wordCount < 20) {
      alert(`Reason must be at least 20 words. Current: ${wordCount} words`);
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("docType", docType);
    formData.append("document", file);
    formData.append("userId", localStorage.getItem("userId"));
    formData.append("reason", reason);

    try {
      await API.post("/docs/upload", formData);
      alert("Document Uploaded Successfully");
      navigate("/status");
    } catch (err) {
      alert("Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1>Upload Document</h1>
        <p className="subtitle">Upload your documents for verification</p>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label>Document Type</label>
            <input
              type="text"
              placeholder="e.g., Aadhaar, PAN, Passport"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Select File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            {file && <span className="file-name">{file.name}</span>}
          </div>

          <div className="form-group">
            <label>Reason for Upload (Minimum 20 words)</label>
            <textarea
              placeholder="Explain why you are uploading this document. Please provide detailed information in at least 20 words..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="5"
              required
            />
            {reason && (
              <span className={`word-count ${reason.trim().split(/\s+/).length >= 20 ? 'valid' : 'invalid'}`}>
                Words: {reason.trim().split(/\s+/).length} / 20
              </span>
            )}
          </div>

          <button type="submit" disabled={uploading || reason.trim().split(/\s+/).length < 20} className="btn-upload">
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </div>

      <div className="upload-guidelines-box">
        <h3>📋 Upload Guidelines</h3>
        <ul>
          <li><strong>File Size:</strong> Maximum 5MB per document</li>
          <li><strong>Formats:</strong> JPG, JPEG, PNG, PDF only</li>
          <li><strong>Quality:</strong> Clear, readable scan or photo</li>
          <li><strong>Documents:</strong> Aadhaar, PAN, Passport, Driving License, Voter ID</li>
          <li><strong>Photo Tips:</strong> Good lighting, all corners visible, no blur</li>
          <li><strong>Verification Time:</strong> 24-48 hours (excluding weekends/holidays)</li>
          <li><strong>Status:</strong> Check "My Status" page for updates</li>
        </ul>
      </div>
    </div>
  );
}

export default Upload;
