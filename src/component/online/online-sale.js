import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import ContextData from "../../context/MainContext";
import URL from "../../URL";

import { useNavigate } from "react-router";

import { useQuery } from "react-query";

// import "bootstrap/dist/css/bootstrap.css";
import { Col, Row, Table } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";

import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

import { queryClient } from "../../App";

import swal from "sweetalert";

import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";

// Create table headers consisting of 4 columns.
import Cookies from "universal-cookie";
import { Box, Flex, Spinner } from "@chakra-ui/react";

const cookies = new Cookies();

const OnlineSale = () => {
  const {
    store_customer_purchase_record,
    removeDataToCurrentGlobal,
    getToast,
    reloadData,
  } = useContext(ContextData);
  const [delID, setProductDelID] = useState(0);
  const [isDeletAction, setDeletAction] = useState(false);
  const [vendorData, getVendorData] = useState({});
  const navigate = useNavigate();

  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");

  const [radioValue, setRadioValue] = useState("Placed");
  console.log("radio ======>", radioValue);

  const radios = [
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
  ];

  async function fetchData({ order_status }) {
    const data = await fetch(URL + "/APP-API/Billing/getOnlineOrder", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        store_id: adminStoreId,
        order_status,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => responseJson);
    return data.online_order;
  }

  const {
    data: ONLINE_ORDERS,
    isFetching,
    isLoading: ONLINE_ORDERS_LOADING,
  } = useQuery({
    queryKey: ["ONLINE_ORDERS", radioValue],
    queryFn: (e) => fetchData({ order_status: e.queryKey[1] }),
  });

  // console.log("isisFetching", isFetching);

  const ChangeStatus = () => {
    setProductDelID(true);
  };

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
                      row.customer_address_id
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
        console.log("status", order_status);

        fetch(URL + "/APP-API/Billing/changeStoreOrderStatus", {
          method: "POST",
          header: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            order_id: order_id,
            order_status: order_status,
            user_id,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.success) {
              // storeProductRelode();
              // fetchData();

              queryClient.invalidateQueries({
                queryKey: ["ONLINE_ORDERS"],
              });

              getToast({
                title: "Status Change ",
                dec: "Successful",
                status: "success",
              });
            } else {
              getToast({ title: "ERROR", dec: "ERROR", status: "error" });
            }

            for (let i = 0; i < 10; i++) {
              document.getElementsByClassName("btn-close")[i].click();
            }
          })
          .catch((error) => {
            //  console.error(error);
          });

        swal("Status Change!", {
          icon: "success",
        });
      } else {
        swal("Nothing Change!");
      }
    });
  };

  const deleteAction = (delete_id, order_status) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Product !",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((changeOrderStatus) => {
      if (changeOrderStatus) {
        fetch(URL + "/APP-API/Billing/deleteStoreProduct", {
          method: "POST",
          header: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            delete_id: delete_id,
            order_status: order_status,
            store_id: adminStoreId,
            adminId: adminId,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log("respond delete", responseJson);
            if (responseJson.delete) {
              getToast({
                title: "Product Deleted ",
                dec: "Successful",
                status: "success",
              });
            } else {
              getToast({ title: "ERROR", dec: "ERROR", status: "error" });
            }

            for (let i = 0; i < 10; i++) {
              document.getElementsByClassName("btn-close")[i].click();
            }
          })
          .catch((error) => {
            //  console.error(error);
          });

        reloadData();

        swal("Poof! Your Product  has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Product is safe!");
      }
    });
  };

  const deletePlot = () => {
    console.log("kit kat", delID);
    fetch(URL + "/APP-API/App/deletePlot", {
      method: "POST",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: delID,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("respond", responseJson);
        if (responseJson.deleted) {
          removeDataToCurrentGlobal({
            type: "store_customer_purchase_record",
            payload: delID,
            where: "id",
          });
          getToast({ title: "Plot Deleted", dec: "", status: "error" });
        } else {
          alert("Error");
        }
        for (let i = 0; i < 10; i++) {
          document.getElementsByClassName("btn-close")[i].click();
        }
      })
      .catch((error) => {
        //  console.error(error);
      });
  };

  const changeOrderStatus = (value) => {
    setRadioValue(value);

    if (value == 1) {
    } else if (value == 2) {
    } else if (value == 3) {
    } else if (value == 4) {
    }
  };

  return (
    <>
      <div>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Vendor List </h4>
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
                        onChange={(e) =>
                          changeOrderStatus(e.currentTarget.value)
                        }
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
                    className="btn btn-dark"
                    data-bs-toggle="modal"
                    data-bs-target="#addVendor"
                  >
                    <i className="ri-add-fill me-1 align-bottom" /> Add Vendor
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
                    {ONLINE_ORDERS_LOADING ? (
                      <Flex
                        height={"5rem"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Spinner />
                      </Flex>
                    ) : (
                      <DatatableWrapper
                        body={ONLINE_ORDERS}
                        headers={STORY_HEADERS}
                        paginationOptionsProps={{
                          initialState: {
                            rowsPerPage: 10,
                            options: [10, 15, 20],
                          },
                        }}
                      >
                        <Row className="mb-4 p-2">
                          <Col
                            xs={12}
                            lg={4}
                            className="d-flex flex-col justify-content-end align-items-end"
                          >
                            <Filter />
                          </Col>
                          <Col
                            xs={12}
                            sm={6}
                            lg={4}
                            className="d-flex flex-col justify-content-lg-center align-items-center justify-content-sm-start mb-2 mb-sm-0"
                          >
                            <PaginationOptions />
                          </Col>
                          <Col
                            xs={12}
                            sm={6}
                            lg={4}
                            className="d-flex flex-col justify-content-end align-items-end"
                          >
                            <Pagination />
                          </Col>
                        </Row>
                        <Table className="table  table-hover">
                          <TableHeader />
                          <TableBody />
                        </Table>
                      </DatatableWrapper>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="addVendor"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered w-50">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="myModalLabel">
                  Sale History
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">{/* <AddVendorForm /> */}</div>
            </div>
            {/*end modal-content*/}
          </div>
          {/*end modal-dialog*/}
        </div>
        {/*end modal*/}

        <div
          className="modal fade"
          id="updateVendor"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered w-50">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="myModalLabel">
                  Edit Vendor
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                {/* <UpdateVendor vendorDetails={vendorData} /> */}
              </div>
            </div>
            {/*end modal-content*/}
          </div>
          {/*end modal-dialog*/}
        </div>
        {/*end modal*/}

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
