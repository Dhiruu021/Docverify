import { useEffect, useState } from "react";
import API from "../services/api";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [showChange, setShowChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const loadProfile = async () => {
    const res = await API.get("/profile");
    setUser(res.data);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const uploadImage = async () => {
    if (!file) return alert("Please select an image first");

    const form = new FormData();
    form.append("image", file);

    await API.put("/profile/image", form);
    alert("Profile updated");
    setFile(null);
    loadProfile();
    
    // Notify navbar to update profile image
    window.dispatchEvent(new Event("profileUpdated"));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await API.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      alert("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setShowChange(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="profile-page">
      {!user ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="profile-card">
          <h1>My Profile</h1>

          <div className="profile-avatar">
            {user.profileImage ? (
              <img
                src={`http://localhost:5000/${user.profileImage}`}
                alt="Profile"
              />
            ) : (
              <div className="avatar-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="profile-info">
            <div className="info-row">
              <span className="info-label">Name</span>
              <span className="info-value">{user.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Role</span>
              <span className="info-value role-badge">{user.role}</span>
            </div>
          </div>

          <div className="profile-upload">
            <input
              type="file"
              id="fileUpload"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="fileUpload" className="file-label">
              {file ? file.name : "Choose Profile Image"}
            </label>
            <button onClick={uploadImage} className="btn-upload" disabled={!file}>
              Upload
            </button>
          </div>

          {!showChange ? (
            <button
              className="btn-change-password"
              onClick={() => setShowChange(true)}
            >
              Change Password
            </button>
          ) : (
            <div className="password-section">
              <h3>Change Password</h3>
              <form onSubmit={handleChangePassword} className="password-form">
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <div className="form-actions">
                  <button type="submit" className="btn-save">Save</button>
                  <button
                    type="button"
                    onClick={() => setShowChange(false)}
                    className="btn-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
