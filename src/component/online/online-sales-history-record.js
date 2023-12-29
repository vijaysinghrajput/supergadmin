import { BiRupee } from "react-icons/bi";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ContextData from "../../context/MainContext";

import { useQuery } from "react-query";
import Cookies from "universal-cookie";
import { useReactToPrint } from "react-to-print";
import { SimpleGrid, useToast } from "@chakra-ui/react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

import { queryClient } from "../../App";

import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import swal from "sweetalert";

import URL from "../../URL";

import "react-datepicker/dist/react-datepicker.css";

const OnlineSalesHistoryRecord = () => {
  const { orderID } = useParams();
  const { customer_address } = useParams();

  const toast = useToast();
  const componentRef = useRef();

  // console.log("orderID", orderID);
  // console.log("customer_address", customer_address);

  const cookies = new Cookies();
  const adminStoreId = cookies.get("adminStoreId");
  const [isDataLoding, setisDataLoding] = useState(true);

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

  const [orderDetails, setorderDetails] = useState([]);

  const [customerAddress, setcustomerAddress] = useState({});
  const [productData, setproductData] = useState([]);
  const [Store_bussiness_info, setStore_bussiness_info] = useState([]);
  const [delivery_slots, setdelivery_slots] = useState([]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  async function fetchData({ orderID, customer_address }) {
    const data = await fetch(URL + "/APP-API/Billing/getOnlineOrderDetails", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        store_id: adminStoreId,
        orderID,
        customer_address,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => responseJson);
    return data;
  }

  const {
    data: ONLINESALEHISTORYRECORD,
    isFetching,
    isLoading: isLoading,
  } = useQuery({
    queryKey: ["ONLINESALEHISTORYRECORD", orderID, customer_address],
    queryFn: (e) =>
      fetchData({ orderID: e.queryKey[1], customer_address: e.queryKey[2] }),
  });

  useEffect(() => {
    console.log("detaiols", ONLINESALEHISTORYRECORD);
    if (ONLINESALEHISTORYRECORD) {
      // setShowData(ONLINESALEHISTORYRECORD.store_customer_purchase_record);
      setcustomerAddress(ONLINESALEHISTORYRECORD.customer_address_details);
      setproductData(ONLINESALEHISTORYRECORD.order_products_details);
      setorderDetails(ONLINESALEHISTORYRECORD.order_details);
      setStore_bussiness_info(ONLINESALEHISTORYRECORD.Store_bussiness_info);
      setdelivery_slots(ONLINESALEHISTORYRECORD.delivery_slots);

      setisDataLoding(false);
    }
  }, [ONLINESALEHISTORYRECORD, isLoading]);

  const UpdateStatusAction = (product_id, product_name, avlstatus) => {
    let flag = false;

    var statusAction = "";
    var statusModified = 0;
    if (Number(avlstatus) == 1) {
      statusAction = "Out Of Stock";
      statusModified = 0;
    } else {
      statusAction = "In The Stock";
      statusModified = 1;
    }

    swal({
      title: "Action | " + statusAction + " | to " + product_name,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((changeOrderStatus) => {
      if (changeOrderStatus) {
        fetch(URL + "/APP-API/Billing/changeStoreOrderAvlStatus", {
          method: "POST",
          header: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            product_id: product_id,
            avl_status: statusModified,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.success) {
              // storeProductRelode();
              // fetchData();

              queryClient.invalidateQueries({
                queryKey: ["ONLINESALEHISTORYRECORD"],
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

  const notAvilable1 = ({ itemID, notAvilableQTY = "0" }) => {
    fetch(URL + "/APP-API/Billing/notAvilable", {
      method: "POST",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        orderID,
        itemID,
        notAvilableQTY,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson) {
          queryClient.invalidateQueries({
            queryKey: ["ONLINESALEHISTORYRECORD"],
          });
        }
      })
      .catch((error) => {
        //  console.error(error);
      });
  };

  const debounce = (func, time) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, time);
    };
  };

  const notAvilable = debounce(notAvilable1, 1000);

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0">Purchase</h4>
            {/* <div className="page-title-right">
                            <ol className="breadcrumb m-0">
                                <li className="breadcrumb-item"><a href="javascript: void(0);">Tables</a></li>
                                <li className="breadcrumb-item active">Basic Tables</li>
                            </ol>
                        </div> */}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card" id="demo">
            <div className="card-body">
              <div className="live-preview">
                <div className="row">
                  <div className="col-md-12">
                    <div className="row py-4 mb-4 border-bottom align-items-center">
                      <div
                        className="col-lg-4 col-print-4"
                        style={{ borderRight: "1px solid #c1c1c1" }}
                      >
                        <div className="px-5 border-left">
                          <h6 className="">
                            Customer Name:{" "}
                            <strong>{customerAddress?.name}</strong>
                          </h6>
                          <h6 className="">
                            Phone: <strong>{customerAddress?.phone}</strong>
                          </h6>
                          <h6 className="">
                            Alt Phone:{" "}
                            <strong>
                              {customerAddress?.alternative_phone}
                            </strong>
                          </h6>

                          <h6 className="">
                            Landmark:{" "}
                            <strong>{customerAddress?.landmark}</strong>
                          </h6>
                          <h6 className="">
                            Distance:{" "}
                            <strong>{customerAddress?.distance_km} KM</strong>
                          </h6>
                          <h6 className="">
                            Address:{" "}
                            <strong>
                              {customerAddress?.user_house_no}{" "}
                              {customerAddress?.base_address}{" "}
                              {customerAddress?.address}
                            </strong>
                          </h6>
                        </div>
                      </div>

                      <div
                        className="col-lg-4 col-print-4 "
                        style={{ borderRight: "1px solid #c1c1c1" }}
                      >
                        <div className="px-5 border-left">
                          <h6 className="">
                            Sub Total :{" "}
                            <strong>{orderDetails?.sub_total}</strong>
                          </h6>
                          <h6 className="">
                            Discount : -{" "}
                            <strong>{orderDetails?.discount}</strong>
                          </h6>

                          <h6 className="">
                            Grand Total :{" "}
                            <strong>{orderDetails?.grand_total}</strong>
                          </h6>

                          <h6 className="">
                            Delivery Charge : +{" "}
                            <strong>{orderDetails?.delivery_charge}</strong>
                          </h6>

                          <h6 className="">
                            Coupon Discount : -{" "}
                            <strong>
                              {orderDetails?.coupon_discount_value}
                            </strong>
                          </h6>

                          <h6 className="">
                            Total Paymnet :{" "}
                            <strong>
                              {Number(orderDetails?.total_payment)}
                            </strong>
                          </h6>

                          {ONLINESALEHISTORYRECORD?.sumOfNotAvilable ? (
                            <h6 className="">
                              Not avilable Settlement :{" "}
                              <strong>
                                {ONLINESALEHISTORYRECORD?.sumOfNotAvilable}
                              </strong>
                            </h6>
                          ) : null}

                          {ONLINESALEHISTORYRECORD?.getSumOfProductNotAvilable ? (
                            <h6 className="">
                              Product Not avilable Settlement :{" "}
                              <strong>
                                {
                                  ONLINESALEHISTORYRECORD?.getSumOfProductNotAvilable
                                }
                              </strong>
                            </h6>
                          ) : null}

                          <h6 className="">
                            Payment after All Settlement :{" "}
                            <strong>
                              {Number(orderDetails?.total_payment) -
                                Number(
                                  ONLINESALEHISTORYRECORD?.sumOfNotAvilable
                                ) -
                                Number(
                                  ONLINESALEHISTORYRECORD?.getSumOfProductNotAvilable
                                )}
                            </strong>
                          </h6>
                        </div>
                      </div>

                      <div
                        className="col-lg-4 col-print-4 "
                        style={{ borderRight: "1px solid #c1c1c1" }}
                      >
                        <div className="px-5 border-left">
                          <h6 className="">
                            Slots: <strong>{delivery_slots}</strong>
                          </h6>

                          <h6 className="">
                            Order status:{" "}
                            <strong>{orderDetails?.order_status}</strong>
                          </h6>
                          <h6 className="">
                            No of Item:{" "}
                            <strong>{orderDetails?.no_of_items}</strong>
                          </h6>
                          <h6 className="">
                            Order ID: <strong>{orderDetails?.order_id}</strong>
                          </h6>
                          <h6 className="">
                            Order Date:{" "}
                            <strong>
                              {orderDetails?.date} || {orderDetails?.time}
                            </strong>
                          </h6>
                          <h6 className="">
                            Payment Mode :{" "}
                            <strong>{orderDetails?.payment_mode}</strong>
                          </h6>
                          <h6 className="">
                            Payment Status :{" "}
                            <strong>
                              {orderDetails?.payment_status == 0
                                ? "Unpaid"
                                : "Paid"}
                            </strong>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Box>
                    {/* MAP */}
                    {/* <a target="_blank" href="https://maps.google.com/?q=<?php   echo $custdetail->latitude ?>,<?php   echo $custdetail->longitude ?>">https://maps.google.com/?q=<?php   echo $custdetail->latitude ?>,<?php   echo $custdetail->longitude ?></a>  */}
                  </Box>
                  <div className="col-xl-12">
                    <div className="table-responsive mt-4 mt-xl-0">
                      <table className="table   align-middle table-nowrap mb-0">
                        <thead>
                          <tr>
                            <th scope="col">IMG</th>
                            <th scope="col">QTY</th>
                            <th scope="col">Size</th>
                            <th scope="col">ITEMS</th>

                            <th scope="col">MRP</th>
                            <th scope="col">PRICE</th>
                            <th scope="col">DIS</th>

                            <th scope="col">AMOUNT</th>
                            <th scope="col">NOT AVIL</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.length && productData ? (
                            productData.map((items, index) => {
                              return (
                                <>
                                  {items && (
                                    <tr
                                      class={
                                        items.avl_status == "1"
                                          ? "table-active"
                                          : "table-danger"
                                      }
                                    >
                                      <td scope="col">
                                        <img
                                          style={{ height: 35 }}
                                          src={items.product_img}
                                        />
                                      </td>
                                      <td scope="col">{items.quantity}</td>

                                      <td scope="col">
                                        {items.product_size}{" "}
                                        {items.product_unit}
                                      </td>

                                      <td>{items.product_full_name}</td>

                                      <td scope="col">{items.mrp}</td>
                                      <td scope="col">
                                        {items.sale_price} * {items.quantity}
                                      </td>
                                      <td scope="col">{items.discount}</td>

                                      <td scope="col">{items.total_amount}</td>
                                      <td scope="col">
                                        <Input
                                          type="number"
                                          defaultValue={items.not_avl_qty}
                                          // value={items.not_avl_qty}
                                          w={20}
                                          h={6}
                                          bg={"#c7c7c7"}
                                          fontSize={12}
                                          min={1}
                                          max={items.not_avl_qty}
                                          onChange={(e) => {
                                            notAvilable({
                                              itemID: items.id,
                                              notAvilableQTY: e.target.value
                                                ? e.target.value
                                                : "0",
                                            });
                                          }}
                                        />
                                      </td>
                                      <td scope="col">
                                        <a
                                          onClick={() =>
                                            UpdateStatusAction(
                                              items.id,
                                              items.product_full_name,
                                              items.avl_status
                                            )
                                          }
                                          class={
                                            items.avl_status == 1
                                              ? "btn btn-sm btn-success"
                                              : "btn btn-sm btn-danger"
                                          }
                                        >
                                          {items.avl_status == 1
                                            ? "Avl"
                                            : "Not Avl"}{" "}
                                        </a>
                                      </td>
                                    </tr>
                                  )}
                                </>
                              );
                            })
                          ) : (
                            <></>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div class="hstack gap-2 justify-content-center mb-2 d-print-none mt-4">
                    <a onClick={handlePrint} class="btn btn-success">
                      <i class="ri-printer-line align-bottom me-1"></i> Print
                      Bill
                    </a>
                  </div>
                  {/*end col*/}
                </div>
                {/*end row*/}
              </div>
            </div>
            {/* end card-body */}
          </div>
          {/* end card */}
        </div>
        {/* end col */}
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body" class="map-responsive">
              <Map
                class="h-500 w-100"
                google={window.google}
                center={{
                  lat: customerAddress?.latitude,
                  lng: customerAddress?.longitude,
                }}
                bootstrapURLKeys={{
                  key: "AIzaSyDDirDSiLgvG8Gl8crjbvrGRXlCPOTYRzE",
                }}
                zoom={15}
                defaultZoom="Zoom"
                initialCenter={{
                  lat: customerAddress?.latitude,
                  lng: customerAddress?.longitude,
                }}
                // onIdle={this.handleMapIdle}
              >
                {orderDetails && (
                  <Marker
                    map={window.google}
                    position={{
                      lat: customerAddress?.latitude,
                      lng: customerAddress?.longitude,
                    }}
                    // onDragend={(t, map, coord) => this.onMarkerDragEnd(coord)}
                    show={true}
                    name="Delivery Location"
                  />

                  // animation={window.google.maps.Animation.DROP} />
                )}
                <InfoWindow
                  position={{
                    lat: customerAddress?.latitude,
                    lng: customerAddress?.longitude,
                  }}
                >
                  <div>
                    <p style={{ padding: 0, margin: 0 }}>hello</p>
                  </div>
                </InfoWindow>
              </Map>
            </div>
          </div>
        </div>
      </div>

      <div id="section-to-print" ref={componentRef}>
        <div className="POS_header px-1">
          {/* <div className=" d-flex justify-content-center">
                        <img src={Store_bussiness_info?.logo} alt="user-img" className="prinerLogo rounded-circle" />
                    </div> */}

          {console.log("Store_bussiness_info", Store_bussiness_info)}

          <div className="col-auto ">
            <h6
              style={{
                fontSize: 14,
                color: "#000",
                fontWeight: "800",
                textAlign: "center",
                marginBottom: 1,
              }}
            >
              {Store_bussiness_info?.buss_name},
              <span
                style={{
                  fontSize: 10,
                }}
              >
                {Store_bussiness_info?.strteet_linn2}{" "}
                {Store_bussiness_info?.area}
              </span>
            </h6>
            <h6
              style={{
                fontSize: 10,
                fontWeight: "800",
                textAlign: "center",
                color: "#000",
              }}
            >
              {Store_bussiness_info?.mobile1} {Store_bussiness_info?.mobile2}{" "}
            </h6>
          </div>
        </div>
        <div class="bill-details">
          <Box textAlign={"center"} fontSize={10}>
            <Text>
              Mo{" "}
              {customerAddress?.phone ? customerAddress?.phone : "----------"},{" "}
              {orderDetails?.date} || {orderDetails?.time}
            </Text>
          </Box>
        </div>
        <SimpleGrid
          fontSize={11}
          // columns={2}
          pl={2}
          py={2}
          borderTop={"1px solid #000"}
          borderBottom={"1px solid #000"}
          color={"#000"}
        >
          <Box>
            <div>
              <div className="">
                <h6
                  className=""
                  style={{
                    color: "#000",
                    marginBottom: 0,
                  }}
                >
                  Customer Name: <strong>{customerAddress?.name}</strong>
                </h6>
                <h6
                  className=""
                  style={{
                    color: "#000",
                    marginBottom: 0,
                  }}
                >
                  Phone: <strong>{customerAddress?.phone}</strong>
                </h6>
                <h6
                  className=""
                  style={{
                    color: "#000",
                    marginBottom: 0,
                  }}
                >
                  Alt Phone:{" "}
                  <strong>{customerAddress?.alternative_phone}</strong>
                </h6>

                <h6
                  className=""
                  style={{
                    color: "#000",
                    marginBottom: 0,
                  }}
                >
                  Landmark: <strong>{customerAddress?.landmark}</strong>
                </h6>
                <h6
                  className=""
                  style={{
                    color: "#000",
                    marginBottom: 0,
                  }}
                >
                  Distance: <strong>{customerAddress?.distance_km} KM</strong>
                </h6>
                <h6
                  className=""
                  style={{
                    color: "#000",
                    marginBottom: 0,
                  }}
                >
                  Address:{" "}
                  <strong>
                    {customerAddress?.user_house_no}{" "}
                    {customerAddress?.base_address} {customerAddress?.address}
                  </strong>
                </h6>
                <h6
                  className=""
                  style={{
                    color: "#000",
                    marginBottom: 0,
                  }}
                >
                  Payment Mode : <strong>{orderDetails?.payment_mode}</strong>
                </h6>
                <h6
                  className=""
                  style={{
                    color: "#000",
                    marginBottom: 0,
                  }}
                >
                  Payment Status :{" "}
                  <strong>
                    {orderDetails?.payment_status == 0 ? "Unpaid" : "Paid"}
                  </strong>
                </h6>
                <h6
                  className=""
                  style={{
                    color: "#000",
                    marginBottom: 0,
                  }}
                >
                  Order Date:{" "}
                  <strong>
                    {orderDetails?.date} || {orderDetails?.time}
                  </strong>
                </h6>
                <div className="">
                  <h6
                    className=""
                    style={{
                      color: "#000",
                      marginBottom: 0,
                    }}
                  >
                    Slots: <strong>{delivery_slots}</strong>
                  </h6>

                  <h6
                    className=""
                    style={{
                      color: "#000",
                      marginBottom: 0,
                    }}
                  >
                    Order status: <strong>{orderDetails?.order_status}</strong>
                  </h6>
                  <h6
                    className=""
                    style={{
                      color: "#000",
                      marginBottom: 0,
                    }}
                  >
                    No of Item: <strong>{orderDetails?.no_of_items}</strong>
                  </h6>
                  <h6
                    className=""
                    style={{
                      color: "#000",
                      marginBottom: 0,
                    }}
                  >
                    Order ID: <strong>{orderDetails?.order_id}</strong>
                  </h6>
                </div>
              </div>
            </div>
          </Box>
        </SimpleGrid>
        <table class="items ml-1">
          <thead>
            <tr
              style={{
                fontSize: 10,
              }}
            >
              <th colSpan={2} class="">
                Item
              </th>
              <th class="">Size</th>
              <th class="">Quant</th>
              <th class="">MRP</th>
              <th class="">RATE</th>
              <th class="">AMT</th>
            </tr>
          </thead>

          <tbody>
            {productData?.map((items, index) => {
              return (
                <tr
                  class="sum-up line"
                  style={
                    !Number(items.avl_status)
                      ? {
                          textDecoration: "line-through",
                        }
                      : {}
                  }
                >
                  <td colSpan={2} rowSpan={1}>
                    {items?.product_name?.substring(0, 16)}
                  </td>
                  <td rowSpan={1}>
                    {items.product_size?.substring(0, 4)}{" "}
                    {items.product_unit?.substring(0, 7)}
                  </td>
                  <td>
                    {items.quantity}{" "}
                    {Number(items.not_avl_qty)
                      ? `-(${items.not_avl_qty}*)`
                      : ""}
                  </td>
                  <td>{items.price}</td>
                  <td class="price">{items.sale_price}</td>
                  <td class="price">
                    {(Number(items.quantity) - Number(items.not_avl_qty)) *
                      Number(items.sale_price)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Box
          fontSize={11}
          // columns={2}
          pl={2}
          pt={2}
          borderTop={"1px solid #000"}
          // borderBottom={"1px solid #000"}
          color={"#000"}
        >
          <div className="">
            <h6
              style={{
                color: "#000",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 0,
                fontSize: "12px",
                // marginRight: "4px",
              }}
            >
              Sub Total :{" "}
              <strong
                className="price"
                style={{
                  marginRight: "6px",
                }}
              >
                {orderDetails?.sub_total}
              </strong>
            </h6>
            <h6
              style={{
                color: "#000",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 0,
                fontSize: "12px",
                // marginRight: "4px",
              }}
            >
              Discount :{" "}
              <strong
                className="price"
                style={{
                  marginRight: "6px",
                }}
              >
                - {orderDetails?.discount}
              </strong>
            </h6>

            <h6
              style={{
                color: "#000",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 0,
                fontSize: "12px",
                // marginRight: "4px",
              }}
            >
              Grand Total :{" "}
              <strong
                className="price"
                style={{
                  marginRight: "6px",
                }}
              >
                {orderDetails?.grand_total}
              </strong>
            </h6>

            <h6
              style={{
                color: "#000",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 0,
                fontSize: "12px",
                // marginRight: "4px",
              }}
            >
              Delivery Charge :{" "}
              <strong
                className="price"
                style={{
                  marginRight: "6px",
                }}
              >
                + {orderDetails?.delivery_charge}
              </strong>
            </h6>
            {ONLINESALEHISTORYRECORD?.coupon_discount_value ? (
              <h6
                style={{
                  color: "#000",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 0,
                  fontSize: "12px",
                  // marginRight: "4px",
                }}
              >
                Coupon Discount :{" "}
                <strong
                  className="price"
                  style={{
                    marginRight: "6px",
                  }}
                >
                  - {orderDetails?.coupon_discount_value}
                </strong>
              </h6>
            ) : null}
            <h6
              style={{
                color: "#000",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 0,
                fontSize: "12px",
                // marginRight: "4px",
              }}
            >
              Total Paymnet :{" "}
              <strong
                className="price"
                style={{
                  marginRight: "6px",
                }}
              >
                {orderDetails?.total_payment}
              </strong>
            </h6>
            {ONLINESALEHISTORYRECORD?.sumOfNotAvilable ? (
              <h6
                style={{
                  color: "#000",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 0,
                  fontSize: "12px",
                  // marginRight: "4px",
                }}
              >
                Not avilable Settlement :{" "}
                <strong
                  className="price"
                  style={{
                    marginRight: "6px",
                  }}
                >
                  {ONLINESALEHISTORYRECORD?.sumOfNotAvilable}
                </strong>
              </h6>
            ) : null}

            {ONLINESALEHISTORYRECORD?.getSumOfProductNotAvilable ? (
              <h6
                style={{
                  color: "#000",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 0,
                  fontSize: "12px",
                  // marginRight: "4px",
                }}
              >
                Product Not avilable Settlement :{" "}
                <strong
                  className="price"
                  style={{
                    marginRight: "6px",
                  }}
                >
                  {ONLINESALEHISTORYRECORD?.getSumOfProductNotAvilable}
                </strong>
              </h6>
            ) : null}

            <h6
              style={{
                color: "#000",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 0,
                fontSize: "12px",
                // marginRight: "4px",
                borderTop: "1px solid #000",
                paddingTop: "3px",
                marginTop: "3px",
                fontSize: "12px",
              }}
            >
              Payment after All Settlement :{" "}
              <strong
                className="price"
                style={{
                  marginRight: "6px",
                  fontSize: "16px",
                }}
              >
                {Number(orderDetails?.total_payment) -
                  Number(ONLINESALEHISTORYRECORD?.sumOfNotAvilable) -
                  Number(ONLINESALEHISTORYRECORD?.getSumOfProductNotAvilable)}
              </strong>
            </h6>
          </div>
        </Box>
      </div>
    </>
  );
};

export default OnlineSalesHistoryRecord;
