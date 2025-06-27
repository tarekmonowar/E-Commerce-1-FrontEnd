import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllProductsResponse,
  AllReviewsResponse,
  CategoriesResponse,
  DeleteProductRequest,
  DeleteReviewRequest,
  MessageResponse,
  NewProductRequest,
  NewReviewRequest,
  ProductResponse,
  SearchProductsRequest,
  SearchProductsResponse,
  UpdateProductRequest,
} from "../../types/api-types";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product`,
  }),
  tagTypes: ["products"],
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => "/latest",
      providesTags: ["products"],
    }),
    allProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `/admin-products?id=${id}`,
      providesTags: ["products"],
    }),
    categories: builder.query<CategoriesResponse, string>({
      query: () => "/category",
      providesTags: ["products"],
    }),

    searchProducts: builder.query<
      SearchProductsResponse,
      SearchProductsRequest
    >({
      query: ({ price, search, sort, category, page }) => {
        let url = `/all?page=${page}`;
        if (price) url += `&price=${price}`;
        if (search) url += `&search=${search}`;
        if (sort) url += `&sort=${sort}`;
        if (category) url += `&category=${category}`;

        return url;
      },
      providesTags: ["products"],
    }),

    ProductDetails: builder.query<ProductResponse, string>({
      query: (id) => `/${id}`,
      providesTags: ["products"],
    }),

    createProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ formData, id }) => ({
        url: `/new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["products"],
    }),

    updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
      query: ({ formData, userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["products"],
    }),
    deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),
    //*------------------------------------ review api ----------------------------------

    allReviewsOfProducts: builder.query<AllReviewsResponse, string>({
      query: (productId) => `reviews/${productId}`,
      providesTags: ["products"],
    }),

    newReview: builder.mutation<MessageResponse, NewReviewRequest>({
      query: ({ comment, rating, productId, userId }) => ({
        url: `review/new/${productId}?id=${userId}`,
        method: "POST",
        body: { comment, rating },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["products"],
    }),

    deleteReview: builder.mutation<MessageResponse, DeleteReviewRequest>({
      query: ({ reviewId, userId }) => ({
        url: `/review/${reviewId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useCreateProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAllReviewsOfProductsQuery,
  useNewReviewMutation,
  useDeleteReviewMutation,
} = productApi;
