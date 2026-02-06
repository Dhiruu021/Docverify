import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import BackButton from "../components/BackButton";
import "./Upload.css";

function Upload() {
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    }
  };

  return (
    <div className="page-center">
      <BackButton />   {/* Added here */}

      <div className="upload-box">
        <h2>Upload Document</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Document Type (Aadhaar, PAN, etc)"
            onChange={(e) => setDocType(e.target.value)}
            required
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />

          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
}

export default Upload;
