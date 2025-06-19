import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

import { useLatestProductsQuery } from "../redux/api/productApi";
import { Skeleton } from "../components/Loader";
import { CartItem } from "../types/types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartReducerInitialState } from "../types/reducer-types";

const Home = () => {
  const { data, isError, isLoading } = useLatestProductsQuery("");

  const dispatch = useDispatch();
  const { cartItems } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer,
  );

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

  if (isError) toast.error("Cannot Fetch the Products");

  return (
    <>
      <div className="home">
        {/* ati dore style a image add kora hoyeche */}
        <section>TAREK</section>

        <div></div>

        <h1>
          Latest Products
          <Link to="/search" className="findmore">
            More
          </Link>
        </h1>

        <main>
          {isLoading ? (
            <>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{ height: "25rem" }}>
                  <Skeleton width="18.75rem" length={1} height="20rem" />
                  <Skeleton width="18.75rem" length={2} height="1.95rem" />
                </div>
              ))}
            </>
          ) : (
            data?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
                photos={i.photo}
              />
            ))
          )}
        </main>
      </div>
    </>
  );
};

export default Home;
