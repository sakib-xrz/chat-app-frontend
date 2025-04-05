// socketService.js
import { io } from "socket.io-client";
import { updateActiveUsers } from "../redux/features/chat/chatSlice";
import { baseApi } from "../redux/api/baseApi";
import { store } from "@/redux/store";

let socket;

export const initializeSocket = (token) => {
  // Close any existing socket connection
  if (socket) {
    socket.close();
  }

  // Create a new socket connection with the provided auth token
  socket = io("http://localhost:8000", {
    auth: { token },
  });

  // Basic connection events
  socket.on("connect", () => {
    console.log("Socket connected", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  // Listen for incoming messages
  socket.on("message:received", (message) => {
    console.log("Message received", message);
    // Invalidate the cache for messages in the room using RTK Query
    store.dispatch(
      baseApi.util.invalidateTags([{ type: "message", id: message.room_id }])
    );
  });

  // Listen for message edits
  socket.on("message:edited", (updatedMessage) => {
    console.log("Message edited", updatedMessage);
    // TODO: Update the edited message in your UI or Redux store
  });

  // Listen for message deletions
  socket.on("message:deleted", (data) => {
    console.log("Message deleted", data);
    // TODO: Remove or mark the message as deleted in your UI
  });

  // Listen for read receipt updates
  socket.on("message:read", (data) => {
    console.log("Message read", data);
    // TODO: Update the message read status in your UI or store
  });

  // Listen for notifications (e.g., new message notifications)
  socket.on("notification:new", (notification) => {
    console.log("New notification", notification);
    // TODO: Handle notifications (e.g., dispatch an action to update notifications)
  });

  // Listen for typing indicator updates
  socket.on("typing:update", (data) => {
    console.log("Typing update", data);
    // TODO: Update the typing indicator in your UI (data.room_id, data.user, data.is_typing)
  });

  // Listen for user status updates (online/offline)
  socket.on("user:status", (data) => {
    console.log("user:status", data);

    store.dispatch(baseApi.util.invalidateTags([{ type: "room" }]));
  });

  // Listen for group events
  socket.on("group:userAdded", (data) => {
    console.log("User added to group", data);
    // TODO: Update your UI to reflect the new group member
  });

  socket.on("group:userRemoved", (data) => {
    console.log("User removed from group", data);
    // TODO: Update your UI to reflect the removal
  });

  socket.on("group:roleUpdated", (data) => {
    console.log("Group user role updated", data);
    // TODO: Update the group role changes in your UI or store
  });

  return socket;
};

export const joinRoom = (roomId) => {
  if (socket) {
    socket.emit("room:join", roomId);
  }
};

export const leaveRoom = (roomId) => {
  if (socket) {
    socket.emit("room:leave", roomId);
  }
};

export const sendMessageSocket = (roomId, content, senderId, type, fileUrl) => {
  if (socket) {
    socket.emit("message:send", {
      room_id: roomId,
      content,
      sender_id: senderId,
      type, // optional: defaults to TEXT on the server if omitted
      file_url: fileUrl, // optional file URL
    });
  }
};

export const editMessageSocket = (messageId, content, senderId) => {
  if (socket) {
    socket.emit("message:edit", { messageId, content, senderId });
  }
};

export const deleteMessageSocket = (messageId, senderId) => {
  if (socket) {
    socket.emit("message:delete", {
      message_id: messageId,
      sender_id: senderId,
    });
  }
};

export const markMessageAsRead = (messageId, userId) => {
  if (socket) {
    socket.emit("message:read", { message_id: messageId, user_id: userId });
  }
};

export const startTyping = (roomId, userId) => {
  if (socket) {
    socket.emit("typing:start", { room_id: roomId, user_id: userId });
  }
};

export const stopTyping = (roomId, userId) => {
  if (socket) {
    socket.emit("typing:stop", { room_id: roomId, user_id: userId });
  }
};

export const addUserToGroup = (roomId, userId, targetUserId, role) => {
  if (socket) {
    socket.emit("group:addUser", {
      room_id: roomId,
      user_id: userId,
      target_user_id: targetUserId,
      role, // optional: defaults to MEMBER on the server if omitted
    });
  }
};

export const removeUserFromGroup = (roomId, userId, targetUserId) => {
  if (socket) {
    socket.emit("group:removeUser", {
      room_id: roomId,
      user_id: userId,
      target_user_id: targetUserId,
    });
  }
};

export const updateGroupUserRole = (roomId, userId, targetUserId, role) => {
  if (socket) {
    socket.emit("group:updateRole", {
      room_id: roomId,
      user_id: userId,
      target_user_id: targetUserId,
      role,
    });
  }
};

export const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

export default {
  initializeSocket,
  joinRoom,
  leaveRoom,
  sendMessageSocket,
  editMessageSocket,
  deleteMessageSocket,
  markMessageAsRead,
  startTyping,
  stopTyping,
  addUserToGroup,
  removeUserFromGroup,
  updateGroupUserRole,
  closeSocket,
};
