import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import ContextData from "../../context/MainContext";
import URLDomain from "../../URL";

import { ImportNewCategory } from "./Import/import-new-category";
import { ImportNewChildCategory } from "./Import/import-new-child-category";
import SweetAlert from 'react-bootstrap-sweetalert';

// import "bootstrap/dist/css/bootstrap.css";
import { Col, Row, Table } from "react-bootstrap";


import {
    DatatableWrapper,
    Filter,
    Pagination,
    PaginationOptions,
    TableBody,
    TableHeader
} from "react-bs-datatable";

// Create table headers consisting of 4 columns.




const CategoryManagement = () => {
    const { storeCategoryData, removeDataToCurrentGlobal, getToast } = useContext(ContextData);
    const [delID, setDelID] = useState(false);
    const [editablePlot, setEditablePlot] = useState({});
    const [showData, setShowData] = useState(storeCategoryData);



    useEffect(() => {
        setShowData(storeCategoryData);
    }, [storeCategoryData]);

    const ChangeStatus = () => {

        setDelID(true)

    };

    const STORY_HEADERS = [

        {
            prop: "category_name",
            title: "Category Name",
            isFilterable: true,
            isSortable: true,
            cell: (row) => {

            
                    return (
                        <> <p className="text-dark">{row.category_name}</p></>
                       
                    );
               

            }

        },

        {
            prop: "category_level",
            title: "Level",
            isFilterable: true,
            isSortable: true,

            cell: (row) => {

                if (row.category_level == 0) {
                    return (
                        <p className="text-danger">Parent Category</p>
                    );
                }
                else {

                    return (
                        <p className="text-success">{row.parent_name}</p>
                    );

                }

            }
        }, {
            prop: "image",
            title: "Image",

            cell: (row) => {
                return (
                    <img src={row.category_image} alt="" style={{ height: '40px', borderRadius: '14px' }} />
                );
            }
        },


        {
            prop: "product",
            title: "Product",

            cell: (row) => {


                return (
                    <button className="btn btn-primary" > Products   </button>
                );


            }
        },
        {
            prop: "dsd",
            title: "Status",

            cell: (row) => {

                if (row.status == 1) {
                    return (
                        <button className="btn btn-success" onClick={ChangeStatus}> Active   </button>

                    );
                }
                else {
                    <button className="btn btn-danger" onClick={ChangeStatus} > InActive   </button>
                }

            }
        },
    ];

    const deletePlot = () => {
        console.log("kit kat", delID);
        fetch(URLDomain + "/APP-API/App/deletePlot", {
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
                    removeDataToCurrentGlobal({ type: "storeCategoryData", payload: delID, where: "id" });
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

                            <div className="col-sm-auto ms-auto">
                                <div className="list-grid-nav hstack gap-1">
                                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#importCategory"><i className="ri-add-fill me-1 align-bottom" /> Import Category   </button>
                                    <button className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#importChildCategory"><i className="ri-add-fill me-1 align-bottom" /> Import Child Category</button>
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


                <div className="row">
                    <div className="col-lg-12">
                        <div>
                            <div className="modal fade" id="importCategory" tabIndex={-1} aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered w-50">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="myModalLabel">Import Category</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                        </div>
                                        <div className="modal-body">
                                            <ImportNewCategory />
                                        </div>
                                    </div>{/*end modal-content*/}
                                </div>{/*end modal-dialog*/}
                            </div>{/*end modal*/}
                        </div>
                    </div>{/* end col */}
                </div>{/*end row*/}

                <div className="row">
                    <div className="col-lg-12">
                        <div>
                            <div className="modal fade" id="importChildCategory" tabIndex={-1} aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered w-50">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="myModalLabel">Import Child Category</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                        </div>
                                        <div className="modal-body">
                                            <ImportNewChildCategory />
                                        </div>
                                    </div>{/*end modal-content*/}
                                </div>{/*end modal-dialog*/}
                            </div>{/*end modal*/}
                        </div>
                    </div>{/* end col */}
                </div>{/*end row*/}

                <svg className="bookmark-hide">
                    <symbol viewBox="0 0 24 24" stroke="currentColor" fill="var(--color-svg)" id="icon-star"><path strokeWidth=".4" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></symbol>
                </svg>
            </div>
        </>
    )

}

export default CategoryManagement;