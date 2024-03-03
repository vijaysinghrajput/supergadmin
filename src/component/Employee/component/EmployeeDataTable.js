import React, { useState, useEffect } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { useNavigate } from "react-router";
import { BiSearch } from "react-icons/bi";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import { useQuery } from "react-query";

import URLDomain from "../../../URL";
import Cookies from "universal-cookie";
import "primereact/resources/themes/lara-light-cyan/theme.css";
const cookies = new Cookies();

export const EmployeeDataTable = () => {
  const navigate = useNavigate();

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    order_status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [Sale, setSale] = useState(null);

  const adminStoreId = cookies.get("adminStoreId");

  async function fetchData() {
    const data = await fetch(
      URLDomain + "/APP-API/Billing/employee_list_load",
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
    data: employee_list_load,
    isLoading: isLoadingAPI,
    isFetching,
  } = useQuery({
    queryKey: ["employee_list_load"],
    queryFn: (e) => fetchData(),
  });

  useEffect(() => {
    setSale([]);
    if (employee_list_load) {
      setSale(employee_list_load.store_employee_list);
    }
  }, [employee_list_load, isLoadingAPI]);

  //   const cols = [
  //     { field: "login_source", header: "Mobile" },
  //     { field: "name", header: "ORDER NO" },
  //     { field: "total_payment", header: "Cost" },
  //     { field: "mobile", header: "mobile" },
  //     { field: "order_status", header: "Status" },
  //     { field: "date", header: "Date" },
  //   ];

  const ActionBodyTemplate = (rowData) => {
    return (
      <button
        onClick={() =>
          navigate(
            "/online/online-sales-history-record/" +
              rowData.name +
              "/" +
              rowData.employee_address_id
          )
        }
        className="btn btn-dark"
      >
        <i className="ri-eye me-1 align-bottom" /> BILL
      </button>
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
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
        emptyMessage="No employee found."
        tableStyle={{ minWidth: "50rem" }}
        filters={filters}
        filterDisplay="row"
        loading={isFetching}
        // header={header}
      >
        <Column
          field="roal"
          header="Roal"
          sortable
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="salary"
          header="Salary"
          sortable
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="name"
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
          field="address"
          header="Address"
          sortable
          style={{ width: "35%" }}
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
