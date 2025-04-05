"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserThreadsQuery } from "@/redux/features/chat/chatApi";
import { useGetProfileQuery } from "@/redux/features/auth/authApi";
import { setCurrentRoom } from "@/redux/features/chat/chatSlice";
import { logout } from "@/redux/features/auth/authSlice";
import { initializeSocket, closeSocket } from "@/services/socketService";
import Sidebar from "@/components/chat/Sidebar";
import ChatArea from "@/components/chat/ChatArea";
import CreateRoomModal from "@/components/chat/CreateRoomModal";

export default function ChatPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const { currentRoom } = useSelector((state) => state.chat);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  const { data: user } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: threads = [] } = useGetUserThreadsQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Initialize socket connection
    if (token) {
      initializeSocket(token);
    }

    // Cleanup socket connection on unmount
    return () => {
      closeSocket();
    };
  }, [isAuthenticated, token, router]);

  const handleLogout = () => {
    closeSocket();
    dispatch(logout());
    router.push("/login");
  };

  const handleRoomSelect = (room) => {
    dispatch(setCurrentRoom(room));
  };

  const toggleCreateRoomModal = () => {
    setIsCreateRoomModalOpen(!isCreateRoomModalOpen);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        user={user?.data}
        threads={threads?.data}
        currentRoom={currentRoom}
        onRoomSelect={handleRoomSelect}
        onCreateRoom={toggleCreateRoomModal}
        onLogout={handleLogout}
      />

      {/* <ChatArea currentRoom={currentRoom || roomDetails?.data} /> */}

      {/* {isCreateRoomModalOpen && (
        <CreateRoomModal onClose={toggleCreateRoomModal} />
      )} */}
    </div>
  );
}
