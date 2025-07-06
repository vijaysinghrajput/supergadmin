import React, { useState, useMemo, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { Calendar } from "primereact/calendar";
import { BiSearch } from "react-icons/bi";
import { useQuery } from "react-query";
import Cookies from "universal-cookie";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

import { ActionForSaleList } from "./ActionForSaleList";
import URLDomain from "../../../URL";
import { queryClient } from "../../../App";

import "primereact/resources/themes/lara-light-cyan/theme.css";

const cookies = new Cookies();

const SaleDataTable = () => {
  const adminStoreId = cookies.get("adminStoreId");
  const [selectedFilter, setSelectedFilter] = useState("today");
  const [customDateRange, setCustomDateRange] = useState([null, null]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  useEffect(() => {
    console.log("Admin Store ID:", adminStoreId);
  }, [adminStoreId]);

  const filterOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "this_week" },
    { label: "This Month", value: "this_month" },
    { label: "This Year", value: "this_year" },
    { label: "Custom Date", value: "custom" },
  ];

  const formatDate = (dateObj) => {
    if (!dateObj) return null;
    const d = new Date(dateObj);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchSaleData = async () => {
    const body = {
      store_id: adminStoreId,
      filterType: selectedFilter,
    };

    if (
      selectedFilter === "custom" &&
      customDateRange[0] &&
      customDateRange[1]
    ) {
      body.customStartDate = formatDate(customDateRange[0]);
      body.customEndDate = formatDate(customDateRange[1]);
    }

    console.log("Sending Request Body:", body);

    const res = await fetch(URLDomain + "/APP-API/Billing/sale_history", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return res.json();
  };

  const { data, isLoading, refetch, isFetching } = useQuery(
    ["offline_sale_history", selectedFilter, customDateRange],
    fetchSaleData
  );

  const saleData = data?.store_customer_purchase_record || [];
  const msgHeading = data?.msg_heading || "";

  const getSeverity = (status) => {
    const map = {
      Placed: "dark",
      Confirmed: "success",
      "Preparing for dispatch": "warning",
      "On the way": "info",
      Delivered: "primary",
      Canceled: "danger",
      Sold: "success",
    };
    return map[status] || null;
  };

  const statusBodyTemplate = (rowData) => (
    <Tag
      value={rowData.order_status}
      severity={getSeverity(rowData.order_status)}
    />
  );

  const actionBodyTemplate = (rowData) => <ActionForSaleList id={rowData} />;

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const renderHeader = useMemo(
    () => (
      <div className="row align-items-center">
        <div className="col-sm-3">
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <BiSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search"
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
            />
          </InputGroup>
        </div>

        <div className="col-sm-3">
          <Dropdown
            value={selectedFilter}
            options={filterOptions}
            onChange={(e) => {
              setSelectedFilter(e.value);
              if (e.value !== "custom") refetch();
            }}
            placeholder="Select Filter"
            className="w-full"
          />
        </div>

        {selectedFilter === "custom" && (
          <div className="col-sm-4">
            <Calendar
              selectionMode="range"
              value={customDateRange}
              onChange={(e) => setCustomDateRange(e.value)}
              readOnlyInput
              maxDate={new Date()}
              placeholder="Pick Date Range"
            />
            <button className="btn btn-primary mt-2" onClick={() => refetch()}>
              Apply
            </button>
          </div>
        )}
      </div>
    ),
    [globalFilterValue, selectedFilter, customDateRange]
  );

  return (
    <div className="card">
      <div className="row">
        <div className="col-sm-12">
          <p>{msgHeading}</p>
        </div>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          value={saleData}
          paginator
          rows={10}
          header={renderHeader}
          emptyMessage="No Sale found."
          tableStyle={{ minWidth: "50rem" }}
          loading={isFetching}
          globalFilterFields={[
            "customer_mobile",
            "order_id",
            "plateform",
            "total_payment",
            "order_status",
            "date",
          ]}
          filters={{
            global: { value: globalFilterValue, matchMode: "contains" },
          }}
        >
          <Column field="customer_mobile" header="Mobile" sortable />
          <Column field="order_id" header="Order No" sortable />
          <Column field="plateform" header="Platform" sortable />
          <Column field="total_payment" header="Payment" sortable />
          <Column field="date" header="Date" sortable />
          <Column
            field="order_status"
            header="Status"
            body={statusBodyTemplate}
          />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
      )}
    </div>
  );
};

export default React.memo(SaleDataTable);
SaleDataTable.displayName = "SaleDataTable";
