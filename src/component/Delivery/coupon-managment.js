import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import ContextData from "../../context/MainContext";
import URL from '../../URL';
import { AddCouponForm } from "./Add/coupon-add-form";
import { useToast } from '@chakra-ui/react';
import { Col, Row, Table } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import swal from 'sweetalert';
import {
    DatatableWrapper,
    Filter,
    Pagination,
    PaginationOptions,
    TableBody,
    TableHeader
} from "react-bs-datatable";

// Create table headers consisting of 4 columns.
import Cookies from 'universal-cookie';

const cookies = new Cookies();


const CouponManagment = () => { 
    const { store_coupon_list, removeDataToCurrentGlobal,  storeBussinessRelode } = useContext(ContextData);
    const [delID, setProductDelID] = useState(0);
    const [isDeletAction, setDeletAction] = useState(false);
    const [vendorData, getVendorData] = useState({});
    // const [downloadBarcode, setdownloadBarcode] = useState({});
    const [showData, setShowData] = useState(store_coupon_list);

    const adminStoreId = cookies.get("adminStoreId");
    const adminId = cookies.get("adminId");

    const toast = useToast();
    const getToast = (e) => {
        toast({
            title: e.title,
            description: e.desc,
            status: e.status,
            duration: 3000,
            isClosable: true,
            position: "bottom-right"
        })
    }


    useEffect(() => {
        setShowData(store_coupon_list);
    }, [store_coupon_list]);

    const ChangeStatus = () => {

        setProductDelID(true)

    };

    const STORY_HEADERS = [
        {
            prop: "coupon_code",
            title: "Code",
            isFilterable: true,
            isSortable: true,
            cell: (row) => {
                return (
                    <p className="text-dark">{row.coupon_code}</p>
                );
            }
        },
        {
            prop: "coupon_type",
            title: "Coupon Type",
            isFilterable: true,
            isSortable: true,
            cell: (row) => {
                return (
                    <p className="text-dark">{row.coupon_type}</p>
                );
            }
        },
        {
            prop: "coupon_discount",
            title: "Discount",
            isFilterable: true,
            isSortable: true,
            cell: (row) => {
                return (
                    <p className="text-dark">{Math.round(row.coupon_discount)}  {row.coupon_type=='amount' ? '₹ OFF':'% OFF'}</p>
                );
            }
        },
        {
            prop: "minimum_order_amount",
            title: "Min Order",
            isFilterable: true,
            isSortable: true,
            cell: (row) => {
                return (
                    <p className="text-dark">{Math.round(row.minimum_order_amount)} ₹</p>
                );
            }
        },
        {
            prop: "start_date",
            title: "Start",
            isFilterable: true,
            isSortable: true,
            cell: (row) => {

                var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                 var today  = new Date(row.start_date);

                 // console.log(today.toLocaleDateString("hi-IN", options)); // शनिवार, 17 सितंबर 2016

                return (
                    <p className="text-dark">{(today).toLocaleDateString("en-US", options)}</p>
                );
            }
        },
        {
            prop: "end_date",
            title: "End",
            isFilterable: true,
            isSortable: true,
            cell: (row) => {

                var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                var today  = new Date(row.end_date);

                // console.log(today.toLocaleDateString("hi-IN", options)); // शनिवार, 17 सितंबर 2016
                return (
                    <p className="text-dark">{(today).toLocaleDateString("en-US", options)}</p>
                );
            }
        },

        {
            prop: "status",
            title: "Status",
            isFilterable: true,
            isSortable: true,
            cell: (row) => {

if(row.status==1)
{
    return (
        <p className="text-success">Active</p>
    );
}
else if(row.status==0)
{
    return (
        <p className="text-dark">Not Active</p>
    );
}
               
            }
        },
 


        {
            prop: "status",
            title: "Action",

            cell: (row) => {


                return (
                    <Dropdown>
                        <Dropdown.Toggle variant="dark" id="dropdown-basic">
                            Action
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => UpdateStatusAction(row.coupon_id, row.coupon_code ,row.status)}  >{row.status==1?'Make Not Active':'Make Active'}</Dropdown.Item>
                            {/* <Dropdown.Item onClick={() => getVendorData(row)} data-bs-toggle="modal" data-bs-target="#updateVendor" >Edit Vendor</Dropdown.Item> */}

                        </Dropdown.Menu>
                    </Dropdown>

                );


            }
        },

    ];


    const UpdateStatusAction = (coupon_id, product_name,status) => {

        var statusAction = '';
        var statusModified=null;
        if(Number(status)==1){
            statusAction='Not Active';
            statusModified=0;
        }else{
            statusAction='Active';
            statusModified=1;
        }

        


        swal({
            title: "Action | "+statusAction+" | to "+product_name,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((deleteProductFromStore) => {



                if (deleteProductFromStore) {

                    console.log("status",statusModified)

                    fetch(URL + "/APP-API/Billing/changeStoreCouponStatus", {
                        method: 'POST',
                        header: {
                            'Accept': 'application/json',
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            coupon_id: coupon_id,
                            statusModified: statusModified
                        })
                    }).then((response) => response.json())
                        .then((responseJson) => {
                            if (responseJson.success) {

                                storeBussinessRelode();

                                getToast({ title: "Status Change ", dec: "Successful", status: "success" });

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

    }


    const deleteAction = (delete_id, product_name) => {


        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Product !",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((deleteProductFromStore) => {



                if (deleteProductFromStore) {




                    fetch(URL + "/APP-API/Billing/deleteStoreProduct", {
                        method: 'POST',
                        header: {
                            'Accept': 'application/json',
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            delete_id: delete_id,
                            product_name: product_name,
                            store_id: adminStoreId,
                            adminId: adminId
                        })
                    }).then((response) => response.json())
                        .then((responseJson) => {
                            console.log("respond delete", responseJson)
                            if (responseJson.delete) {
                                getToast({ title: "Product Deleted ", dec: "Successful", status: "success" });

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

                    storeBussinessRelode();



                    swal("Poof! Your Product  has been deleted!", {
                        icon: "success",
                    });
                } else {
                    swal("Product is safe!");
                }
            });

    }
    const deleteProductFromStore = () => {

        // console.log('delete_id',delID)
        alert("done")
    }


    const deletePlot = () => {
        console.log("kit kat", delID);
        fetch(URL + "/APP-API/App/deletePlot", {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                id: delID
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("respond", responseJson)
                if (responseJson.deleted) {
                    removeDataToCurrentGlobal({ type: "store_coupon_list", payload: delID, where: "id" });
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
    }


    return (
        <>


            <div>
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Coupon List</h4>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row g-2"> 

                            <div className="col-sm-auto ms-auto">
                                <div className="list-grid-nav hstack gap-1">
 
                                    <button className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#addCoupon"><i className="ri-add-fill me-1 align-bottom" /> Add Coupon</button>
                                </div>
                            </div>{/*end col*/}
                        </div>{/*end row*/}
                    </div>
                </div>

                <div className="row">

                </div>

                <div className="row">
                    <div className="col-lg-12">
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
                                                    options: [10, 15, 20]
                                                }
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
                                            <Table
                                                className="table  table-hover">
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



                <div className="modal fade" id="addCoupon" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered w-50">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="myModalLabel">Add Coupon</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <AddCouponForm />
                            </div>
                        </div>{/*end modal-content*/}
                    </div>{/*end modal-dialog*/}
                </div>{/*end modal*/}

                <div className="modal fade" id="updateVendor" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered w-50">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="myModalLabel">Edit Vendor</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                {/* <UpdateVendor vendorDetails={vendorData} /> */}
                            </div>
                        </div>{/*end modal-content*/}
                    </div>{/*end modal-dialog*/}
                </div>{/*end modal*/}

                <svg className="bookmark-hide">
                    <symbol viewBox="0 0 24 24" stroke="currentColor" fill="var(--color-svg)" id="icon-star"><path strokeWidth=".4" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></symbol>
                </svg>
            </div>
        </>
    )

}

export default CouponManagment;