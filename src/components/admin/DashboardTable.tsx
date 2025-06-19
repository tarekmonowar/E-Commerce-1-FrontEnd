import TableHOC from "./TableHOC";
import { ColumnDef } from "@tanstack/react-table";
// import data from "../../assets/data.json";

interface TransactionType {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: string;
}
const columns: ColumnDef<TransactionType>[] = [
  {
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "discount",
    header: "Discount",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
// const TransactionTable = TableHOC(
//   columns,
//   data.transaction,
//   "transaction-box",
//   "Top-Transactions",
//   true,
// );
const TransactionTable = ({ data = [] }: { data: TransactionType[] }) => {
  return TableHOC<TransactionType>(
    columns,
    data,
    "transaction-box",
    "Top Transaction",
  )();
};
export default TransactionTable;
