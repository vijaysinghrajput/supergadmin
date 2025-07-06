import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";

import URLDomain from "../../../URL";
import "primereact/resources/themes/lara-light-cyan/theme.css";

const cookies = new Cookies();

const CustomerDataTable = () => {
  const navigate = useNavigate();
  const adminStoreId = cookies.get("adminStoreId");

  // State management
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [dateError, setDateError] = useState("");

  // Filter options
  const filterOptions = [
    { label: "All Customers", value: "all" },
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "this_week" },
    { label: "This Month", value: "this_month" },
    { label: "This Year", value: "this_year" },
    { label: "Custom Date", value: "custom" },
  ];

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  // Format date for display
  const formatDateForDisplay = (dateStr, timeStr) => {
    if (!dateStr) return "";

    try {
      const [day, month, year] = dateStr.split("-");
      const date = new Date(`${month}/${day}/${year}`);

      if (timeStr) {
        return (
          date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }) + ` • ${timeStr}`
        );
      }

      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Fetch customer data with stats
  const fetchCustomerData = async () => {
    const body = {
      store_id: adminStoreId,
      filterType: selectedFilter,
    };

    if (selectedFilter === "custom") {
      if (!customStartDate || !customEndDate) {
        setDateError("Please select both dates");
        return { customers: [] };
      }

      if (new Date(customStartDate) > new Date(customEndDate)) {
        setDateError("End date cannot be before start date");
        return { customers: [] };
      }

      body.customStartDate = customStartDate.split("-").reverse().join("-");
      body.customEndDate = customEndDate.split("-").reverse().join("-");
      setDateError("");
    }

    const res = await fetch(
      URLDomain + "/APP-API/Billing/customer_list_with_stats",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    return res.json();
  };

  // Use React Query for data fetching
  const { data, isLoading, refetch, isFetching } = useQuery(
    ["customer_list", selectedFilter, customStartDate, customEndDate],
    fetchCustomerData,
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const customers = data?.customers || [];
  const summaryMessage = data?.summary || "";

  // Action button template
  const actionBodyTemplate = (rowData) => (
    <Button
      variant="outline-dark"
      size="sm"
      onClick={() =>
        navigate(
          `/salesManagement/customer-history-record/${rowData.id}/${rowData.mobile}`
        )
      }
    >
      <i className="ri-eye-line me-1" /> Details
    </Button>
  );

  // Address template
  const addressBodyTemplate = (rowData) => (
    <div
      className="text-truncate"
      style={{ maxWidth: "200px" }}
      title={rowData.address}
    >
      {rowData.address}
      {rowData.city && `, ${rowData.city}`}
      {rowData.state && `, ${rowData.state}`}
      {rowData.pin_code && ` - ${rowData.pin_code}`}
    </div>
  );

  // Stats template
  const statsBodyTemplate = (rowData) => (
    <div className="d-flex flex-column">
      <div>
        <Badge bg="light" text="dark" className="me-1">
          Orders: {rowData.total_orders || 0}
        </Badge>
      </div>
      <div className="mt-1">
        <Badge bg="success" className="text-white">
          Spent: {formatCurrency(rowData.total_spent)}
        </Badge>
      </div>
    </div>
  );

  // Date template
  const dateBodyTemplate = (rowData) => (
    <div className="d-flex flex-column">
      <span className="small">{formatDateForDisplay(rowData.join_date)}</span>
      {rowData.join_time && (
        <span className="text-muted small">{rowData.join_time}</span>
      )}
    </div>
  );

  // Handle filter changes
  const handleFilterChange = (value) => {
    setSelectedFilter(value);
    if (value !== "custom") {
      setCustomStartDate("");
      setCustomEndDate("");
      refetch();
    }
  };

  // Apply custom date filter
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

  // Render filter header
  const renderHeader = (
    <div className="d-flex flex-column flex-md-row gap-3 align-items-start align-items-md-center mb-3">
      <InputGroup className="flex-grow-1">
        <InputGroup.Text>
          <BiSearch />
        </InputGroup.Text>
        <Form.Control
          placeholder="Search customers..."
          value={globalFilterValue}
          onChange={(e) => setGlobalFilterValue(e.target.value)}
          aria-label="Search customers"
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
  );

  // Loading state
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
              <h5 className="mb-1">Customer Management</h5>
              <p className="mb-0 text-muted small">{summaryMessage}</p>
            </div>

            <div className="d-flex gap-3">
              <Badge bg="light" text="dark" className="fs-6">
                Total: {customers.length} customers
              </Badge>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          {renderHeader}

          <DataTable
            value={customers}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 20]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            emptyMessage={
              <div className="text-center py-4">
                <BiSearch size={24} className="mb-2" />
                <p className="mb-1">No customers found</p>
                <small className="text-muted">Try changing your filters</small>
              </div>
            }
            loading={isFetching}
            loadingTemplate={<ProgressSpinner />}
            tableStyle={{ minWidth: "50rem" }}
            globalFilter={globalFilterValue}
            globalFilterFields={["name", "mobile", "address", "city", "state"]}
            size="small"
            responsiveLayout="stack"
          >
            <Column
              field="login_source"
              header="Source"
              sortable
              style={{ minWidth: "90px" }}
              body={(rowData) => (
                <Badge bg="secondary" className="text-capitalize">
                  {rowData.login_source || "Direct"}
                </Badge>
              )}
            />
            <Column
              field="name"
              header="Name"
              sortable
              style={{ minWidth: "120px" }}
            />
            <Column
              field="mobile"
              header="Mobile"
              sortable
              style={{ minWidth: "110px" }}
            />
            <Column
              header="Address"
              body={addressBodyTemplate}
              style={{ minWidth: "180px" }}
            />
            <Column
              header="Stats"
              body={statsBodyTemplate}
              style={{ minWidth: "120px" }}
            />
            <Column
              header="Join Date"
              body={dateBodyTemplate}
              sortable
              sortField="join_date"
              style={{ minWidth: "130px" }}
            />
            <Column
              header="Actions"
              body={actionBodyTemplate}
              style={{ minWidth: "100px" }}
            />
          </DataTable>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CustomerDataTable;
