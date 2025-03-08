import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const socket = io("https://backend-a9wn.onrender.com", { transports: ["websocket"] });

export default function ChatInterface() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [userName, setUserName] = useState("Loading...");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(`https://backend-a9wn.onrender.com/stranger/${userId}`);
        setUserName(response.data.name);
      } catch (error) {
        setUserName("Unknown");
        console.error("Failed to fetch user name:", error);
      }
    };
    fetchUserName();
  }, [userId]);

  useEffect(() => {
    const senderId = localStorage.getItem("id");
    socket.emit("register", senderId);

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("message-deleted", ({ messageId }) => {
      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      }, 3000);
    });

    return () => {
      socket.off("receive-message");
      socket.off("message-deleted");
    };
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const senderId = localStorage.getItem("id");
    if (!inputValue.trim()) return;

    try {
      const response = await axios.post("https://backend-a9wn.onrender.com/message/send", {
        sender: senderId,
        receiver: userId,
        content: inputValue,
      });

      socket.emit("send-message", {
        senderId,
        receiverId: userId,
        content: inputValue,
        _id: response.data.message._id,
      });

      setMessages([...messages, { sender: senderId, content: inputValue, _id: response.data.message._id }]);
      setInputValue("");
    } catch (error) {
      console.error("Failed to send message:", error.response?.data || error.message);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "2rem", backgroundColor: "#282c34", color: "#abb2bf", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", height: "80vh", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <h2 style={{ color: "#61dafb", margin: 0 }}>Chat with {userName}</h2>
      </div>
      <div style={{ flexGrow: 1, overflowY: "auto", padding: "1rem", borderBottom: "1px solid #3e4451" }}>
        {messages.map((msg, index) => (
          <div
            key={msg._id || index}
            style={{
              textAlign: msg.sender === localStorage.getItem("id") ? "right" : "left",
              marginBottom: "0.75rem",
              display: "flex",
              justifyContent: msg.sender === localStorage.getItem("id") ? "flex-end" : "flex-start",
            }}
          >
            <div style={{ backgroundColor: msg.sender === localStorage.getItem("id") ? "#3e4451" : "#21252b", padding: "0.75rem 1rem", borderRadius: "16px", maxWidth: "70%", wordWrap: "break-word" }}>
              <p style={{ margin: 0, color: "#abb2bf" }}>{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: "flex", marginTop: "1rem" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          style={{ flexGrow: 1, padding: "0.75rem 1rem", borderRadius: "24px", border: "1px solid #3e4451", backgroundColor: "#21252b", color: "#abb2bf", outline: "none" }}
        />
        <button
          onClick={sendMessage}
          style={{ backgroundColor: "#61dafb", color: "#282c34", border: "none", padding: "0.75rem 1.5rem", borderRadius: "24px", marginLeft: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: "0.5rem" }} /> Send
        </button>
      </div>
    </div>
  );
}