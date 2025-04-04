import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  socketConnected,
  socketDisconnected,
} from "../redux/features/socket/socketSlice";
import { getSocket, initializeSocket } from "@/lib/socket";

export const useSocket = (token) => {
  const dispatch = useDispatch();
  const { connected, socketId } = useSelector((state) => state.socket);

  useEffect(() => {
    const socket = initializeSocket(token);
    console.log("socket", socket);

    const onConnect = () => {
      dispatch(socketConnected(socket.id));
    };

    const onDisconnect = () => {
      dispatch(socketDisconnected());
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // If socket is already connected when hook mounts
    if (socket.connected) {
      dispatch(socketConnected(socket.id));
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [dispatch, token]);

  return { connected, socketId, socket: getSocket() };
};
