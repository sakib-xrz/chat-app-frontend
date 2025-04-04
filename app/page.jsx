"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/chat");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Chat App</h1>
        <p className="text-gray-500">Redirecting...</p>
      </div>
    </div>
  );
}
