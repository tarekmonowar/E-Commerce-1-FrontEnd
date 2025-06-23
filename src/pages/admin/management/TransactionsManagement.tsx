import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { useSelector } from "react-redux";
import {
  useDeleteOrderMutation,
  useOrderDetailsQuery,
  useUpdateOrderMutation,
} from "../../../redux/api/orderApi";
import { CustomError } from "../../../types/api-types";
import toast from "react-hot-toast";
import { Order } from "../../../types/types";
import { Skeleton } from "../../../components/Loader";
import { responseToast } from "./../../../utils/features";

type OrderItem = {
  name: string;
  photo: string;
  _id: string;
  quantity: number;
  price: number;
};

// type Order = {
//   name: string;
//   address: string;
//   city: string;
//   state: string;
//   country: string;
//   pinCode: number;
//   status: "Processing" | "Shipped" | "Delivered";
//   subtotal: number;
//   discount: number;
//   shippingCharges: number;
//   tax: number;
//   total: number;
//   orderItems: OrderItem[];
//   _id: string;
// };

const defaultData: Order = {
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
  status: "",
  subtotal: 0,
  discount: 0,
  shippingCharges: 0,
  tax: 0,
  total: 0,
  orderItems: [],
  user: { name: "", _id: "" },
  _id: "",
};

const TransactionManagement = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer,
  );

  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useOrderDetailsQuery(
    params.id ? params.id : "",
  );

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err?.data?.message || "Something went wrong");
      <Navigate to={"/404"} />;
    }
  }, [isError, error]);

  const {
    shippingInfo: { address, city, state, country, pinCode },
    orderItems,
    user: { name },
    status,
    subtotal,
    discount,
    tax,
    total,
    shippingCharges,
  } = data?.order || defaultData;

  const updateHandler = async () => {
    const res = await updateOrder({
      userId: user?._id || "",
      orderId: data?.order._id || "",
    });
    responseToast(res, navigate, "/admin/transaction");
  };

  const deleteHandler = async () => {
    const res = await deleteOrder({
      userId: user?._id || "",
      orderId: data?.order._id || "",
    });
    responseToast(res, navigate, "/admin/transaction");
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section
              style={{
                padding: "2rem",
              }}
            >
              <h2>Order Items</h2>

              {orderItems.map((i) => (
                <ProductCard
                  key={i._id}
                  name={i.name}
                  photo={`${i.photo}`}
                  // productId={i.productId}
                  _id={i._id}
                  quantity={i.quantity}
                  price={i.price}
                />
              ))}
            </section>

            <article className="shipping-info-card">
              <button onClick={deleteHandler} className="product-delete-btn">
                <FaTrash />
              </button>
              <h1>Order Info</h1>
              <h5>User Info</h5>
              <p>Name: {name}</p>
              <p>
                Address:{" "}
                {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
              </p>
              <h5>Amount Info</h5>
              <p>Subtotal: {subtotal}</p>
              <p>Shipping Charges: {shippingCharges}</p>
              <p>Tax: {tax}</p>
              <p>Discount: {discount}</p>
              <p>Total: {total}</p>

              <h5>Status Info</h5>
              <p>
                Status:{" "}
                <span
                  className={
                    status === "Delivered"
                      ? "purple"
                      : status === "Shipped"
                      ? "green"
                      : "red"
                  }
                >
                  {status}
                </span>
              </p>
              <button className="shipping-btn" onClick={updateHandler}>
                Process Status
              </button>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

const ProductCard = ({ name, photo, price, quantity, _id }: OrderItem) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${_id}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
