import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { useNavigate } from "react-router";
import { BiSearch } from "react-icons/bi";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { ActionForOnlineList } from "./ActionForOnlineList";

import { useQuery } from "react-query";

import URLDomain from "../../../URL";
import Cookies from "universal-cookie";
import { queryClient } from "../../../App";

import "primereact/resources/themes/lara-light-cyan/theme.css";
const cookies = new Cookies();

export const OnlineOrderListDataTable = (order_type) => {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [selectedMonthYear, setselectedMonthYear] = useState(null);

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

  async function fetchData({ order_status }) {
    const data = await fetch(
      URLDomain + "/APP-API/Billing/sale_history_online",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          store_id: adminStoreId,
          selectedMonthYear,
          order_type: order_type.data,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => responseJson);
    return data;
  }

  const {
    data: ONLINE_ORDERS,
    isFetching,
    isLoading: ONLINE_ORDERS_LOADING,
  } = useQuery({
    // queryKey: ["ONLINE_ORDERS", order_type.data],
    // queryFn: (e) => fetchData({ order_status: e.queryKey[1] }),

    queryKey: ["ONLINE_ORDERS", selectedMonthYear, order_type.data],
    queryFn: (e) =>
      fetchData({ MonthYear: e.queryKey[1], order_status: e.queryKey[2] }),
  });

  useEffect(() => {
    setSale([]);
    setSaleYear([]);

    if (ONLINE_ORDERS) {
      setSale(ONLINE_ORDERS.store_customer_purchase_record);
      setSaleYear(ONLINE_ORDERS.sale_year);

      console.log("Sales", Sale);
      setisDataLoding(false);
    }
  }, [ONLINE_ORDERS]);

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

  const customer_name = (rowData) => {
    return (
      <p>
        {rowData.customer_name} {rowData.customer_phone}
      </p>
    );
  };

  const customer_addrsss = (rowData) => {
    return <p>{rowData.customer_address}</p>;
  };

  const ActionBodyTemplate = (rowData) => {
    return <ActionForOnlineList id={rowData} />;
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
        // style={{ minWidth: "2rem" }}
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
      queryKey: ["ONLINE_ORDERS"],
    });
  };

  const renderHeader = () => {
    return (
      <div className="row  ">
        <div className="col-sm-4">
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              <BiSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search in Data"
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
            />
          </InputGroup>
        </div>
        <div className="col-sm-4">
          <Dropdown
            value={selectedMonthYear}
            onChange={(e) => changeDataData(e)}
            options={SaleYear}
            optionLabel="label"
            optionGroupLabel="label"
            optionGroupChildren="items"
            optionGroupTemplate={groupedItemTemplate}
            className="w-full md:w-14rem"
            placeholder="YEAR / MONTH"
          />
        </div>
        <div className="col-sm-4">
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              <BiSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search in Data"
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
            />
          </InputGroup>
        </div>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="card">
      <DataTable
        value={Sale}
        paginator
        rows={5}
        header={header}
        emptyMessage="No Sale found."
        tableStyle={{ minWidth: "50rem" }}
        filters={filters}
        filterDisplay="row"
        loading={isFetching}
        // header={header}
      >
        <Column
          field="customer_mobile"
          header="Mobile"
          sortable
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="order_id"
          header="Order No"
          sortable
          style={{ width: "10%" }}
        ></Column>

        <Column
          field="order_status"
          header="Name"
          body={customer_name}
          sortable
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="order_status"
          header="Address"
          body={customer_addrsss}
          sortable
          style={{ width: "55%" }}
        ></Column>

        <Column
          field="date"
          header="Date"
          sortable
          style={{ width: "55%" }}
        ></Column>

        <Column
          field="delivery_slots"
          header="Slot"
          sortable
          style={{ width: "55%" }}
        ></Column>

        <Column
          field=""
          header="Action"
          body={ActionBodyTemplate}
          sortable
          style={{ width: "25%" }}
        ></Column>
      </DataTable>
    </div>
  );
};
