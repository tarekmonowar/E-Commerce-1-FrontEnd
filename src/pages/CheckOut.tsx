import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";

import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { responseToast } from "../utils/features";
import { useNewOrderMutation } from "../redux/api/orderApi";
import { resetCart } from "../redux/reducer/cartReducer";
import { useDispatch, useSelector } from "react-redux";
import { NewOrderRequest } from "../types/api-types";
import { RootState } from "../redux/store";

// Load Stripe outside component to avoid recreating it on every render
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY as string,
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const {
    shippingInfo,
    cartItems,
    subtotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cartReducer);

  const [isProcessing, setIsProcessing] = useState(false);

  const [newOrder] = useNewOrderMutation();

  // Confirm payment on form submit
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const orderData: NewOrderRequest = {
      shippingInfo,
      orderItems: cartItems,
      subtotal,
      tax,
      discount,
      shippingCharges,
      total,
      user: user ? user._id : "",
    };

    // Confirm the payment with Stripe.js
    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirect here after successful payment
        return_url: window.location.origin,
      },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      return toast.error(error.message || "Something Went Wrong");
    }

    if (paymentIntent.status === "succeeded") {
      //* new order create in backend
      const res = await newOrder(orderData);
      dispatch(resetCart());
      responseToast(res, navigate, "/orders");
    }
    setIsProcessing(false);
  };

  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
};

export default function CheckOut() {
  const location = useLocation();

  const clientSecret: string | undefined = location.state;

  if (!clientSecret) return <Navigate to={"/shipping"} />;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
}
