// import { BiRupee } from "react-icons/bi";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BiRupee, BiBarcodeReader } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { TiPrinter } from "react-icons/ti";
import { IoIosSave, IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import URLDomain from "../../URL";
import { useReactToPrint } from "react-to-print";
import { useBoolean, useToast } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Form,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { useQuery } from "react-query";
import { queryClient } from "../../App";
import Cookies from "universal-cookie";
import { SimpleGrid } from "@chakra-ui/react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

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
const cookies = new Cookies();
const adminId = cookies.get("adminId");

const OnlineSalesHistoryRecord = () => {
  const { orderID } = useParams();
  const { customer_address } = useParams();
  const { order_type } = useParams();

  const toast = useToast();
  const componentRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // console.log("orderID", orderID);
  // console.log("customer_address", customer_address);

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

  if (isLoading) {
    return <>loading...</>;
  }

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
                            Extra Added Amount :{" "}
                            <strong>
                              {Number(orderDetails?.extra_item_total)}
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

                  <div className="col-xl-12">
                    <Flex
                      alignItems={"center"}
                      justifyContent={"right"}
                      pb={2}
                      pr={3}
                      onClick={onOpen}
                    >
                      <Button>Add More</Button>
                    </Flex>
                    <AddProductModal
                      isOpen={isOpen}
                      onClose={onClose}
                      onOpen={onOpen}
                      orderId={orderDetails?.order_id}
                      customerId={
                        ONLINESALEHISTORYRECORD?.customer_address_details
                          ?.customer_id
                      }
                      customerMobile={
                        ONLINESALEHISTORYRECORD?.order_details.customer_mobile
                      }
                      total_payment={orderDetails?.total_payment}
                      extra_item_total={orderDetails?.extra_item_total}
                    />
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
                                      className={
                                        items.is_extra_item == "1"
                                          ? "bg-secondery"
                                          : "bg-light"
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

      <div
        id="section-to-print"
        ref={componentRef}
        style={{
          width: "3in",
          fontFamily: "Arial, sans-serif",
          fontSize: "10px",
          color: "#000",
          margin: "0 auto", // Center align for thermal printer
          padding: "0 5px", // Add left and right margins
        }}
      >
        {/* Header */}
        <div
          className="POS_header"
          style={{ textAlign: "center", marginBottom: "10px" }}
        ></div>

        {/* Customer Details */}
        <div style={{ marginBottom: "10px" }}>
          <p style={{ margin: "0 0 5px", fontWeight: "bold" }}>
            Customer Name: {customerAddress?.name}
          </p>
          <p style={{ margin: "0 0 5px", fontWeight: "bold" }}>
            Order Date: {orderDetails?.date} || {orderDetails?.time}
          </p>
        </div>

        {/* Items Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "10px",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid #000",
                fontSize: "10px",
                fontWeight: "bold",
              }}
            >
              <th style={{ textAlign: "left", padding: "2px" }}>Item</th>
              <th style={{ textAlign: "center", padding: "2px" }}>Size</th>
              <th style={{ textAlign: "center", padding: "2px" }}>Qty</th>
              <th style={{ textAlign: "right", padding: "2px" }}>MRP</th>
              <th style={{ textAlign: "right", padding: "2px" }}>Rate</th>
              <th style={{ textAlign: "right", padding: "2px" }}>Amt</th>
            </tr>
          </thead>
          <tbody>
            {productData?.map((items, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: "1px dashed #000", // Underline rows
                  fontSize: "10px",
                }}
              >
                <td style={{ textAlign: "left", padding: "2px" }}>
                  {items?.product_name?.substring(0, 21)}
                </td>
                <td style={{ textAlign: "center", padding: "2px" }}>
                  {items.product_size} {items.product_unit}
                </td>
                <td style={{ textAlign: "center", padding: "2px" }}>
                  {items.quantity}
                </td>
                <td style={{ textAlign: "right", padding: "2px" }}>
                  {items.mrp}
                </td>
                <td style={{ textAlign: "right", padding: "2px" }}>
                  {items.sale_price}
                </td>
                <td style={{ textAlign: "right", padding: "2px" }}>
                  {(Number(items.quantity) - Number(items.not_avl_qty)) *
                    Number(items.sale_price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div
          style={{
            borderTop: "1px dashed #000",
            paddingTop: "5px",
            marginBottom: "10px",
          }}
        >
          <p style={{ margin: "0 0 5px", fontWeight: "bold" }}>
            Sub Total:{" "}
            <span style={{ float: "right" }}>{orderDetails?.sub_total}</span>
          </p>
          <p style={{ margin: "0 0 5px", fontWeight: "bold" }}>
            Discount:{" "}
            <span style={{ float: "right" }}>- {orderDetails?.discount}</span>
          </p>
          <p style={{ margin: "0 0 5px", fontWeight: "bold" }}>
            Grand Total:{" "}
            <span style={{ float: "right" }}>{orderDetails?.grand_total}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export function AddProductModal({
  isOpen,
  onOpen,
  onClose,
  orderId,
  total_payment,
  extra_item_total,
  customerMobile,
}) {
  const [addedItems, setAddedItems] = useState([]);
  const adminStoreId = cookies.get("adminStoreId");
  // const adminStoreId = cookies.get("adminStoreId");
  const [onlyPrint, setOnlyPrint] = useState(false);
  // const [isLoading, setIL] = useState(false);
  const [isLoading, setLoading] = useBoolean();

  const submitSale = () => {
    setLoading.on();
    const data = JSON.stringify({
      store_id: adminStoreId,
      customer_mobile: customerMobile,
      order_id: orderId,
      user_id: adminId,
      product_list: addedItems,
      total_payment,
      extra_item_total,
    });
    console.log("dataaaaa", data);
    fetch(URLDomain + "/APP-API/Billing/SaleSExtratoreProducts", {
      method: "POST",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // functionality.fetchAllData(responseJson);
        console.log(" Sale server res ---->", responseJson);
        setLoading.off();
        if (responseJson.purchase_product_insert) onClose();
        queryClient.invalidateQueries({
          queryKey: ["ONLINESALEHISTORYRECORD"],
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  async function fetchData() {
    const data = await fetch(
      URLDomain + "/APP-API/Billing/InsertPurchaseData",
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
    data: PURCHASEDATA,
    isError,
    isLoading: isLoadingAPI,
  } = useQuery({
    queryKey: ["PURCHASEDATA"],
    queryFn: (e) => fetchData(),
    refetchOnWindowFocus: false,
    // refetchInterval: 100,
  });

  const handleOnSelect = (item) => {
    console.log("barcode ---->", item.product_bar_code);
    const allReadyExist = addedItems.some(
      (elem) => elem.product_full_name === item.product_full_name
    );
    const index = addedItems.findIndex(
      (elem) => elem.product_full_name === item.product_full_name
    );
    console.log("hey 2");
    !allReadyExist
      ? setAddedItems([
          { ...item, billing_quantity: 1, amount_total: item.sale_price },
          ...addedItems,
        ])
      : setAddedItems((previousState) => {
          let obj = previousState[index];
          if (obj !== undefined) {
            obj.billing_quantity = Number(obj.billing_quantity || 0) + 1; // <-- state mutation
            obj.amount_total =
              Number(obj.billing_quantity) * Number(obj.sale_price);
            console.log("Quantity Scan ---->", obj.billing_quantity);
          }
          return [...previousState];
        });
    // !allReadyExist && setAddedItems([...addedItems, item]);
    /*  setTimeout(() => {
             document.getElementsByClassName("clear-icon")[0].querySelector(':scope > svg')[0].click();
         }, 1000) */ //1 second delay
  };

  const deleteFeild = (index) => {
    let newArr = [...addedItems];
    delete newArr[index];
    newArr = newArr.filter((item) => item);
    setAddedItems(newArr);
  };

  const updateFieldChanged = (index) => (e) => {
    // console.log('index: ' + index);
    // console.log('property name: ' + e.target.name);
    let newArr = [...addedItems];

    e.target.name === "price" &&
      (newArr[index].price = e.target.value) &&
      (newArr[index].sale_price = e.target.value) &&
      (newArr[index].discount_in_rs = 0);

    e.target.name === "quantity" &&
      (newArr[index].billing_quantity = e.target.value);

    e.target.name === "product_name" &&
      (newArr[index].product_name = e.target.value);
    e.target.name === "product_size" &&
      (newArr[index].product_size = e.target.value);
    e.target.name === "product_unit" &&
      (newArr[index].product_unit = e.target.value);

    e.target.name === "sale_price" &&
      (newArr[index].sale_price = e.target.value) &&
      (newArr[index].discount_in_rs =
        newArr[index].price - newArr[index].sale_price);
    e.target.name === "discount" &&
      (newArr[index].discount_in_rs = e.target.value) &&
      (newArr[index].sale_price =
        newArr[index].price - newArr[index].discount_in_rs);
    newArr[index].amount_total =
      Number(newArr[index].billing_quantity) * Number(newArr[index].sale_price);
    // console.log("new arrya --->", newArr);

    newArr = newArr.filter((item) => item);
    setAddedItems(newArr);
  };

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add More Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxH={"500px"} overflow={"auto"}>
            <div className="col-lg-12 border-bottom pb-4">
              <div className="row g-3">
                <div className="col-md-12 col-sm-12">
                  <div className="d-flex align-items-center">
                    {/* <input id="search-dropdown" type="text" className="form-control search bg-light border-light" placeholder="Add product..." /> */}
                    <div style={{ width: "68%" }}>
                      <ReactSearchAutocomplete
                        items={PURCHASEDATA?.searchProduct}
                        className="form-control search bg-light border-light"
                        onSelect={handleOnSelect}
                        styling={{
                          zIndex: "1",
                        }}
                        fuseOptions={{
                          keys: [
                            "product_name",
                            "product_bar_code",
                            "product_full_name",
                          ],
                        }}
                        resultStringKeyName="product_name_search" // formatResult={formatResult}
                      />
                    </div>
                    {/* <i className="ri-search-line search-icon" /> */}
                    {/* <h2 className="mb-0" style={{ marginLeft: "1rem" }}> */}
                    <Box ml={4}>
                      <BiBarcodeReader size={28} />
                    </Box>
                    {/* </h2> */}
                    {addedItems.length ? (
                      <Flex
                        ml={10}
                        alignItems={"center"}
                        justifyContent={"center"}
                        cursor={"pointer"}
                        onClick={() => {
                          setAddedItems([]);
                        }}
                        borderRadius={6}
                        border={"2px solid #d4d4d4"}
                        px={2}
                        py={1}
                      >
                        <Text fontWeight={"700"} className="mb-0">
                          Delete All
                        </Text>
                        <MdDelete size={24} color="red" />
                      </Flex>
                    ) : null}
                    {addedItems.length ? (
                      !onlyPrint ? (
                        <Button
                          isLoading={isLoading}
                          onClick={submitSale}
                          ml={6}
                          backgroundColor={"#000"}
                          borderRadius={6}
                          color={"#fff"}
                        >
                          <Flex
                            alignItems={"center"}
                            justifyContent={"center"}
                            cursor={"pointer"}
                            // onClick={deleteAll}
                            px={3}
                            py={1}
                            gap={1}
                          >
                            <Text
                              fontWeight={"700"}
                              fontSize={14}
                              className="mb-0"
                            >
                              Save
                            </Text>
                            <IoIosSave size={28} />
                          </Flex>
                        </Button>
                      ) : (
                        <Button
                          isLoading={isLoading}
                          // onClick={handlePrint}
                          ml={6}
                          borderRadius={6}
                          colorScheme="orange"
                        >
                          <Flex
                            alignItems={"center"}
                            justifyContent={"center"}
                            cursor={"pointer"}
                            // onClick={deleteAll}
                            px={3}
                            py={1}
                            gap={1}
                          >
                            <Text
                              fontWeight={"700"}
                              fontSize={14}
                              className="mb-0"
                            >
                              Print
                            </Text>
                            <TiPrinter size={28} />
                          </Flex>
                        </Button>
                      )
                    ) : null}
                  </div>

                  <div
                    className="dropdown-menu dropdown-menu-lg"
                    id="search-dropdown"
                  ></div>
                </div>
              </div>
            </div>
            <div className="col-xl-12">
              <div className="table-responsive mt-4 mt-xl-0">
                <table className="table table-active table-hover table-striped align-middle table-nowrap mb-0">
                  <thead>
                    <tr>
                      <th scope="col">NO</th>
                      <th scope="col">QTY</th>
                      <th scope="col">ITEMS</th>
                      <th scope="col">Size</th>
                      <th scope="col">Unit</th>

                      <th scope="col">MRP</th>
                      <Box
                        as="th"
                        display={"flex"}
                        alignItems={"center"}
                        scope="col"
                      >
                        <BiRupee />
                        PRICE
                      </Box>
                      <th scope="col">DISCOUNT</th>
                      {/* <th scope="col">HSN</th> */}
                      {/* <th scope="col">GST</th> */}
                      {/* <th scope="col">CGST</th> */}
                      <th scope="col">AMOUNT</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {addedItems?.length && addedItems ? (
                      addedItems?.map((items, index) => {
                        return (
                          <>
                            {items && (
                              <tr>
                                <td width={"10%"} className="fw-medium">
                                  {index + 1}
                                </td>
                                <td width={"10%"}>
                                  <input
                                    type="number"
                                    name="quantity"
                                    onChange={updateFieldChanged(index)}
                                    value={
                                      items.billing_quantity
                                        ? items.billing_quantity
                                        : ""
                                    }
                                    className="invoice_input"
                                    style={{ width: "3rem" }}
                                    placeholder="0"
                                  />
                                </td>
                                <td width={"40%"}>
                                  <input
                                    type="text"
                                    name="product_name"
                                    onChange={updateFieldChanged(index)}
                                    value={items.product_name}
                                    className="invoice_input"
                                    style={{ width: "15rem" }}
                                    placeholder=""
                                  />
                                </td>
                                {/* <td width={"40%"} >{items.product_full_name}</td> */}

                                <td width={"5%"}>
                                  <input
                                    type="number"
                                    name="product_size"
                                    onChange={updateFieldChanged(index)}
                                    value={
                                      items.product_size
                                        ? items.product_size
                                        : ""
                                    }
                                    className="invoice_input"
                                    style={{ width: "3rem" }}
                                    placeholder="0"
                                  />
                                </td>
                                <td width={"5%"}>
                                  <input
                                    type="text"
                                    name="product_unit"
                                    onChange={updateFieldChanged(index)}
                                    value={
                                      items.product_unit
                                        ? items.product_unit
                                        : ""
                                    }
                                    className="invoice_input"
                                    style={{ width: "3rem" }}
                                    placeholder="0"
                                  />
                                </td>

                                <td width={"10%"}>
                                  <input
                                    type="number"
                                    name="price"
                                    value={items.price}
                                    onChange={updateFieldChanged(index)}
                                    className="invoice_input"
                                    style={{ width: "5rem" }}
                                    placeholder="0"
                                  />
                                </td>

                                <td width={"10%"}>
                                  <input
                                    type="number"
                                    name="sale_price"
                                    value={items.sale_price}
                                    onChange={updateFieldChanged(index)}
                                    className="invoice_input"
                                    style={{ width: "5rem" }}
                                    placeholder="0"
                                  />
                                </td>
                                <td width={"10%"}>
                                  <input
                                    type="number"
                                    name="discount"
                                    onChange={updateFieldChanged(index)}
                                    value={items.discount_in_rs}
                                    className="invoice_input"
                                    style={{ width: "3rem" }}
                                    placeholder="0"
                                  />
                                </td>
                                {/* <td width={"10%"} ><input type="number" value={items.hsn_code} className="invoice_input" style={{ width: "3rem" }} placeholder="0" /></td> */}
                                {/* <td width={"10%"} ><input type="number" disabled value={items.i_gst} className="invoice_input" style={{ width: "3rem" }} placeholder="0" /></td> */}
                                {/* <td width={"10%"} ><input type="number" value={items.c_gst} className="invoice_input" style={{ width: "3rem" }} placeholder="0" /></td> */}
                                <td width={"10%"}>
                                  <input
                                    type="number"
                                    disabled
                                    value={
                                      items.amount_total
                                        ? items.amount_total
                                        : ""
                                    }
                                    readOnly
                                    className="invoice_input"
                                    style={{ width: "6rem" }}
                                    placeholder="0"
                                  />
                                </td>
                                <td width={"10%"}>
                                  <AiOutlineDelete
                                    style={{
                                      cursor: "pointer",
                                      color: "red",
                                    }}
                                    onClick={() => deleteFeild(index)}
                                    size={24}
                                  />
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
                {!addedItems.length ? (
                  <>
                    <div className="col-md-12 px-0">
                      <div className="d-flex align-items-center justify-content-center p-3 add_product_dashedBorder mt-4">
                        <div className="w-100">
                          <Flex
                            justifyContent={"center"}
                            alignItems={"center"}
                            gap={3}
                            color={"#001794"}
                            fontWeight={"600"}
                            fontSize={16}
                          >
                            <BiBarcodeReader size={30} /> Scan Barcode / Add you
                            product
                          </Flex>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            <Flex justifyContent={"center"} p={5}></Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default OnlineSalesHistoryRecord;
