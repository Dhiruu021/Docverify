import { useEffect, useState } from "react";
import API from "../services/api";
import BackButton from "../components/BackButton";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);

  // Change Password States
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
    loadProfile();
  };

  // Change Password Function
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await API.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      alert("Password changed successfully ✅");
      setOldPassword("");
      setNewPassword("");
      setShowChange(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="profile-wrapper">
      <BackButton />

      {!user ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="profile-container">
          <h2>My Profile</h2>

          {user.profileImage && (
            <img
              src={`http://localhost:5000/${user.profileImage}`}
              className="profile-img"
              alt="Profile"
            />
          )}

          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>

          <div className="upload-row">
            {/* hidden file input */}
            <input
              type="file"
              id="fileUpload"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />

            {/* custom file box */}
            <label htmlFor="fileUpload" className="file-box">
              {file ? file.name : "Choose file"}
            </label>

            <button onClick={uploadImage} className="upload-btn">
              Upload
            </button>
          </div>



          {/* CHANGE PASSWORD BUTTON */}
          {!showChange && (
            <button
              className="change-pass-btn"
              onClick={() => setShowChange(true)}
            >
              🔐 Change Password
            </button>
          )}

          {/* CHANGE PASSWORD FORM */}
          {showChange && (
            <>
              <h3 style={{ marginTop: "25px" }}>Change Password</h3>

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

                <div className="pass-btns">
                  <button type="submit">Save</button>
                  <button
                    type="button"
                    onClick={() => setShowChange(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
