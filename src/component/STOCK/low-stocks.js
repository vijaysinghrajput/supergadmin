import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import ContextData from "../../context/MainContext";
import URL from '../../URL';

import { MoveWarehouseToStore } from "./Update/MoveWarehouseToStore";
import { MoveStoreToWarehouse } from "./Update/MoveStoreToWarehouse";

import SweetAlert from 'react-bootstrap-sweetalert';

// import "bootstrap/dist/css/bootstrap.css";
import { Col, Row, Table } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';


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


const LowStock = () => {
    const { storeProductsData, removeDataToCurrentGlobal, getToast, reloadData } = useContext(ContextData);
    const [delID, setProductDelID] = useState(0);
    const [isDeletAction, setDeletAction] = useState(false);
    const [isStoreLowStockDataShow, setStoreLowStockDataShow] = useState(true);
    const [isWarehouseLowStockDataShow, setWarehouseLowStockDataShow] = useState(false);
    const [filteredStoreStocksData, setFilterStoreStockData] = useState([]);
    const [filteredWarehouseStocksData, setFilterWarehouseStockData] = useState([]);

    const [UpdateProductPrice, setUpdateProductPrice] = useState({});
    // const [downloadBarcode, setdownloadBarcode] = useState({});
    const [showData, setShowData] = useState(storeProductsData);

    const adminStoreId = cookies.get("adminStoreId");
    const adminId = cookies.get("adminId");



    const [radioValue, setRadioValue] = useState('1');

    const radios = [
        { name: 'Store Low Stock', value: '1' },
        { name: 'Warehouse Low Stock', value: '2' },
    ];



    useEffect(() => {


        const filterWareHoseStock = storeProductsData.filter(obj => Number(obj.stock_quantity) < Number(obj.stock_alert_quantity) || Number(obj.stok_warehouse_qty) < Number(obj.warehouse_stock_alert_quantity))

        setFilterStoreStockData(filterWareHoseStock);



    }, [storeProductsData]);

    const ChangeStatus = () => {

        setProductDelID(true)

    };

    const STORY_HEADERS = [

        {
            prop: "product_name",
            title: "Product",
            isFilterable: true,
            isSortable: true,
            cell: (row) => {
                return (
                    <p className="text-dark">{row.product_name}</p>
                );
            }
        },
        {
            prop: "image",
            title: "Image",

            cell: (row) => {
                return (
                    <img src={row.product_image} alt="" style={{ height: '40px', borderRadius: '14px' }} />
                );
            }
        },
        {
            prop: "stock_quantity",
            title: "Store Stock",
            isFilterable: true,
            isSortable: true,
            cell: (row) => {

                if (Number(row.stock_quantity) < Number(row.stock_alert_quantity)) {
                    return (
                        <p className="text-danger">{row.stock_quantity}</p>

                    );
                }
                else {
                    return (
                        <p className="text-success">{row.stock_quantity}</p>

                    );
                }

            }
        },
        {
            prop: "stok_warehouse_qty",
            title: "Warehouse Stock",
            isFilterable: true,
            isSortable: true,
            cell: (row) => {

                if (Number(row.stok_warehouse_qty) < Number(row.warehouse_stock_alert_quantity)) {
                    return (
                        <p className="text-danger">{row.stok_warehouse_qty}</p>

                    );
                }
                else {
                    return (
                        <p className="text-success">{row.stok_warehouse_qty}</p>

                    );
                }

            }
        },


        {
            prop: "stock_alert_quantity",
            title: "Store Alert",
            isFilterable: true,
            isSortable: true,
            cell: (row) => {
                return (
                    <p className="text-dark">{row.stock_alert_quantity}</p>
                );
            }
        },
        {
            prop: "warehouse_stock_alert_quantity",
            title: "Warehouse Alert",
            isFilterable: true,
            isSortable: true,
            cell: (row) => {
                return (
                    <p className="text-dark">{row.warehouse_stock_alert_quantity}</p>
                );
            }
        },

        {
            prop: "sale_price",
            title: "Sale Price",
            isFilterable: true,
            isSortable: true,
            cell: (row) => {
                return (
                    <p className="text-dark"> ₹ {row.sale_price}</p>
                );
            }
        },



        {
            prop: "Stock",
            title: "Move Stock",

            cell: (row) => {


                return (
                    <Dropdown>
                        <Dropdown.Toggle variant="dark" id="dropdown-basic">
                            Move Stock
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setUpdateProductPrice(row)} data-bs-toggle="modal" data-bs-target="#warehousetostore" > Warehouse To Store</Dropdown.Item>
                            <Dropdown.Item onClick={() => setUpdateProductPrice(row)} data-bs-toggle="modal" data-bs-target="#storetowarehouse" > Store To Warehouse</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                );


            }
        },

    ];


    const FilterDataLowStock = (value) => {
        setRadioValue(value)


        if (value == 1) {
            const newFilterStoreStock = storeProductsData.filter(obj => Number(obj.stock_quantity) < Number(obj.stock_alert_quantity))
            setFilterStoreStockData(newFilterStoreStock);

        }
        else {
            const newFilterWareHoseStock = storeProductsData.filter(obj => Number(obj.stok_warehouse_qty) < Number(obj.warehouse_stock_alert_quantity))
            setFilterStoreStockData(newFilterWareHoseStock);
        }

    }


    return (
        <>


            <div>
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">low STOCK List</h4>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row g-2">

                            <div className=" ms-auto">
                                <div className="list-grid-nav  gap-1">

                                    <ButtonGroup>
                                        {radios.map((radio, idx) => (
                                            <ToggleButton
                                                key={idx}
                                                id={`radio-${idx}`}
                                                type="radio"
                                                variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                                                name="radio"
                                                value={radio.value}
                                                checked={radioValue === radio.value}
                                                onChange={(e) => FilterDataLowStock(e.currentTarget.value)}
                                            >
                                                {radio.name}
                                            </ToggleButton>
                                        ))}
                                    </ButtonGroup>


                                    {/* <ButtonGroup aria-label="Basic example">
      <Button onClick={() => StoreLowStockDataShowFunction()} variant={isStoreLowStockDataShow?'success':'secondary'}>Store Low Stock</Button>
      <Button  onClick={() => warehouseLowStockDataShowFunction()} variant={isWarehouseLowStockDataShow?'success':'secondary'}>Warehouse Low Stock</Button>
    </ButtonGroup>                                */}
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
                                            body={filteredStoreStocksData}
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




                <div className="modal fade" id="warehousetostore" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered w-50">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="myModalLabel">Move Stock Warehouse To Store</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <MoveWarehouseToStore productDetails={UpdateProductPrice} />
                            </div>
                        </div>{/*end modal-content*/}
                    </div>{/*end modal-dialog*/}
                </div>{/*end modal*/}

                <div className="modal fade" id="storetowarehouse" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered w-50">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="myModalLabel">Move Stock Store To Warehouse</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <MoveStoreToWarehouse productDetails={UpdateProductPrice} />
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

export default LowStock;