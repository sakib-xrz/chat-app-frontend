import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserRooms: builder.query({
      query: () => ({
        url: `/chat/rooms`,
        method: "GET",
      }),
      providesTags: [tagTypes.room],
    }),
    createRoom: builder.mutation({
      query: (data) => ({
        url: `/chat/rooms`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.room],
    }),
    getRoomDetails: builder.query({
      query: (roomId) => ({
        url: `/chat/rooms/${roomId}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [{ type: tagTypes.room, id: arg }],
    }),
    addUserToRoom: builder.mutation({
      query: ({ roomId, userId }) => ({
        url: `/chat/rooms/users`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: tagTypes.room, id: arg.roomId },
      ],
    }),
    removeUserFromRoom: builder.mutation({
      query: ({ roomId, userId }) => ({
        url: `/chat/rooms/${roomId}/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: tagTypes.room, id: arg.roomId },
      ],
    }),
    updateUserRole: builder.mutation({
      query: ({ roomId, userId, role }) => ({
        url: `/chat/rooms/${roomId}/users/${userId}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: tagTypes.room, id: arg.roomId },
      ],
    }),
    getMessagesByRoomId: builder.query({
      query: (roomId) => ({
        url: `/chat/rooms/${roomId}/messages`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [
        { type: tagTypes.message, id: arg },
      ],
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: `/chat/messages`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: tagTypes.message, id: arg.roomId },
      ],
    }),
    uploadFile: builder.mutation({
      query: ({ roomId, file }) => {
        const formData = new FormData();
        formData.append("roomId", roomId);
        formData.append("file", file);

        return {
          url: `/chat/messages/file`,
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: tagTypes.message, id: arg.roomId },
      ],
    }),
    editMessage: builder.mutation({
      query: ({ messageId, content }) => ({
        url: `/chat/messages`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: (result, error, arg) => [tagTypes.message],
    }),
    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `/chat/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.message],
    }),
    markMessageAsRead: builder.mutation({
      query: (messageId) => ({
        url: `/chat/messages/${messageId}/read`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetUserRoomsQuery,
  useCreateRoomMutation,
  useGetRoomDetailsQuery,
  useAddUserToRoomMutation,
  useRemoveUserFromRoomMutation,
  useUpdateUserRoleMutation,
  useGetMessagesByRoomIdQuery,
  useSendMessageMutation,
  useUploadFileMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useMarkMessageAsReadMutation,
} = chatApi;
