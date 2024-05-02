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

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import { useQuery } from "react-query";

import URLDomain from "../../../URL";
import Cookies from "universal-cookie";
import "primereact/resources/themes/lara-light-cyan/theme.css";
const cookies = new Cookies();

export const CustomerDataTable = () => {
  const navigate = useNavigate();

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    order_status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [isDataLoding, setisDataLoding] = useState(true);
  const [Sale, setSale] = useState(null);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");

  async function fetchData() {
    const data = await fetch(
      URLDomain + "/APP-API/Billing/customer_list_load",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          store_id: adminStoreId,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => responseJson);

    return data;
  }

  const {
    data: customer_list_load,
    isError,
    isLoading: isLoadingAPI,
    isFetching,
  } = useQuery({
    queryKey: ["customer_list_load"],
    queryFn: (e) => fetchData(),
  });

  useEffect(() => {
    setSale([]);
    console.log("search product", customer_list_load, isLoadingAPI);
    if (customer_list_load) {
      setSale(customer_list_load.store_customer_list);
      setisDataLoding(false);
    }
  }, [customer_list_load, isLoadingAPI]);

  //   const cols = [
  //     { field: "login_source", header: "Mobile" },
  //     { field: "name", header: "ORDER NO" },
  //     { field: "total_payment", header: "Cost" },
  //     { field: "mobile", header: "mobile" },
  //     { field: "order_status", header: "Status" },
  //     { field: "date", header: "Date" },
  //   ];

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.order_status}
        severity={getSeverity(rowData.order_status)}
      ></Tag>
    );
  };

  const ActionBodyTemplate = (rowData) => {
    return (
      <button
        onClick={() =>
          navigate(
            "/salesManagement/customer-history-record/" +
              rowData.id +
              "/" +
              rowData.mobile
          )
        }
        className="btn btn-dark"
      >
        <i className="ri-eye me-1 align-bottom" /> Details
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
        selectionMode="single"
        sortMode="multiple"
        // sortField="date"
        removableSort
        stateStorage="session"
        stateKey="dt-state-demo-local"
        emptyMessage="No Customer found."
        tableStyle={{ minWidth: "50rem" }}
        filters={filters}
        filterDisplay="row"
        loading={isFetching}
        // header={header}
      >
        <Column
          field="login_source"
          header="Login"
          sortable
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="customer_name"
          header="Name"
          sortable
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="mobile"
          header="Mobile"
          sortable
          style={{ width: "10%" }}
        ></Column>

        <Column
          field="full_address"
          header="Address"
          sortable
          style={{ width: "35%" }}
        ></Column>
        <Column
          field="join_date"
          header="Date"
          sortable
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="join_time"
          header="Time"
          sortable
          style={{ width: "10%" }}
        ></Column>
        <Column
          field=""
          header="Action"
          body={ActionBodyTemplate}
          sortable
          style={{ width: "5%" }}
        ></Column>
      </DataTable>
    </div>
  );
};
