import {
  flexRender,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import { useState } from "react";
import { isValidElement } from "react";

function TableHOC<T extends object>(
  columns: ColumnDef<T>[],
  data: T[],
  containerClassname: string,
  heading: string,
  showPagination: boolean = false,
  pageSize: number = 6, // Allow pageSize as a prop
) {
  return function HOC() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize,
    });

    const table = useReactTable({
      columns,
      data,
      state: {
        sorting,
        pagination,
      },
      onSortingChange: setSorting,
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });

    return (
      <div className={containerClassname}>
        <h2 className="heading">{heading}</h2>

        <table className="table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getIsSorted() && (
                      <span>
                        {header.column.getIsSorted() === "desc" ? " 🔽" : " 🔼"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              // <tr key={row.id}>
              //   {row.getVisibleCells().map((cell) => (

              //     <td key={cell.id}>
              //       {flexRender(cell.column.columnDef.cell, cell.getContext())}
              //     </td>
              //   ))}
              // </tr>

              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const cellValue = cell.getValue();

                  if (isValidElement(cellValue)) {
                    return <td key={cell.id}>{cellValue}</td>;
                  }

                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {showPagination && (
          <div className="table-pagination">
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              Prev
            </button>
            <span>{`${
              table.getState().pagination.pageIndex + 1
            } of ${table.getPageCount()}`}</span>
            <button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };
}

export default TableHOC;
