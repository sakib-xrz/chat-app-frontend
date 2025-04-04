"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Sidebar({
  user,
  rooms,
  currentRoom,
  onRoomSelect,
  onCreateRoom,
  onLogout,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Chat App</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            aria-label="Logout"
          >
            <LogOut size={20} />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarFallback>
              {user?.username?.charAt(0).toUpperCase() || <User size={20} />}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user?.username || "User"}</p>
            <p className="text-xs text-gray-500">{user?.email || ""}</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-500">ROOMS</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCreateRoom}
              aria-label="Create new room"
            >
              <Plus size={18} />
            </Button>
          </div>

          {rooms.length > 0 ? (
            <div className="space-y-1">
              {rooms.map((room) => (
                <Button
                  key={room._id}
                  variant={
                    currentRoom?._id === room._id ? "secondary" : "ghost"
                  }
                  className="w-full justify-start h-auto py-2 px-3"
                  onClick={() => onRoomSelect(room)}
                >
                  <div className="text-left">
                    <div className="font-medium truncate">
                      {room?.type === "GROUP"
                        ? room?.name
                        : room?.participants[1]?.user?.name}
                    </div>
                    {room.lastMessage && (
                      <div className="text-xs text-gray-500 truncate">
                        {room.lastMessage.content}
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm py-4">
              {searchQuery ? "No rooms found" : "No rooms available"}
            </p>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <Link
          href="/profile"
          className="flex items-center text-gray-700 hover:text-blue-500"
        >
          <Settings size={18} className="mr-2" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
}
