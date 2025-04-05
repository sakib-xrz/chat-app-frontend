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
  }),
});

export const { useGetUserThreadsQuery } = chatApi;
