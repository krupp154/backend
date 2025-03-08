import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfessionPage from "../components/confession-page";
import NameSelectionModal from "../components/name-selection-modal";
import UsersList from "../components/users-list";
import ChatInterface from "../components/chat-interface";

export default function HomePage() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#111827', color: 'white' }}>
        <Header />
        <Routes>
          <Route path="/" element={<ConfessionWrapper />} />
          <Route path="/users" element={<UsersWrapper />} />
          <Route path="/chat/:userId" element={<ChatWrapper />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

function ConfessionWrapper() {
  const navigate = useNavigate();
  const [showNameModal, setShowNameModal] = useState(false);

  const handleFindStrangers = () => setShowNameModal(true);
  const handleNameConfirm = (name, anonymous) => {
    localStorage.setItem("userName", anonymous ? "Anonymous" : name);
    navigate("/users");
  };

  return (
    <>
      <ConfessionPage setShowNameModal={setShowNameModal} onFindStrangers={handleFindStrangers} />
      {showNameModal && <NameSelectionModal setShowNameModal={setShowNameModal} onConfirm={handleNameConfirm} />}
    </>
  );
}

function UsersWrapper() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "";
  const handleConnect = (user) => navigate(`/chat/${user._id}`);

  return <UsersList onConnect={handleConnect} currentUserName={userName} />;
}

function ChatWrapper() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "";
  const selectedUser = { id: 1, name: "Stranger" }; // Replace with dynamic user data

  return <ChatInterface user={selectedUser} currentUserName={userName} onExitChat={() => navigate("/users")} />;
}

function Header() {
  return (
    <header style={{ padding: '24px', textAlign: 'center', background: 'linear-gradient(to right, #6366f1, #8b5cf6)' }}>
      <h1>The Secret Garden Chat</h1>
    </header>
  );
}

function Footer() {
  const handleClearCookies = () => {
    localStorage.clear();
    alert("Cookies cleared successfully!");
    window.location.reload(); // Refresh the page to reflect changes
  };

  return (
    <footer style={{ padding: '16px', textAlign: 'center', backgroundColor: '#1f2937', color: '#9ca3af' }}>
      <p>© {new Date().getFullYear()} Anonymous Confessions. All rights reserved.</p>
      <button 
        onClick={handleClearCookies} 
        style={{
          marginTop: '10px',
          backgroundColor: '#EF4444',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Clear Cookies
      </button>
    </footer>
  );
}
