import { io } from "socket.io-client";

let socket;

export const initializeSocket = (token) => {
  if (!socket) {
    socket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
      {
        auth: token ? { token } : undefined,
        transports: ["websocket"],
        autoConnect: true,
      }
    );

    console.log("Socket initialized");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.log("Socket connection error:", error);
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initializeSocket first.");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = undefined;
    console.log("Socket disconnected manually");
  }
};
