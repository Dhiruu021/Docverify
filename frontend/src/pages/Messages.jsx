import { useEffect, useState } from "react";
import API from "../services/api";
import "./Messages.css";

function Messages() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState({
    receiverId: "",
    subject: "",
    content: "",
  });
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchMessages();
    fetchUsers();
    fetchUnreadCount();
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      const endpoint = activeTab === "inbox" ? "/messages/inbox" : "/messages/sent";
      const res = await API.get(endpoint);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/messages/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get("/messages/unread-count");
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await API.post("/messages", newMessage);
      setShowCompose(false);
      setNewMessage({ receiverId: "", subject: "", content: "" });
      fetchMessages();
    } catch (err) {
      alert("Failed to send message");
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await API.put(`/messages/${messageId}/read`);
      fetchMessages();
      fetchUnreadCount();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm("Delete this message?")) return;
    try {
      await API.delete(`/messages/${messageId}`);
      fetchMessages();
    } catch (err) {
      alert("Failed to delete message");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="messages-page">
      <div className="messages-container">
        <header className="messages-header">
          <h1>💬 Messages</h1>
          <button className="btn-compose" onClick={() => setShowCompose(true)}>
            ✏️ New Message
          </button>
        </header>

        <div className="messages-tabs">
          <button
            className={`tab ${activeTab === "inbox" ? "active" : ""}`}
            onClick={() => setActiveTab("inbox")}
          >
            📥 Inbox {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          <button
            className={`tab ${activeTab === "sent" ? "active" : ""}`}
            onClick={() => setActiveTab("sent")}
          >
            📤 Sent
          </button>
        </div>

        {showCompose && (
          <div className="compose-modal">
            <div className="compose-form">
              <h3>New Message</h3>
              <form onSubmit={handleSendMessage}>
                <select
                  value={newMessage.receiverId}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, receiverId: e.target.value })
                  }
                  required
                >
                  <option value="">Select recipient...</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Subject"
                  value={newMessage.subject}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, subject: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Write your message..."
                  rows="5"
                  value={newMessage.content}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, content: e.target.value })
                  }
                  required
                />
                <div className="compose-actions">
                  <button type="submit" className="btn-send">
                    📨 Send
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowCompose(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedMessage && (
          <div className="message-modal">
            <div className="message-detail">
              <div className="message-detail-header">
                <h3>{selectedMessage.subject}</h3>
                <button
                  className="btn-close"
                  onClick={() => setSelectedMessage(null)}
                >
                  ✕
                </button>
              </div>
              <div className="message-meta">
                <span>
                  <strong>From:</strong> {selectedMessage.senderName}
                </span>
                <span>
                  <strong>To:</strong> {selectedMessage.receiverName}
                </span>
                <span>{formatDate(selectedMessage.createdAt)}</span>
              </div>
              <div className="message-body">
                <p>{selectedMessage.content}</p>
              </div>
            </div>
          </div>
        )}

        <div className="messages-list">
          {messages.length === 0 ? (
            <div className="no-messages">
              <p>No messages</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`message-card ${!msg.read && activeTab === "inbox" ? "unread" : ""}`}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (activeTab === "inbox" && !msg.read) {
                    handleMarkAsRead(msg._id);
                  }
                }}
              >
                <div className="message-info">
                  <h4 className="message-subject">
                    {!msg.read && activeTab === "inbox" && (
                      <span className="unread-dot"></span>
                    )}
                    {msg.subject}
                  </h4>
                  <p className="message-preview">
                    {activeTab === "inbox"
                      ? `From: ${msg.senderName}`
                      : `To: ${msg.receiverName}`}
                  </p>
                </div>
                <div className="message-actions">
                  <span className="message-date">{formatDate(msg.createdAt)}</span>
                  <button
                    className="btn-delete-msg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMessage(msg._id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
