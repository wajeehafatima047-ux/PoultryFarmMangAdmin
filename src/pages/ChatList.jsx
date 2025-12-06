import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ChatList() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const chatThreadsRef = collection(db, "chatThreads");
    const q = query(chatThreadsRef, orderBy("lastMessageTime", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const chatList = [];
        snapshot.forEach((doc) => {
          chatList.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setChats(chatList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching chats:", error);
        toast.error("Failed to load chats");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return "No messages";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);

      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
      
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Unknown";
    }
  };

  const filteredChats = chats.filter((chat) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      chat.userName?.toLowerCase().includes(searchLower) ||
      chat.userEmail?.toLowerCase().includes(searchLower) ||
      chat.userPhone?.includes(searchTerm) ||
      chat.lastMessage?.toLowerCase().includes(searchLower)
    );
  });

  const handleChatClick = async (chatId) => {
    try {
      // Mark chat as read
      const chatRef = doc(db, "chatThreads", chatId);
      await updateDoc(chatRef, {
        unreadCount: 0,
      });
      
      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error("Error updating chat:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div>Loading chats...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Customer Chats</h2>
        <div style={{ fontSize: "14px", color: "#6B7280" }}>
          {chats.length} {chats.length === 1 ? "conversation" : "conversations"}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 400,
            padding: "10px 15px",
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            fontSize: 14,
          }}
        />
      </div>

      {filteredChats.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#6B7280" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
          <div style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
            {searchTerm ? "No chats found" : "No conversations yet"}
          </div>
          <div style={{ fontSize: 14 }}>
            {searchTerm ? "Try a different search term" : "Customer messages will appear here"}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                padding: 16,
                cursor: "pointer",
                border: "1px solid #E5E7EB",
                transition: "all 0.2s",
                boxShadow: chat.unreadCount > 0 ? "0 2px 8px rgba(139, 30, 35, 0.1)" : "0 1px 3px rgba(0,0,0,0.1)",
                borderLeft: chat.unreadCount > 0 ? "4px solid #8B1E23" : "1px solid #E5E7EB",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F9FAFB";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "#8B1E23",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "600",
                        fontSize: 16,
                      }}
                    >
                      {chat.userName?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: "600", color: "#111" }}>
                          {chat.userName || "Unknown User"}
                        </h3>
                        {chat.unreadCount > 0 && (
                          <span
                            style={{
                              backgroundColor: "#8B1E23",
                              color: "#FFFFFF",
                              borderRadius: "12px",
                              padding: "2px 8px",
                              fontSize: 12,
                              fontWeight: "600",
                            }}
                          >
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                        {chat.userEmail || "No email"}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 14, color: "#374151", marginTop: 8 }}>
                    {chat.lastMessage || "No messages"}
                  </div>
                  {chat.userPhone && (
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                      📞 {chat.userPhone}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginLeft: 16 }}>
                  {formatTime(chat.lastMessageTime)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatList;

