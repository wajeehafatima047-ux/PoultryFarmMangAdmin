import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";

function ChatConversation() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [chatThread, setChatThread] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chatId) {
      navigate("/chat");
      return;
    }

    loadChatThread();
    setupMessagesListener();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatThread = async () => {
    try {
      const { getDoc } = await import("firebase/firestore");
      const chatRef = doc(db, "chatThreads", chatId);
      const chatSnap = await getDoc(chatRef);

      if (chatSnap.exists()) {
        setChatThread({ id: chatSnap.id, ...chatSnap.data() });
        
        // Mark as read
        await updateDoc(chatRef, {
          unreadCount: 0,
        });
      } else {
        toast.error("Chat not found");
        navigate("/chat");
      }
    } catch (error) {
      console.error("Error loading chat thread:", error);
      toast.error("Failed to load chat");
    }
  };

  const setupMessagesListener = () => {
    if (!chatId) return;

    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("chatId", "==", chatId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const chatMessages = [];
        snapshot.forEach((doc) => {
          chatMessages.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setMessages(chatMessages);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to messages:", error);
        toast.error("Failed to load messages");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  };

  const sendMessage = async () => {
    if (!message.trim() || !chatId) return;

    setSending(true);
    try {
      // Add message
      await addDoc(collection(db, "chats"), {
        chatId: chatId,
        userId: chatThread?.userId || "",
        userName: chatThread?.userName || "User",
        message: message.trim(),
        sender: "admin",
        createdAt: Timestamp.now(),
        read: false,
      });

      // Update chat thread
      const chatRef = doc(db, "chatThreads", chatId);
      await updateDoc(chatRef, {
        lastMessage: message.trim(),
        lastMessageTime: Timestamp.now(),
        unreadCount: 0,
      });

      setMessage("");
      toast.success("Message sent");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "";
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
        });
      }
    } catch (error) {
      return "";
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div>Loading conversation...</div>
      </div>
    );
  }

  if (!chatThread) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div>Chat not found</div>
      </div>
    );
  }

  let currentDate = null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 80px)" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => navigate("/chat")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 20,
              padding: "4px 8px",
            }}
          >
            ←
          </button>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "#8B1E23",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "600",
              fontSize: 20,
            }}
          >
            {chatThread.userName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: "600", color: "#111" }}>
              {chatThread.userName || "Unknown User"}
            </div>
            <div style={{ fontSize: 13, color: "#6B7280" }}>
              {chatThread.userEmail || "No email"}
              {chatThread.userPhone && ` • ${chatThread.userPhone}`}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          backgroundColor: "#FAF5EF",
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6B7280" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
            <div>No messages yet. Start the conversation!</div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const messageDate = formatDate(msg.createdAt);
            const showDate = messageDate !== currentDate;
            if (showDate) currentDate = messageDate;

            const isAdmin = msg.sender === "admin";

            return (
              <React.Fragment key={msg.id}>
                {showDate && (
                  <div
                    style={{
                      textAlign: "center",
                      margin: "20px 0",
                      color: "#9CA3AF",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {messageDate}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: isAdmin ? "flex-end" : "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      backgroundColor: isAdmin ? "#8B1E23" : "#FFFFFF",
                      color: isAdmin ? "#FFFFFF" : "#111",
                      padding: "12px 16px",
                      borderRadius: 16,
                      borderBottomRightRadius: isAdmin ? 4 : 16,
                      borderBottomLeftRadius: isAdmin ? 16 : 4,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 4 }}>
                      {msg.message}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        opacity: 0.7,
                        textAlign: "right",
                      }}
                    >
                      {formatTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #E5E7EB",
          padding: "16px 20px",
          display: "flex",
          gap: 12,
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "12px 16px",
            border: "1px solid #E5E7EB",
            borderRadius: 24,
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!message.trim() || sending}
          style={{
            backgroundColor: sending || !message.trim() ? "#9CA3AF" : "#8B1E23",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 24,
            padding: "12px 24px",
            cursor: sending || !message.trim() ? "not-allowed" : "pointer",
            fontWeight: "600",
            fontSize: 14,
            transition: "background-color 0.2s",
          }}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatConversation;

