import { useState, useContext, useRef, useEffect } from "react";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";

import { Col, Row, Table } from "react-bootstrap";

export const DeliverySettingComp = (DeliverySlotData) => {
  const STORY_HEADERS_SLOTS = [
    {
      prop: "min_order_value",
      title: "MOV",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p>{row.min_order_value}</p>;
      },
    },
    {
      prop: "distance_km",
      title: "KM",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p>{row.distance_km}</p>;
      },
    },
    {
      prop: "minium_amount_free_del",
      title: "Min Odr Amt Free Del",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p>{row.minium_amount_free_del}</p>;
      },
    },
    {
      prop: "delivery_charge",
      title: "Del Charge",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p>{row.delivery_charge}</p>;
      },
    },
  ];

  return (
    <>
      <div className="card">
        <div className="card-body">
          <ul
            className="nav nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
            role="tablist"
          >
            <li className="nav-item">
              <a
                className="nav-link fs-14 active"
                data-bs-toggle="tab"
                href="#delivery-slots-location-tab"
                role="tab"
              >
                <i className="ri-airplay-fill d-inline-block d-md-none" />{" "}
                <span className="d-none d-md-inline-block text-light btn btn-primary">
                  Delivery Charge & Location Condition
                </span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link fs-14"
                data-bs-toggle="tab"
                href="#delivery-slots-tab"
                role="tab"
              >
                <i className="ri-list-unordered d-inline-block d-md-none" />{" "}
                <span className="d-none d-md-inline-block text-light btn btn-dark">
                  Delivery Slots List
                </span>
              </a>
            </li>
          </ul>

          <div className="tab-content pt-4 text-muted">
            <div
              className="tab-pane active"
              id="overview-tab-2"
              role="tabpanel"
            >
              <div
                className="tab-panel active"
                id="delivery-slots-location-tab"
                role="tabpanel"
              >
                <div className="card mt-2">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-13">
                        <div className="">
                          <h5 className="card-title mb-3">
                            Delivery Slots Condition
                          </h5>

                          <div className="">
                            <div id="customerList">
                              <div className="table-responsive table-card mb-1 px-4">
                                <DatatableWrapper
                                  body={DeliverySlotData.dataSlot}
                                  headers={STORY_HEADERS_SLOTS}
                                  paginationOptionsProps={{
                                    initialState: {
                                      rowsPerPage: 15,
                                      options: [15],
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
                                      {/* <PaginationOptions /> */}
                                    </Col>
                                    <Col
                                      xs={12}
                                      sm={6}
                                      lg={4}
                                      className="d-flex flex-col justify-content-end align-items-end"
                                    >
                                      {/* <Pagination /> */}
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
                  </div>
                </div>
              </div>

              {/*end tab-pane*/}

              {/*end tab-pane*/}
            </div>
            {/*end tab-content*/}
          </div>

          {/*end col*/}
        </div>
      </div>
    </>
  );
};
