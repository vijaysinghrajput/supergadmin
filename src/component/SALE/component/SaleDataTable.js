import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";
import { CiCalendarDate } from "react-icons/ci";

import { Calendar } from "primereact/calendar";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { ActionForSaleList } from "./ActionForSaleList";

import { useQuery } from "react-query";

import URLDomain from "../../../URL";
import { queryClient } from "../../../App";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Box } from "@chakra-ui/react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const SaleDataTable = () => {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [SaleDate, setSaleDate] = useState(null);
  const [RangeSaleDate, setRangeSaleDate] = useState(null);

  const [saleDateValue, setsaleDateValue] = useState(null);

  const [selectedMonthYear, setselectedMonthYear] = useState(null);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    order_status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [isDataLoding, setisDataLoding] = useState(true);
  const [Sale, setSale] = useState(null);
  const [SaleYear, setSaleYear] = useState(null);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");

  async function fetchData(MonthYear) {
    const data = await fetch(URLDomain + "/APP-API/Billing/sale_history", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        store_id: adminStoreId,
        selectedMonthYear,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => responseJson);

    return data;
  }

  const {
    data: offline_sale_history,
    isError,
    isLoading: isLoadingAPI,
    isFetching,
  } = useQuery({
    queryKey: ["offline_sale_history", selectedMonthYear],
    queryFn: (e) => fetchData({ MonthYear: e.queryKey[1] }),
  });

  useEffect(() => {
    setSale([]);
    setSaleYear([]);

    if (offline_sale_history) {
      setSale(offline_sale_history.store_customer_purchase_record);
      setSaleYear(offline_sale_history.sale_year);

      console.log("Sales", Sale);
      setisDataLoding(false);
    }
  }, [offline_sale_history, isLoadingAPI]);

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

  const ActionBodyTemplate = (rowData) => {
    return <ActionForSaleList id={rowData} />;
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
        // style={{ minWidth: "2rem" }}
      />
    );
  };

  const changeSaleDateOnly = (e) => {
    let d = e.value;
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    let dateDatat = `${day}-${month}-${year}`;
    setSaleDate(e.value);
    setsaleDateValue(dateDatat);
  };

  const changeRangeSaleDateOnly = (e) => {
    setRangeSaleDate(e.value);
    console.log("date range", e.value);
    // setRangeSaleDate(dateDatat);
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
      queryKey: ["offline_sale_history"],
    });
  };

  const renderHeader = () => {
    return (
      <div className="row  ">
        <div className="col-sm-3">
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
        <div className="col-sm-3">
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
        <div className="col-sm-3">
          <label htmlFor="buttondisplay" className="font-bold block mb-2">
            <CiCalendarDate onClick={onOpen} size={35} /> Sale Date{" "}
            {saleDateValue}
          </label>
        </div>

        <div className="col-sm-3">
          <label htmlFor="buttondisplay" className="font-bold block mb-2">
            Sale Date Range
          </label>
          <Box position={"relative"}>
            <div className="card flex justify-content-center">
              <Calendar
                value={RangeSaleDate}
                onChange={(e) => changeRangeSaleDateOnly(e)}
                selectionMode="range"
                readOnlyInput
                maxDate={new Date()}
              />
            </div>
          </Box>
        </div>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="card">
      {isDataLoding ? (
        "Loding"
      ) : (
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
            style={{ width: "25%" }}
          ></Column>
          <Column
            field="plateform"
            header="Plateform"
            sortable
            style={{ width: "25%" }}
          ></Column>
          <Column
            field="total_payment"
            header="Payment"
            sortable
            style={{ width: "25%" }}
          ></Column>

          <Column
            field="date"
            header="Date"
            sortable
            style={{ width: "55%" }}
          ></Column>

          <Column
            field="order_status"
            header="Status"
            body={statusBodyTemplate}
            sortable
            style={{ width: "15%" }}
            showFilterMenu={false}
            // filterMenuStyle={{ width: "6rem" }}
            filter
            filterElement={statusRowFilterTemplate}
          ></Column>

          <Column
            field=""
            header="Action"
            body={ActionBodyTemplate}
            sortable
            style={{ width: "25%" }}
          ></Column>
        </DataTable>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Calendar
              id="buttondisplay"
              value={SaleDate}
              formatDateTime="dd-mm-yyyy"
              onChange={(e) => changeSaleDateOnly(e)}
              inline
              maxDate={new Date()}
              onSelect={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};
