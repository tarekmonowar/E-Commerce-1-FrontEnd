import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllDiscountResponse,
  createDiscountRequest,
  MessageResponse,
  singleCouponRequest,
  SingleDiscountResponse,
  updateDiscountRequest,
} from "../../types/api-types";

export const discountApi = createApi({
  reducerPath: "discountApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/coupon`,
  }),
  tagTypes: ["coupon"],

  endpoints: (builder) => ({
    allCoupon: builder.query<AllDiscountResponse, string>({
      query: (id) => `/all?id=${id}`,
      providesTags: ["coupon"],
    }),

    createDiscount: builder.mutation<MessageResponse, createDiscountRequest>({
      query: ({ formData, id }) => ({
        url: `/new?id=${id}`,
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["coupon"],
    }),

    couponDetails: builder.query<SingleDiscountResponse, singleCouponRequest>({
      query: ({ userId, couponId }) => `/${couponId}?id=${userId}`,
      providesTags: ["coupon"],
    }),

    updateDiscount: builder.mutation<MessageResponse, updateDiscountRequest>({
      query: ({ formData, userId, couponId }) => ({
        url: `/${couponId}?id=${userId}`,
        method: "PUT",
        body: formData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["coupon"],
    }),

    deleteCoupon: builder.mutation<
      MessageResponse,
      { userId: string; couponId: string }
    >({
      query: ({ userId, couponId }) => ({
        url: `/${couponId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coupon"],
    }),
  }),
});

export const {
  useAllCouponQuery,
  useCreateDiscountMutation,
  useCouponDetailsQuery,
  useUpdateDiscountMutation,
  useDeleteCouponMutation,
} = discountApi;
