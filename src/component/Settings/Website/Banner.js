import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import ContextData from "../../../context/MainContext";
import URLDomain from "../../../URL";
import { useNavigate } from "react-router";

import { AddBannerForm } from "./AddBannerForm";

// import "bootstrap/dist/css/bootstrap.css";
import { Col, Row, Table } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import swal from "sweetalert";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
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

import Cookies from "universal-cookie";

const cookies = new Cookies();

const Banner = () => {
  const { store_banner_list, removeDataToCurrentGlobal, storeBussinessRelode } =
    useContext(ContextData);
  const [delID, setDelID] = useState();
  const [editablePlot, setEditablePlot] = useState({});
  const [showData, setShowData] = useState(store_banner_list);
  const navigate = useNavigate();
  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");
  const toast = useToast();

  const [radioValue1, setRadioValue1] = useState("1");

  const radios1 = [
    { name: "Active", value: "1" },
    { name: "Not Active", value: "2" },
  ];

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

  useEffect(() => {
    setShowData(store_banner_list);
  }, [store_banner_list]);

  const STORY_HEADERS = [
    {
      prop: "type",
      title: "Type",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p className="text-danger"> {row.type}</p>;
      },
    },
    {
      prop: "name",
      title: "Banner",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return (
          <p className="text-dark"> {row.name == null ? "TOP" : row.name}</p>
        );
      },
    },

    {
      prop: "image",
      title: "Image",

      cell: (row) => {
        return (
          <img
            src={row.image}
            alt=""
            style={{ height: "40px", borderRadius: "14px" }}
          />
        );
      },
    },

    {
      prop: "status",
      title: "Status",
      isSortable: true,

      cell: (row) => {
        return (
          <Dropdown>
            <Dropdown.Toggle
              variant={row.status == 1 ? "success" : "danger"}
              id="dropdown-basic"
            >
              {row.status == 1 ? "Active" : "Not Active"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => changeStatus(row.id, row.status)}>
                {row.status == 1 ? "Make Not Active" : "Make Active"}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      },
    },

    {
      prop: "status",
      title: "Action",
      isSortable: true,

      cell: (row) => {
        return (
          <button
            className="btn btn-danger"
            onClick={() => deleteAction(row.id, row.image)}
          >
            <i className="ri-delete-bin-7-fill me-1 align-bottom" /> Delete{" "}
          </button>
        );
      },
    },
  ];

  const deleteAction = (banner_id, old_img) => {
    swal({
      title: "Action Delete",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((deleteProductFromStore) => {
      if (deleteProductFromStore) {
        fetch(URLDomain + "/APP-API/Billing/deleteStoreBanner", {
          method: "POST",
          header: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            banner_id: banner_id,
            old_img: old_img,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.delete) {
              storeBussinessRelode();

              getToast({
                title: "Deleted ",
                dec: "Successful",
                status: "success",
              });
            } else {
              storeBussinessRelode();
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

  const changeStatus = (banner_id, status) => {
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
      title: "Action | " + statusAction,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((deleteProductFromStore) => {
      if (deleteProductFromStore) {
        console.log("status", statusModified);

        fetch(URLDomain + "/APP-API/Billing/changeStoreBannerStatus", {
          method: "POST",
          header: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            banner_id: banner_id,
            statusModified: statusModified,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.success) {
              storeBussinessRelode();

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

  const changeStatusData = (value) => {
    setRadioValue1(value);

    if (value == 1) {
      const newParentData = store_banner_list.filter((obj) => obj.status == 1);
      setShowData(newParentData);
    } else {
      const newChildData = store_banner_list.filter((obj) => obj.status == 0);
      setShowData(newChildData);
    }
  };

  return (
    <>
      <div>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Banner List</h4>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="row g-2">
              <div className="col-sm-auto ">
                <div className="list-grid-nav hstack gap-1">
                  <ButtonGroup>
                    {radios1.map((radio, idx) => (
                      <ToggleButton
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        variant={idx % 2 ? "outline-danger" : "outline-success"}
                        name="radio"
                        value={radio.value}
                        checked={radioValue1 === radio.value}
                        onChange={(e) =>
                          changeStatusData(e.currentTarget.value)
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
                    data-bs-target="#addBrands"
                  >
                    <i className="ri-add-fill me-1 align-bottom" /> Add New
                    Banner
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
                  <div className="table-responsive table-card mb-1 px-4">
                    <DatatableWrapper
                      body={showData}
                      headers={STORY_HEADERS}
                      paginationOptionsProps={{
                        initialState: {
                          rowsPerPage: 5,
                          options: [5, 10, 15, 20],
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
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div>
              <div
                className="modal fade"
                id="addBrands"
                tabIndex={-1}
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered w-50">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="myModalLabel">
                        Add New Banner
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                    </div>
                    <div className="modal-body">
                      <AddBannerForm />
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

export default Banner;
