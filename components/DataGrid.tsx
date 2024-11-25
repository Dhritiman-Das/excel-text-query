"use client";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ColDef } from "ag-grid-community";
import { CarListing } from "@/lib/types";

interface DataGridProps {
  data: CarListing[] | null;
}

export default function DataGrid({ data }: DataGridProps) {
  const [columnDefs] = useState<ColDef[]>([
    {
      field: "brand",
      filter: true,
      sort: "asc",
    },
    {
      field: "model",
      filter: true,
    },
    {
      field: "year",
      filter: "agNumberColumnFilter",
      sort: "desc",
    },
    { field: "age" },
    { field: "kmDriven" },
    {
      field: "transmission",
      filter: true,
    },
    {
      field: "owner",
      filter: true,
    },
    {
      field: "fuelType",
      filter: true,
    },
    { field: "postedDate" },
    {
      field: "description",
      width: 300,
    },
    { field: "askPrice" },
    // { field: "askPriceInInt" },
  ]);

  return (
    <div className="ag-theme-alpine w-full h-full">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={data || []}
        pagination={true}
        paginationAutoPageSize={true}
      />
    </div>
  );
}
