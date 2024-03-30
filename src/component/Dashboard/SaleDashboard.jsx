import { useState, useContext, useEffect } from "react";
import { Chart, Pie } from "react-chartjs-2";
import Data from "../../context/MainContext";
import Cookies from "universal-cookie";
import { useQuery } from "react-query";
import URLDomain from "../../URL";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
} from "chart.js";
import { Box, Button } from "@chakra-ui/react";

const cookies = new Cookies();

const adminStoreId = cookies.get("adminStoreId");

ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const generateRandomColorArray = ({ length }) => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    // text += cars[i] + "<br>";
    arr.push(getRandomColor());
  }
  return arr;
};

async function fetchData() {
  const data = await fetch(URLDomain + "/APP-API/Billing/DashboardReports", {
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
  // console.log("ok datad ==========>", data.store_customer_purchase_record);
  return data;
}

const SaleDashboard = () => {
  const {
    data: DASHBOARD_REPORT,
    isError,
    isLoading: isLoadingAPI,
  } = useQuery({
    queryKey: ["DASHBOARD_REPORT"],
    queryFn: (e) => fetchData(),
  });

  const { auth, user } = useContext(Data);
  const [count, setCount] = useState(500);
  const [numberOfOrders, setNumberOfOrders] = useState([]);

  useEffect(() => {
    setNumberOfOrders(DASHBOARD_REPORT?.ordersByWithoutMonths);
  }, []);

  //   console.log("dashboard data ==========>", Object.values(DASHBOARD_REPORT));
  //   console.log("dashboard data ==========>", DASHBOARD_REPORT);

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="h-100">
            <div className="row mb-3 pb-1">
              <div className="col-12">
                <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                  <div className="flex-grow-1">
                    <h4 className="fs-16 mb-1">Good Morning, Anna!</h4>
                    <p className="text-muted mb-0">
                      Here's what's happening with your store today.
                    </p>
                  </div>
                  <div className="mt-3 mt-lg-0">
                    <form action="javascript:void(0);">
                      <div className="row g-3 mb-0 align-items-center">
                        <div className="col-sm-auto">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control border-0 dash-filter-picker shadow"
                              data-provider="flatpickr"
                              data-range-date="true"
                              data-date-format="d M, Y"
                              data-deafult-date="01 Jan 2022 to 31 Jan 2022"
                            />
                            <div className="input-group-text bg-primary border-primary text-white">
                              <i className="ri-calendar-2-line" />
                            </div>
                          </div>
                        </div>
                        {/*end col*/}
                        <div className="col-auto">
                          <button
                            type="button"
                            className="btn btn-soft-success"
                          >
                            <i className="ri-add-circle-line align-middle me-1" />
                            Add Product
                          </button>
                        </div>
                        {/*end col*/}
                        <div className="col-auto">
                          <button
                            type="button"
                            className="btn btn-soft-info btn-icon waves-effect waves-light layout-rightside-btn"
                          >
                            <i className="ri-pulse-line" />
                          </button>
                        </div>
                        {/*end col*/}
                      </div>
                      {/*end row*/}
                    </form>
                  </div>
                </div>
                {/* end card header */}
              </div>
              {/*end col*/}
            </div>
            {/*end row*/}
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
                        {/* <h5 className="text-success fs-14 mb-0">
                          <i className="ri-arrow-right-up-line fs-13 align-middle" />
                          +16.24 %
                        </h5> */}
                      </div>
                    </div>
                    <div className="d-flex align-items-end justify-content-between mt-4">
                      <div>
                        <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                          ₹
                          <span className="counter-value" data-target={count}>
                            {Number(
                              DASHBOARD_REPORT?.totalEarning
                            ).toLocaleString()}
                          </span>
                        </h4>
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
                        {/* <h5 className="text-danger fs-14 mb-0">
                          <i className="ri-arrow-right-down-line fs-13 align-middle" />
                          -3.57 %
                        </h5> */}
                      </div>
                    </div>
                    <div className="d-flex align-items-end justify-content-between mt-4">
                      <div>
                        <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                          <span className="counter-value" data-target={36894}>
                            {Number(
                              DASHBOARD_REPORT?.totalOrdersCount
                            ).toLocaleString()}
                          </span>
                        </h4>
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
                        {/* <h5 className="text-success fs-14 mb-0">
                          <i className="ri-arrow-right-up-line fs-13 align-middle" />
                          +29.08 %
                        </h5> */}
                      </div>
                    </div>
                    <div className="d-flex align-items-end justify-content-between mt-4">
                      <div>
                        <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                          <span className="counter-value" data-target="183.35">
                            {Number(
                              DASHBOARD_REPORT?.totalCustomersCount
                            ).toLocaleString()}
                          </span>
                        </h4>
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
                          My Balance
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <h5 className="text-muted fs-14 mb-0">+0.00 %</h5>
                      </div>
                    </div>
                    <div className="d-flex align-items-end justify-content-between mt-4">
                      <div>
                        <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                          $
                          <span className="counter-value" data-target="165.89">
                            0
                          </span>
                          k
                        </h4>
                        <a href="#" className="text-decoration-underline">
                          Withdraw money
                        </a>
                      </div>
                      <div className="avatar-sm flex-shrink-0">
                        <span className="avatar-title bg-soft-primary rounded fs-3">
                          <i className="bx bx-wallet text-primary" />
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
              <div className="col-xl-8">
                <div className="card">
                  <div className="card-header border-0 align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">
                      Number of orders by months
                    </h4>
                    {/* <div>
                      <button
                        type="button"
                        className="btn btn-soft-secondary btn-sm"
                      >
                        ALL
                      </button>
                      <button
                        type="button"
                        className="btn btn-soft-secondary btn-sm"
                      >
                        1M
                      </button>
                      <button
                        type="button"
                        className="btn btn-soft-secondary btn-sm"
                      >
                        6M
                      </button>
                      <button
                        type="button"
                        className="btn btn-soft-primary btn-sm"
                      >
                        1Y
                      </button>
                    </div> */}
                  </div>

                  {/* end card header */}
                  <div className="card-header p-0 border-0 bg-soft-light">
                    <div className="row g-0 text-center">
                      <Box px={6}>
                        <Chart
                          type={"bar"}
                          data={{
                            labels: [
                              "JAN",
                              "FEB",
                              "MAR",
                              "APR",
                              "MAY",
                              "JUN",
                              "JUL",
                              "AUG",
                              "SEPT",
                              "OCT",
                              "NOV",
                              "DEC",
                            ],
                            datasets: [
                              {
                                label: "Number of orders",
                                data: DASHBOARD_REPORT?.ordersByWithoutMonths,
                                borderWidth: 1,
                              },
                            ],
                          }}
                          options={{
                            scales: {
                              y: {
                                beginAtZero: true,
                              },
                            },
                          }}

                          //   {...props}
                        />
                      </Box>
                    </div>
                  </div>
                </div>
                {/* end card */}
              </div>
            </div>
            <div className="row">
              <div className="col-xl-12">
                <div className="card" data-aos="zoom-out">
                  <div className="card-header align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">
                      Best Selling Products
                    </h4>
                    <div className="flex-shrink-0">
                      <div className="dropdown card-header-dropdown">
                        <a
                          className="text-reset dropdown-btn"
                          href="#"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <span className="fw-semibold text-uppercase fs-12">
                            Sort by:
                          </span>
                          <span className="text-muted">
                            Today
                            <i className="mdi mdi-chevron-down ms-1" />
                          </span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a className="dropdown-item" href="#">
                            Today
                          </a>
                          <a className="dropdown-item" href="#">
                            Yesterday
                          </a>
                          <a className="dropdown-item" href="#">
                            Last 7 Days
                          </a>
                          <a className="dropdown-item" href="#">
                            Last 30 Days
                          </a>
                          <a className="dropdown-item" href="#">
                            This Month
                          </a>
                          <a className="dropdown-item" href="#">
                            Last Month
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end card header */}
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      <table className="table table-hover table-centered align-middle table-nowrap mb-0">
                        <tbody>
                          {DASHBOARD_REPORT?.topSellingsProducts.map(
                            (items, i) => {
                              return (
                                <tr>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className="avatar-sm bg-light rounded p-1 me-2">
                                        <img
                                          src={items.product_img}
                                          alt=""
                                          className="img-fluid d-block"
                                        />
                                      </div>
                                      <div>
                                        <h5 className="fs-14 my-1">
                                          <a
                                            href="apps-ecommerce-product-details.html"
                                            className="text-reset"
                                          >
                                            {items.product_full_name}
                                          </a>
                                        </h5>
                                        <span className="text-muted">
                                          24 Apr 2021
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <h5 className="fs-14 my-1 fw-normal">
                                      ₹{items.price}
                                    </h5>
                                    <span className="text-muted">Price</span>
                                  </td>
                                  <td>
                                    <h5 className="fs-14 my-1 fw-normal">
                                      {" "}
                                      {items.totalCount}
                                    </h5>
                                    <span className="text-muted">Orders</span>
                                  </td>
                                  <td>
                                    <h5 className="fs-14 my-1 fw-normal">
                                      510
                                    </h5>
                                    <span className="text-muted">Stock</span>
                                  </td>
                                  {/* log */}
                                  <td>
                                    <h5 className="fs-14 my-1 fw-normal">
                                      ₹
                                      {Number(items.price) *
                                        Number(items.totalCount)}
                                    </h5>
                                    <span className="text-muted">Amount</span>
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                      <div className="flex-shrink-0">
                        <div className="text-muted">
                          Showing <span className="fw-semibold">5</span> of{" "}
                          <span className="fw-semibold">25</span> Results
                        </div>
                      </div>
                      <ul className="pagination pagination-separated pagination-sm mb-0">
                        <li className="page-item disabled">
                          <a href="#" className="page-link">
                            ←
                          </a>
                        </li>
                        <li className="page-item">
                          <a href="#" className="page-link">
                            1
                          </a>
                        </li>
                        <li className="page-item active">
                          <a href="#" className="page-link">
                            2
                          </a>
                        </li>
                        <li className="page-item">
                          <a href="#" className="page-link">
                            3
                          </a>
                        </li>
                        <li className="page-item">
                          <a href="#" className="page-link">
                            →
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="card card-height-100">
                  <div className="card-header align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">
                      Top Selling Category
                    </h4>
                  </div>
                  {/* end card header */}
                  <div className="card-body">
                    <Pie
                      //   options={...}
                      data={{
                        labels: DASHBOARD_REPORT?.saleByCategorysName,
                        datasets: [
                          {
                            label: "My First Dataset",
                            data: DASHBOARD_REPORT?.saleByCategorysCount,
                            backgroundColor: generateRandomColorArray({
                              length:
                                DASHBOARD_REPORT?.saleByCategorysCount.length,
                            }),
                            hoverOffset: 4,
                          },
                        ],
                      }}
                    />
                  </div>{" "}
                  {/* .card-body*/}
                </div>{" "}
                {/* .card*/}
              </div>{" "}
              {/* .col*/}
            </div>{" "}
            <div className="row">
              <div className="col-xl-6">
                <div className="card" data-aos="zoom-out">
                  <div className="card-header align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">
                      Best Selling Products
                    </h4>
                    <div className="flex-shrink-0">
                      <div className="dropdown card-header-dropdown">
                        <a
                          className="text-reset dropdown-btn"
                          href="#"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <span className="fw-semibold text-uppercase fs-12">
                            Sort by:
                          </span>
                          <span className="text-muted">
                            Today
                            <i className="mdi mdi-chevron-down ms-1" />
                          </span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a className="dropdown-item" href="#">
                            Today
                          </a>
                          <a className="dropdown-item" href="#">
                            Yesterday
                          </a>
                          <a className="dropdown-item" href="#">
                            Last 7 Days
                          </a>
                          <a className="dropdown-item" href="#">
                            Last 30 Days
                          </a>
                          <a className="dropdown-item" href="#">
                            This Month
                          </a>
                          <a className="dropdown-item" href="#">
                            Last Month
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end card header */}
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      <table className="table table-hover table-centered align-middle table-nowrap mb-0">
                        <tbody>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-sm bg-light rounded p-1 me-2">
                                  <img
                                    src="assets/images/products/img-1.png"
                                    alt=""
                                    className="img-fluid d-block"
                                  />
                                </div>
                                <div>
                                  <h5 className="fs-14 my-1">
                                    <a
                                      href="apps-ecommerce-product-details.html"
                                      className="text-reset"
                                    >
                                      Branded T-Shirts
                                    </a>
                                  </h5>
                                  <span className="text-muted">
                                    24 Apr 2021
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">$29.00</h5>
                              <span className="text-muted">Price</span>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">62</h5>
                              <span className="text-muted">Orders</span>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">510</h5>
                              <span className="text-muted">Stock</span>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">$1,798</h5>
                              <span className="text-muted">Amount</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-sm bg-light rounded p-1 me-2">
                                  <img
                                    src="assets/images/products/img-2.png"
                                    alt=""
                                    className="img-fluid d-block"
                                  />
                                </div>
                                <div>
                                  <h5 className="fs-14 my-1">
                                    <a
                                      href="apps-ecommerce-product-details.html"
                                      className="text-reset"
                                    >
                                      Bentwood Chair
                                    </a>
                                  </h5>
                                  <span className="text-muted">
                                    19 Mar 2021
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">$85.20</h5>
                              <span className="text-muted">Price</span>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">35</h5>
                              <span className="text-muted">Orders</span>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">
                                <span className="badge badge-soft-danger">
                                  Out of stock
                                </span>{" "}
                              </h5>
                              <span className="text-muted">Stock</span>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">$2982</h5>
                              <span className="text-muted">Amount</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-sm bg-light rounded p-1 me-2">
                                  <img
                                    src="assets/images/products/img-3.png"
                                    alt=""
                                    className="img-fluid d-block"
                                  />
                                </div>
                                <div>
                                  <h5 className="fs-14 my-1">
                                    <a
                                      href="apps-ecommerce-product-details.html"
                                      className="text-reset"
                                    >
                                      Borosil Paper Cup
                                    </a>
                                  </h5>
                                  <span className="text-muted">
                                    01 Mar 2021
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">$14.00</h5>
                              <span className="text-muted">Price</span>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">80</h5>
                              <span className="text-muted">Orders</span>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">749</h5>
                              <span className="text-muted">Stock</span>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">$1120</h5>
                              <span className="text-muted">Amount</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-sm bg-light rounded p-1 me-2">
                                  <img
                                    src="assets/images/products/img-4.png"
                                    alt=""
                                    className="img-fluid d-block"
                                  />
                                </div>
                                <div>
                                  <h5 className="fs-14 my-1">
                                    <a
                                      href="apps-ecommerce-product-details.html"
                                      className="text-reset"
                                    >
                                      One Seater Sofa
                                    </a>
                                  </h5>
                                  <span className="text-muted">
                                    11 Feb 2021
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">$127.50</h5>
                              <span className="text-muted">Price</span>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">56</h5>
                              <span className="text-muted">Orders</span>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">
                                <span className="badge badge-soft-danger">
                                  Out of stock
                                </span>
                              </h5>
                              <span className="text-muted">Stock</span>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">$7140</h5>
                              <span className="text-muted">Amount</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-sm bg-light rounded p-1 me-2">
                                  <img
                                    src="assets/images/products/img-5.png"
                                    alt=""
                                    className="img-fluid d-block"
                                  />
                                </div>
                                <div>
                                  <h5 className="fs-14 my-1">
                                    <a
                                      href="apps-ecommerce-product-details.html"
                                      className="text-reset"
                                    >
                                      Stillbird Helmet
                                    </a>
                                  </h5>
                                  <span className="text-muted">
                                    17 Jan 2021
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">$54</h5>
                              <span className="text-muted">Price</span>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">74</h5>
                              <span className="text-muted">Orders</span>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">805</h5>
                              <span className="text-muted">Stock</span>
                            </td>
                            <td>
                              <h5 className="fs-14 my-1 fw-normal">$3996</h5>
                              <span className="text-muted">Amount</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                      <div className="flex-shrink-0">
                        <div className="text-muted">
                          Showing <span className="fw-semibold">5</span> of{" "}
                          <span className="fw-semibold">25</span> Results
                        </div>
                      </div>
                      <ul className="pagination pagination-separated pagination-sm mb-0">
                        <li className="page-item disabled">
                          <a href="#" className="page-link">
                            ←
                          </a>
                        </li>
                        <li className="page-item">
                          <a href="#" className="page-link">
                            1
                          </a>
                        </li>
                        <li className="page-item active">
                          <a href="#" className="page-link">
                            2
                          </a>
                        </li>
                        <li className="page-item">
                          <a href="#" className="page-link">
                            3
                          </a>
                        </li>
                        <li className="page-item">
                          <a href="#" className="page-link">
                            →
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="card card-height-100">
                  <div className="card-header align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">Top Sellers</h4>
                    <div className="flex-shrink-0">
                      <div className="dropdown card-header-dropdown">
                        <a
                          className="text-reset dropdown-btn"
                          href="#"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <span className="text-muted">
                            Report
                            <i className="mdi mdi-chevron-down ms-1" />
                          </span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a className="dropdown-item" href="#">
                            Download Report
                          </a>
                          <a className="dropdown-item" href="#">
                            Export
                          </a>
                          <a className="dropdown-item" href="#">
                            Import
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end card header */}
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      <table className="table table-centered table-hover align-middle table-nowrap mb-0">
                        <tbody>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-2">
                                  <img
                                    src="assets/images/companies/img-1.png"
                                    alt=""
                                    className="avatar-sm p-2"
                                  />
                                </div>
                                <div>
                                  <h5 className="fs-14 my-1 fw-medium">
                                    <a
                                      href="apps-ecommerce-seller-details.html"
                                      className="text-reset"
                                    >
                                      iTest Factory
                                    </a>
                                  </h5>
                                  <span className="text-muted">
                                    Oliver Tyler
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="text-muted">
                                Bags and Wallets
                              </span>
                            </td>
                            <td>
                              <p className="mb-0">8547</p>
                              <span className="text-muted">Stock</span>
                            </td>
                            <td>
                              <span className="text-muted">$541200</span>
                            </td>
                            <td>
                              <h5 className="fs-14 mb-0">
                                32%
                                <i className="ri-bar-chart-fill text-success fs-16 align-middle ms-2" />
                              </h5>
                            </td>
                          </tr>
                          {/* end */}
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-2">
                                  <img
                                    src="assets/images/companies/img-2.png"
                                    alt=""
                                    className="avatar-sm p-2"
                                  />
                                </div>
                                <div className="flex-grow-1">
                                  <h5 className="fs-14 my-1 fw-medium">
                                    <a
                                      href="apps-ecommerce-seller-details.html"
                                      className="text-reset"
                                    >
                                      Digitech Galaxy
                                    </a>
                                  </h5>
                                  <span className="text-muted">
                                    John Roberts
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="text-muted">Watches</span>
                            </td>
                            <td>
                              <p className="mb-0">895</p>
                              <span className="text-muted">Stock</span>
                            </td>
                            <td>
                              <span className="text-muted">$75030</span>
                            </td>
                            <td>
                              <h5 className="fs-14 mb-0">
                                79%
                                <i className="ri-bar-chart-fill text-success fs-16 align-middle ms-2" />
                              </h5>
                            </td>
                          </tr>
                          {/* end */}
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-2">
                                  <img
                                    src="assets/images/companies/img-3.png"
                                    alt=""
                                    className="avatar-sm p-2"
                                  />
                                </div>
                                <div className="flex-gow-1">
                                  <h5 className="fs-14 my-1 fw-medium">
                                    <a
                                      href="apps-ecommerce-seller-details.html"
                                      className="text-reset"
                                    >
                                      Nesta Technologies
                                    </a>
                                  </h5>
                                  <span className="text-muted">
                                    Harley Fuller
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="text-muted">
                                Bike Accessories
                              </span>
                            </td>
                            <td>
                              <p className="mb-0">3470</p>
                              <span className="text-muted">Stock</span>
                            </td>
                            <td>
                              <span className="text-muted">$45600</span>
                            </td>
                            <td>
                              <h5 className="fs-14 mb-0">
                                90%
                                <i className="ri-bar-chart-fill text-success fs-16 align-middle ms-2" />
                              </h5>
                            </td>
                          </tr>
                          {/* end */}
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-2">
                                  <img
                                    src="assets/images/companies/img-8.png"
                                    alt=""
                                    className="avatar-sm p-2"
                                  />
                                </div>
                                <div className="flex-grow-1">
                                  <h5 className="fs-14 my-1 fw-medium">
                                    <a
                                      href="apps-ecommerce-seller-details.html"
                                      className="text-reset"
                                    >
                                      Zoetic Fashion
                                    </a>
                                  </h5>
                                  <span className="text-muted">
                                    James Bowen
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="text-muted">Clothes</span>
                            </td>
                            <td>
                              <p className="mb-0">5488</p>
                              <span className="text-muted">Stock</span>
                            </td>
                            <td>
                              <span className="text-muted">$29456</span>
                            </td>
                            <td>
                              <h5 className="fs-14 mb-0">
                                40%
                                <i className="ri-bar-chart-fill text-success fs-16 align-middle ms-2" />
                              </h5>
                            </td>
                          </tr>
                          {/* end */}
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-2">
                                  <img
                                    src="assets/images/companies/img-5.png"
                                    alt=""
                                    className="avatar-sm p-2"
                                  />
                                </div>
                                <div className="flex-grow-1">
                                  <h5 className="fs-14 my-1 fw-medium">
                                    <a
                                      href="apps-ecommerce-seller-details.html"
                                      className="text-reset"
                                    >
                                      Meta4Systems
                                    </a>
                                  </h5>
                                  <span className="text-muted">Zoe Dennis</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="text-muted">Furniture</span>
                            </td>
                            <td>
                              <p className="mb-0">4100</p>
                              <span className="text-muted">Stock</span>
                            </td>
                            <td>
                              <span className="text-muted">$11260</span>
                            </td>
                            <td>
                              <h5 className="fs-14 mb-0">
                                57%
                                <i className="ri-bar-chart-fill text-success fs-16 align-middle ms-2" />
                              </h5>
                            </td>
                          </tr>
                          {/* end */}
                        </tbody>
                      </table>
                      {/* end table */}
                    </div>
                    <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                      <div className="flex-shrink-0">
                        <div className="text-muted">
                          Showing <span className="fw-semibold">5</span> of{" "}
                          <span className="fw-semibold">25</span> Results
                        </div>
                      </div>
                      <ul className="pagination pagination-separated pagination-sm mb-0">
                        <li className="page-item disabled">
                          <a href="#" className="page-link">
                            ←
                          </a>
                        </li>
                        <li className="page-item">
                          <a href="#" className="page-link">
                            1
                          </a>
                        </li>
                        <li className="page-item active">
                          <a href="#" className="page-link">
                            2
                          </a>
                        </li>
                        <li className="page-item">
                          <a href="#" className="page-link">
                            3
                          </a>
                        </li>
                        <li className="page-item">
                          <a href="#" className="page-link">
                            →
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>{" "}
                  {/* .card-body*/}
                </div>{" "}
                {/* .card*/}
              </div>{" "}
              {/* .col*/}
            </div>{" "}
            {/* end row*/}
            <div className="row">
              <div className="col-xl-4">
                <div className="card card-height-100">
                  <div className="card-header align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">
                      Store Visits by Source
                    </h4>
                    <div className="flex-shrink-0">
                      <div className="dropdown card-header-dropdown">
                        <a
                          className="text-reset dropdown-btn"
                          href="#"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <span className="text-muted">
                            Report
                            <i className="mdi mdi-chevron-down ms-1" />
                          </span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a className="dropdown-item" href="#">
                            Download Report
                          </a>
                          <a className="dropdown-item" href="#">
                            Export
                          </a>
                          <a className="dropdown-item" href="#">
                            Import
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end card header */}
                  <div className="card-body">
                    <div
                      id="store-visits-source"
                      data-colors='["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]'
                      className="apex-charts"
                      dir="ltr"
                    />
                  </div>
                </div>{" "}
                {/* .card*/}
              </div>{" "}
              {/* .col*/}
              <div className="col-xl-8">
                <div className="card">
                  <div className="card-header align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">
                      Recent Orders
                    </h4>
                    <div className="flex-shrink-0">
                      <button
                        type="button"
                        className="btn btn-soft-info btn-sm"
                      >
                        <i className="ri-file-list-3-line align-middle" />{" "}
                        Generate Report
                      </button>
                    </div>
                  </div>
                  {/* end card header */}
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      <table className="table table-borderless table-centered align-middle table-nowrap mb-0">
                        <thead className="text-muted table-light">
                          <tr>
                            <th scope="col">Order ID</th>
                            <th scope="col">Customer</th>
                            <th scope="col">Product</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Vendor</th>
                            <th scope="col">Status</th>
                            <th scope="col">Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <a
                                href="apps-ecommerce-order-details.html"
                                className="fw-medium link-primary"
                              >
                                #VZ2112
                              </a>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-2">
                                  <img
                                    src="assets/images/users/avatar-1.jpg"
                                    alt=""
                                    className="avatar-xs rounded-circle"
                                  />
                                </div>
                                <div className="flex-grow-1">Alex Smith</div>
                              </div>
                            </td>
                            <td>Clothes</td>
                            <td>
                              <span className="text-success">$109.00</span>
                            </td>
                            <td>Zoetic Fashion</td>
                            <td>
                              <span className="badge badge-soft-success">
                                Paid
                              </span>
                            </td>
                            <td>
                              <h5 className="fs-14 fw-medium mb-0">
                                5.0
                                <span className="text-muted fs-11 ms-1">
                                  (61 votes)
                                </span>
                              </h5>
                            </td>
                          </tr>
                          {/* end tr */}
                          <tr>
                            <td>
                              <a
                                href="apps-ecommerce-order-details.html"
                                className="fw-medium link-primary"
                              >
                                #VZ2111
                              </a>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-2">
                                  <img
                                    src="assets/images/users/avatar-2.jpg"
                                    alt=""
                                    className="avatar-xs rounded-circle"
                                  />
                                </div>
                                <div className="flex-grow-1">Jansh Brown</div>
                              </div>
                            </td>
                            <td>Kitchen Storage</td>
                            <td>
                              <span className="text-success">$149.00</span>
                            </td>
                            <td>Micro Design</td>
                            <td>
                              <span className="badge badge-soft-warning">
                                Pending
                              </span>
                            </td>
                            <td>
                              <h5 className="fs-14 fw-medium mb-0">
                                4.5
                                <span className="text-muted fs-11 ms-1">
                                  (61 votes)
                                </span>
                              </h5>
                            </td>
                          </tr>
                          {/* end tr */}
                          <tr>
                            <td>
                              <a
                                href="apps-ecommerce-order-details.html"
                                className="fw-medium link-primary"
                              >
                                #VZ2109
                              </a>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-2">
                                  <img
                                    src="assets/images/users/avatar-3.jpg"
                                    alt=""
                                    className="avatar-xs rounded-circle"
                                  />
                                </div>
                                <div className="flex-grow-1">Ayaan Bowen</div>
                              </div>
                            </td>
                            <td>Bike Accessories</td>
                            <td>
                              <span className="text-success">$215.00</span>
                            </td>
                            <td>Nesta Technologies</td>
                            <td>
                              <span className="badge badge-soft-success">
                                Paid
                              </span>
                            </td>
                            <td>
                              <h5 className="fs-14 fw-medium mb-0">
                                4.9
                                <span className="text-muted fs-11 ms-1">
                                  (89 votes)
                                </span>
                              </h5>
                            </td>
                          </tr>
                          {/* end tr */}
                          <tr>
                            <td>
                              <a
                                href="apps-ecommerce-order-details.html"
                                className="fw-medium link-primary"
                              >
                                #VZ2108
                              </a>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-2">
                                  <img
                                    src="assets/images/users/avatar-4.jpg"
                                    alt=""
                                    className="avatar-xs rounded-circle"
                                  />
                                </div>
                                <div className="flex-grow-1">Prezy Mark</div>
                              </div>
                            </td>
                            <td>Furniture</td>
                            <td>
                              <span className="text-success">$199.00</span>
                            </td>
                            <td>Syntyce Solutions</td>
                            <td>
                              <span className="badge badge-soft-danger">
                                Unpaid
                              </span>
                            </td>
                            <td>
                              <h5 className="fs-14 fw-medium mb-0">
                                4.3
                                <span className="text-muted fs-11 ms-1">
                                  (47 votes)
                                </span>
                              </h5>
                            </td>
                          </tr>
                          {/* end tr */}
                          <tr>
                            <td>
                              <a
                                href="apps-ecommerce-order-details.html"
                                className="fw-medium link-primary"
                              >
                                #VZ2107
                              </a>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-2">
                                  <img
                                    src="assets/images/users/avatar-6.jpg"
                                    alt=""
                                    className="avatar-xs rounded-circle"
                                  />
                                </div>
                                <div className="flex-grow-1">Vihan Hudda</div>
                              </div>
                            </td>
                            <td>Bags and Wallets</td>
                            <td>
                              <span className="text-success">$330.00</span>
                            </td>
                            <td>iTest Factory</td>
                            <td>
                              <span className="badge badge-soft-success">
                                Paid
                              </span>
                            </td>
                            <td>
                              <h5 className="fs-14 fw-medium mb-0">
                                4.7
                                <span className="text-muted fs-11 ms-1">
                                  (161 votes)
                                </span>
                              </h5>
                            </td>
                          </tr>
                          {/* end tr */}
                        </tbody>
                        {/* end tbody */}
                      </table>
                      {/* end table */}
                    </div>
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
                        Refer a new seller to us and earn $100 per refer.
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

export default SaleDashboard;
