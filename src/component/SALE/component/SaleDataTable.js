import React, { useState, useMemo, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";
import { BiSearch, BiCalendar } from "react-icons/bi";
import { useQuery } from "react-query";
import Cookies from "universal-cookie";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";

import { ActionForSaleList } from "./ActionForSaleList";
import URLDomain from "../../../URL";
import "primereact/resources/themes/lara-light-cyan/theme.css";

const cookies = new Cookies();

const SaleDataTable = () => {
  const adminStoreId = cookies.get("adminStoreId");
  const [selectedFilter, setSelectedFilter] = useState("today");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (selectedFilter !== "custom") {
      setDateError("");
    }
  }, [selectedFilter]);

  const filterOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "this_week" },
    { label: "This Month", value: "this_month" },
    { label: "This Year", value: "this_year" },
    { label: "Custom Date", value: "custom" },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Fixed date formatting to handle server format
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";

    // Check if date is in "DD-MM-YYYY" format
    if (dateStr.includes("-") && dateStr.split("-")[0].length === 2) {
      const [day, month, year] = dateStr.split("-");
      return `${day}-${month}-${year}`;
    }

    // Handle other formats using Date object
    try {
      const date = new Date(dateStr);
      if (isNaN(date)) return dateStr;

      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-");
    } catch (e) {
      return dateStr;
    }
  };

  const fetchSaleData = async () => {
    const body = {
      store_id: adminStoreId,
      filterType: selectedFilter,
    };

    if (selectedFilter === "custom") {
      if (!customStartDate || !customEndDate) {
        setDateError("Please select both dates");
        return { store_customer_purchase_record: [] };
      }

      // Format dates for server (YYYY-MM-DD to DD-MM-YYYY)
      body.customStartDate = customStartDate.split("-").reverse().join("-");
      body.customEndDate = customEndDate.split("-").reverse().join("-");
      setDateError("");
    }

    const res = await fetch(URLDomain + "/APP-API/Billing/sale_history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return res.json();
  };

  const { data, isLoading, refetch, isFetching } = useQuery(
    ["offline_sale_history", selectedFilter, customStartDate, customEndDate],
    fetchSaleData,
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const saleData = data?.store_customer_purchase_record || [];
  const totalSalesCount = data?.total_sales || 0;
  const totalSalesValue = data?.total_sales_value || 0;
  const summaryMessage = data?.msg_heading || "";

  const getSeverity = (status) => {
    const statusMap = {
      Placed: "dark",
      Confirmed: "success",
      "Preparing for dispatch": "warning",
      "On the way": "info",
      Delivered: "primary",
      Canceled: "danger",
      Sold: "success",
    };
    return statusMap[status] || null;
  };

  const statusBodyTemplate = (rowData) => (
    <Tag
      value={rowData.order_status}
      severity={getSeverity(rowData.order_status)}
      className="p-tag-rounded"
    />
  );

  const paymentBodyTemplate = (rowData) => (
    <span className="font-semibold">
      {formatCurrency(rowData.total_payment)}
    </span>
  );

  const dateBodyTemplate = (rowData) => (
    <div className="d-flex flex-column">
      <span className="text-nowrap">{formatDateForDisplay(rowData.date)}</span>
      {rowData.time && <small className="text-muted">{rowData.time}</small>}
    </div>
  );

  const actionBodyTemplate = (rowData) => <ActionForSaleList id={rowData} />;

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    if (value !== "custom") {
      setCustomStartDate("");
      setCustomEndDate("");
      refetch();
    }
  };

  const handleApplyCustomDate = () => {
    if (!customStartDate || !customEndDate) {
      setDateError("Please select both dates");
      return;
    }

    if (new Date(customStartDate) > new Date(customEndDate)) {
      setDateError("End date cannot be before start date");
      return;
    }

    refetch();
  };

  const renderHeader = useMemo(
    () => (
      <div className="d-flex flex-column flex-md-row gap-3 align-items-start align-items-md-center mb-3">
        <InputGroup className="flex-grow-1">
          <InputGroup.Text>
            <BiSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search orders..."
            value={globalFilterValue}
            onChange={(e) => setGlobalFilterValue(e.target.value)}
            aria-label="Search orders"
          />
        </InputGroup>

        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 w-100 w-md-auto">
          <Dropdown
            value={selectedFilter}
            options={filterOptions}
            onChange={(e) => handleFilterChange(e.value)}
            placeholder="Select Filter"
            className="w-100 w-md-auto"
          />

          {selectedFilter === "custom" && (
            <div className="d-flex flex-column w-100">
              <div className="d-flex flex-column flex-sm-row gap-2 w-100">
                <div className="position-relative flex-grow-1">
                  <Form.Control
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="pe-4"
                  />
                  <BiCalendar className="position-absolute top-50 end-0 translate-middle-y me-2 text-muted" />
                </div>

                <div className="position-relative flex-grow-1">
                  <Form.Control
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    min={customStartDate}
                    className="pe-4"
                  />
                  <BiCalendar className="position-absolute top-50 end-0 translate-middle-y me-2 text-muted" />
                </div>

                <Button
                  variant="primary"
                  onClick={handleApplyCustomDate}
                  disabled={isFetching}
                  className="d-flex align-items-center"
                >
                  {isFetching ? (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                  ) : null}
                  Apply
                </Button>
              </div>

              {dateError && (
                <div className="text-danger small mt-1">{dateError}</div>
              )}
            </div>
          )}
        </div>
      </div>
    ),
    [
      globalFilterValue,
      selectedFilter,
      customStartDate,
      customEndDate,
      dateError,
      isFetching,
    ]
  );

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      <Card className="border-0 shadow-sm">
        <Card.Body className="py-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h5 className="mb-1">Sales Summary</h5>
              <p className="mb-0 text-muted small">{summaryMessage}</p>
            </div>

            <div className="d-flex gap-4">
              <div className="text-center">
                <div className="text-muted small">Total Orders</div>
                <div className="h4 mb-0 fw-bold">{totalSalesCount}</div>
              </div>

              <div className="text-center">
                <div className="text-muted small">Total Value</div>
                <div className="h4 mb-0 fw-bold text-success">
                  {formatCurrency(totalSalesValue)}
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          {renderHeader}

          <DataTable
            value={saleData}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 20]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            emptyMessage={
              <div className="text-center py-4">
                <BiSearch size={24} className="mb-2" />
                <p className="mb-1">No sales records found</p>
                <small className="text-muted">Try changing your filters</small>
              </div>
            }
            loading={isFetching}
            loadingTemplate={<ProgressSpinner />}
            tableStyle={{ minWidth: "50rem" }}
            globalFilter={globalFilterValue}
            globalFilterFields={[
              "customer_mobile",
              "order_id",
              "plateform",
              "total_payment",
              "order_status",
              "date",
            ]}
            size="small"
            responsiveLayout="stack"
          >
            <Column
              field="customer_mobile"
              header="Mobile"
              sortable
              style={{ minWidth: "100px" }}
            />
            <Column
              field="order_id"
              header="Order ID"
              sortable
              style={{ minWidth: "120px" }}
            />
            <Column
              field="plateform"
              header="Platform"
              sortable
              style={{ minWidth: "100px" }}
            />
            <Column
              field="total_payment"
              header="Payment"
              body={paymentBodyTemplate}
              sortable
              style={{ minWidth: "120px" }}
              align="right"
            />
            <Column
              field="date"
              header="Date"
              body={dateBodyTemplate}
              sortable
              style={{ minWidth: "130px" }}
            />
            <Column
              field="order_status"
              header="Status"
              body={statusBodyTemplate}
              className="text-center"
              style={{ minWidth: "150px" }}
            />
            <Column
              header="Actions"
              body={actionBodyTemplate}
              className="text-center"
              style={{ minWidth: "100px" }}
            />
          </DataTable>
        </Card.Body>
      </Card>
    </div>
  );
};

export default React.memo(SaleDataTable);
