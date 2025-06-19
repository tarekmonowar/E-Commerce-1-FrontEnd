import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllProductsResponse,
  CategoriesResponse,
  DeleteProductRequest,
  MessageResponse,
  NewProductRequest,
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
} = productApi;
