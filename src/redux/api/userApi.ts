import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllUsersResponse,
  DeleteUserRequest,
  MessageResponse,
  UserResponse,
} from "../../types/api-types";
import { User } from "../../types/types";
import axios from "axios";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user`,
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: "/new",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),

    deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
      query: ({ userId, adminUserId }) => ({
        url: `/${userId}?id=${adminUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    allUsers: builder.query<AllUsersResponse, string>({
      query: (id) => `/all?id=${id}`,
      providesTags: ["users"],
    }),
  }),
});

export const getUser = async (id: string) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`,
    );
    const data: UserResponse = res.data;
    return data;
  } catch (error) {
    console.error("Failed to fetch user:", error); // ✅ useful side effect
    throw error;
  }
};

export const { useLoginMutation, useAllUsersQuery, useDeleteUserMutation } =
  userApi;
