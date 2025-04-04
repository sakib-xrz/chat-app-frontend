import { io } from "socket.io-client";
import { updateActiveUsers } from "../redux/features/chat/chatSlice";
import { BASE_URL } from "@/lib/constant";
import { baseApi } from "../redux/api/baseApi";
import { store } from "@/redux/store";

let socket;

export const initializeSocket = (token) => {
  // Close existing socket if it exists
  if (socket) {
    socket.close();
  }

  // Create new socket connection with auth token
  socket = io(BASE_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  // Socket event listeners
  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  // Listen for incoming messages
  socket.on("message:received", (message) => {
    // Invalidate the cache for the room's messages via RTK Query
    store.dispatch(
      baseApi.util.invalidateTags([{ type: "message", id: message.room_id }])
    );
  });

  // Listen for user status updates
  socket.on("user:status", (data) => {
    // Data payload from backend: { user_id, is_online, last_seen? }
    store.dispatch(updateActiveUsers(data));
  });

  return socket;
};

export const joinRoom = (roomId) => {
  if (socket) {
    // Emit the room join event with the room ID (as a string)
    socket.emit("room:join", roomId);
  }
};

export const leaveRoom = (roomId) => {
  if (socket) {
    // Emit the room leave event with the room ID (as a string)
    socket.emit("room:leave", roomId);
  }
};

export const sendMessageSocket = (roomId, content, senderId, type, fileUrl) => {
  if (socket) {
    // Emit the message send event with the proper payload
    socket.emit("message:send", {
      room_id: roomId,
      content,
      sender_id: senderId,
      type, // optional: defaults to TEXT on backend if omitted
      file_url: fileUrl, // optional
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
  closeSocket,
};
