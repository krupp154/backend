import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { ArrowLeft, Search } from "lucide-react";

const socket = io("https://backend-a9wn.onrender.com", { transports: ["websocket"] });

export default function UsersList({ currentUserName = "" }) {
  const [users, setUsers] = useState([]);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [requestSender, setRequestSender] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("id");
    socket.emit("register", userId);

    // Listen for incoming requests
    socket.on("incoming-request", async ({ senderId }) => {
      console.log("Incoming chat request from:", senderId);

      try {
        const response = await axios.get(`https://backend-a9wn.onrender.com/stranger/${senderId}`);
        setRequestSender(response.data.name || senderId); // Fallback to ID if name missing
        setPendingRequest(senderId);
      } catch (error) {
        console.error("Failed to fetch user details", error);
        setRequestSender(senderId); // Ensure it doesn't break if API fails
      }
    });


    // Handle request accepted event
    socket.on("request-accepted", ({ receiverId }) => {
      if (receiverId === localStorage.getItem("id")) {
        navigate(`/chat/${receiverId}`);
      }
    });

    // Listen for user list updates
    socket.on("user-list-updated", () => {
      console.log("User list updated, fetching new users...");
      fetchUsers();
    });
    // Fetch initial user list
    fetchUsers();

    // Fetch active users
    axios.get(`https://backend-a9wn.onrender.com/stranger/list/${userId}`).then((response) => {
      setUsers(response.data);
    });

    return () => {
      socket.off("incoming-request");
      socket.off("request-accepted");
    };
  }, []);

  const fetchUsers = () => {
    const userId = localStorage.getItem("id");
    axios.get(`https://backend-a9wn.onrender.com/stranger/list/${userId}`)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  const sendConnectionRequest = (receiverId) => {
    const senderId = localStorage.getItem("id");
    console.log(`Sending connection request from ${senderId} to ${receiverId}`);
    socket.emit("send-request", { senderId, receiverId });
  };

  const acceptRequest = () => {
    const receiverId = localStorage.getItem("id");
    console.log(`Accepting request from ${pendingRequest}`);

    // Emit event to notify both users
    socket.emit("accept-request", { senderId: pendingRequest, receiverId });


    // Navigate both users to chat
    navigate(`/chat/${pendingRequest}`);

    setPendingRequest(null);
  };

  // Listen for request-accepted event and navigate both users
  socket.on("request-accepted", ({ senderId, receiverId }) => {
    const currentUserId = localStorage.getItem("id");

    if (currentUserId === senderId || currentUserId === receiverId) {
      console.log(`Chat started between ${senderId} and ${receiverId}`);
      navigate(`/chat/${receiverId}`);
    }

  });



  const handleBack = async () => {
    const userId = localStorage.getItem("id");  // Track username
    if (userId) {
      try {
        const response = await axios.delete(`https://backend-a9wn.onrender.com/stranger/remove/${userId}`);
        console.log(response);

        // Clear stored session details
        localStorage.removeItem("id");
        localStorage.removeItem("userName");
      } catch (error) {
        console.error("Error removing user from active list:", error);
      }
    }
    navigate('/');
  };




  return (
    <div style={{ maxWidth: "1100px", margin: "20px auto", padding: "1rem", backgroundColor: "#111827", color: "white", borderRadius: "12px" }}>

      {/* Incoming Request Popup */}
      {pendingRequest && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{
            backgroundColor: "#1f2937",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            width: "400px"
          }}>
            <h3>Chat Request</h3>
            <p>User <strong>{requestSender || pendingRequest}</strong> wants to chat with you.</p>
            {/* If the name isn't fetched, fallback to ID */}

            <button
              onClick={acceptRequest}
              style={{
                backgroundColor: "#4caf50", color: "white", border: "none",
                padding: "10px 20px", borderRadius: "5px", cursor: "pointer", marginRight: "10px"
              }}>
              Accept
            </button>
            <button
              onClick={() => setPendingRequest(null)}
              style={{
                backgroundColor: "#f44336", color: "white", border: "none",
                padding: "10px 20px", borderRadius: "5px", cursor: "pointer"
              }}>
              Decline
            </button>
          </div>
        </div>
      )}


      <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <button
          style={{
            backgroundColor: "transparent", border: "1px solid #6366f1",
            color: "#6366f1", padding: "0.5rem 1rem", borderRadius: "0.5rem",
            cursor: "pointer", display: "flex", alignItems: "center"
          }}
          onClick={handleBack}
        >
          <ArrowLeft size={18} style={{ marginRight: "0.5rem" }} /> Back
        </button>
        <h2 style={{ margin: 0, marginLeft: "1rem", color: 'white' }}>Find Someone to Chat With</h2>
      </div>
      {users.map((user) => (
        <div key={user._id} style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          borderBottom: "1px solid #4b5563"
        }}>
          <span>{user.name}</span>
          <button
            onClick={() => sendConnectionRequest(user._id)}
            style={{
              backgroundColor: "#6366f1", color: "white", border: "none",
              padding: "10px 15px", borderRadius: "5px", cursor: "pointer"
            }}>
            Connect
          </button>
        </div>
      ))}
    </div>
  );
}
