import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
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

export const ExpeseDataTable = () => {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [Sale, setSale] = useState(null);

  const adminStoreId = cookies.get("adminStoreId");

  async function fetchData() {
    const data = await fetch(URLDomain + "/APP-API/Billing/expense_list_load", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        store_id: adminStoreId,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => responseJson);

    return data;
  }

  const {
    data: expense_list_load,
    isError,
    isLoading: isLoadingAPI,
    isFetching,
  } = useQuery({
    queryKey: ["expense_list_load"],
    queryFn: (e) => fetchData(),
  });

  useEffect(() => {
    setSale([]);
    console.log("search product", expense_list_load, isLoadingAPI);
    if (expense_list_load) {
      setSale(expense_list_load.store_expense_list);
    }
  }, [expense_list_load, isLoadingAPI]);

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
        emptyMessage="No Expense found."
        tableStyle={{ minWidth: "50rem" }}
        filters={filters}
        filterDisplay="row"
        loading={isFetching}
        // header={header}
      >
        <Column
          field="type"
          header="Type"
          sortable
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="amount"
          header="Amount"
          sortable
          style={{ width: "15%" }}
        ></Column>

        <Column
          field="notes"
          header="Notes"
          sortable
          style={{ width: "35%" }}
        ></Column>
        <Column
          field="date"
          header="Date"
          sortable
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="time"
          header="Time"
          sortable
          style={{ width: "10%" }}
        ></Column>
      </DataTable>
    </div>
  );
};
