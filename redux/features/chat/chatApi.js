import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/tagTypes";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserThreads: builder.query({
      query: () => ({
        url: `/chat/threads`,
        method: "GET",
      }),
      providesTags: [tagTypes.thread],
    }),
    getMessageByThreadId: builder.query({
      query: (threadId) => ({
        url: `/chat/thread/${threadId}/messages`,
        method: "GET",
      }),
      providesTags: (result, error, threadId) => [
        { type: tagTypes.message, id: threadId },
      ],
    }),
    sendMessage: builder.mutation({
      query: (body) => ({
        url: `/chat/messages`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.message, tagTypes.thread],
    }),
  }),
});

export const {
  useGetUserThreadsQuery,
  useGetMessageByThreadIdQuery,
  useSendMessageMutation,
} = chatApi;
