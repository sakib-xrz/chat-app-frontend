import { baseApi } from "@/redux/api/baseApi";
import { setToken } from "./authSlice";
import { tagTypes } from "@/redux/tagTypes";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `/auth/register`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const { accessToken } = result.data.data;

          if (accessToken) {
            dispatch(setToken(accessToken));
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `/auth/login`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const { accessToken } = result.data.data;

          if (accessToken) {
            dispatch(setToken(accessToken));
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getProfile: builder.query({
      query: () => ({
        url: `/auth/profile`,
        method: "GET",
      }),
      providesTags: [tagTypes.profile],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `/auth/change-password`,
        method: "POST",
        body: data,
      }),
    }),
    searchUsers: builder.query({
      query: (query) => ({
        url: `/auth/search?q=${query}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useChangePasswordMutation,
  useSearchUsersQuery,
} = authApi;
