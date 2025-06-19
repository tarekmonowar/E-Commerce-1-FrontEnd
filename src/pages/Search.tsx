import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productApi";
import toast from "react-hot-toast";
import { CustomError } from "../types/api-types";
import { Skeleton } from "../components/Loader";
import { CartItem } from "../types/types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartReducerInitialState } from "../types/reducer-types";

export default function Search() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  // Pagination logic
  const isPrevPage = page > 1;
  const isNextPage = page < 4;
  // Fetching categories and products by using RTK Query hooks
  const { data, isError, error, isLoading } = useCategoriesQuery("");
  const {
    data: searchProducts,
    isError: searchIsError,
    error: searchError,
    isLoading: searchLoading,
  } = useSearchProductsQuery({
    price: maxPrice,
    search,
    sort,
    category,
    page,
  });

  const { cartItems } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer,
  );

  useEffect(() => {
    const handleError = (err: unknown) => {
      const errorObj = err as CustomError;
      toast.error(errorObj?.data?.message || "Something went wrong");
    };

    if (isError) handleError(error);
    if (searchIsError) handleError(searchError);
  }, [isError, error, searchIsError, searchError]);

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) {
      return toast.error("Out of Stock");
    }

    const alreadyInCart = cartItems.some(
      (item) => item.productId === cartItem.productId,
    );

    if (alreadyInCart) {
      return toast.error("Item already in cart");
    }

    dispatch(addToCart(cartItem));
    toast.success("Item added to cart!");
  };

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filter</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price(Low to High)</option>
            <option value="dsc">Price(High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price : {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            {!isLoading &&
              data?.categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
          </select>
        </div>
      </aside>

      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {searchLoading ? (
          <Skeleton length={20} />
        ) : (
          <div className="search-product-list">
            {searchProducts?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
                photos={i.photo}
              />
            ))}
          </div>
        )}
        {searchProducts && searchProducts.totalPage > 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {searchProducts.totalPage}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
}
