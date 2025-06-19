import { ReactElement, useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import TableHOC from "../components/admin/TableHOC";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMyOrdersQuery } from "../redux/api/orderApi";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import { RootState } from "../redux/store";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const column: ColumnDef<DataType>[] = [
  {
    header: "ID",
    accessorKey: "_id",
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
  },
  {
    header: "Discount",
    accessorKey: "discount",
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Action",
    accessorKey: "action",
  },
];

export default function Orders() {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, isError, error } = useMyOrdersQuery(
    user ? user._id : "",
  );

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err?.data?.message || "Something went wrong");
    }
  }, [isError, error]);

  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(() => {
    if (data) {
      setRows(
        data.orders.map((i) => ({
          _id: i._id,
          amount: i.total,
          discount: i.discount,
          quantity: i.orderItems.length,
          status: (
            <span
              className={
                i.status === "Processing"
                  ? "red"
                  : i.status === "Shipped"
                  ? "green"
                  : "purple"
              }
            >
              {i.status}
            </span>
          ),
          action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>,
        })),
      );
    } else {
      console.log("No products yet or products undefined");
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-product-box",
    "Orders",
    rows.length > 6,
  )();

  return (
    <div className="container">
      <h1>My Orders</h1>
      {isLoading ? <Skeleton length={20} /> : Table}
    </div>
  );
}
