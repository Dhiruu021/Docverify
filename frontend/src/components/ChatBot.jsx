import { useState, useRef, useEffect } from "react";
import "./ChatBot.css";

const CONTACT_NUMBER = "7800330409";
const OFFICE_HOURS = { start: 9, end: 18 }; // 9AM - 6PM

const isOfficeTime = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getHours();
  
  // Monday (1) to Saturday (6), 9AM to 6PM
  return day >= 1 && day <= 6 && hour >= OFFICE_HOURS.start && hour < OFFICE_HOURS.end;
};

const getContactMessage = () => {
  if (isOfficeTime()) {
    return `For urgent assistance, call us at: ${CONTACT_NUMBER}`;
  }
  return "Our office hours are Mon-Sat, 9AM-6PM. Please leave a message or call during office hours.";
};

const FAQS = [
  {
    question: "How to upload document?",
    answer: "Go to Dashboard → Click 'Upload Document' → Select document type → Choose file → Submit."
  },
  {
    question: "How to check status?",
    answer: "Click 'My Status' in navigation or dashboard to see all your documents and their verification status."
  },
  {
    question: "What documents are accepted?",
    answer: "Aadhaar, PAN, Passport, Driving License, and other ID documents. Supported formats: JPG, PNG, PDF."
  },
  {
    question: "How long does verification take?",
    answer: "Usually 24-48 hours. You'll see status updates in 'My Status' page."
  },
  {
    question: "What if document is rejected?",
    answer: "Check the rejection reason, fix the issue, and upload a new clear document."
  },
  {
    question: "How to contact admin?",
    answer: "Use the 'Messages' feature from the dropdown menu to chat with admin directly."
  },
  {
    question: "Forgot password?",
    answer: "Contact admin through Messages or email support for password reset."
  },
  {
    question: "How to update profile?",
    answer: "Click your avatar → Profile → Edit your details and save."
  },
  {
    question: "Need urgent help?",
    answer: getContactMessage()
  }
];

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi! I'm DocBot. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findAnswer = (question) => {
    const lowerQ = question.toLowerCase();
    const match = FAQS.find(faq => 
      faq.question.toLowerCase().includes(lowerQ) ||
      lowerQ.includes(faq.question.toLowerCase().split(" ")[0])
    );
    return match?.answer || "I don't have an answer for that. Try asking about: upload, status, documents, verification, or contact admin.";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { type: "user", text: userMsg }]);
    setInput("");

    setTimeout(() => {
      const answer = findAnswer(userMsg);
      setMessages(prev => [...prev, { type: "bot", text: answer }]);
    }, 500);
  };

  const handleQuickQuestion = (question) => {
    setMessages(prev => [...prev, { type: "user", text: question }]);
    setTimeout(() => {
      const faq = FAQS.find(f => f.question === question);
      setMessages(prev => [...prev, { type: "bot", text: faq?.answer || findAnswer(question) }]);
    }, 500);
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          <span>Help</span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              <span>DocBot</span>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}`}>
                {msg.type === "bot" && (
                  <div className="bot-avatar">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                  </div>
                )}
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-quick">
            {FAQS.slice(0, 4).map((faq, idx) => (
              <button key={idx} onClick={() => handleQuickQuestion(faq.question)}>
                {faq.question}
              </button>
            ))}
          </div>

          <div className="chatbot-contact-status">
            {isOfficeTime() ? (
              <span className="status-online">● Office Open - Call {CONTACT_NUMBER}</span>
            ) : (
              <span className="status-offline">○ Office Closed - Mon-Sat 9AM-6PM</span>
            )}
          </div>

          <form className="chatbot-input" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
            />
            <button type="submit">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
