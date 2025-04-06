"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { Send, Paperclip } from "lucide-react";

import { messageSchema } from "@/schemas/validationSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatMessengerTime } from "@/lib/utils";
import { useGetMessageByThreadIdQuery } from "@/redux/features/chat/chatApi";
import { setMessages } from "@/redux/features/chat/chatSlice";
import { AvatarImage } from "@radix-ui/react-avatar";

export default function ChatArea({ selectedThread, user }) {
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const messages = useSelector((state) => state.chat.messages);

  const { data: messagesData = [], isLoading } = useGetMessageByThreadIdQuery(
    selectedThread?.id,
    {
      skip: !selectedThread?.id,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  useEffect(() => {
    dispatch(setMessages(messagesData?.data));
    scrollToBottom();
  }, [messagesData, dispatch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formik = useFormik({
    initialValues: {
      content: "",
    },
    validationSchema: messageSchema,
    onSubmit: async (values, { resetForm }) => {
      // if (editingMessageId) {
      //   await editMessage({
      //     messageId: editingMessageId,
      //     content: values.content,
      //   });
      //   setEditingMessageId(null);
      // } else if (selectedThread?.id) {
      //   await sendMessage({
      //     roomId: selectedThread.id,
      //     content: values.content,
      //   });
      //   sendMessageSocket(selectedThread.id, values.content);
      // }
      // resetForm();
    },
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && selectedThread?.id) {
      await uploadFile({ roomId: selectedThread.id, file });
    }
  };

  if (!selectedThread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Welcome to Chat App
          </h2>
          <p className="text-gray-500 mt-2">
            Select a conversation to start chatting
          </p>
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
              {selectedThread?.participant?.name}
            </h2>
            <p className="text-sm text-gray-500">
              {selectedThread?.participant?.is_online
                ? "Online"
                : `Last seen ${formatMessengerTime(
                    selectedThread?.participant?.last_seen
                  )}`}
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 bg-gray-50">
        {messages?.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender.id === user?.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="relative group max-w-xs sm:max-w-md">
                  {message.sender.id !== user?.id && (
                    <Avatar className="absolute -left-10 top-0">
                      <AvatarImage src={message.sender?.image} />
                      <AvatarFallback>
                        {message.sender?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.sender.id === user?.id
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    {message.sender.id !== user?.id && (
                      <div className="font-semibold text-xs mb-1">
                        {message.sender.name}
                      </div>
                    )}

                    {<p>{message.content}</p>}

                    <div
                      className={`text-xs mt-1 ${
                        message.sender.id === user?.id
                          ? "text-blue-200"
                          : "text-gray-500"
                      }`}
                    >
                      {formatMessengerTime(message.created_at)}
                    </div>
                  </div>
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
            placeholder={"Type a message..."}
            className="flex-1 rounded-full"
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <Button type="submit" size="icon" className="rounded-full">
            {<Send size={20} />}
          </Button>
        </form>
        {formik.touched.content && formik.errors.content && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.content}</p>
        )}
      </div>
    </div>
  );
}
