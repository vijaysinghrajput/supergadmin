import { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Navigate } from "react-router-dom";
import Data from "../context/MainContext";
import Cookies from "universal-cookie";
import { useQuery } from "react-query";
import URLDomain from "../URL";
import { useLayoutEffect } from "react";
import ReactApexChart from "react-apexcharts";

const cookies = new Cookies();
const adminStoreId = cookies.get("adminStoreId");

// Low Stock Alert Configuration
const LOW_STOCK_THRESHOLD = 10; // Editable constant for low stock alert

function getFormattedDate(date) {
  // Validate date input
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    console.warn("Invalid date provided to getFormattedDate:", date);
    return new Date()
      .toISOString()
      .split("T")[0]
      .split("-")
      .reverse()
      .join("-"); // Return today's date in DD-MM-YYYY format
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

// Fetch analytics data
async function fetchAnalyticsData({ start_date, end_date }) {
  try {
    console.log("Fetching analytics data for store ID:", adminStoreId);
    console.log("Date range:", { start_date, end_date });

    const response = await fetch(
      URLDomain + "/APP-API/Billing/DashboardReports",
      {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          store_id: adminStoreId,
          start_date,
          end_date,
        }),
      }
    );

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Response Error:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorText: errorText,
      });
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Invalid content type:", contentType);
      throw new Error("Server returned non-JSON response");
    }

    const data = await response.json();
    console.log("Analytics data fetched successfully:", data);

    // Validate data structure
    if (!data || typeof data !== "object") {
      console.error("Invalid data structure received:", data);
      throw new Error("Invalid data structure received from server");
    }

    return data;
  } catch (error) {
    console.error("Error fetching analytics data:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      storeId: adminStoreId,
      url: URLDomain + "/APP-API/Billing/DashboardReports",
    });

    // Re-throw the error so react-query can handle it
    throw error;
  }
}

