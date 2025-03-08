"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

function ConfessionPage({ onFindStrangers }) {
  const [confession, setConfession] = useState("");
  const [name, setName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [confessions, setConfessions] = useState([]);
  // State to track user interactions with posts
  const [userInteractions, setUserInteractions] = useState({});

  // Load user interactions from localStorage on component mount
  useEffect(() => {
    const savedInteractions = localStorage.getItem("userConfessionInteractions");
    if (savedInteractions) {
      setUserInteractions(JSON.parse(savedInteractions));
    }
  }, []);

  // Save user interactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userConfessionInteractions", JSON.stringify(userInteractions));
  }, [userInteractions]);

  // Fetch confessions from backend
  const fetchConfessions = async () => {
    try {
      const response = await axios.get("https://backend-a9wn.onrender.com/post");
      setConfessions(response.data);
    } catch (error) {
      console.error("Error fetching confessions:", error);
    }
  };

  useEffect(() => {
    fetchConfessions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (confession.trim() === "") return;

    const newConfession = {
      content: confession,
      username: isAnonymous ? "Anonymous" : name,
    };

    try {
      await axios.post("https://backend-a9wn.onrender.com/post/upload", newConfession);
      fetchConfessions(); // Refresh the confessions list
      setConfession("");
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error posting confession:", error);
    }
  };

  const handleLike = async (confId) => {
    try {
      const currentInteraction = userInteractions[confId] || "none";

      // If user already liked, remove the like
      if (currentInteraction === "liked") {
        // Remove the like on the backend
        await axios.post(`https://backend-a9wn.onrender.com/post/${confId}/unlike`);

        // Update local state
        setUserInteractions({
          ...userInteractions,
          [confId]: "none"
        });
      }
      // If user previously disliked, remove dislike and add like
      else if (currentInteraction === "disliked") {
        // Remove dislike first
        await axios.post(`https://backend-a9wn.onrender.com/post/${confId}/undislike`);
        // Then add like
        await axios.post(`https://backend-a9wn.onrender.com/post/${confId}/like`);

        // Update local state
        setUserInteractions({
          ...userInteractions,
          [confId]: "liked"
        });
      }
      // If no previous interaction, just add the like
      else {
        await axios.post(`https://backend-a9wn.onrender.com/post/${confId}/like`);

        // Update local state
        setUserInteractions({
          ...userInteractions,
          [confId]: "liked"
        });
      }

      fetchConfessions(); // Refresh after interaction
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleDislike = async (confId) => {
    try {
      const currentInteraction = userInteractions[confId] || "none";

      // If user already disliked, remove the dislike
      if (currentInteraction === "disliked") {
        // Remove the dislike on the backend
        await axios.post(`https://backend-a9wn.onrender.com/post/${confId}/undislike`);

        // Update local state
        setUserInteractions({
          ...userInteractions,
          [confId]: "none"
        });
      }
      // If user previously liked, remove like and add dislike
      else if (currentInteraction === "liked") {
        // Remove like first
        await axios.post(`https://backend-a9wn.onrender.com/post/${confId}/unlike`);
        // Then add dislike
        await axios.post(`https://backend-a9wn.onrender.com/post/${confId}/dislike`);

        // Update local state
        setUserInteractions({
          ...userInteractions,
          [confId]: "disliked"
        });
      }
      // If no previous interaction, just add the dislike
      else {
        await axios.post(`https://backend-a9wn.onrender.com/post/${confId}/dislike`);

        // Update local state
        setUserInteractions({
          ...userInteractions,
          [confId]: "disliked"
        });
      }

      fetchConfessions(); // Refresh after interaction
    } catch (error) {
      console.error("Error handling dislike:", error);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "20px auto", padding: "1rem", backgroundColor: '#111827', color: 'white', borderRadius: '12px' }}>
      <div style={{ backgroundColor: "#1f2937", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", marginBottom: "20px" }}>
        <div style={{ backgroundColor: "#6366f1", padding: "1rem", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}>
          <h2 style={{ margin: 0, color: 'white' }}>Share Your Confession</h2>
        </div>
        <div style={{ padding: "1rem" }}>
          {submitted ? (
            <div style={{ backgroundColor: "#4b5563", color: "#a0d911", padding: "0.75rem", borderRadius: "0.5rem", marginBottom: "1rem", position: "relative", animation: "fireworks 0.8s ease-out" }}>
              Your confession has been submitted successfully!
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="confession" style={{ display: "block", marginBottom: "0.5rem" }}>Your Confession</label>
                <textarea
                  id="confession"
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #4b5563", backgroundColor: '#374151', color: 'white' }}
                  rows={4}
                  placeholder="Share your secret confession here..."
                  value={confession}
                  onChange={(e) => setConfession(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    id="anonymousCheck1"
                    checked={isAnonymous}
                    onChange={() => setIsAnonymous(!isAnonymous)}
                    style={{ marginRight: "0.5rem" }}
                  />
                  <label htmlFor="anonymousCheck1">Post anonymously</label>
                </div>
              </div>

              {!isAnonymous && (
                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="name" style={{ display: "block", marginBottom: "0.5rem" }}>Your Name</label>
                  <input
                    type="text"
                    id="name"
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #4b5563", backgroundColor: '#374151', color: 'white' }}
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit" style={{ backgroundColor: "#6366f1", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "0.5rem", cursor: "pointer" }}>
                  Submit Confession
                </button>
                <button type="button" style={{ backgroundColor: "transparent", border: "1px solid #6366f1", color: "#6366f1", padding: "0.5rem 1rem", borderRadius: "0.5rem", cursor: "pointer" }} onClick={onFindStrangers}>
                  Find Strangers
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <h3 style={{ marginBottom: "1rem", color: 'white' }}>Recent Confessions</h3>
      {confessions.map((conf) => (
        <div key={conf._id} style={{ backgroundColor: "#1f2937", color: "white", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", marginBottom: "1rem", padding: "1rem" }}>
          <p>{conf.content}</p>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "#9ca3af" }}>
            <span>{conf.username || "Anonymous"}</span>
            <span>{formatTime(conf.createdAt)}</span>
          </div>

          {/* Improved Like & Dislike Buttons with Icons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "4px", color: "#9ca3af", fontSize: "0.9rem" }}>{conf.like || 0}</span>
              <button
                onClick={() => handleLike(conf._id)}
                style={{
                  backgroundColor: "transparent", // Remove background color
                  color: userInteractions[conf._id] === "liked" ? "#22c55e" : "#9ca3af", // Green when liked
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.3s ease-in-out, transform 0.1s ease",
                  fontSize: "1.2rem", // Slightly larger icon
                  boxShadow: userInteractions[conf._id] === "liked" ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none", // Shadow when liked
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 10v12"></path>
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                </svg>
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "4px", color: "#9ca3af", fontSize: "0.9rem" }}>{conf.dislike || 0}</span>
              <button
                onClick={() => handleDislike(conf._id)}
                style={{
                  backgroundColor: "transparent", // Remove background color
                  color: userInteractions[conf._id] === "disliked" ? "#ef4444" : "#9ca3af", // Red when disliked
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.3s ease-in-out, transform 0.1s ease",
                  fontSize: "1.2rem", // Slightly larger icon
                  boxShadow: userInteractions[conf._id] === "disliked" ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none", // Shadow when disliked
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 14V2"></path>
                  <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ConfessionPage;