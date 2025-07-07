import React, { useState, useContext, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "react-query";

import ContextData from "../../context/MainContext";
import URL from "../../URL";

import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

import { queryClient } from "../../App";
import { OnlineOrderListDataTable } from "./component/OnlineOrderListDataTable";

import swal from "sweetalert";
import Cookies from "universal-cookie";
import { Flex, Spinner, useToast } from "@chakra-ui/react";

const cookies = new Cookies();

const OnlineSale = () => {
  const { getToast } = useContext(ContextData);
  const navigate = useNavigate();
  const toast = useToast();

  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");

  const [radioValue, setRadioValue] = useState("Placed");

  // Memoized status options for better performance
  const radios = useMemo(
    () => [
      { name: "Placed", value: "Placed", variant: "dark" },
      { name: "Confirmed", value: "Confirmed", variant: "success" },
      {
        name: "Preparing for dispatch",
        value: "Preparing for dispatch",
        variant: "warning",
      },
      { name: "On the way", value: "On the way", variant: "info" },
      { name: "Delivered", value: "Delivered", variant: "primary" },
      { name: "Canceled", value: "Canceled", variant: "danger" },
    ],
    []
  );

  // API function for updating order status
  const updateOrderStatusAPI = async ({ store_id, order_id, order_status }) => {
    const response = await fetch(URL + "/APP-API/Billing/updateOrderStatus", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        store_id,
        order_id,
        order_status,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  };

  // Mutation for updating order status
  const updateOrderStatusMutation = useMutation(updateOrderStatusAPI, {
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries(["ONLINE_ORDERS"]);
        toast({
          title: "Status Updated",
          dec: "Order status updated successfully",
          status: "success",
        });
      } else {
        toast({
          title: "Error",
          dec: data.message || "Failed to update order status",
          status: "error",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        dec: "Failed to update order status",
        status: "error",
      });
    },
  });

  const STORY_HEADERS = [
    {
      prop: "customer_name",
      title: "Name",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p className="text-success">{row.customer_name}</p>;
      },
    },
    {
      prop: "customer_address",
      title: "Address.",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p className="text-dark">{row.customer_address}</p>;
      },
    },
    {
      prop: "delivery_slots",
      title: "Slots.",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p className="text-dark">{row.delivery_slots}</p>;
      },
    },
    {
      prop: "customer_phone",
      title: "Mobile",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p className="text-primary">{row.customer_phone}</p>;
      },
    },

    {
      prop: "total_payment",
      title: "Total Payment",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p className="text-danger"> ₹ {row.total_payment}</p>;
      },
    },

    {
      prop: "payment_mode",
      title: "Pay Mode",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p className="text-dark">{row.payment_mode}</p>;
      },
    },

    {
      prop: "date",
      title: "Bill Date",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return (
          <p className="text-dark">
            {row.date} {row.time}
          </p>
        );
      },
    },

    {
      prop: "order_status",
      title: "Current Status",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        const statusVariant =
          radios.find((r) => r.value === row.order_status)?.variant ||
          "secondary";
        return (
          <span className={`badge bg-${statusVariant}`}>
            {row.order_status}
          </span>
        );
      },
    },

    {
      prop: "quick_status_change",
      title: "Quick Status",
      cell: (row) => {
        return (
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-primary"
              size="sm"
              id={`status-dropdown-${row.order_id}`}
              disabled={updateOrderStatusMutation.isLoading}
            >
              {updateOrderStatusMutation.isLoading
                ? "Updating..."
                : "Change Status"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {radios.map((radio, idx) => (
                <div key={idx}>
                  {radio.value !== row.order_status && (
                    <Dropdown.Item
                      onClick={() =>
                        handleQuickStatusChange(row.order_id, radio.value)
                      }
                      className={`text-${radio.variant}`}
                    >
                      <i className={`ri-checkbox-circle-line me-2`}></i>
                      {radio.value}
                    </Dropdown.Item>
                  )}
                </div>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        );
      },
    },

    {
      prop: "action",
      title: "Action",

      cell: (row) => {
        console.log("roww ---->", row);
        return (
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
              Action
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                className="btn btn-primary"
                onClick={() =>
                  navigate(
                    "/online/online-sales-history-record/" +
                      row.order_id +
                      "/" +
                      row.customer_address_id +
                      "/" +
                      row.order_type
                  )
                }
              >
                View Record
              </Dropdown.Item>

              {radios.map((radio, idx) => (
                // <ToggleButton
                //   key={idx}
                //   id={`radio-${idx}`}
                //   type="radio"
                //   variant={"outline-" + radio.variant}
                //   name="radio"
                //   value={radio.value}
                //   checked={radioValue === radio.value}
                //   onChange={(e) => changeOrderStatus(e.currentTarget.value)}
                // >
                //   {radio.name}
                // </ToggleButton>

                <>
                  {radio.value != row.order_status ? (
                    <Dropdown.Item
                      onClick={() =>
                        UpdateStatusAction(
                          row.id,
                          row.order_status,
                          radio.value,
                          row.user_id
                        )
                      }
                    >
                      {radio.value}
                    </Dropdown.Item>
                  ) : null}
                </>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        );
      },
    },
  ];

  // Quick status change handler with callback optimization
  const handleQuickStatusChange = useCallback(
    (order_id, new_status) => {
      console.log("order_id --->", order_id);
      console.log("new_status --->", new_status);
      updateOrderStatusMutation.mutate({
        store_id: adminStoreId,
        order_id: order_id,
        order_status: new_status,
      });
    },
    [updateOrderStatusMutation, adminStoreId]
  );

  // Enhanced status update with confirmation
  const UpdateStatusAction = (
    order_id,
    old_order_status,
    order_status,
    user_id
  ) => {
    swal({
      title: "Action | " + old_order_status + " | to " + order_status,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((changeOrderStatus) => {
      if (changeOrderStatus) {
        updateOrderStatusMutation.mutate({
          store_id: adminStoreId,
          order_id: order_id,
          order_status: order_status,
        });

        swal("Status Change!", {
          icon: "success",
        });
      } else {
        swal("Nothing Change!");
      }
    });
  };

  const changeOrderStatus = useCallback((value) => {
    setRadioValue(value);
  }, []);

  return (
    <>
      <div>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Online Orders Management</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active">Online Orders</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="row g-2">
              <div className="col-sm-auto ">
                <div className="list-grid-nav hstack gap-1">
                  <ButtonGroup>
                    {radios.map((radio, idx) => (
                      <ToggleButton
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        variant={"outline-" + radio.variant}
                        name="radio"
                        value={radio.value}
                        checked={radioValue === radio.value}
                        onChange={(e) => {
                          console.log("value --->", e.currentTarget.value);
                          setRadioValue(e.currentTarget.value);
                          changeOrderStatus(e.currentTarget.value);
                        }}
                      >
                        {radio.name}
                      </ToggleButton>
                    ))}
                  </ButtonGroup>
                </div>
              </div>
              {/*end col*/}

              <div className="col-sm-auto ms-auto">
                <div className="list-grid-nav hstack gap-1">
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      queryClient.invalidateQueries(["ONLINE_ORDERS"])
                    }
                  >
                    <i className="ri-refresh-line me-1 align-bottom" />
                    Refresh Orders
                  </button>
                </div>
              </div>
              {/*end col*/}
            </div>
            {/*end row*/}
          </div>
        </div>

        <div className="row"></div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div id="customerList">
                  <div className="table-responsive table-card mb-1">
                    <OnlineOrderListDataTable
                      data={radioValue}
                      onStatusChange={handleQuickStatusChange}
                      isUpdating={updateOrderStatusMutation.isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Update Loading Overlay */}
        {updateOrderStatusMutation.isLoading && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 }}
          >
            <div className="bg-white p-4 rounded shadow">
              <div className="d-flex align-items-center">
                <Spinner className="me-3" />
                <span>Updating order status...</span>
              </div>
            </div>
          </div>
        )}

        <svg className="bookmark-hide">
          <symbol
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="var(--color-svg)"
            id="icon-star"
          >
            <path
              strokeWidth=".4"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </symbol>
        </svg>
      </div>
    </>
  );
};

export default OnlineSale;
