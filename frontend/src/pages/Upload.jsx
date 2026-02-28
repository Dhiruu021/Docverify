import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Upload.css";

function Upload() {
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append("docType", docType);
    formData.append("document", file);
    formData.append("userId", localStorage.getItem("userId"));

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

          <button type="submit" disabled={uploading} className="btn-upload">
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </form>

        <div className="upload-notes">
          <h3>📋 Upload Guidelines</h3>
          <ul>
            <li><strong>File Size:</strong> Maximum 5MB per document</li>
            <li><strong>Formats:</strong> JPG, JPEG, PNG, PDF only</li>
            <li><strong>Quality:</strong> Clear, readable scan or photo</li>
            <li><strong>Documents:</strong> Aadhaar, PAN, Passport, Driving License, Voter ID</li>
            <li><strong>Photo Tips:</strong> Good lighting, all corners visible, no blur</li>
            <li><strong>Verification Time:</strong> 24-48 hours</li>
            <li><strong>Status:</strong> Check "My Status" page for updates</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Upload;
