import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import ContextData from "../../context/MainContext";
import URL from "../../URL";

import { AddCustomerForm } from "./Add/customer-add-form";
// import { AddUnitForm } from "./Add/unit-add-form";
// import { CustomerDataComp } from "./Update/CustomerDataComp";
// import { UpdateProductStockComp } from "./Update/UpdateProductStockComp";
import { UpdateCustomer } from "./Update/UpdateCustomer";

import SweetAlert from "react-bootstrap-sweetalert";

import CustomerDataTable from "./component/CustomerDataTable";

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

import { useQuery } from "react-query";
import URLDomain from "../../URL";
import { Stack, Skeleton } from "@chakra-ui/react";
// Create table headers consisting of 4 columns.
import Cookies from "universal-cookie";

const cookies = new Cookies();

const CustomerManagement = () => {
  const {
    store_customer_list,
    removeDataToCurrentGlobal,
    getToast,
    reloadData,
  } = useContext(ContextData);
  const [delID, setProductDelID] = useState(0);
  const [isDeletAction, setDeletAction] = useState(false);
  const [CustomerData, getCustomerData] = useState({});

  const [showData, setShowData] = useState(null);

  const [isDataLoding, setisDataLoding] = useState(true);

  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");

  async function fetchData() {
    const data = await fetch(
      URLDomain + "/APP-API/Billing/customer_list_load",
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
    data: customer_list_load,
    isError,
    isLoading: isLoadingAPI,
    isFetching,
  } = useQuery({
    queryKey: ["customer_list_load"],
    queryFn: (e) => fetchData(),
  });

  useEffect(() => {
    setShowData([]);
    console.log("vendor list", customer_list_load, isLoadingAPI);
    if (customer_list_load) {
      setShowData(customer_list_load.store_customer_list);
      setisDataLoding(false);
    }
  }, [customer_list_load, isLoadingAPI]);

  const ChangeStatus = () => {
    setProductDelID(true);
  };

  const STORY_HEADERS = [
    {
      prop: "name",
      title: "Name",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p className="text-dark">{row.name}</p>;
      },
    },
    {
      prop: "mobile",
      title: "Mobile",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p className="text-dark">{row.mobile}</p>;
      },
    },

    {
      prop: "Stock",
      title: "Action",

      cell: (row) => {
        return (
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
              Action
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => getCustomerData(row)}
                data-bs-toggle="modal"
                data-bs-target="#UpdateProductPricing"
              >
                Make Payment
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => getCustomerData(row)}
                data-bs-toggle="modal"
                data-bs-target="#UpdateProductPricing"
              >
                Purchase History
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => getCustomerData(row)}
                data-bs-toggle="modal"
                data-bs-target="#UpdateProductStock"
              >
                Payment History
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => getCustomerData(row)}
                data-bs-toggle="modal"
                data-bs-target="#UpdateCustomer"
              >
                Edit Customer
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      },
    },
  ];

  const deleteAction = (delete_id, product_name) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Product !",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((deleteProductFromStore) => {
      if (deleteProductFromStore) {
        fetch(URL + "/APP-API/Billing/deleteStoreProduct", {
          method: "POST",
          header: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            delete_id: delete_id,
            product_name: product_name,
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
          removeDataToCurrentGlobal({
            type: "store_customer_list",
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

  return (
    <>
      <div>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Customer List</h4>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="row g-2">
              <div className="col-sm-auto ms-auto">
                <div className="list-grid-nav hstack gap-1">
                  <button
                    className="btn btn-dark"
                    data-bs-toggle="modal"
                    data-bs-target="#addCustomer"
                  >
                    <i className="ri-add-fill me-1 align-bottom" /> Add Customer
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
            <CustomerDataTable />
          </div>
        </div>

        <div
          className="modal fade"
          id="addCustomer"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered w-50">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="myModalLabel">
                  Add Customer
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <AddCustomerForm />
              </div>
            </div>
            {/*end modal-content*/}
          </div>
          {/*end modal-dialog*/}
        </div>
        {/*end modal*/}

        <div
          className="modal fade"
          id="UpdateCustomer"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered w-50">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="myModalLabel">
                  Edit Customer
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <UpdateCustomer CustomerDetails={CustomerData} />
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

export default CustomerManagement;
