"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  Send,
  Paperclip,
  MoreVertical,
  Edit,
  Trash2,
  Check,
} from "lucide-react";
import {
  useGetMessagesByRoomIdQuery,
  useSendMessageMutation,
  useDeleteMessageMutation,
  useEditMessageMutation,
  useUploadFileMutation,
} from "@/redux/features/chat/chatApi";
import {
  joinRoom,
  leaveRoom,
  sendMessageSocket,
} from "@/services/socketService";
import { messageSchema } from "@/schemas/validationSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ChatArea({ currentRoom }) {
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const [editingMessageId, setEditingMessageId] = useState(null);

  const { data: messages = [] } = useGetMessagesByRoomIdQuery(
    currentRoom?._id,
    {
      skip: !currentRoom?._id,
      pollingInterval: 5000, // Poll every 5 seconds as a fallback
    }
  );

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [editMessage] = useEditMessageMutation();
  const [uploadFile] = useUploadFileMutation();

  useEffect(() => {
    if (currentRoom?._id) {
      joinRoom(currentRoom._id);
    }

    return () => {
      if (currentRoom?._id) {
        leaveRoom(currentRoom._id);
      }
    };
  }, [currentRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formik = useFormik({
    initialValues: {
      content: "",
    },
    validationSchema: messageSchema,
    onSubmit: async (values, { resetForm }) => {
      if (editingMessageId) {
        await editMessage({
          messageId: editingMessageId,
          content: values.content,
        });
        setEditingMessageId(null);
      } else if (currentRoom?._id) {
        await sendMessage({ roomId: currentRoom._id, content: values.content });
        sendMessageSocket(currentRoom._id, values.content);
      }
      resetForm();
    },
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && currentRoom?._id) {
      await uploadFile({ roomId: currentRoom._id, file });
    }
  };

  const handleEditMessage = (message) => {
    setEditingMessageId(message._id);
    formik.setFieldValue("content", message.content);
  };

  const handleDeleteMessage = async (messageId) => {
    await deleteMessage(messageId);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!currentRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Welcome to Chat App
          </h2>
          <p className="text-gray-500 mt-2">Select a room to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {" "}
              {currentRoom?.type === "GROUP"
                ? currentRoom?.name
                : currentRoom?.participants[1]?.user?.name}
            </h2>
            <p className="text-sm text-gray-500">
              {currentRoom?.type === "GROUP"
                ? `${currentRoom.participants?.length || 0} members`
                : currentRoom?.participants[1]?.user?.is_online
                ? "Online"
                : currentRoom?.participants[1]?.user?.last_seen}
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 bg-gray-50">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.sender._id === user?._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="relative group max-w-xs sm:max-w-md">
                  {message.sender._id !== user?._id && (
                    <Avatar className="absolute -left-10 top-0">
                      <AvatarFallback>
                        {message.sender.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.sender._id === user?._id
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    {message.sender._id !== user?._id && (
                      <div className="font-semibold text-xs mb-1">
                        {message.sender.username}
                      </div>
                    )}

                    {message.fileUrl ? (
                      <div>
                        {message.fileType?.startsWith("image/") ? (
                          <img
                            src={message.fileUrl || "/placeholder.svg"}
                            alt="Uploaded"
                            className="max-w-full rounded"
                          />
                        ) : (
                          <a
                            href={message.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-300 hover:text-blue-100"
                          >
                            <Paperclip size={16} className="mr-1" />
                            {message.fileName || "Attachment"}
                          </a>
                        )}
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}

                    <div
                      className={`text-xs mt-1 ${
                        message.sender._id === user?._id
                          ? "text-blue-200"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </div>
                  </div>

                  {message.sender._id === user?._id && (
                    <div className="absolute top-0 right-0 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white shadow"
                          >
                            <MoreVertical size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditMessage(message)}
                          >
                            <Edit size={14} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteMessage(message._id)}
                            className="text-red-600"
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet</p>
          </div>
        )}
      </ScrollArea>

      <div className="p-4 bg-white border-t border-gray-200">
        <form
          onSubmit={formik.handleSubmit}
          className="flex items-center space-x-2"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current.click()}
            className="rounded-full"
          >
            <Paperclip size={20} />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <Input
            name="content"
            placeholder={
              editingMessageId ? "Edit your message..." : "Type a message..."
            }
            className="flex-1 rounded-full"
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <Button
            type="submit"
            size="icon"
            disabled={!formik.values.content.trim() || isSending}
            className="rounded-full"
          >
            {editingMessageId ? <Check size={20} /> : <Send size={20} />}
          </Button>
        </form>
        {formik.touched.content && formik.errors.content && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.content}</p>
        )}
      </div>
    </div>
  );
}
