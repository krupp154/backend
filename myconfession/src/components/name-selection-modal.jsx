"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

function NameSelectionModal({ onConfirm, setShowNameModal }) {
  const [name, setName] = useState("");
  useEffect(()=>{
    const name = localStorage.getItem('name');
    if(name) {
      setName(name);
    }
  },[]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = isAnonymous ? "Anonymous" : name.trim();

    if (username === "") return;

    try {
      const id = localStorage.getItem('id');
      console.log(id);
      
      if(id) {
        const response = await axios.post(`https://backend-a9wn.onrender.com/stranger/update/${id}`, { _id: id, name: username });
        
        localStorage.setItem('username', response.data.name);
      } else {
        // Start a session by adding the user
        const response = await axios.post("https://backend-a9wn.onrender.com/stranger/add", { name: username });
        localStorage.setItem('id', response.data._id);
        localStorage.setItem('username', response.data.name);
      }

      // Pass username and anonymous status back to the parent component
      onConfirm(username, isAnonymous);
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex",
      justifyContent: "center", alignItems: "center"
    }}>
      <div style={{
        backgroundColor: "#1f2937", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        width: "100%", maxWidth: "500px", color: 'white'
      }}>
        <div style={{
          backgroundColor: "#6366f1", color: "white",
          padding: "1rem", borderTopLeftRadius: "12px", borderTopRightRadius: "12px",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <h5 style={{ margin: 0 }}>How would you like to appear?</h5>
          <button
            onClick={() => setShowNameModal(false)}
            style={{
              background: "transparent", border: "none", color: "white",
              fontSize: "1.2rem", cursor: "pointer", padding: "0.3rem 0.6rem",
              borderRadius: "50%", transition: "background 0.3s",
            }}
            onMouseEnter={(e) => e.target.style.background = "rgba(255, 255, 255, 0.2)"}
            onMouseLeave={(e) => e.target.style.background = "transparent"}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: "1rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                id="anonymousCheck"
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
                style={{ marginRight: "0.5rem" }}
              />
              <label htmlFor="anonymousCheck">Join anonymously</label>
            </div>
          </div>

          {!isAnonymous && (
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="name" style={{ display: "block", marginBottom: "0.5rem" }}>
                Your Name
              </label>
              <input
                type="text"
                id="name"
                style={{
                  width: "100%", padding: "0.5rem",
                  borderRadius: "0.5rem", border: "1px solid #4b5563",
                  backgroundColor: '#374151', color: 'white'
                }}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#6366f1", color: "white",
                border: "none", padding: "0.5rem 1rem",
                borderRadius: "0.5rem", cursor: "pointer"
              }}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NameSelectionModal;