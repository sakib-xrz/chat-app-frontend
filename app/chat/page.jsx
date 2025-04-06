"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserThreadsQuery } from "@/redux/features/chat/chatApi";
import { useGetProfileQuery } from "@/redux/features/auth/authApi";
import { logout } from "@/redux/features/auth/authSlice";
import { initializeSocket, closeSocket } from "@/services/socketService";
import Sidebar from "@/components/chat/Sidebar";
import ChatArea from "@/components/chat/ChatArea";
import {
  setMessages,
  setSelectedThread,
} from "@/redux/features/chat/chatSlice";

export default function ChatPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const selectedThread = useSelector((state) => state.chat.selectedThread);

  const { data: threads = [] } = useGetUserThreadsQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const { data: user } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
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
    dispatch(setSelectedThread(null));
    dispatch(setMessages([]));
    router.push("/login");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        user={user?.data}
        threads={threads?.data}
        onLogout={handleLogout}
      />

      <ChatArea selectedThread={selectedThread} user={user?.data} />
    </div>
  );
}
