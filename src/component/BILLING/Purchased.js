import { BiRupee, BiBarcodeReader } from "react-icons/bi";
import { FcCalendar } from "react-icons/fc";
import { AiOutlineDelete } from "react-icons/ai";
import { useContext, useEffect, useRef, useState } from "react";
import ContextData from "../../context/MainContext";
import Multiselect from "multiselect-react-dropdown";
import DatePicker from "react-datepicker";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import useScanDetection from "use-scan-detection";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Text,
  useBoolean,
  useToast,
  Stack,
  Skeleton,
} from "@chakra-ui/react";

import { useQuery } from "react-query";

import "react-datepicker/dist/react-datepicker.css";
import URLDomain from "../../URL";

import Cookies from "universal-cookie";
const cookies = new Cookies();

export const Purchased = () => {
  const getAllVendorsRef = useRef(null);
  const navigate = useNavigate();
  const {
    store_vendor_list,
    storeProductsData,
    store_login_user,
    storeVendorRelode,
  } = useContext(ContextData);
  const [vendorLists, setVendorLists] = useState([]);
  const [PurchaseDate, setPurchaseDate] = useState(new Date());
  const [selectedVendor, setSelectedVendor] = useState();
  const [isLoading, setLoading] = useBoolean();
  const [isDataLoding, setisDataLoding] = useState(true);
  const [searchProduct, setsearchProduct] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [allTotals, setAllTotals] = useState({
    subTotal: 0,
    sGstTotal: 0,
    cGstTotal: 0,
    grandTotal: 0,
    discount: 0,
    additional_charges: 0,
    amount_paid: 0,
    outstanding: 0,
    round_off: false,
    round_off_value: 0,
    fully_paid: false,
  });

  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");

  const [restInfo, setRestInfo] = useState({
    sales_man: "NA",
    payment_mode: "Cash",
    notes: "",
    stock_location: "Store",
  });
  const toast = useToast();

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
  });

  useEffect(() => {
    setsearchProduct(storeProductsData);
    console.log("search product", PURCHASEDATA, isLoadingAPI);
    if (PURCHASEDATA) {
      setsearchProduct(PURCHASEDATA.searchProduct);
      setVendorLists(PURCHASEDATA.vendorLists);
      setisDataLoding(false);
    }
  }, [PURCHASEDATA, isLoadingAPI]);

  useScanDetection({
    onComplete: (code) => {
      const prod = searchProduct?.find((o) => o.product_bar_code == code);
      const allReadyExist = addedItems.some(
        (elem) => elem.product_bar_code === code
      );
      prod["mrp"] = prod.price;
      prod["c_gst"] = 0;
      prod["s_gst"] = 0;
      prod["discount_in_percent"] = 0;
      prod["discount_in_rs"] = 0;
      prod["purchase_price"] = 0;
      !allReadyExist && setAddedItems([...addedItems, prod]);
    },
  });

  useEffect(() => {
    const subTotalGet = addedItems.reduce((acc, obj) => {
      return acc + Number(Number(obj?.amount_total || 0));
    }, 0);

    const grandTotal = addedItems.reduce((acc, obj) => {
      return acc + Number(Number(obj?.net_amount || 0));
    }, 0);

    const discount = addedItems.reduce((acc, obj) => {
      const initialPurchasePrice =
        Number(obj?.rate) +
        Number((Number(obj?.s_gst) / 100) * 2 * Number(obj?.rate));

      const discountedRupee =
        (initialPurchasePrice * Number(obj?.discount_in_percent)) / 100;
      return (
        acc +
        Number(Number(discountedRupee) * Number(obj?.billing_quantity || 0))
      );
    }, 0);

    const sGstTotal = addedItems.reduce((acc, obj) => {
      return (
        acc +
        (Number(obj?.s_gst || 0) / 100) *
          Number(obj?.rate || 0) *
          Number(obj?.billing_quantity || 0)
      );
    }, 0);
    const subTotal = subTotalGet;
    // const grandTotal = subTotal;
    setAllTotals({
      ...allTotals,
      discount,
      subTotal,
      sGstTotal,
      cGstTotal: sGstTotal,
      grandTotal,
    });
  }, [addedItems]);

  // useEffect(() => {
  //   const { subTotal, sGstTotal, cGstTotal, discount, additional_charges } =
  //     allTotals;
  //   const Total =
  //     subTotal + sGstTotal + cGstTotal + Number(additional_charges || 0);
  //   const discountedPrice = Number(Total || 0) - Number(discount || 0);
  //   setAllTotals({
  //     ...allTotals,
  //     grandTotal: discountedPrice,
  //   });
  //   console.log("hey there 2 ----->", discount);
  // }, [allTotals.discount]);

  useEffect(() => {
    console.log("additional chanregs useeffct");
    const { subTotal, sGstTotal, cGstTotal, discount, additional_charges } =
      allTotals;
    const Total = subTotal + sGstTotal + cGstTotal - Number(discount || 0);
    const AdditionalChargesTotal =
      Number(Total || 0) + Number(additional_charges || 0);
    setAllTotals({
      ...allTotals,
      grandTotal: AdditionalChargesTotal,
    });
  }, [allTotals.additional_charges]);

  useEffect(() => {
    console.log("amount paid useeffct");
    const { grandTotal, amount_paid } = allTotals;
    const Total = Number(grandTotal || 0);
    const outstanding = Total - Number(amount_paid || 0);
    setAllTotals({
      ...allTotals,
      outstanding: outstanding,
    });
  }, [allTotals.amount_paid]);

  useEffect(() => {
    console.log("fully payment useeffct");
    const { fully_paid } = allTotals;
    console.log(" is working ---??", fully_paid);
    fully_paid &&
      setAllTotals({
        ...allTotals,
        outstanding: 0,
      });
  }, [allTotals.fully_paid]);

  const handleOnSelect = (item) => {
    console.log("lolipop ---->", item);
    const allReadyExist = addedItems.some((elem) => {
      return elem.id === item.id;
    });
    item["mrp"] = item.price;
    item["c_gst"] = 0;
    item["s_gst"] = 0;
    item["discount_in_percent"] = 0;
    item["discount_in_rs"] = 0;
    item["purchase_price"] = 0;
    !allReadyExist && setAddedItems([...addedItems, item]);
    /*  setTimeout(() => {
             document.getElementsByClassName("clear-icon")[0].querySelector(':scope > svg')[0].click();
         }, 1000) */ //1 second delay
  };

  const calRowTotals = ({ index, newArr }) => {
    const discount = newArr[index].discount_in_percent | 0;
    const initialPurchasePrice =
      Number(newArr[index].rate) +
      Number(
        (Number(newArr[index].s_gst) / 100) * 2 * Number(newArr[index].rate)
      );

    const discountedRupee = (initialPurchasePrice * Number(discount)) / 100;

    const purchasePrice = initialPurchasePrice - discountedRupee;

    newArr[index].purchase_price = purchasePrice;

    newArr[index].net_amount =
      Number(purchasePrice) * Number(newArr[index].billing_quantity);

    console.log(
      "hey there ---->",
      Number(newArr[index].purchase_price),
      discount,
      purchasePrice
    );

    // newArr = newArr.filter((item) => item);
    setAddedItems(newArr);
  };

  const updateFieldChanged = (index) => (e) => {
    // console.log('index: ' + index);
    // console.log('property name: ' + e.target.name);
    let newArr = [...addedItems];
    e.target.name === "quantity" &&
      (newArr[index].billing_quantity = e.target.value);
    e.target.name === "purchase_price" &&
      (newArr[index].purchase_price = e.target.value);
    e.target.name === "rate" && (newArr[index].rate = e.target.value);
    e.target.name === "rate" && (newArr[index].purchase_price = e.target.value);

    newArr[index].amount_total =
      Number(newArr[index].billing_quantity) * Number(newArr[index].rate);

    const sGst =
      Number(newArr[index].purchase_price) *
      Number(Number(newArr[index].s_gst) / 100);

    const val = Number(newArr[index].billing_quantity) * (sGst * 2);

    newArr[index].net_amount = newArr[index].amount_total + val;

    if (e.target.name === "discount") {
      newArr[index].discount_in_percent = e.target.value;
    }

    calRowTotals({ index, newArr });

    // console.log("new arrya --->", newArr);
    // newArr = newArr.filter((item) => item);
    // setAddedItems(newArr);
  };

  const changeGst = (index) => (e) => {
    let newArr = [...addedItems];

    if (e.target.name === "s_gst") {
      newArr[index].s_gst = e.target.value;
      newArr[index].c_gst = e.target.value;

      // const sGst =
      //   Number(newArr[index].purchase_price) *
      //   Number(Number(e.target.value) / 100);

      // const val =  * (sGst * 2);
    }

    e.target.name === "hsnCode" && (newArr[index].hsn_code = e.target.value);
    if (e.target.name === "mrp") {
      newArr[index].mrp = e.target.value;
      console.log("jaanu mai ya naa----->", newArr);
    }

    calRowTotals({ index, newArr });
    // newArr[index].amount_total = Number(newArr[index].billing_quantity) * Number(newArr[index].purchase_price);
    console.log("new arrya --->", newArr);
  };

  const deleteFeild = (index) => {
    let newArr = [...addedItems];
    delete newArr[index];
    newArr = newArr.filter((item) => item);
    setAddedItems(newArr);
  };

  const submitPurchase = () => {
    if (selectedVendor) {
      const data = JSON.stringify({
        store_id: adminStoreId,
        vendor_id: selectedVendor.id,
        vendor_firm_name: selectedVendor.firm_name,
        vendor_mobile: selectedVendor.mobile,
        sale_man_name: restInfo.sales_man,
        user_id: adminId,
        sub_total: allTotals.subTotal,
        i_gst: Number(allTotals.sGstTotal) + Number(allTotals.cGstTotal),
        s_gst: Number(allTotals.sGstTotal),
        c_gst: Number(allTotals.cGstTotal),
        extra_charge: allTotals.additional_charges,
        discount: allTotals.discount,
        notes: restInfo.notes,
        total_payment: allTotals.grandTotal,
        amount_paid: allTotals.amount_paid,
        outstanding: allTotals.outstanding,
        stock_location: restInfo.stock_location,
        payment_mode: restInfo.payment_mode,
        purchaes_date: PurchaseDate.toLocaleDateString(),
        product_list: addedItems,
      });

      console.log(" all data from data ---->", allTotals);
      console.log(" all data from data ---->", JSON.parse(data));

      if (addedItems.length) {
        setLoading.on();
        fetch(URLDomain + "/APP-API/Billing/purchaseStoreProducts", {
          method: "POST",
          header: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: data,
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(" purchase server res ---->", responseJson);
            if (responseJson.purchase_insert) {
              storeVendorRelode();
              setAddedItems([]);
              toast({
                title: "Purchase Inserted",
                // description: "We've created your account for you.",
                status: "success",
                duration: 4000,
                isClosable: true,
              });
            } else {
              toast({
                title: "Purchase Not Inserted",
                // description: "We've created your account for you.",
                status: "error",
                duration: 4000,
                isClosable: true,
              });
            }
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setLoading.off();
            navigate("/purchaseManagement/purchase-history");
          });
      } else {
        setLoading.off();
        toast({
          title: "Please add products",
          // description: "We've created your account for you.",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Please select the vendor..!!",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0">Purchase</h4>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              {isDataLoding ? (
                <Stack>
                  <Skeleton height="150px" />
                  <Skeleton height="150px" />
                  <Skeleton height="150px" />
                </Stack>
              ) : (
                <div className="live-preview">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row py-4 mb-4 border-bottom align-items-center">
                        <div
                          className="col-lg-8 px-4"
                          style={{ borderRight: "1px solid #c1c1c1" }}
                        >
                          <div className="row">
                            <div
                              className="col-md-7 px-5"
                              style={{
                                borderRight: "1px solid #c1c1c1",
                                zIndex: 999999,
                              }}
                            >
                              <h4 className="mb-0 text-center mb-4">
                                Choose vendor
                              </h4>
                              <Multiselect
                                // singleSelect={true}
                                selectionLimit={1}
                                displayValue="firm_name"
                                onKeyPressFn={function noRefCheck() {}}
                                onSearch={function noRefCheck() {}}
                                onRemove={(e) => {
                                  setSelectedVendor(e[0]);
                                }}
                                onSelect={(e) => {
                                  setSelectedVendor(e[0]);
                                }}
                                options={vendorLists}
                                ref={getAllVendorsRef}
                              />
                            </div>
                            {selectedVendor?.name ? (
                              <div className="col-md-5">
                                <div className="px-5 border-left">
                                  <h6 className="">
                                    Contact Name:{" "}
                                    <strong>{selectedVendor?.name}</strong>
                                  </h6>
                                  <h6 className="">
                                    Mobile:{" "}
                                    <strong>{selectedVendor?.mobile}</strong>
                                  </h6>
                                  <h6 className="">
                                    Address:{" "}
                                    <strong>{selectedVendor?.address}</strong>
                                  </h6>
                                  <h6 className="mb-0">
                                    Firm Name:{" "}
                                    <strong>{selectedVendor?.firm_name}</strong>
                                  </h6>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-lg-4 px-4">
                          {/* <h4 className="mb-0 text-center mb-4"> */}
                          <Flex
                            justifyContent={"center"}
                            alignItems={"center"}
                            mb={3}
                            gap={3}
                            fontSize={16}
                          >
                            Purchased Date <FcCalendar />
                          </Flex>
                          {/* </h4> */}
                          <DatePicker
                            selected={PurchaseDate}
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) =>
                              setPurchaseDate(Date.parse(date))
                            }
                            className="form-control bg-light border-light custom_date_input"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 pb-4 border-bottom">
                      <div className="row g-3">
                        <div className="col-md-12 col-sm-12">
                          <div className="d-flex align-items-center">
                            {/* <input id="search-dropdown" type="text" className="form-control search bg-light border-light" placeholder="Add product..." /> */}
                            <div style={{ width: "68%" }}>
                              <ReactSearchAutocomplete
                                items={searchProduct}
                                className="form-control search bg-light border-light"
                                onSelect={handleOnSelect}
                                autoFocus
                                styling={{
                                  zIndex: "9999",
                                }}
                                fuseOptions={{
                                  keys: [
                                    "product_name",
                                    "product_bar_code",
                                    "product_full_name",
                                    "hsn_code",
                                  ],
                                }}
                                resultStringKeyName="product_name_search"
                                // formatResult={formatResult}
                              />
                            </div>
                            {/* <i className="ri-search-line search-icon" /> */}
                            {/* <h2 className="mb-0" style={{ marginLeft: "1rem" }}> */}
                            <Box ml={4}>
                              <BiBarcodeReader size={26} />
                            </Box>
                            {/* </h2> */}
                          </div>

                          <div
                            className="dropdown-menu dropdown-menu-lg"
                            id="search-dropdown"
                          ></div>
                        </div>
                        {/*end col*/}
                        <div className="offset-md-4 col-md-3 col-sm-4 d-flex justify-content-end"></div>
                        {/*end col*/}
                      </div>
                    </div>
                    <div className="col-xl-12">
                      <div className="table-responsive mt-4 mt-xl-0">
                        <table className="table table-active table-hover table-striped align-middle table-nowrap mb-0">
                          <thead>
                            <tr>
                              <th scope="col">NO</th>
                              <th scope="col">ITEMS</th>
                              <th scope="col">HSN</th>
                              <th scope="col">MRP</th>
                              <th scope="col">QTY</th>
                              <Box
                                as="th"
                                display={"flex"}
                                alignItems={"center"}
                                scope="col"
                              >
                                {/* <BiRupee /> */}
                                RATE
                              </Box>
                              <th scope="col">SGST%</th>
                              <th scope="col">CGST%</th>
                              <th scope="col">DISC%</th>
                              <th scope="col">PRICE</th>
                              <th scope="col">AMOUNT</th>
                              <th scope="col">NET AMT</th>
                              <th scope="col"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {addedItems.length && addedItems ? (
                              addedItems.map((items, index) => {
                                return (
                                  <>
                                    {items && (
                                      <tr key={`purchaseList-${index}`}>
                                        <td width={"4%"} className="fw-medium">
                                          {index + 1}
                                        </td>
                                        <td
                                          style={{
                                            maxWidth: "16rem",
                                            overflow: "hidden",
                                          }}
                                        >
                                          <Text>{items.product_full_name}</Text>
                                        </td>
                                        <td width={"8%"}>
                                          <input
                                            type="text"
                                            onChange={changeGst(index)}
                                            name="hsnCode"
                                            value={items.hsn_code}
                                            className="invoice_input"
                                            style={{ width: "100%" }}
                                            placeholder="0"
                                          />
                                        </td>
                                        <td width={"7%"}>
                                          <input
                                            type="text"
                                            onChange={changeGst(index)}
                                            name="mrp"
                                            value={items.mrp}
                                            className="invoice_input"
                                            style={{ width: "100%" }}
                                            placeholder="0"
                                          />
                                        </td>
                                        <td width={"7%"}>
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
                                            style={{ width: "100%" }}
                                            placeholder="0"
                                          />
                                        </td>
                                        <td width={"7%"}>
                                          <input
                                            type="number"
                                            name="rate"
                                            value={items.rate ? items.rate : ""}
                                            onChange={updateFieldChanged(index)}
                                            className="invoice_input"
                                            style={{ width: "100%" }}
                                            placeholder="0"
                                          />
                                        </td>

                                        <td width={"5%"}>
                                          <input
                                            type="number"
                                            onChange={changeGst(index)}
                                            name="s_gst"
                                            value={items.s_gst}
                                            className="invoice_input"
                                            style={{ width: "100%" }}
                                            placeholder="0"
                                          />
                                        </td>
                                        <td width={"5%"}>
                                          <input
                                            type="number"
                                            onChange={changeGst(index)}
                                            name="s_gst"
                                            readOnly
                                            value={items.s_gst}
                                            className="invoice_input"
                                            style={{ width: "100%" }}
                                            placeholder="0"
                                          />
                                        </td>
                                        <td width={"6%"}>
                                          <input
                                            type="number"
                                            name="discount"
                                            onChange={updateFieldChanged(index)}
                                            value={items.discount_in_percent}
                                            // defaultValue={"0"}
                                            className="invoice_input"
                                            style={{ width: "100%" }}
                                            placeholder="0"
                                          />
                                        </td>
                                        <td width={"7%"}>
                                          <input
                                            type="number"
                                            onChange={changeGst(index)}
                                            name="purchase_price"
                                            value={items.purchase_price}
                                            disabled
                                            className="invoice_input"
                                            style={{ width: "100%" }}
                                            placeholder="0"
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            value={
                                              items.amount_total
                                                ? items.amount_total.toLocaleString(
                                                    "en-IN"
                                                  )
                                                : ""
                                            }
                                            readOnly
                                            className="invoice_input"
                                            style={{ width: "100%" }}
                                            placeholder="0"
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            value={
                                              items.net_amount
                                                ? items.net_amount.toLocaleString(
                                                    "en-IN"
                                                  )
                                                : ""
                                            }
                                            readOnly
                                            className="invoice_input"
                                            style={{ width: "100%" }}
                                            placeholder="0"
                                          />
                                        </td>
                                        <td>
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
                          <div className="d-flex py-3 px-5 justify-content-between align-items-center">
                            <h5
                              style={{
                                fontSize: 14,
                                margin: 0,
                                fontWeight: "600",
                                color: "black",
                              }}
                            >
                              Payment Mode
                            </h5>
                            <select
                              class="form-select mb-0 w-50"
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
                              <option value="Cheque">Cheque</option>
                            </select>
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
                              Sales Man
                            </h5>
                            <h5
                              style={{
                                fontSize: 14,
                                margin: 0,
                                fontWeight: "600",
                                color: "black",
                              }}
                            >
                              <input
                                type="text"
                                onChange={(e) =>
                                  setRestInfo({
                                    ...restInfo,
                                    sales_man: e.target.value,
                                  })
                                }
                                className="invoice_input p-2 px-3"
                                style={{ width: "14rem" }}
                                placeholder="Enter name here"
                              />
                            </h5>
                          </div>
                          <div className="py-3 px-5">
                            <h5
                              style={{
                                fontSize: 14,
                                marginBottom: 8,
                                fontWeight: "500",
                                color: "black",
                              }}
                            >
                              Notes
                            </h5>
                            <textarea
                              onChange={(e) =>
                                setRestInfo({
                                  ...restInfo,
                                  notes: e.target.value,
                                })
                              }
                              className="invoice_input"
                              style={{ width: "100%" }}
                              rows={2}
                              placeholder="Enter your notes..!!"
                            />
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
                              Send Stocks Location
                            </h5>
                            <select
                              class="form-select mb-0 w-50"
                              onChange={(e) =>
                                setRestInfo({
                                  ...restInfo,
                                  stock_location: e.target.value,
                                })
                              }
                              aria-label="Default select example"
                            >
                              <option value="Store">Store</option>
                              <option value="Warehouse">Warehouse</option>
                            </select>
                          </div>

                          <div className="py-3 px-5 mt-5">
                            <Button
                              // type="button"
                              isLoading={isLoading}
                              onClick={submitPurchase}
                              fontSize={14}
                              colorScheme="teal"
                              width={"100%"}
                              // class="btn btn-success waves-effect waves-light w-100 "
                            >
                              Submit
                            </Button>
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
                              {allTotals.subTotal.toLocaleString("en-IN")}
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
                              Discount
                            </h5>
                            <Flex
                              fontWeight={"600"}
                              fontSize={14}
                              alignItems={"center"}
                            >
                              -<BiRupee />
                              <input
                                type="number"
                                onChange={(e) =>
                                  setAllTotals({
                                    ...allTotals,
                                    discount: e.target.value,
                                  })
                                }
                                className="invoice_input"
                                style={{ width: "5rem" }}
                                placeholder="0"
                              />
                            </Flex>
                          </div>
                          <div className="d-flex py-3 px-5 justify-content-between align-items-center  border-bottom">
                            <h5
                              style={{
                                fontSize: 14,
                                margin: 0,
                                fontWeight: "600",
                                color: "black",
                              }}
                            >
                              Additional Charges
                            </h5>
                            <Flex
                              fontWeight={"600"}
                              fontSize={14}
                              alignItems={"center"}
                            >
                              +<BiRupee />
                              <input
                                type="number"
                                onChange={(e) =>
                                  setAllTotals({
                                    ...allTotals,
                                    additional_charges: e.target.value,
                                  })
                                }
                                className="invoice_input"
                                style={{ width: "5rem" }}
                                placeholder="0"
                              />
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
                              +<BiRupee />{" "}
                              {allTotals.sGstTotal.toLocaleString("en-IN")}
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
                              +<BiRupee />{" "}
                              {allTotals.cGstTotal.toLocaleString("en-IN")}
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
                              {allTotals.discount.toLocaleString("en-IN")}
                            </Flex>
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
                              Total Amount
                            </h5>
                            <Flex
                              fontWeight={"600"}
                              fontSize={14}
                              alignItems={"center"}
                            >
                              <BiRupee />{" "}
                              {allTotals.grandTotal.toLocaleString("en-IN")}
                            </Flex>
                          </div>

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

                          <div className="d-flex pt-3 px-5 justify-content-between align-items-center">
                            <h5
                              style={{
                                fontSize: 14,
                                margin: 0,
                                fontWeight: "700",
                                color: "black",
                              }}
                            ></h5>
                            {/* <h5 style={{ fontSize: 14, margin: 0, fontWeight: "600", color: "black" }}>{allTotals.grandTotal.toLocaleString('en-IN')}</h5> */}
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
                                disabled={allTotals.fully_paid}
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
                              {allTotals.outstanding
                                ? allTotals.outstanding.toLocaleString("en-IN")
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
              )}
            </div>
            {/* end card-body */}
          </div>
          {/* end card */}
        </div>
        {/* end col */}
      </div>
    </>
  );
};
