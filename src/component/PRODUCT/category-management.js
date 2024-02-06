import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";

import ContextData from "../../context/MainContext";

import { ImportNewCategory } from "./Import/import-new-category";
import { ImportNewChildCategory } from "./Import/import-new-child-category";
import { AddCategoryForm } from "./Add/category-add-form";

import SweetAlert from "react-bootstrap-sweetalert";

// import "bootstrap/dist/css/bootstrap.css";
import { Col, Row, Table } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

import Dropdown from "react-bootstrap/Dropdown";
import swal from "sweetalert";
import { Stack, Skeleton } from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";

import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";

// Create table headers consisting of 4 columns.

import URLDomain from "../../URL";
import { useQuery } from "react-query";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const adminStoreId = cookies.get("adminStoreId");
const adminId = cookies.get("adminId");

const CategoryManagement = () => {
  const { storeCategoryData, storeCategoryRelode } = useContext(ContextData);
  const [delID, setDelID] = useState(false);
  const [editablePlot, setEditablePlot] = useState({});
  const [showData, setShowData] = useState(storeCategoryData);
  const [showDataCopy, setShowDataCopy] = useState(storeCategoryData);
  const [isDataLoding, setisDataLoding] = useState(true);

  const navigate = useNavigate();

  const toast = useToast();

  async function fetchData() {
    const data = await fetch(
      URLDomain + "/APP-API/Billing/storeCategoryDataApi",
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
    data: CATEGORYDATAT,
    isError,
    isLoading: isLoadingAPI,
  } = useQuery({
    queryKey: ["CATEGORYDATAT"],
    queryFn: (e) => fetchData(),
  });

  useEffect(() => {
    if (CATEGORYDATAT) {
      setShowData(CATEGORYDATAT.stores_category);
      setShowDataCopy(CATEGORYDATAT.stores_category);
      setisDataLoding(false);
    }

    console.log("showDataCopy", showDataCopy);
  }, [CATEGORYDATAT, isLoadingAPI]);

  const ChangeStatus = () => {
    setDelID(true);
  };

  const getToast = (e) => {
    toast({
      title: e.title,
      description: e.desc,
      status: e.status,
      duration: 3000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState("0");

  const radios = [
    { name: "All Category", value: "0", variant: "secondary" },
    { name: "Parent Category", value: "1", variant: "primary" },
    { name: "Child Category", value: "2", variant: "dark" },
    { name: "Active", value: "3", variant: "success" },
    { name: "Not Active", value: "4", variant: "danger" },
  ];

  const STORY_HEADERS = [
    {
      prop: "category_name",
      title: "Name",
      isFilterable: true,
      isSortable: true,

      cell: (row) => {
        if (row.category_level == 0) {
          return (
            <>
              <p className="text-danger">{row.category_name}</p>
              <p className="text-danger">{row.hindi_name}</p>
            </>
          );
        } else {
          return (
            <>
              <p className="text-success">{row.category_name}</p>
              <p className="text-success">{row.hindi_name}</p>
            </>
          );
        }
      },
    },

    {
      prop: "category_level",
      title: "Level",
      isFilterable: true,
      isSortable: true,

      cell: (row) => {
        if (row.category_level == 0) {
          return <p className="text-danger">Parent Category</p>;
        } else {
          return (
            <>
              <p className="text-success">{row.parent_name}</p>
              <p className="text-success">{row.parent_hindi_name}</p>
            </>
          );
        }
      },
    },
    {
      prop: "image",
      title: "Image",

      cell: (row) => {
        return (
          <img
            src={row.category_image}
            alt=""
            style={{ height: "40px", borderRadius: "14px" }}
          />
        );
      },
    },

    {
      prop: "product",
      title: "Product",
      cell: (row) => {
        if (row.category_level == 0) {
          return (
            <button
              onClick={() =>
                navigate(
                  "/productManagement/product-by-parent-category/" +
                    row.master_category_id +
                    "/" +
                    row.category_name
                )
              }
              className="btn btn-primary"
            >
              {" "}
              Products{" "}
            </button>
          );
        } else {
          return (
            <button
              onClick={() =>
                navigate(
                  "/productManagement/product-by-category/" +
                    row.master_category_id +
                    "/" +
                    row.category_name
                )
              }
              className="btn btn-dark"
            >
              {" "}
              Products{" "}
            </button>
          );
        }
      },
    },
    {
      prop: "status",
      title: "Status",
      isSortable: true,

      cell: (row) => {
        if (row.category_level == 0) {
          return (
            <Dropdown>
              <Dropdown.Toggle
                variant={row.status == 1 ? "success" : "danger"}
                id="dropdown-basic"
              >
                {row.status == 1 ? "Active" : "Not Active"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() =>
                    deleteAction2(
                      row.master_category_id,
                      row.category_name,
                      row.status
                    )
                  }
                >
                  {row.status == 1 ? "Make Not Active" : "Make Active"}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          );
        } else {
          return (
            <Dropdown>
              <Dropdown.Toggle
                variant={row.status == 1 ? "success" : "danger"}
                id="dropdown-basic"
              >
                {row.status == 1 ? "Active" : "Not Active"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() =>
                    deleteAction(
                      row.master_category_id,
                      row.category_name,
                      row.status
                    )
                  }
                >
                  {row.status == 1 ? "Make Not Active" : "Make Active"}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          );
        }
      },
    },
  ];

  const deleteAction2 = (master_category_id, product_name, status) => {
    var statusAction = "";
    var statusModified = null;
    if (Number(status) == 1) {
      statusAction = "Not Active";
      statusModified = 0;
    } else {
      statusAction = "Active";
      statusModified = 1;
    }

    swal({
      title: "Action | " + statusAction + " | to " + product_name,
      text: "All prodcut will be | " + statusAction + " | of  " + product_name,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((deleteProductFromStore) => {
      if (deleteProductFromStore) {
        console.log("status", statusModified);

        fetch(URLDomain + "/APP-API/Billing/changeStoreMasterCategoryStatus", {
          method: "POST",
          header: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            master_category_id: master_category_id,
            statusModified: statusModified,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.success) {
              storeCategoryRelode();

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

  const deleteAction = (master_category_id, product_name, status) => {
    var statusAction = "";
    var statusModified = null;
    if (Number(status) == 1) {
      statusAction = "Not Active";
      statusModified = 0;
    } else {
      statusAction = "Active";
      statusModified = 1;
    }

    swal({
      title: "Action | " + statusAction + " | to " + product_name,
      text: "All prodcut will be | " + statusAction + " | of  " + product_name,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((deleteProductFromStore) => {
      if (deleteProductFromStore) {
        // console.log("status", statusModified);

        fetch(URLDomain + "/APP-API/Billing/changeStoreCategoryStatus", {
          method: "POST",
          header: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            master_category_id: master_category_id,
            statusModified: statusModified,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.success) {
              storeCategoryRelode();

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

  const changeCategory = (value) => {
    setRadioValue(value);
    if (value == 1) {
      const newParentData = showDataCopy.filter(
        (obj) => obj.category_level == 0
      );
      setShowData(newParentData);
    } else if (value == 0) {
      const newChildData = showDataCopy;
      setShowData(newChildData);
    } else if (value == 2) {
      const newChildData = showDataCopy.filter(
        (obj) => obj.category_level != 0
      );
      setShowData(newChildData);
    } else if (value == 3) {
      const newChildData = showDataCopy.filter((obj) => obj.status == 1);
      setShowData(newChildData);
    } else if (value == 4) {
      const newChildData = showDataCopy.filter((obj) => obj.status == 0);
      setShowData(newChildData);
    }
  };

  // const changeStatusData = (value) => {
  //     setRadioValue1(value)

  //     if (value == 1) {
  //         const newParentData = storeCategoryData.filter(obj => obj.status == 1)
  //         setShowData(newParentData);

  //     }
  //     else {
  //         const newChildData = storeCategoryData.filter(obj => obj.status != 0)
  //         setShowData(newChildData);
  //     }

  // }

  return (
    <>
      {delID ? (
        <SweetAlert
          warning
          showCancel
          confirmBtnText="Yes, delete it!"
          confirmBtnBsStyle="danger"
          title="Are you sure?"
          // onConfirm={this.deleteFile}
          // onCancel={this.onCancel}
          focusCancelBtn
        >
          You will not be able to recover this imaginary file!
        </SweetAlert>
      ) : null}
      <div>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Category List</h4>
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
                        onChange={(e) => changeCategory(e.currentTarget.value)}
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
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#AddCategoryForm"
                  >
                    <i className="ri-add-fill me-1 align-bottom" />
                    Add Category{" "}
                  </button>

                  {/* <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#importCategory"
                  >
                    <i className="ri-add-fill me-1 align-bottom" /> Import
                    Category{" "}
                  </button>
                  <button
                    className="btn btn-dark"
                    data-bs-toggle="modal"
                    data-bs-target="#importChildCategory"
                  >
                    <i className="ri-add-fill me-1 align-bottom" /> Import Child
                    Category
                  </button> */}
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
              <Stack padding={8}>
                <Skeleton height="100px" borderRadius={6} />
                <Skeleton height="100px" borderRadius={6} />
                <Skeleton height="100px" borderRadius={6} />
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

        <div className="row">
          <div className="col-lg-12">
            <div>
              <div
                className="modal fade"
                id="AddCategoryForm"
                tabIndex={-1}
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered w-50">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="myModalLabel">
                        Add New Category
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                    </div>
                    <div className="modal-body">
                      <AddCategoryForm categoryData={showDataCopy} />
                    </div>
                  </div>
                  {/*end modal-content*/}
                </div>
                {/*end modal-dialog*/}
              </div>
              {/*end modal*/}
            </div>
          </div>
          {/* end col */}
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div>
              <div
                className="modal fade"
                id="importCategory"
                tabIndex={-1}
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered w-50">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="myModalLabel">
                        Import Category
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                    </div>
                    <div className="modal-body">
                      {/* <ImportNewCategory /> */}
                    </div>
                  </div>
                  {/*end modal-content*/}
                </div>
                {/*end modal-dialog*/}
              </div>
              {/*end modal*/}
            </div>
          </div>
          {/* end col */}
        </div>
        {/*end row*/}
        <div className="row">
          <div className="col-lg-12">
            <div>
              <div
                className="modal fade"
                id="importChildCategory"
                tabIndex={-1}
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered w-50">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="myModalLabel">
                        Import Child Category
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                    </div>
                    <div className="modal-body">
                      {/* <ImportNewChildCategory /> */}
                    </div>
                  </div>
                  {/*end modal-content*/}
                </div>
                {/*end modal-dialog*/}
              </div>
              {/*end modal*/}
            </div>
          </div>
          {/* end col */}
        </div>
        {/*end row*/}
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

export default CategoryManagement;
