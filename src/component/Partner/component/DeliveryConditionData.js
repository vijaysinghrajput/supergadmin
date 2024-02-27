import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
import { BiSearch } from "react-icons/bi";
import { Toast } from "primereact/toast";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { DeliverySlotsListTable } from "./DeliverySlotsListTable";

import { useQuery } from "react-query";

import URLDomain from "../../../URL";
import Cookies from "universal-cookie";
import { queryClient } from "../../../App";

import "primereact/resources/themes/lara-light-cyan/theme.css";
const cookies = new Cookies();

export const DeliveryConditionData = () => {
  const navigate = useNavigate();

  const toast = useRef(null);

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [selectedMonthYear, setselectedMonthYear] = useState(null);

  const [expandedRows, setExpandedRows] = useState(null);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    order_status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [isDataLoding, setisDataLoding] = useState(true);
  const [Sale, setSale] = useState(null);
  const [SaleYear, setSaleYear] = useState(null);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");

  async function fetchData() {
    const data = await fetch(
      URLDomain + "/APP-API/Billing/deliveryCondtionData",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          store_id: adminStoreId,
          distance_km: 3,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => responseJson);

    return data;
  }

  const {
    data: deliveryCondtionData,
    isError,
    isLoading: isLoadingAPI,
    isFetching,
  } = useQuery({
    queryKey: ["deliveryCondtionData"],
    queryFn: (e) => fetchData(),
  });

  useEffect(() => {
    setSale([]);
    setSaleYear([]);
    if (deliveryCondtionData) {
      setSale(deliveryCondtionData.store_delivery_slot);
      //   setSaleYear(deliveryCondtionData.sale_year);

      console.log("SaleYear", SaleYear);

      setisDataLoding(false);
    }
  }, [deliveryCondtionData, isLoadingAPI]);

  const expandAll = () => {
    let _expandedRows = {};

    Sale.forEach((p) => (_expandedRows[`${p.id}`] = true));

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const onRowExpand = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Product Expanded",
      detail: event.data.distance_km,
      life: 3000,
    });
  };

  const onRowCollapse = (event) => {
    toast.current.show({
      severity: "success",
      summary: "Product Collapsed",
      detail: event.data.distance_km,
      life: 3000,
    });
  };

  //   const cols = [
  //     { field: "customer_mobile", header: "Mobile" },
  //     { field: "order_id", header: "ORDER NO" },
  //     { field: "total_payment", header: "Cost" },
  //     { field: "plateform", header: "Plateform" },
  //     { field: "order_status", header: "Status" },
  //     { field: "date", header: "Date" },
  //   ];

  const groupedItemTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <img
          alt={option.label}
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          className={`mr-2 flag flag-${option.code.toLowerCase()}`}
          style={{ width: "18px" }}
        />
        <div>{option.label}</div>
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.order_status}
        severity={getSeverity(rowData.order_status)}
      ></Tag>
    );
  };

  const kmTem = (rowData) => {
    return <p>{rowData.distance_km} KM</p>;
  };
  const minOrderTem = (rowData) => {
    return <p>{rowData.min_order_value} ₹</p>;
  };

  const ActionBodyTemplate = (rowData) => {
    return (
      <button
        onClick={() =>
          navigate(
            "/online/online-sales-history-record/" +
              rowData.order_id +
              "/" +
              rowData.customer_address_id
          )
        }
        className="btn btn-dark"
      >
        <i className="ri-eye me-1 align-bottom" /> BILL
      </button>
    );
  };

  const getSeverity = (value) => {
    switch (value) {
      case "Placed":
        return "dark";
      case "Confirmed":
        return "success";
      case "Preparing for dispatch":
        return "warning";

      case "On the way":
        return "info";
      case "Delivered":
        return "primary";
      case "Canceled":
        return "danger";
      case "Sold":
        return "success";
      default:
        return null;
    }
  };

  const [statuses] = useState([
    "Placed",
    "Confirmed",
    "Preparing for dispatch",
    "On the way",
    "Delivered",
    "Canceled",
    "Sold",
  ]);

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.order_status}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Select Status"
        className="p-column-filter"
        showClear
        style={{ minWidth: "5rem" }}
      />
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const statusItemTemplate = (option) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };

  const YearTemplate = (option) => {
    return <Tag value={option} severity="dark" />;
  };

  const changeDataData = (value) => {
    // console.log("value", value.value);

    setselectedMonthYear(value.value);

    queryClient.invalidateQueries({
      queryKey: ["deliveryCondtionData"],
    });
  };

  const allowExpansion = (rowData) => {
    return rowData.id.length > 0;
  };

  const header = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
      <Button
        icon="pi pi-minus"
        label="Collapse All"
        onClick={collapseAll}
        text
      />
    </div>
  );

  const rowExpansionTemplate = (data) => {
    // console.log;

    return (
      <div className="p-3">
        <h5>Delivery Slot for {data.distance_km} KM</h5>
        <DeliverySlotsListTable data={data.slotting_id} />
      </div>
    );
  };

  return (
    <div className="card">
      <DataTable
        value={Sale}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        loading={isFetching}
        header={header}
        tableStyle={{ minWidth: "60rem" }}
      >
        <Column expander={allowExpansion} style={{ width: "5rem" }} />
        <Column
          field="distance_km"
          header="KM"
          sortable
          style={{ width: "25%" }}
          body={kmTem}
        ></Column>
        <Column
          field="min_order_value"
          header="Min Ord"
          sortable
          style={{ width: "25%" }}
          body={minOrderTem}
        ></Column>
        <Column
          field="minium_amount_free_del"
          header="Min Ord for Free Del"
          sortable
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="delivery_charge"
          header="Del Charge"
          sortable
          style={{ width: "25%" }}
        ></Column>

        <Column
          field="time_hold_slot"
          header="time_hold_slot"
          sortable
          style={{ width: "25%" }}
        ></Column>

        <Column
          field="today_close_time"
          header="today_close_time"
          sortable
          style={{ width: "25%" }}
        ></Column>
      </DataTable>
    </div>
  );
};
