import { BiRupee, BiBarcodeReader } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { useEffect, useState, useRef } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import useScanDetection from "use-scan-detection";
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
import { TiPrinter } from "react-icons/ti";
import { IoIosSave, IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import URLDomain from "../../URL";
import { useReactToPrint } from "react-to-print";
import { useToast } from "@chakra-ui/react";
import { EnterMobileNumber } from "./Sale/EnterMobileNumber";
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
import Cookies from "universal-cookie";
const cookies = new Cookies();

function isValidBarcode(barcode) {
  // check length
  if (
    barcode.length < 8 ||
    barcode.length > 18 ||
    (barcode.length != 8 &&
      barcode.length != 12 &&
      barcode.length != 13 &&
      barcode.length != 14 &&
      barcode.length != 18)
  ) {
    return false;
  }

  var lastDigit = Number(barcode.substring(barcode.length - 1));
  var checkSum = 0;
  if (isNaN(lastDigit)) {
    return false;
  } // not a valid upc/ean

  var arr = barcode
    .substring(0, barcode.length - 1)
    .split("")
    .reverse();
  var oddTotal = 0,
    evenTotal = 0;

  for (var i = 0; i < arr.length; i++) {
    if (isNaN(arr[i])) {
      return false;
    } // can't be a valid upc/ean we're checking for

    if (i % 2 == 0) {
      oddTotal += Number(arr[i]) * 3;
    } else {
      evenTotal += Number(arr[i]);
    }
  }
  checkSum = (10 - ((evenTotal + oddTotal) % 10)) % 10;

  // true if they are equal
  return checkSum == lastDigit;
}

export const Sale = () => {
  const [Saledate, setSaledate] = useState(new Date());
  const [selectedCustomer, setSelectCustomer] = useState({
    mobile: 9999999999,
  });

  const [Store_bussiness_info, setStore_bussiness_info] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [previousAddedItems, setPreviousAddedItems] = useState([]);
  const [onlyPrint, setOnlyPrint] = useState(false);
  const [lastInsertedRow, setLastInsertedRow] = useState({});
  const [isLoading, setIL] = useState(false);
  const [isDataLoding, setisDataLoding] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  const toast = useToast();

  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");

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

  useEffect(() => {
    setAllProducts(allProducts);
    setStore_bussiness_info(Store_bussiness_info);
    // console.log("search product", PURCHASEDATA, isLoadingAPI);
    if (PURCHASEDATA) {
      setAllProducts(PURCHASEDATA.searchProduct);
      setStore_bussiness_info(PURCHASEDATA.partner_bussiness_info);
      setisDataLoding(false);
    }
  }, [PURCHASEDATA, isLoadingAPI]);

  var DateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  var BillDate = new Date(Saledate);

  const [customerShoppingDetails, setcustomerShoppingDetails] = useState({
    mobile: selectedCustomer?.mobile,
    customer_type: "",
    no_of_shopping_time: 0,
    shopping_value: 0,
  });

  const [useCouponData, setuseCouponData] = useState({
    is_coupon_applied: 0,
    coupon_code: 0,
    coupon_id: null,
  });

  const [allTotals, setAllTotals] = useState({
    subTotal: 0,
    sGstTotal: 0,
    cGstTotal: 0,
    grandTotal: 0,
    discount: 0,
    coupon_discount_value: 0,
    additional_charges: 0,
    amount_paid: 0,
    outstanding: 0,
    round_off: false,
    round_off_value: 0,
    fully_paid: false,
  });
  const [restInfo, setRestInfo] = useState({
    sales_man: "",
    payment_mode: "Cash",
    notes: "",
    stock_location: "Store",
    order_no:
      new Date().getTime() +
      new Date().getDate() +
      "" +
      new Date().getHours() +
      "" +
      new Date().getMinutes() +
      "" +
      new Date().getSeconds() +
      "" +
      adminId,
  });
  const componentRef = useRef();

  useEffect(() => {
    const func = () => {
      document.querySelectorAll("[data-test]")[0].focus();
      document.querySelectorAll("[data-test]")[0].select();
    };

    const keyDownHandler = (event) => {
      // if (event.keyCode === 220) {
      //   event.preventDefault();
      //   func();
      //   document.querySelectorAll("#search-options")[0].scrollIntoView();
      // }
      // console.log("key stroke ---->", event);
      if (event.keyCode === 220) {
        event.preventDefault();
        func();
        document
          .querySelectorAll("#search-options")[0]
          .scrollIntoView({ block: "center" });
      }

      if ((event.ctrlKey || event.metaKey) && event.keyCode == 83) {
        // submitSale();
        event.preventDefault();
        console.log(
          "key stroke =======>",
          allTotals,
          " =============== ",
          addedItems
        );
        // onlyPrint ? handlePrint() : submitSale();
      }

      if ((event.ctrlKey || event.metaKey) && event.keyCode == 68) {
        event.preventDefault();
        setAddedItems([]);
      }

      if ((event.ctrlKey || event.metaKey) && event.keyCode == 80) {
        event.preventDefault();
        handlePrint();
      }

      if ((event.ctrlKey || event.metaKey) && event.keyCode == 66) {
        event.preventDefault();
        onOpen();
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    document.querySelectorAll("[data-test]")[0].addEventListener("click", func);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("click", keyDownHandler);
    };
  }, []);

  useEffect(() => {
    if (addedItems === previousAddedItems) {
      // console.log("match");
      setOnlyPrint(true);
    } else {
      setOnlyPrint(false);
      // console.log("no match");
    }
    console.log(
      "padh likh leye hote ==============>",
      addedItems,
      "=============",
      allTotals
    );
  }, [addedItems, previousAddedItems]);

  const deleteAll = () => {
    setAddedItems([]);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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

  // useEffect(
  //   () => {
  //     setAllProducts(storeProductsData);
  //     const CouponData = store_coupon_list?.filter((obj) => obj.status == 1);
  //     setCouponData(CouponData);

  //     console.log("store prod", store_login_user);
  //   },
  //   [storeProductsData],
  //   allTotals
  // );

  useScanDetection({
    // preventDefault: true,

    onComplete: (code) => {
      const isValid = isValidBarcode(code);
      console.log("vaild hai kya barcode ======?", isValid);
      if (isValid) {
        const prod = allProducts?.find((o) => o.product_bar_code == code);
        if (prod) {
          const allReadyExist = addedItems.find(
            (elem) => elem.product_bar_code === code
          );
          const index = addedItems.findIndex(
            (elem) => elem.product_bar_code === code
          );
          const updatedProduct = [...addedItems];
          if (allReadyExist) {
            let obj = updatedProduct[index];
            if (obj !== undefined) {
              obj.billing_quantity++; // <-- state mutation
              obj.amount_total =
                Number(obj.billing_quantity) * Number(obj?.sale_price);
            }
          }
          console.log("hey 1", code);
          !allReadyExist
            ? setAddedItems([
                {
                  ...prod,
                  billing_quantity: 1,
                  amount_total: prod?.sale_price,
                },
                ...addedItems,
              ])
            : setAddedItems([...updatedProduct]);
          /* previousState => {
                let obj = previousState[index];
                if (obj !== undefined) {
                    obj.billing_quantity++; // <-- state mutation
                    obj.amount_total = Number(obj.billing_quantity) * Number(obj.sale_price);
                    console.log("Quantity Scan ---->", obj.billing_quantity);
                }
                return [...previousState];
            } */
        } else {
          toast({
            title: "Invalid Product",
            duration: 3000,
            status: "error",
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Barcode Invalid",
          duration: 3000,
          status: "error",
          isClosable: true,
        });
      }
    },
  });

  useEffect(() => {
    const subTotalGet = addedItems.reduce((acc, obj) => {
      return (
        acc +
        Number(Number(obj?.price || 0) * Number(obj?.billing_quantity || 0))
      );
    }, 0);

    const grandTotal = addedItems.reduce((acc, obj) => {
      return (
        acc +
        Number(
          Number(obj?.sale_price || 0) * Number(obj?.billing_quantity || 0)
        )
      );
    }, 0);

    const discount = addedItems.reduce((acc, obj) => {
      return (
        acc +
        Number(
          Number(obj?.discount_in_rs || 0) * Number(obj?.billing_quantity || 0)
        )
      );
    }, 0);

    const sGstTotal = addedItems.reduce((acc, obj) => {
      return (
        acc +
        (Number(obj?.s_gst || 0) / 100) *
          Number(obj?.sale_price || 0) *
          Number(obj?.billing_quantity || 0)
      );
    }, 0);

    const subTotal = subTotalGet;

    console.log("sub total =========>", sGstTotal);

    setAllTotals({
      ...allTotals,
      discount,
      subTotal,
      sGstTotal,
      cGstTotal: sGstTotal,
      grandTotal,
    });
  }, [addedItems]);

  useEffect(() => {
    console.log("all totoals ==========>", allTotals);
  }, [allTotals]);

  useEffect(() => {
    const { subTotal, sGstTotal, cGstTotal, discount, additional_charges } =
      allTotals;
    const Total = subTotal + sGstTotal + cGstTotal - Number(discount || 0);
    const AdditionalChargesTotal =
      Number(Total || 0) + Number(additional_charges || 0);
    setAllTotals({
      ...allTotals,
      grandTotal: AdditionalChargesTotal,
    });
  }, [allTotals?.additional_charges]);

  useEffect(() => {
    const { grandTotal, amount_paid } = allTotals;
    const Total = Number(grandTotal || 0);
    const outstanding = Total - Number(amount_paid || 0);
    setAllTotals({
      ...allTotals,
      outstanding: outstanding,
    });
  }, [allTotals?.amount_paid]);

  useEffect(() => {
    const { fully_paid } = allTotals;
    fully_paid &&
      setAllTotals({
        ...allTotals,
        outstanding: 0,
      });
  }, [allTotals?.fully_paid]);

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

  const Print = () => {
    console.log("print");
    let printContents = document.getElementById("section-to-print").innerHTML;
    let originalContents =
      document.getElementsByClassName("main-content").innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  const deleteFeild = (index) => {
    let newArr = [...addedItems];
    delete newArr[index];
    newArr = newArr.filter((item) => item);
    setAddedItems(newArr);
  };

  const submitSale = () => {
    console.log(
      "final order =======================>",
      allTotals,
      " ========== ",
      addedItems
    );
    setIL(true);
    // if (
    //   selectedCustomer.mobile == undefined ||
    //   selectedCustomer.mobile == null
    // ) {
    //   getToast({
    //     title: "Customer Mobile Number",
    //     dec: "Requird",
    //     status: "error",
    //   });
    //   setIL(false);
    // } else
    if (allTotals?.grandTotal == 0) {
      getToast({ title: "Please add items", dec: "Requird", status: "error" });
      setIL(false);
    } else {
      const data = JSON.stringify({
        customer_type: customerShoppingDetails?.customer_type,
        store_id: adminStoreId,
        customer_mobile: selectedCustomer.mobile,
        user_id: adminId,
        sub_total: allTotals?.subTotal,
        i_gst: Number(allTotals?.sGstTotal) + Number(allTotals?.cGstTotal),
        s_gst: Number(allTotals?.sGstTotal),
        c_gst: Number(allTotals?.cGstTotal),
        extra_charge: allTotals?.additional_charges,
        discount: allTotals?.discount,
        notes: restInfo.notes,
        order_no: restInfo.order_no,
        total_payment: allTotals?.grandTotal,
        amount_paid: allTotals?.amount_paid,
        outstanding: allTotals?.outstanding,
        stock_location: restInfo.stock_location,
        payment_mode: restInfo.payment_mode,
        is_coupon_applied: useCouponData.is_coupon_applied,
        coupon_code: useCouponData.coupon_code,
        coupon_discount_value: allTotals?.coupon_discount_value,
        coupon_id: useCouponData.coupon_id,
        purchaes_date: Saledate.toLocaleDateString(),
        product_list: addedItems,
      });

      fetch(URLDomain + "/APP-API/Billing/SaleStoreProducts", {
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
          setLastInsertedRow(responseJson.inserted_row);
          // setAddedItems([]);
          setIL(false);
          handlePrint();
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIL(false);
          setPreviousAddedItems(addedItems);
        });
    }
  };

  const formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  const deleteLastOrder = ({ id }) => {
    const data = JSON.stringify({ id });

    fetch(URLDomain + "/APP-API/Billing/deleteLastSaleRow", {
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
        setLastInsertedRow({});
      })
      .catch((error) => {
        console.error(error);
      });
    // .finally(() => {
    //   setIL(false);
    //   setPreviousAddedItems(addedItems);
    // });
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0">Sale</h4>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="live-preview">
                <div className="row">
                  <EnterMobileNumber
                    Saledate={Saledate}
                    customerShoppingDetails={customerShoppingDetails}
                    selectedCustomer={selectedCustomer}
                    setSaledate={setSaledate}
                    setSelectCustomer={setSelectCustomer}
                    setcustomerShoppingDetails={setcustomerShoppingDetails}
                  />
                  <div className="col-lg-12 border-bottom">
                    <div className="row g-3">
                      <div className="col-md-12 col-sm-12">
                        <div className="d-flex align-items-center">
                          {/* <input id="search-dropdown" type="text" className="form-control search bg-light border-light" placeholder="Add product..." /> */}
                          <div style={{ width: "68%" }}>
                            <ReactSearchAutocomplete
                              items={allProducts}
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
                              onClick={deleteAll}
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
                                onClick={handlePrint}
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

                        <Box
                          py={4}
                          // my={3}
                          // borderTop={"1px solid"}
                          // borderBottom={"1px solid"}
                          borderColor={"#efefef"}
                        >
                          <Flex
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Flex>
                              {Object.keys(lastInsertedRow).length ? (
                                <>
                                  <Text fontWeight={"600"}>
                                    Last inserted row:{" "}
                                  </Text>
                                  <Flex alignItems={"center"}>
                                    <Flex
                                      fontWeight={"700"}
                                      mx={2}
                                      alignItems={"center"}
                                    >
                                      <BiRupee />
                                      <Text>
                                        {lastInsertedRow?.total_payment}
                                      </Text>
                                    </Flex>
                                    <Text> No. Product: </Text>
                                    <Text fontWeight={"600"}>
                                      {lastInsertedRow?.no_of_items}
                                    </Text>
                                    <AiOutlineDelete
                                      style={{
                                        cursor: "pointer",
                                        color: "red",
                                        marginLeft: 6,
                                      }}
                                      onClick={() =>
                                        deleteLastOrder({
                                          id: lastInsertedRow?.id,
                                        })
                                      }
                                      size={24}
                                    />
                                  </Flex>
                                </>
                              ) : null}
                            </Flex>
                            <Flex
                              justifyContent={"end"}
                              fontSize={16}
                              fontWeight={"600"}
                              mr={8}
                              alignItems={"center"}
                            >
                              <Text>Total amount to pay:</Text>
                              <Flex
                                fontWeight={"700"}
                                ml={1}
                                alignItems={"center"}
                                fontSize={20}
                              >
                                <BiRupee />
                                <Text>{allTotals?.grandTotal}</Text>
                              </Flex>
                              <Box
                                ml={4}
                                p={1}
                                borderRadius={6}
                                border={"1px solid #d4d4d4"}
                                cursor={"pointer"}
                                onClick={onOpen}
                              >
                                <IoMdAdd />
                              </Box>
                            </Flex>
                          </Flex>
                        </Box>

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
                                  <BiBarcodeReader size={30} /> Scan Barcode /
                                  Add you product
                                </Flex>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-12 border-top border-bottom mt-5">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="d-flex py-3 px-5 justify-content-between align-items-center border-bottom">
                          <h5
                            style={{
                              fontSize: 17,
                              margin: 0,
                              fontWeight: "700",
                              color: "black",
                            }}
                          >
                            Total Amount
                          </h5>
                          <Flex
                            fontWeight={"600"}
                            fontSize={14}
                            alignItems={"center"}
                          >
                            <BiRupee />{" "}
                            {allTotals?.grandTotal.toLocaleString("en-IN")}
                          </Flex>
                        </div>
                        {/* <div className="d-flex py-3 px-5 justify-content-between align-items-center border-bottom">
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "700",
                              color: "black",
                            }}
                          >
                            Available Coupon
                          </h5>
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "600",
                              color: "black",
                            }}
                          >
                            <select
                              class="form-select "
                              onChange={(e) =>
                                getCouponUseDetails(e.target.value)
                              }
                              aria-label="Default select example"
                            >
                              <option value={null}>Choose Coupon</option>
                              {couponData?.map((items, index) => {
                                if (
                                  Number(allTotals?.grandTotal) >=
                                  Number(items.minimum_order_amount)
                                ) {
                                  return (
                                    <>
                                      <option value={items.coupon_id}>
                                        {items.coupon_code} ({" "}
                                        {Math.round(items.coupon_discount)}{" "}
                                        {items.coupon_type == "amount"
                                          ? "₹ OFF"
                                          : "% OFF"}{" "}
                                        )
                                      </option>
                                    </>
                                  );
                                } else {
                                  return (
                                    <>
                                      <option value={null}>
                                        {" "}
                                        Buy{" "}
                                        {Number(items.minimum_order_amount) -
                                          Number(allTotals?.grandTotal)}{" "}
                                        ₹ More and Get{" "}
                                        {Math.round(items.coupon_discount)}{" "}
                                        {items.coupon_type == "amount"
                                          ? "₹ OFF"
                                          : "% OFF"}{" "}
                                      </option>
                                    </>
                                  );
                                }
                              })}
                            </select>
                          </h5>
                        </div> */}
                        <div className="d-flex py-3 px-5 justify-content-between align-items-center">
                          <Checkbox
                            onChange={(e) =>
                              setAllTotals({
                                ...allTotals,
                                round_off: e.target.checked,
                              })
                            }
                          >
                            <h5
                              style={{
                                fontSize: 14,
                                margin: 0,
                                fontWeight: "700",
                                color: "black",
                              }}
                            >
                              Round Off
                            </h5>
                          </Checkbox>
                        </div>

                        <div className="d-flex py-3 px-5 justify-content-between align-items-center border-bottom">
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "700",
                              color: "black",
                            }}
                          >
                            Payment Mode
                          </h5>
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "600",
                              color: "black",
                            }}
                          >
                            <select
                              class="form-select "
                              onChange={(e) =>
                                setRestInfo({
                                  ...restInfo,
                                  payment_mode: e.target.value,
                                })
                              }
                              aria-label="Default select example"
                            >
                              <option value="Cash">Cash</option>
                              <option value="UPI">UPI</option>
                              <option value="Bank Transfer">
                                Bank Transfer
                              </option>
                            </select>
                          </h5>
                        </div>
                        <div className="py-3 px-5 mt-5">
                          <Button
                            // type="button"
                            isLoading={isLoading}
                            onClick={submitSale}
                            fontSize={14}
                            colorScheme="teal"
                            width={"100%"}
                            // class="btn btn-success waves-effect waves-light w-100 "
                          >
                            Submit
                          </Button>

                          {/* <ReactToPrint
                            trigger={() => (
                              <button
                                type="button"
                                class="btn btn-warning waves-effect waves-light w-100 mt-3"
                              >
                                Print
                              </button>
                            )}
                            content={() => componentRef.current}
                            // print={() => console.log("hey nanveet")}
                          /> */}
                        </div>
                      </div>
                      <div
                        className="col-md-6 px-0 py-3"
                        style={{ borderLeft: "1px solid #d9d9d9" }}
                      >
                        <div className="d-flex py-3 px-5 justify-content-between align-items-center border-bottom">
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "600",
                              color: "black",
                            }}
                          >
                            Sub Total
                          </h5>
                          <Flex
                            fontWeight={"600"}
                            fontSize={14}
                            alignItems={"center"}
                          >
                            <BiRupee />{" "}
                            {allTotals?.subTotal?.toLocaleString("en-IN")}
                          </Flex>
                        </div>

                        <div className="d-flex py-3 px-5 justify-content-between align-items-center border-bottom">
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "600",
                              color: "black",
                            }}
                          >
                            Discount
                          </h5>
                          <Flex
                            fontWeight={"600"}
                            fontSize={14}
                            alignItems={"center"}
                          >
                            -<BiRupee />{" "}
                            {allTotals?.discount?.toLocaleString("en-IN")}
                          </Flex>
                        </div>

                        <div className="d-flex py-3 px-5 justify-content-between align-items-center">
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "600",
                              color: "black",
                            }}
                          >
                            SGST
                          </h5>
                          <Flex
                            fontWeight={"600"}
                            fontSize={14}
                            alignItems={"center"}
                          >
                            <BiRupee />{" "}
                            {allTotals?.sGstTotal?.toLocaleString("en-IN")}
                          </Flex>
                        </div>
                        <div className="d-flex py-3 px-5 justify-content-between align-items-center border-bottom">
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "600",
                              color: "black",
                            }}
                          >
                            CGST
                          </h5>
                          <Flex
                            fontWeight={"600"}
                            fontSize={14}
                            alignItems={"center"}
                          >
                            <BiRupee />{" "}
                            {allTotals?.cGstTotal?.toLocaleString("en-IN")}
                          </Flex>
                        </div>

                        {useCouponData.is_coupon_applied == 1 ? (
                          <div className="d-flex py-3 px-5 justify-content-between align-items-center border-bottom">
                            <h5
                              style={{
                                fontSize: 14,
                                margin: 0,
                                fontWeight: "600",
                                color: "black",
                              }}
                            >
                              Extra Discount
                            </h5>
                            <Flex
                              fontWeight={"600"}
                              fontSize={14}
                              alignItems={"center"}
                            >
                              -<BiRupee />{" "}
                              {allTotals?.coupon_discount_value?.toLocaleString(
                                "en-IN"
                              )}
                            </Flex>
                          </div>
                        ) : null}

                        <div className="d-flex py-3 px-5 justify-content-between align-items-center border-bottom">
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "700",
                              color: "black",
                            }}
                          >
                            Total Amount
                          </h5>
                          <Flex
                            fontWeight={"600"}
                            fontSize={14}
                            alignItems={"center"}
                          >
                            <BiRupee />{" "}
                            {allTotals?.grandTotal?.toLocaleString("en-IN")}
                          </Flex>
                        </div>

                        <div className="d-flex pt-3 px-5 justify-content-between align-items-center">
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "700",
                              color: "black",
                            }}
                          ></h5>
                          {/* <h5 style={{ fontSize: 14, margin: 0, fontWeight: "600", color: "black" }}>{allTotals?.grandTotal.toLocaleString('en-IN')}</h5> */}
                          <Checkbox
                            onChange={(e) =>
                              setAllTotals({
                                ...allTotals,
                                fully_paid: e.target.checked,
                              })
                            }
                          >
                            <h5
                              style={{
                                fontSize: 14,
                                margin: 0,
                                fontWeight: "700",
                                color: "black",
                              }}
                            >
                              Mark as fully paid
                            </h5>
                          </Checkbox>
                        </div>
                        <div className="d-flex py-3 px-5 justify-content-between align-items-center border-bottom">
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "600",
                              color: "black",
                            }}
                          >
                            Amount Paid
                          </h5>
                          <Flex
                            fontWeight={"600"}
                            fontSize={14}
                            alignItems={"center"}
                          >
                            <BiRupee />
                            <input
                              type="number"
                              disabled={allTotals?.fully_paid}
                              onChange={(e) =>
                                setAllTotals({
                                  ...allTotals,
                                  amount_paid: e.target.value,
                                })
                              }
                              className="invoice_input"
                              style={{ width: "5rem" }}
                              placeholder="0"
                            />
                          </Flex>
                        </div>
                        <div className="d-flex pt-3 px-5 justify-content-between align-items-center">
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "600",
                              color: "green",
                            }}
                          >
                            Outstanding
                          </h5>
                          <Flex
                            fontWeight={"600"}
                            fontSize={14}
                            alignItems={"center"}
                          >
                            <BiRupee />{" "}
                            {allTotals?.outstanding
                              ? allTotals?.outstanding.toLocaleString("en-IN")
                              : 0}
                          </Flex>
                        </div>
                      </div>
                    </div>
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
      {/* section-to-print */}

      <Modal
        initialFocusRef={initialRef}
        size="xs"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Add Extra</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody pb={5}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAddedItems([
                  {
                    billing_quantity: 1,
                    amount_total: initialRef.current.value,
                    product_name: "Extra",
                    product_size: "1",
                    product_unit: "n",
                    price: initialRef.current.value,
                    sale_price: initialRef.current.value,
                    discount_in_rs: 0,
                    //

                    id: "00",
                    store_id: "STORE0001",
                    // product_name: "Anik ghee",
                    product_full_name: "Extra",
                    product_uniq_slug_name: "extra",
                    product_image:
                      "https://static.vecteezy.com/system/resources/previews/008/770/217/original/paper-bag-full-of-organic-and-fresh-grocery-products-free-vector.jpg",
                    product_type: "Grocery",
                    parent_category_id: "000",
                    parent_category_name: "Extra",
                    category_id: "000",
                    child_category_name: "Extra",
                    brand_id: "00",
                    brand_name: "Extra",
                    purchase_price: initialRef.current.value,
                    // price: "76",
                    discount_in_percent: "0",
                    // discount_in_rs: "2",
                    // sale_price: "74",
                    // product_size: "100",
                    // product_unit: "g",
                    stock_quantity: "100",
                    stok_warehouse_qty: "0",
                    stock_alert_quantity: "0",
                    warehouse_stock_alert_quantity: "0",
                    max: "10",
                    product_bar_code: "8900000000000",
                    deceptions: "Extra",
                    hsn_code: "00000",
                    i_gst: "0",
                    c_gst: "0",
                    s_gst: "0",
                    expeiry_date: null,
                    margin_in_rs: "0",
                    status: "1",
                    add_date: "09-09-2023",
                    update_date: "10-10-2023",
                    priority: "10",
                    product_name_search: "Extra",
                    // billing_quantity: 1,
                    // amount_total: "74",
                  },
                  ...addedItems,
                ]);
                onClose();
              }}
            >
              <FormControl>
                <Input py={5} ref={initialRef} placeholder="Enter Price" />
                <FormLabel fontSize={12} mt={1} textAlign={"center"}>
                  Price
                </FormLabel>
              </FormControl>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <div id="section-to-print" ref={componentRef}>
        <div className="POS_header px-1">
          {/* <div className=" d-flex justify-content-center">
                        <img src={Store_bussiness_info?.logo} alt="user-img" className="prinerLogo rounded-circle" />
                    </div> */}

          <div className="col-auto ">
            <Text fontWeight={"700"} fontSize={24} mb={0}>
              {Store_bussiness_info?.buss_name}
            </Text>
            {/* <p className="text-dark-75">{Store_bussiness_info?.tag_line}</p> */}

            <h6
              style={{
                fontSize: 10,
                fontWeight: "800",
                textAlign: "center",
                marginBottom: 1,
              }}
            >
              {Store_bussiness_info?.strteet_linn2} {Store_bussiness_info?.area}
            </h6>
            <h6
              style={{ fontSize: 10, fontWeight: "800", textAlign: "center" }}
            >
              {Store_bussiness_info?.mobile1} {Store_bussiness_info?.mobile2}{" "}
            </h6>
          </div>
        </div>
        <div class="bill-details">
          {/* {Store_bussiness_info?.gst_no != null ? (
                            <tr><td className='text-center'>
                                GST No : <span > {Store_bussiness_info?.gst_no}</span>
                            </td></tr>
                        ) : null}
                        {Store_bussiness_info?.fassai_no != null ? (
                            <tr><td className='text-center'>
                                Fassai No : <span> {Store_bussiness_info?.fassai_no}</span>
                            </td></tr>
                        ) : null} */}
          <Box textAlign={"center"} fontSize={12}>
            <Text mb={0}>
              {BillDate.toLocaleDateString("en-US", DateOptions)} ,{" "}
              {formatAMPM(BillDate)}
            </Text>

            <Text>
              Mo{" "}
              {selectedCustomer?.mobile
                ? selectedCustomer?.mobile
                : "----------"}
            </Text>
            <Text>
              Name{" "}
              {selectedCustomer?.name ? selectedCustomer?.name : "----------"}
            </Text>
          </Box>
          {/* <tr>
                            <td className='text-center'>Bill No : <span>{restInfo.order_no}</span></td>
                        </tr> */}
        </div>

        <table class="items ml-1">
          <thead>
            <tr>
              <th colSpan={2} class="">
                Item
              </th>
              <th class="">Size</th>
              <th class="">Q</th>
              <th class="">MRP</th>
              <th class="">RATE</th>
              <th class="">AMT</th>
            </tr>
          </thead>

          <tbody>
            {addedItems?.map((items, index) => {
              return (
                <tr class="sum-up line">
                  <td colSpan={2}>{items?.product_name?.substring(0, 21)}</td>
                  <td>
                    {items.product_size} {items.product_unit}
                  </td>
                  <td>{items.billing_quantity}</td>
                  <td>{items.price}</td>
                  <td class="price">{items.sale_price}</td>
                  <td class="price">{items.amount_total}</td>
                </tr>
              );
            })}

            <tr>
              <td colspan="6" class="sum-up line">
                Sub Total
              </td>
              <td class="line price">
                {allTotals?.subTotal.toLocaleString("en-IN")}
              </td>
            </tr>
            <tr>
              <td colspan="6" class="sum-up line">
                Discount
              </td>
              <td class="line price">
                - {(allTotals?.discount).toLocaleString("en-IN")}
              </td>
            </tr>

            {/* <tr>
                            <td colspan="3" class="sum-up ">Subtotal</td>
                            <td class=" price">{allTotals?.subTotal?.toLocaleString('en-IN')}</td>
                        </tr> */}
            {/* <tr>
                            <td colspan="3" class="sum-up">GST</td>
                            <td class="price">{(allTotals?.sGstTotal + allTotals?.cGstTotal).toLocaleString('en-IN')}</td>
                        </tr> */}

            {useCouponData.is_coupon_applied == 1 ? (
              <tr>
                <td colspan="6" class="sum-up">
                  Extra Discount
                </td>
                <td class="price">
                  {(allTotals?.coupon_discount_value).toLocaleString("en-IN")}
                </td>
              </tr>
            ) : null}

            <tr>
              <th colspan="6" class="total text">
                Total
              </th>
              <th class="total price">
                {allTotals?.grandTotal.toLocaleString("en-IN")}
              </th>
            </tr>
          </tbody>
        </table>
        <section>
          <p>
            Paid by : <span>{restInfo.payment_mode}</span>
          </p>
          <p style={{ textAlign: "center" }}>
            Thank you for shopping with {Store_bussiness_info?.buss_name}
          </p>
        </section>
        {/* <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={URLDomain + '/online-bill/' + restInfo?.order_no}
                        viewBox={`0 0 256 256`}
                    />
                </div>
                <div className='POS_footer' style={{ textAlign: "center" }}>
                    <p>Scan QR Code </p>
                </div> */}
      </div>
    </>
  );
};

//
