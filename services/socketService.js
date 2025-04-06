// socketService.js
import { io } from "socket.io-client";
import { store } from "@/redux/store";
import { getMessages, setMessages } from "@/redux/features/chat/chatSlice";

let socket;

const notificationSound =
  "https://2u039f-a.akamaihd.net/downloads/ringtones/files/mp3/facebook-messenger-tone-wapking-fm-mp3-17015-19072-43455.mp3";

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
  socket.on("new_message", (message) => {
    console.log("Message received", message);
    const sound = new Audio(notificationSound);
    sound.play();
    const messages = getMessages(store.getState());
    store.dispatch(setMessages([...messages, message]));
  });

  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

export default {
  initializeSocket,
  closeSocket,
};
