import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import ContextData from "../../context/MainContext";
import { useQuery } from "react-query";

import URLDomain from "../../URL";
import { ImportNewProduct } from "./Import/import-new-product";
import { AddExpiry } from "./Add/add-expiry";
// import { AddUnitForm } from "./Add/unit-add-form";
// import { vendorDataComp } from "./Update/vendorDataComp";
// import { UpdateProductStockComp } from "./Update/UpdateProductStockComp";
import { UpdateVendor } from "./Update/UpdateVendor";
import { Stack, Skeleton } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { queryClient } from "../../App";

import SweetAlert from "react-bootstrap-sweetalert";

// import "bootstrap/dist/css/bootstrap.css";
import { Col, Row, Table } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";

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

const cookies = new Cookies();

const ExpairyManagement = () => {
  const [delID, setProductDelID] = useState(0);
  const [isDeletAction, setDeletAction] = useState(false);
  const [vendorData, getVendorData] = useState({});
  // const [downloadBarcode, setdownloadBarcode] = useState({});
  const [showData, setShowData] = useState(null);

  const [isDataLoding, setisDataLoding] = useState(true);

  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");

  const navigate = useNavigate();

  async function fetchData() {
    const data = await fetch(URLDomain + "/APP-API/Billing/expiry_list_load", {
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
    data: expiry_list_load,
    isError,
    isLoading: isLoadingAPI,
    isFetching,
  } = useQuery({
    queryKey: ["expiry_list_load"],
    queryFn: (e) => fetchData(),
  });

  useEffect(() => {
    setShowData([]);
    console.log("vendor list", expiry_list_load, isLoadingAPI);
    if (expiry_list_load) {
      setShowData(expiry_list_load.store_expiry_list);
      setisDataLoding(false);
    }
  }, [expiry_list_load, isLoadingAPI]);

  const ChangeStatus = () => {
    setProductDelID(true);
  };

  const STORY_HEADERS = [
    {
      prop: "firm_name",
      title: "Firm Name",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p className="text-dark">{row.vendor_firm_name}</p>;
      },
    },

    {
      prop: "sub_total",
      title: "Total ",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p className="text-dark">{row.sub_total}</p>;
      },
    },
    {
      prop: "order_id",
      title: "Transation",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p className="text-dark">{row.order_id}</p>;
      },
    },

    {
      prop: "no_of_items",
      title: "Items",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p className="text-dark">{row.no_of_items}</p>;
      },
    },

    {
      prop: "purchaes_date",
      title: "Return Date",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p className="text-dark">{row.purchaes_date}</p>;
      },
    },
    {
      prop: "settlement_status",
      title: "Settlement Status",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        if (row.settlement_status == 0) {
          return <p className=" btn- text-danger">Not Settlement</p>;
        } else {
          return <p className=" btn- text-success">Settlement</p>;
        }
      },
    },

    {
      prop: "Stock",
      title: "Action",

      cell: (row) => {
        if (row.settlement_status == 0) {
          return (
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-basic">
                Action
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() =>
                    navigate(
                      "/purchaseManagement/expiry-history-record/" +
                        row.order_id +
                        "/" +
                        row.vendor_id
                    )
                  }
                >
                  Expiry Details
                </Dropdown.Item>
                <Dropdown.Item onClick={() => deleteAction(row.id)}>
                  Settlement
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          );
        } else {
          return (
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-basic">
                Action
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() =>
                    navigate(
                      "/purchaseManagement/expiry-history-record/" +
                        row.order_id +
                        "/" +
                        row.vendor_id
                    )
                  }
                >
                  Expiry Details
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          );
        }
      },
    },
  ];

  const deleteAction = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once done, you will not be able to recover this action !",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((deleteProductFromStore) => {
      if (deleteProductFromStore) {
        fetch(URLDomain + "/APP-API/Billing/updateExpiryStatus", {
          method: "POST",
          header: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log("respond delete", responseJson);
            if (responseJson.success) {
              queryClient.invalidateQueries({
                queryKey: ["expiry_list_load"],
              });
            } else {
            }

            for (let i = 0; i < 10; i++) {
              document.getElementsByClassName("btn-close")[i].click();
            }
          })
          .catch((error) => {
            //  console.error(error);
          });

        // reloadData();

        swal("Poof! Your Product  has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Product is safe!");
      }
    });
  };
  const deleteProductFromStore = () => {
    // console.log('delete_id',delID)
    alert("done");
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
          //   getToast({ title: "Plot Deleted", dec: "", status: "error" });
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

  return (
    <>
      <div>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Expiry List</h4>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="row g-2">
              {isFetching && "fetching..."}

              <div className="col-sm-auto ms-auto">
                <div className="list-grid-nav hstack gap-1">
                  <button
                    className="btn btn-dark"
                    data-bs-toggle="modal"
                    data-bs-target="#addExpiry"
                  >
                    <i className="ri-add-fill me-1 align-bottom" /> Add Expiry
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
            {isDataLoding ? (
              <Stack>
                <Skeleton height="100px" />
                <Skeleton height="100px" />
                <Skeleton height="100px" />
              </Stack>
            ) : (
              <div className="card">
                <div className="card-body">
                  <div id="customerList">
                    <div className="table-responsive table-card mb-1">
                      <DatatableWrapper
                        body={showData}
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
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="modal fade"
          id="addExpiry"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered w-100">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="myModalLabel">
                  Add Expiry
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <AddExpiry />
              </div>
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
                <UpdateVendor vendorDetails={vendorData} />
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

export default ExpairyManagement;