const HomePage = () => {
  const { auth, user } = useContext(Data);
  const [count, setCount] = useState(500);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [dateRange, setDateRange] = useState({
    startDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date;
    })(),
    endDate: new Date(),
  });
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [bestSellingCurrentPage, setBestSellingCurrentPage] = useState(1);
  const [bestSellingItemsPerPage] = useState(5);

  const {
    data: ANALYTICS_DATA,
    isError,
    error,
    isLoading: isLoadingAPI,
  } = useQuery({
    queryKey: [
      "ANALYTICS_DATA",
      getFormattedDate(dateRange.startDate),
      getFormattedDate(dateRange.endDate),
    ],
    queryFn: (e) =>
      fetchAnalyticsData({
        start_date: e.queryKey[1],
        end_date: e.queryKey[2],
      }),
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    onError: (error) => {
      console.error("React Query Error:", {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        storeId: adminStoreId,
      });
    },
    onSuccess: (data) => {
      console.log(
        "Analytics data loaded successfully at:",
        new Date().toISOString()
      );
    },
  });

  // Date range helper functions
  const setDateRangePreset = (preset) => {
    const today = new Date();
    const endDate = new Date(); // Today
    let startDate;

    switch (preset) {
      case "week":
        startDate = new Date();
        startDate.setDate(today.getDate() - 7);
        break;
      case "month":
        startDate = new Date();
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "quarter":
        startDate = new Date();
        startDate.setMonth(today.getMonth() - 3);
        break;
      case "year":
        startDate = new Date();
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case "ytd": // Year to date
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date();
        startDate.setDate(today.getDate() - 30);
    }

    setDateRange({ startDate, endDate });
    setSelectedPeriod(preset);
    setShowCustomDatePicker(false);
  };

  const handleCustomDateChange = (field, value) => {
    if (!value) return; // Don't update if value is empty

    const newDate = new Date(value);
    if (isNaN(newDate.getTime())) {
      console.warn("Invalid date provided:", value);
      return; // Don't update if date is invalid
    }

    setDateRange((prev) => ({
      ...prev,
      [field]: newDate,
    }));
  };

  const applyCustomDateRange = () => {
    setSelectedPeriod("custom");
    setShowCustomDatePicker(false);
  };

  // Loading Skeleton Component
  const LoadingSkeleton = ({ rows = 5 }) => (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index}>
          <td>
            <div className="placeholder-glow">
              <span className="placeholder col-8"></span>
            </div>
          </td>
          <td>
            <div className="placeholder-glow">
              <span className="placeholder col-6"></span>
            </div>
          </td>
          <td>
            <div className="placeholder-glow">
              <span className="placeholder col-4"></span>
            </div>
          </td>
          <td>
            <div className="placeholder-glow">
              <span className="placeholder col-5"></span>
            </div>
          </td>
          <td>
            <div className="placeholder-glow">
              <span className="placeholder col-7"></span>
            </div>
          </td>
          <td>
            <div className="placeholder-glow">
              <span className="placeholder col-4"></span>
            </div>
          </td>
          <td>
            <div className="placeholder-glow">
              <span className="placeholder col-3"></span>
            </div>
          </td>
        </tr>
      ))}
    </>
  );

  // Pagination helper functions
  const getPaginatedData = (data, currentPage, itemsPerPage) => {
    if (!data || !Array.isArray(data)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data, itemsPerPage) => {
    if (!data || !Array.isArray(data)) return 0;
    return Math.ceil(data.length / itemsPerPage);
  };

  // Pagination Component
  const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(
            currentPage * itemsPerPage,
            ANALYTICS_DATA?.recent_activities?.recentSales?.length || 0
          )}{" "}
          of {ANALYTICS_DATA?.recent_activities?.recentSales?.length || 0}{" "}
          entries
        </div>
        <nav>
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  // Date Picker Component
  const DateRangePicker = () => {
    return (
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <h5 className="card-title mb-0">Date Range Selection</h5>
                <div className="d-flex flex-wrap gap-2">
                  {/* Preset Buttons */}
                  <button
                    className={`btn btn-sm ${
                      selectedPeriod === "week"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setDateRangePreset("week")}
                  >
                    Last Week
                  </button>
                  <button
                    className={`btn btn-sm ${
                      selectedPeriod === "month"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setDateRangePreset("month")}
                  >
                    Last Month
                  </button>
                  <button
                    className={`btn btn-sm ${
                      selectedPeriod === "quarter"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setDateRangePreset("quarter")}
                  >
                    Last Quarter
                  </button>
                  <button
                    className={`btn btn-sm ${
                      selectedPeriod === "year"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setDateRangePreset("year")}
                  >
                    Last Year
                  </button>
                  <button
                    className={`btn btn-sm ${
                      selectedPeriod === "ytd"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setDateRangePreset("ytd")}
                  >
                    Year to Date
                  </button>
                  <button
                    className={`btn btn-sm ${
                      selectedPeriod === "custom"
                        ? "btn-success"
                        : "btn-outline-success"
                    }`}
                    onClick={() =>
                      setShowCustomDatePicker(!showCustomDatePicker)
                    }
                  >
                    Custom Range
                  </button>
                </div>
              </div>

              {/* Custom Date Picker */}
              {showCustomDatePicker && (
                <div className="mt-3 p-3 border rounded bg-light">
                  <div className="row">
                    <div className="col-md-4">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={dateRange.startDate.toISOString().split("T")[0]}
                        onChange={(e) =>
                          handleCustomDateChange("startDate", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={dateRange.endDate.toISOString().split("T")[0]}
                        onChange={(e) =>
                          handleCustomDateChange("endDate", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                      <button
                        className="btn btn-success me-2"
                        onClick={applyCustomDateRange}
                      >
                        Apply
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowCustomDatePicker(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Date Range Display */}
              <div className="mt-3">
                <small className="text-muted">
                  Current Range: {dateRange.startDate.toLocaleDateString()} -{" "}
                  {dateRange.endDate.toLocaleDateString()}
                  {selectedPeriod !== "custom" && ` (${selectedPeriod})`}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="h-100">
            {/*end row*/}
            {/* Date Range Picker */}
            <DateRangePicker />
            <div className="row">
              <div className="col-xl-3 col-md-6">
                {/* card */}
                <div className="card card-animate">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1 overflow-hidden">
                        <p
                          onClick={() => {
                            setCount(count + 500);
                            console.log("navneet", count);
                          }}
                          className="text-uppercase fw-medium text-muted text-truncate mb-0"
                        >
                          Total Earnings
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <h5
                          className={`fs-14 mb-0 ${
                            ANALYTICS_DATA?.kpis?.totalRevenue?.change >= 0
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          <i
                            className={`fs-13 align-middle ${
                              ANALYTICS_DATA?.kpis?.totalRevenue?.change >= 0
                                ? "ri-arrow-right-up-line"
                                : "ri-arrow-right-down-line"
                            }`}
                          />
                          {ANALYTICS_DATA?.kpis?.totalRevenue?.change
                            ? `${
                                ANALYTICS_DATA.kpis.totalRevenue.change > 0
                                  ? "+"
                                  : ""
                              }${ANALYTICS_DATA.kpis.totalRevenue.change.toFixed(
                                2
                              )}%`
                            : "+16.24 %"}
                        </h5>
                      </div>
                    </div>
                    <div className="d-flex align-items-end justify-content-between mt-4">
                      <div>
                        {isLoadingAPI ? (
                          <div className="placeholder-glow">
                            <span className="placeholder col-6 fs-22 fw-semibold ff-secondary mb-4"></span>
                          </div>
                        ) : (
                          <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                            ₹
                            {ANALYTICS_DATA?.kpis?.totalRevenue?.current
                              ? ANALYTICS_DATA.kpis.totalRevenue.current.toLocaleString(
                                  "en-IN"
                                )
                              : count.toLocaleString("en-IN")}
                          </h4>
                        )}
                        <a href="#" className="text-decoration-underline">
                          View net earnings
                        </a>
                      </div>
                      <div className="avatar-sm flex-shrink-0">
                        <span className="avatar-title bg-soft-success rounded fs-3">
                          <i className="bx bx-dollar-circle text-success" />
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
              <div className="col-xl-3 col-md-6">
                {/* card */}
                <div className="card card-animate">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1 overflow-hidden">
                        <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                          Orders
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <h5
                          className={`fs-14 mb-0 ${
                            ANALYTICS_DATA?.kpis?.totalOrders?.change >= 0
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          <i
                            className={`fs-13 align-middle ${
                              ANALYTICS_DATA?.kpis?.totalOrders?.change >= 0
                                ? "ri-arrow-right-up-line"
                                : "ri-arrow-right-down-line"
                            }`}
                          />
                          {ANALYTICS_DATA?.kpis?.totalOrders?.change
                            ? `${
                                ANALYTICS_DATA.kpis?.totalOrders?.change > 0
                                  ? "+"
                                  : ""
                              }${ANALYTICS_DATA.kpis?.totalOrders?.change.toFixed(
                                2
                              )}%`
                            : "-3.57 %"}
                        </h5>
                      </div>
                    </div>
                    <div className="d-flex align-items-end justify-content-between mt-4">
                      <div>
                        {isLoadingAPI ? (
                          <div className="placeholder-glow">
                            <span className="placeholder col-6 fs-22 fw-semibold ff-secondary mb-4"></span>
                          </div>
                        ) : (
                          <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                            {(
                              ANALYTICS_DATA?.kpis?.totalOrders?.current || 0
                            ).toLocaleString("en-IN")}
                          </h4>
                        )}
                        <a href="#" className="text-decoration-underline">
                          View all orders
                        </a>
                      </div>
                      <div className="avatar-sm flex-shrink-0">
                        <span className="avatar-title bg-soft-info rounded fs-3">
                          <i className="bx bx-shopping-bag text-info" />
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
              <div className="col-xl-3 col-md-6">
                {/* card */}
                <div className="card card-animate">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1 overflow-hidden">
                        <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                          Customers
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <h5
                          className={`fs-14 mb-0 ${
                            ANALYTICS_DATA?.kpis?.totalCustomers?.change >= 0
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          <i
                            className={`fs-13 align-middle ${
                              ANALYTICS_DATA?.kpis?.totalCustomers?.change >= 0
                                ? "ri-arrow-right-up-line"
                                : "ri-arrow-right-down-line"
                            }`}
                          />
                          {ANALYTICS_DATA?.kpis?.totalCustomers?.change
                            ? `${
                                ANALYTICS_DATA.kpis?.totalCustomers.change > 0
                                  ? "+"
                                  : ""
                              }${ANALYTICS_DATA.kpis?.totalCustomers.change.toFixed(
                                2
                              )}%`
                            : "+29.08 %"}
                        </h5>
                      </div>
                    </div>
                    <div className="d-flex align-items-end justify-content-between mt-4">
                      <div>
                        {isLoadingAPI ? (
                          <div className="placeholder-glow">
                            <span className="placeholder col-6 fs-22 fw-semibold ff-secondary mb-4"></span>
                          </div>
                        ) : (
                          <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                            {(
                              ANALYTICS_DATA?.kpis?.totalCustomers?.current || 0
                            ).toLocaleString("en-IN")}
                          </h4>
                        )}
                        <a href="#" className="text-decoration-underline">
                          See details
                        </a>
                      </div>
                      <div className="avatar-sm flex-shrink-0">
                        <span className="avatar-title bg-soft-warning rounded fs-3">
                          <i className="bx bx-user-circle text-warning" />
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
              <div className="col-xl-3 col-md-6">
                {/* card */}
                <div className="card card-animate">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1 overflow-hidden">
                        <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                          Active Users
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <h5
                          className={`fs-14 mb-0 ${
                            ANALYTICS_DATA?.kpis?.activeUsers?.change >= 0
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          <i
                            className={`fs-13 align-middle ${
                              ANALYTICS_DATA?.kpis?.activeUsers?.change >= 0
                                ? "ri-arrow-right-up-line"
                                : "ri-arrow-right-down-line"
                            }`}
                          />
                          {ANALYTICS_DATA?.kpis?.activeUsers?.change
                            ? `${
                                ANALYTICS_DATA.kpis?.activeUsers.change > 0
                                  ? "+"
                                  : ""
                              }${ANALYTICS_DATA.kpis?.activeUsers.change.toFixed(
                                2
                              )}%`
                            : "+0.00 %"}
                        </h5>
                      </div>
                    </div>
                    <div className="d-flex align-items-end justify-content-between mt-4">
                      <div>
                        {isLoadingAPI ? (
                          <div className="placeholder-glow">
                            <span className="placeholder col-6 fs-22 fw-semibold ff-secondary mb-4"></span>
                          </div>
                        ) : (
                          <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                            {(
                              ANALYTICS_DATA?.kpis?.activeUsers?.current || 0
                            ).toLocaleString("en-IN")}
                          </h4>
                        )}
                        <a href="#" className="text-decoration-underline">
                          View user activity
                        </a>
                      </div>
                      <div className="avatar-sm flex-shrink-0">
                        <span className="avatar-title bg-soft-primary rounded fs-3">
                          <i className="bx bx-user text-primary" />
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
            </div>{" "}
            {/* end row*/}
            <div className="row">
              <div className="col-xl-12">
                <div className="card">
                  <div className="card-header border-0 align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">Revenue</h4>
                  </div>
                  {/* end card header */}
                  <div className="card-header p-0 border-0 bg-soft-light">
                    <div className="row g-0 text-center">
                      <div className="col-6 col-sm-4">
                        <div className="p-3 border border-dashed border-start-0">
                          <h5 className="mb-1">
                            <span className="counter-value" data-target={7585}>
                              {ANALYTICS_DATA?.trends?.totalOrders.toLocaleString(
                                "en-IN"
                              ) || 0}
                            </span>
                          </h5>
                          <p className="text-muted mb-0">Orders</p>
                        </div>
                      </div>
                      {/*end col*/}
                      <div className="col-6 col-sm-4">
                        <div className="p-3 border border-dashed border-start-0">
                          <h5 className="mb-1">
                            ₹
                            <span className="counter-value" data-target="22.89">
                              {ANALYTICS_DATA?.trends?.totalRevenue.toLocaleString(
                                "en-IN"
                              ) || 0}
                            </span>
                          </h5>
                          <p className="text-muted mb-0">Earnings</p>
                        </div>
                      </div>
                      {/*end col*/}
                      <div className="col-6 col-sm-4">
                        <div className="p-3 border border-dashed border-start-0 border-end-0">
                          <h5 className="mb-1 text-success">
                            <span className="counter-value" data-target="18.92">
                              {ANALYTICS_DATA?.trends?.totalCustomers.toLocaleString(
                                "en-IN"
                              ) || 0}
                            </span>
                          </h5>
                          <p className="text-muted mb-0">Total Customer</p>
                        </div>
                      </div>
                      {/*end col*/}
                    </div>
                  </div>
                  {/* end card header */}
                  <div className="card-body p-0 pb-2">
                    <div className="w-100">
                      {ANALYTICS_DATA?.trends ? (
                        <ReactApexChart
                          options={{
                            chart: {
                              height: 350,
                              type: "line",
                              stacked: false,
                              toolbar: {
                                show: true,
                              },
                            },
                            colors: ["#556ee6", "#34c38f", "#f46a6a"],
                            stroke: {
                              width: [0, 2, 5],
                              curve: "smooth",
                            },
                            plotOptions: {
                              bar: {
                                columnWidth: "50%",
                              },
                            },
                            fill: {
                              opacity: [0.85, 0.25, 1],
                              gradient: {
                                inverseColors: false,
                                shade: "light",
                                type: "vertical",
                                opacityFrom: 0.85,
                                opacityTo: 0.55,
                                stops: [0, 100, 100, 100],
                              },
                            },
                            labels: ANALYTICS_DATA.trends.labels || [
                              "Jan",
                              "Feb",
                              "Mar",
                              "Apr",
                              "May",
                              "Jun",
                              "Jul",
                              "Aug",
                              "Sep",
                              "Oct",
                              "Nov",
                            ],
                            markers: {
                              size: 0,
                            },
                            xaxis: {
                              type: "category",
                              categories: ANALYTICS_DATA.trends.labels || [
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                "Jul",
                                "Aug",
                                "Sep",
                                "Oct",
                                "Nov",
                              ],
                            },
                            yaxis: {
                              title: {
                                text: "Values",
                              },
                            },
                            tooltip: {
                              shared: true,
                              intersect: false,
                              y: {
                                formatter: function (y) {
                                  if (typeof y !== "undefined") {
                                    return y.toFixed(0);
                                  }
                                  return y;
                                },
                              },
                            },
                            legend: {
                              position: "top",
                              horizontalAlign: "right",
                            },
                          }}
                          series={[
                            {
                              name: "Revenue",
                              type: "column",
                              data: ANALYTICS_DATA.trends.revenue || [
                                23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30,
                              ],
                            },
                            {
                              name: "Orders",
                              type: "area",
                              data: ANALYTICS_DATA.trends.orders || [
                                44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43,
                              ],
                            },
                            {
                              name: "Customers",
                              type: "line",
                              data: ANALYTICS_DATA.trends.customers || [
                                30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39,
                              ],
                            },
                          ]}
                          type="line"
                          height={350}
                        />
                      ) : (
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ height: "350px" }}
                        >
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
              </div>
              {/* end col */}
              {/* end col */}
            </div>
            <div className="row">
              <div className="col-xl-12">
                <div className="card" data-aos="zoom-out">
                  <div className="card-header align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">
                      Best Selling Products
                    </h4>
                  </div>
                  {/* end card header */}
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      <table className="table table-hover table-centered align-middle table-nowrap mb-0">
                        <tbody>
                          {isLoadingAPI ? (
                            <LoadingSkeleton rows={bestSellingItemsPerPage} />
                          ) : ANALYTICS_DATA?.best_selling_products &&
                            ANALYTICS_DATA.best_selling_products.length > 0 ? (
                            getPaginatedData(
                              ANALYTICS_DATA.best_selling_products,
                              bestSellingCurrentPage,
                              bestSellingItemsPerPage
                            ).map((product, index) => {
                              const stockQuantity = parseInt(
                                product.quantity || product.stock_quantity || 0
                              );
                              const isLowStock =
                                stockQuantity <= LOW_STOCK_THRESHOLD &&
                                stockQuantity > 0;
                              const isOutOfStock =
                                product.avl_status === "0" ||
                                stockQuantity === 0;

                              return (
                                <tr key={product.id || index}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className="avatar-sm bg-light rounded p-1 me-2">
                                        <img
                                          src={
                                            product.product_img?.trim() ||
                                            "assets/images/products/img-1.png"
                                          }
                                          alt={
                                            product.product_name || "Product"
                                          }
                                          className="img-fluid d-block"
                                          onError={(e) => {
                                            e.target.src =
                                              "assets/images/products/img-1.png";
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <h5 className="fs-14 my-1">
                                          <a href="#" className="text-reset">
                                            {product.product_full_name ||
                                              product.product_name ||
                                              "Unknown Product"}
                                          </a>
                                        </h5>
                                        <span className="text-muted">
                                          SKU:{" "}
                                          {product.sku || product.id || "N/A"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <h5 className="fs-14 my-1 fw-normal">
                                      ₹
                                      {parseFloat(
                                        product.sale_price || product.price || 0
                                      ).toLocaleString("en-IN")}
                                    </h5>
                                    <span className="text-muted">Price</span>
                                  </td>
                                  <td>
                                    <h5 className="fs-14 my-1 fw-normal">
                                      {parseInt(
                                        product.total_qty_sold ||
                                          product.quantity_sold ||
                                          0
                                      ).toLocaleString("en-IN")}
                                    </h5>
                                    <span className="text-muted">Sold</span>
                                  </td>
                                  <td>
                                    <h5
                                      className={`fs-14 my-1 fw-normal ${
                                        isLowStock ? "text-danger fw-bold" : ""
                                      }`}
                                    >
                                      {isOutOfStock ? (
                                        <span className="badge badge-soft-danger">
                                          Out of stock
                                        </span>
                                      ) : isLowStock ? (
                                        <span className="text-danger fw-bold">
                                          {stockQuantity.toLocaleString(
                                            "en-IN"
                                          )}{" "}
                                          (Low Stock!)
                                        </span>
                                      ) : (
                                        stockQuantity.toLocaleString("en-IN")
                                      )}
                                    </h5>
                                    <span className="text-muted">Stock</span>
                                  </td>
                                  <td>
                                    <h5 className="fs-14 my-1 fw-normal">
                                      ₹
                                      {parseFloat(
                                        product.total_amount || 0
                                      ).toLocaleString("en-IN")}
                                    </h5>
                                    <span className="text-muted">Amount</span>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center py-4">
                                <div className="text-muted">
                                  No best selling products data available
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {ANALYTICS_DATA?.best_selling_products &&
                      ANALYTICS_DATA.best_selling_products.length > 0 && (
                        <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                          <div className="flex-shrink-0">
                            <div className="text-muted">
                              Showing{" "}
                              <span className="fw-semibold">
                                {(bestSellingCurrentPage - 1) *
                                  bestSellingItemsPerPage +
                                  1}
                              </span>{" "}
                              to{" "}
                              <span className="fw-semibold">
                                {Math.min(
                                  bestSellingCurrentPage *
                                    bestSellingItemsPerPage,
                                  ANALYTICS_DATA.best_selling_products.length
                                )}
                              </span>{" "}
                              of{" "}
                              <span className="fw-semibold">
                                {ANALYTICS_DATA.best_selling_products.length.toLocaleString(
                                  "en-IN"
                                )}
                              </span>{" "}
                              Results
                            </div>
                          </div>
                          <nav>
                            <ul className="pagination pagination-sm mb-0">
                              <li
                                className={`page-item ${
                                  bestSellingCurrentPage === 1 ? "disabled" : ""
                                }`}
                              >
                                <button
                                  className="page-link"
                                  onClick={() =>
                                    setBestSellingCurrentPage(
                                      bestSellingCurrentPage - 1
                                    )
                                  }
                                  disabled={bestSellingCurrentPage === 1}
                                >
                                  Previous
                                </button>
                              </li>
                              {Array.from(
                                {
                                  length: getTotalPages(
                                    ANALYTICS_DATA.best_selling_products,
                                    bestSellingItemsPerPage
                                  ),
                                },
                                (_, i) => i + 1
                              ).map((page) => (
                                <li
                                  key={page}
                                  className={`page-item ${
                                    bestSellingCurrentPage === page
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  <button
                                    className="page-link"
                                    onClick={() =>
                                      setBestSellingCurrentPage(page)
                                    }
                                  >
                                    {page}
                                  </button>
                                </li>
                              ))}
                              <li
                                className={`page-item ${
                                  bestSellingCurrentPage ===
                                  getTotalPages(
                                    ANALYTICS_DATA.best_selling_products,
                                    bestSellingItemsPerPage
                                  )
                                    ? "disabled"
                                    : ""
                                }`}
                              >
                                <button
                                  className="page-link"
                                  onClick={() =>
                                    setBestSellingCurrentPage(
                                      bestSellingCurrentPage + 1
                                    )
                                  }
                                  disabled={
                                    bestSellingCurrentPage ===
                                    getTotalPages(
                                      ANALYTICS_DATA.best_selling_products,
                                      bestSellingItemsPerPage
                                    )
                                  }
                                >
                                  Next
                                </button>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      )}
                  </div>
                </div>
              </div>
              {/* .col*/}
            </div>{" "}
            {/* end row*/}
            <div className="row">
              <div className="col-xl-12">
                <div className="card card-height-100">
                  <div className="card-header align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">
                      Revenue by Category
                    </h4>
                  </div>
                  {/* end card header */}
                  <div className="card-body">
                    {!ANALYTICS_DATA ? (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "300px" }}
                      >
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : ANALYTICS_DATA?.comparisons?.revenueByCategory &&
                      ANALYTICS_DATA.comparisons.revenueByCategory.length >
                        0 ? (
                      <>
                        <ReactApexChart
                          options={{
                            chart: {
                              type: "pie",
                              height: 380,
                              toolbar: {
                                show: true,
                                tools: {
                                  download: true,
                                },
                              },
                            },
                            labels:
                              ANALYTICS_DATA.comparisons.revenueByCategory.map(
                                (item) => item.category_name
                              ),
                            colors: [
                              "#556ee6",
                              "#34c38f",
                              "#f46a6a",
                              "#f1b44c",
                              "#50a5f1",
                            ],
                            plotOptions: {
                              pie: {
                                startAngle: -90,
                                endAngle: 270,
                              },
                            },
                            dataLabels: {
                              enabled: true,
                              formatter: function (val, opts) {
                                return opts.w.config.series[opts.seriesIndex];
                              },
                            },
                            legend: {
                              position: "bottom",
                              horizontalAlign: "center",
                              floating: false,
                              fontSize: "14px",
                              fontFamily: "Helvetica, Arial",
                              fontWeight: 400,
                            },
                            tooltip: {
                              enabled: true,
                              y: {
                                formatter: function (val) {
                                  return "₹" + val.toLocaleString();
                                },
                              },
                            },
                            responsive: [
                              {
                                breakpoint: 480,
                                options: {
                                  chart: {
                                    width: 200,
                                  },
                                  legend: {
                                    position: "bottom",
                                  },
                                },
                              },
                            ],
                          }}
                          series={ANALYTICS_DATA.comparisons.revenueByCategory.map(
                            (item) => parseFloat(item.revenue || 0)
                          )}
                          type="pie"
                          height={380}
                        />
                        <div className="mt-3">
                          <h6 className="text-muted mb-3">
                            Category Breakdown:
                          </h6>
                          <div className="row g-2 px-5">
                            {ANALYTICS_DATA.comparisons.revenueByCategory.map(
                              (category, index) => {
                                const colors = [
                                  "primary",
                                  "success",
                                  "warning",
                                  "danger",
                                  "info",
                                  "secondary",
                                  "dark",
                                  "purple",
                                  "pink",
                                  "cyan",
                                ];
                                const colorClass =
                                  colors[index % colors.length];
                                return (
                                  <div
                                    key={category.category_name}
                                    className="col-12"
                                  >
                                    <div className="d-flex align-items-center justify-content-between p-2 border rounded">
                                      <div className="d-flex align-items-center">
                                        <div
                                          className={`badge bg-${colorClass} rounded-circle p-1 me-2`}
                                          style={{
                                            width: "12px",
                                            height: "12px",
                                          }}
                                        ></div>
                                        <span
                                          className="text-truncate"
                                          style={{ maxWidth: "150px" }}
                                          title={category.category_name}
                                        >
                                          {category.category_name}
                                        </span>
                                      </div>
                                      <div className="text-end">
                                        <div className="fw-semibold text-success">
                                          ₹
                                          {parseFloat(
                                            category.revenue || 0
                                          ).toLocaleString("en-IN")}
                                        </div>
                                        <small className="text-muted">
                                          {(
                                            (parseFloat(category.revenue || 0) /
                                              ANALYTICS_DATA.comparisons.revenueByCategory.reduce(
                                                (sum, cat) =>
                                                  sum +
                                                  parseFloat(cat.revenue || 0),
                                                0
                                              )) *
                                            100
                                          ).toFixed(1)}
                                          %
                                        </small>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                          <div className="mt-3 p-2 bg-light rounded">
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-semibold">
                                Total Revenue:
                              </span>
                              <span className="fw-bold text-primary fs-5">
                                ₹
                                {ANALYTICS_DATA.comparisons.revenueByCategory
                                  .reduce(
                                    (sum, cat) =>
                                      sum + parseFloat(cat.revenue || 0),
                                    0
                                  )
                                  .toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-5">
                        <i className="ri-pie-chart-line fs-1 text-muted d-block mb-2"></i>
                        <p className="text-muted">No category data available</p>
                      </div>
                    )}
                  </div>
                </div>{" "}
                {/* .card*/}
              </div>{" "}
              {/* .col*/}
              <div className="col-xl-12">
                <div className="card">
                  <div className="card-header align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">
                      Recent Orders
                    </h4>
                  </div>
                  {/* end card header */}
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      <table className="table table-borderless table-centered align-middle table-nowrap mb-0">
                        <thead className="text-muted table-light">
                          <tr>
                            <th scope="col">Order ID</th>
                            <th scope="col">Customer</th>
                            <th scope="col">Sale Date</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {!ANALYTICS_DATA ? (
                            <LoadingSkeleton rows={5} cols={5} />
                          ) : ANALYTICS_DATA?.recent_activities?.recentSales &&
                            ANALYTICS_DATA.recent_activities.recentSales
                              .length > 0 ? (
                            getPaginatedData(
                              ANALYTICS_DATA.recent_activities.recentSales,
                              currentPage,
                              itemsPerPage
                            ).map((order, index) => (
                              <tr key={order.id || index}>
                                <td>
                                  <a
                                    href="#"
                                    className="fw-medium link-primary"
                                  >
                                    #{order.id || "N/A"}
                                  </a>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0 me-2">
                                      <div className="avatar-xs rounded-circle bg-light d-flex align-items-center justify-content-center">
                                        <i className="ri-user-line text-muted"></i>
                                      </div>
                                    </div>
                                    <div className="flex-grow-1">
                                      {order.customer_name || "Guest Customer"}
                                    </div>
                                  </div>
                                </td>
                                <td>{order.sale_date || "N/A"}</td>
                                <td>
                                  <span className="text-success">
                                    ₹
                                    {parseFloat(
                                      order.total_payment || 0
                                    ).toLocaleString("en-IN", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </span>
                                </td>
                                <td>
                                  <span className="badge badge-soft-success">
                                    Completed
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center py-4">
                                <div className="text-muted">
                                  <i className="ri-inbox-line fs-1 d-block mb-2"></i>
                                  No recent orders found
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                        {/* end tbody */}
                      </table>
                      {/* end table */}
                    </div>
                    {ANALYTICS_DATA?.recent_activities?.recentSales &&
                      ANALYTICS_DATA.recent_activities.recentSales.length >
                        0 && (
                        <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                          <div className="flex-shrink-0">
                            <div className="text-muted">
                              Showing{" "}
                              <span className="fw-semibold">
                                {(currentPage - 1) * itemsPerPage + 1}
                              </span>{" "}
                              to{" "}
                              <span className="fw-semibold">
                                {Math.min(
                                  currentPage * itemsPerPage,
                                  ANALYTICS_DATA.recent_activities.recentSales
                                    .length
                                )}
                              </span>{" "}
                              of{" "}
                              <span className="fw-semibold">
                                {ANALYTICS_DATA.recent_activities.recentSales.length.toLocaleString(
                                  "en-IN"
                                )}
                              </span>{" "}
                              Results
                            </div>
                          </div>
                          <nav>
                            <ul className="pagination pagination-sm mb-0">
                              <li
                                className={`page-item ${
                                  currentPage === 1 ? "disabled" : ""
                                }`}
                              >
                                <button
                                  className="page-link"
                                  onClick={() =>
                                    setCurrentPage(currentPage - 1)
                                  }
                                  disabled={currentPage === 1}
                                >
                                  Previous
                                </button>
                              </li>
                              {Array.from(
                                {
                                  length: getTotalPages(
                                    ANALYTICS_DATA.recent_activities
                                      .recentSales,
                                    itemsPerPage
                                  ),
                                },
                                (_, i) => i + 1
                              ).map((page) => (
                                <li
                                  key={page}
                                  className={`page-item ${
                                    currentPage === page ? "active" : ""
                                  }`}
                                >
                                  <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(page)}
                                  >
                                    {page}
                                  </button>
                                </li>
                              ))}
                              <li
                                className={`page-item ${
                                  currentPage ===
                                  getTotalPages(
                                    ANALYTICS_DATA.recent_activities
                                      .recentSales,
                                    itemsPerPage
                                  )
                                    ? "disabled"
                                    : ""
                                }`}
                              >
                                <button
                                  className="page-link"
                                  onClick={() =>
                                    setCurrentPage(currentPage + 1)
                                  }
                                  disabled={
                                    currentPage ===
                                    getTotalPages(
                                      ANALYTICS_DATA.recent_activities
                                        .recentSales,
                                      itemsPerPage
                                    )
                                  }
                                >
                                  Next
                                </button>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      )}
                  </div>
                </div>{" "}
                {/* .card*/}
              </div>{" "}
              {/* .col*/}
            </div>{" "}
            {/* end row*/}
          </div>{" "}
          {/* end .h-100*/}
        </div>{" "}
        {/* end col */}
        <div className="col-auto layout-rightside-col">
          <div className="overlay" />
          <div className="layout-rightside">
            <div className="card h-100 rounded-0">
              <div className="card-body p-0">
                <div className="p-3">
                  <h6 className="text-muted mb-0 text-uppercase fw-semibold">
                    Recent Activity
                  </h6>
                </div>
                <div
                  data-simplebar
                  style={{ maxHeight: "410px" }}
                  className="p-3 pt-0"
                >
                  <div className="acitivity-timeline acitivity-main">
                    <div className="acitivity-item d-flex">
                      <div className="flex-shrink-0 avatar-xs acitivity-avatar">
                        <div className="avatar-title bg-soft-success text-success rounded-circle">
                          <i className="ri-shopping-cart-2-line" />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1 lh-base">
                          Purchase by James Price
                        </h6>
                        <p className="text-muted mb-1">
                          Product noise evolve smartwatch{" "}
                        </p>
                        <small className="mb-0 text-muted">
                          02:14 PM Today
                        </small>
                      </div>
                    </div>
                    <div className="acitivity-item py-3 d-flex">
                      <div className="flex-shrink-0 avatar-xs acitivity-avatar">
                        <div className="avatar-title bg-soft-danger text-danger rounded-circle">
                          <i className="ri-stack-fill" />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1 lh-base">
                          Added new{" "}
                          <span className="fw-semibold">style collection</span>
                        </h6>
                        <p className="text-muted mb-1">By Nesta Technologies</p>
                        <div className="d-inline-flex gap-2 border border-dashed p-2 mb-2">
                          <a
                            href="apps-ecommerce-product-details.html"
                            className="bg-light rounded p-1"
                          >
                            <img
                              src="assets/images/products/img-8.png"
                              alt=""
                              className="img-fluid d-block"
                            />
                          </a>
                          <a
                            href="apps-ecommerce-product-details.html"
                            className="bg-light rounded p-1"
                          >
                            <img
                              src="assets/images/products/img-2.png"
                              alt=""
                              className="img-fluid d-block"
                            />
                          </a>
                          <a
                            href="apps-ecommerce-product-details.html"
                            className="bg-light rounded p-1"
                          >
                            <img
                              src="assets/images/products/img-10.png"
                              alt=""
                              className="img-fluid d-block"
                            />
                          </a>
                        </div>
                        <p className="mb-0 text-muted">
                          <small>9:47 PM Yesterday</small>
                        </p>
                      </div>
                    </div>
                    <div className="acitivity-item py-3 d-flex">
                      <div className="flex-shrink-0">
                        <img
                          src="assets/images/users/avatar-2.jpg"
                          alt=""
                          className="avatar-xs rounded-circle acitivity-avatar"
                        />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1 lh-base">
                          Natasha Carey have liked the products
                        </h6>
                        <p className="text-muted mb-1">
                          Allow users to like products in your WooCommerce
                          store.
                        </p>
                        <small className="mb-0 text-muted">25 Dec, 2021</small>
                      </div>
                    </div>
                    <div className="acitivity-item py-3 d-flex">
                      <div className="flex-shrink-0">
                        <div className="avatar-xs acitivity-avatar">
                          <div className="avatar-title rounded-circle bg-secondary">
                            <i className="mdi mdi-sale fs-14" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1 lh-base">
                          Today offers by{" "}
                          <a
                            href="apps-ecommerce-seller-details.html"
                            className="link-secondary"
                          >
                            Digitech Galaxy
                          </a>
                        </h6>
                        <p className="text-muted mb-2">
                          Offer is valid on orders of Rs.500 Or above for
                          selected products only.
                        </p>
                        <small className="mb-0 text-muted">12 Dec, 2021</small>
                      </div>
                    </div>
                    <div className="acitivity-item py-3 d-flex">
                      <div className="flex-shrink-0">
                        <div className="avatar-xs acitivity-avatar">
                          <div className="avatar-title rounded-circle bg-soft-danger text-danger">
                            <i className="ri-bookmark-fill" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1 lh-base">Favoried Product</h6>
                        <p className="text-muted mb-2">
                          Esther James have favorited product.
                        </p>
                        <small className="mb-0 text-muted">25 Nov, 2021</small>
                      </div>
                    </div>
                    <div className="acitivity-item py-3 d-flex">
                      <div className="flex-shrink-0">
                        <div className="avatar-xs acitivity-avatar">
                          <div className="avatar-title rounded-circle bg-secondary">
                            <i className="mdi mdi-sale fs-14" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1 lh-base">
                          Flash sale starting{" "}
                          <span className="text-primary">Tomorrow.</span>
                        </h6>
                        <p className="text-muted mb-0">
                          Flash sale by{" "}
                          <a
                            href="javascript:void(0);"
                            className="link-secondary fw-medium"
                          >
                            Zoetic Fashion
                          </a>
                        </p>
                        <small className="mb-0 text-muted">22 Oct, 2021</small>
                      </div>
                    </div>
                    <div className="acitivity-item py-3 d-flex">
                      <div className="flex-shrink-0">
                        <div className="avatar-xs acitivity-avatar">
                          <div className="avatar-title rounded-circle bg-soft-info text-info">
                            <i className="ri-line-chart-line" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1 lh-base">Monthly sales report</h6>
                        <p className="text-muted mb-2">
                          <span className="text-danger">2 days left</span>{" "}
                          notification to submit the monthly sales report.{" "}
                          <a
                            href="javascript:void(0);"
                            className="link-warning text-decoration-underline"
                          >
                            Reports Builder
                          </a>
                        </p>
                        <small className="mb-0 text-muted">15 Oct</small>
                      </div>
                    </div>
                    <div className="acitivity-item d-flex">
                      <div className="flex-shrink-0">
                        <img
                          src="assets/images/users/avatar-3.jpg"
                          alt=""
                          className="avatar-xs rounded-circle acitivity-avatar"
                        />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1 lh-base">Frank Hook Commented</h6>
                        <p className="text-muted mb-2 fst-italic">
                          " A product that has reviews is more likable to be
                          sold than a product. "
                        </p>
                        <small className="mb-0 text-muted">26 Aug, 2021</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 mt-2">
                  <h6 className="text-muted mb-3 text-uppercase fw-semibold">
                    Top 10 Categories
                  </h6>
                  <ol className="ps-3 text-muted">
                    <li className="py-1">
                      <a href="#" className="text-muted">
                        Mobile &amp; Accessories{" "}
                        <span className="float-end">(10,294)</span>
                      </a>
                    </li>
                    <li className="py-1">
                      <a href="#" className="text-muted">
                        Desktop <span className="float-end">(6,256)</span>
                      </a>
                    </li>
                    <li className="py-1">
                      <a href="#" className="text-muted">
                        Electronics <span className="float-end">(3,479)</span>
                      </a>
                    </li>
                    <li className="py-1">
                      <a href="#" className="text-muted">
                        Home &amp; Furniture{" "}
                        <span className="float-end">(2,275)</span>
                      </a>
                    </li>
                    <li className="py-1">
                      <a href="#" className="text-muted">
                        Grocery <span className="float-end">(1,950)</span>
                      </a>
                    </li>
                    <li className="py-1">
                      <a href="#" className="text-muted">
                        Fashion <span className="float-end">(1,582)</span>
                      </a>
                    </li>
                    <li className="py-1">
                      <a href="#" className="text-muted">
                        Appliances <span className="float-end">(1,037)</span>
                      </a>
                    </li>
                    <li className="py-1">
                      <a href="#" className="text-muted">
                        Beauty, Toys &amp; More{" "}
                        <span className="float-end">(924)</span>
                      </a>
                    </li>
                    <li className="py-1">
                      <a href="#" className="text-muted">
                        Food &amp; Drinks{" "}
                        <span className="float-end">(701)</span>
                      </a>
                    </li>
                    <li className="py-1">
                      <a href="#" className="text-muted">
                        Toys &amp; Games{" "}
                        <span className="float-end">(239)</span>
                      </a>
                    </li>
                  </ol>
                  <div className="mt-3 text-center">
                    <a
                      href="javascript:void(0);"
                      className="text-muted text-decoration-underline"
                    >
                      View all Categories
                    </a>
                  </div>
                </div>
                <div className="p-3">
                  <h6 className="text-muted mb-3 text-uppercase fw-semibold">
                    Products Reviews
                  </h6>
                  {/* Swiper */}
                  <div
                    className="swiper vertical-swiper"
                    style={{ height: "250px" }}
                  >
                    <div className="swiper-wrapper">
                      <div className="swiper-slide">
                        <div className="card border border-dashed shadow-none">
                          <div className="card-body">
                            <div className="d-flex">
                              <div className="flex-shrink-0 avatar-sm">
                                <div className="avatar-title bg-light rounded">
                                  <img
                                    src="assets/images/companies/img-1.png"
                                    alt=""
                                    height={30}
                                  />
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <div>
                                  <p className="text-muted mb-1 fst-italic text-truncate-two-lines">
                                    " Great product and looks great, lots of
                                    features. "
                                  </p>
                                  <div className="fs-11 align-middle text-warning">
                                    <i className="ri-star-fill" />
                                    <i className="ri-star-fill" />
                                    <i className="ri-star-fill" />
                                    <i className="ri-star-fill" />
                                    <i className="ri-star-fill" />
                                  </div>
                                </div>
                                <div className="text-end mb-0 text-muted">
                                  - by{" "}
                                  <cite title="Source Title">
                                    Force Medicines
                                  </cite>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="card border border-dashed shadow-none">
                          <div className="card-body">
                            <div className="d-flex">
                              <div className="flex-shrink-0">
                                <img
                                  src="assets/images/users/avatar-3.jpg"
                                  alt=""
                                  className="avatar-sm rounded"
                                />
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <div>
                                  <p className="text-muted mb-1 fst-italic text-truncate-two-lines">
                                    " Amazing template, very easy to understand
                                    and manipulate. "
                                  </p>
                                  <div className="fs-11 align-middle text-warning">
                                    <i className="ri-star-fill" />
                                    <i className="ri-star-fill" />
                                    <i className="ri-star-fill" />
                                    <i className="ri-star-fill" />
                                    <i className="ri-star-half-fill" />
                                  </div>
                                </div>
                                <div className="text-end mb-0 text-muted">
                                  - by{" "}
                                  <cite title="Source Title">Henry Baird</cite>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="card border border-dashed shadow-none">
                          <div className="card-body">
                            <div className="d-flex">
                              <div className="flex-shrink-0 avatar-sm">
                                <div className="avatar-title bg-light rounded">
                                  <img
                                    src="assets/images/companies/img-8.png"
                                    alt=""
                                    height={30}
                                  />
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <div>
                                  <p className="text-muted mb-1 fst-italic text-truncate-two-lines">
                                    "Very beautiful product and Very helpful
                                    customer service."
                                  </p>
                                  <div className="fs-11 align-middle text-warning">
                                    <i className="ri-star-fill" />
                                    <i className="ri-star-fill" />
                                    <i className="ri-star-fill" />
                                    <i className="ri-star-line" />
                                    <i className="ri-star-line" />
                                  </div>
                                </div>
                                <div className="text-end mb-0 text-muted">
                                  - by{" "}
                                  <cite title="Source Title">
                                    Zoetic Fashion
                                  </cite>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="card border border-dashed shadow-none">
                          <div className="card-body">
                            <div className="d-flex">
                              <div className="flex-shrink-0">
                                <img
                                  src="assets/images/users/avatar-2.jpg"
                                  alt=""
                                  className="avatar-sm rounded"
                                />
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <div>
                                  <p className="text-muted mb-1 fst-italic text-truncate-two-lines">
                                    " The product is very beautiful. I like it.
                                    "
                                  </p>
                                  <div className="fs-11 align-middle text-warning">
                                    <i className="ri-star-fill" />
                                    <i className="ri-star-fill" />
                                    <i className="ri-star-fill" />
                                    <i className="ri-star-half-fill" />
                                    <i className="ri-star-line" />
                                  </div>
                                </div>
                                <div className="text-end mb-0 text-muted">
                                  - by{" "}
                                  <cite title="Source Title">
                                    Nancy Martino
                                  </cite>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h6 className="text-muted mb-3 text-uppercase fw-semibold">
                    Customer Reviews
                  </h6>
                  <div className="bg-light px-3 py-2 rounded-2 mb-2">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <div className="fs-16 align-middle text-warning">
                          <i className="ri-star-fill" />
                          <i className="ri-star-fill" />
                          <i className="ri-star-fill" />
                          <i className="ri-star-fill" />
                          <i className="ri-star-half-fill" />
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <h6 className="mb-0">4.5 out of 5</h6>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted">
                      Total <span className="fw-medium">5.50k</span>
                      reviews
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="row align-items-center g-2">
                      <div className="col-auto">
                        <div className="p-1">
                          <h6 className="mb-0">5 star</h6>
                        </div>
                      </div>
                      <div className="col">
                        <div className="p-1">
                          <div className="progress animated-progress progress-sm">
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{ width: "50.16%" }}
                              aria-valuenow="50.16"
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="p-1">
                          <h6 className="mb-0 text-muted">2758</h6>
                        </div>
                      </div>
                    </div>
                    {/* end row */}
                    <div className="row align-items-center g-2">
                      <div className="col-auto">
                        <div className="p-1">
                          <h6 className="mb-0">4 star</h6>
                        </div>
                      </div>
                      <div className="col">
                        <div className="p-1">
                          <div className="progress animated-progress progress-sm">
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{ width: "29.32%" }}
                              aria-valuenow="29.32"
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="p-1">
                          <h6 className="mb-0 text-muted">1063</h6>
                        </div>
                      </div>
                    </div>
                    {/* end row */}
                    <div className="row align-items-center g-2">
                      <div className="col-auto">
                        <div className="p-1">
                          <h6 className="mb-0">3 star</h6>
                        </div>
                      </div>
                      <div className="col">
                        <div className="p-1">
                          <div className="progress animated-progress progress-sm">
                            <div
                              className="progress-bar bg-warning"
                              role="progressbar"
                              style={{ width: "18.12%" }}
                              aria-valuenow="18.12"
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="p-1">
                          <h6 className="mb-0 text-muted">997</h6>
                        </div>
                      </div>
                    </div>
                    {/* end row */}
                    <div className="row align-items-center g-2">
                      <div className="col-auto">
                        <div className="p-1">
                          <h6 className="mb-0">2 star</h6>
                        </div>
                      </div>
                      <div className="col">
                        <div className="p-1">
                          <div className="progress animated-progress progress-sm">
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{ width: "4.98%" }}
                              aria-valuenow="4.98"
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="p-1">
                          <h6 className="mb-0 text-muted">227</h6>
                        </div>
                      </div>
                    </div>
                    {/* end row */}
                    <div className="row align-items-center g-2">
                      <div className="col-auto">
                        <div className="p-1">
                          <h6 className="mb-0">1 star</h6>
                        </div>
                      </div>
                      <div className="col">
                        <div className="p-1">
                          <div className="progress animated-progress progress-sm">
                            <div
                              className="progress-bar bg-danger"
                              role="progressbar"
                              style={{ width: "7.42%" }}
                              aria-valuenow="7.42"
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="p-1">
                          <h6 className="mb-0 text-muted">408</h6>
                        </div>
                      </div>
                    </div>
                    {/* end row */}
                  </div>
                </div>
                <div className="card sidebar-alert bg-light border-0 text-center mx-4 mb-0 mt-3">
                  <div className="card-body">
                    <img src="assets/images/giftbox.png" alt="" />
                    <div className="mt-4">
                      <h5>Invite New Seller</h5>
                      <p className="text-muted lh-base">
                        Refer a new seller to us and earn ₹100 per refer.
                      </p>
                      <button
                        type="button"
                        className="btn btn-primary btn-label rounded-pill"
                      >
                        <i className="ri-mail-fill label-icon align-middle rounded-pill fs-16 me-2" />
                        Invite Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* end card*/}
          </div>{" "}
          {/* end .rightbar*/}
        </div>{" "}
        {/* end col */}
      </div>
    </>
  );
};

export default HomePage;
