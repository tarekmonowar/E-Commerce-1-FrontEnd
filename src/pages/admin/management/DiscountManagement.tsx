import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/Loader";
import {
  useCouponDetailsQuery,
  useDeleteCouponMutation,
  useUpdateDiscountMutation,
} from "../../../redux/api/couponApi";
import { RootState } from "../../../redux/store";

const DiscountManagement = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useCouponDetailsQuery({
    userId: user ? user._id : "",
    couponId: id!,
  });

  const [updateDiscount] = useUpdateDiscountMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const [code, setCode] = useState("");
  const [amount, setAmount] = useState(0);
  // console.log("data in tm", data);

  useEffect(() => {
    if (data?.coupon) {
      setCode(data.coupon.code);
      setAmount(data.coupon.amount);
    }
  }, [data]);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    // submit handler
    e.preventDefault();

    setBtnLoading(true);

    try {
      const result = await updateDiscount({
        userId: user ? user._id : "",
        couponId: id!,
        formData: {
          code,
          amount,
        },
      }).unwrap();

      toast.success(result.message);
      setAmount(0);
      setCode("");
      navigate("/admin/discount");
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteHandler = async () => {
    setBtnLoading(true);

    try {
      const res = await deleteCoupon({
        userId: user ? user._id : "",
        couponId: id!,
      }).unwrap();

      if (res.success) {
        toast.success(res.message);
        navigate("/admin/discount");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete coupon");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>

                <div>
                  <label>Discount</label>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>

                <button disabled={btnLoading} type="submit">
                  Update
                </button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default DiscountManagement;
