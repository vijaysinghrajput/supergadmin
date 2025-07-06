import React, { useContext, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { BiRupee, BiBarcodeReader } from "react-icons/bi";
import { FcCalendar } from "react-icons/fc";
import { AiOutlineDelete } from "react-icons/ai";
import ContextData from "../../context/MainContext";
import Multiselect from "multiselect-react-dropdown";
import DatePicker from "react-datepicker";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import useScanDetection from "use-scan-detection";
import { Box, Checkbox, Flex, useToast } from "@chakra-ui/react";

import "react-datepicker/dist/react-datepicker.css";
import URLDomain from "../../URL";

export const Purchased = React.memo(() => {
  const getAllVendorsRef = useRef(null);
  const { store_vendor_list, storeProductsData, store_login_user, reloadData } =
    useContext(ContextData);
  const [vendorLists, setVendorLists] = useState([]);
  const [PurchaseDate, setPurchaseDate] = useState(new Date());
  const [selectedVendor, setSelectedVendor] = useState({});
  const [allProducts, setAllProducts] = useState([]);
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
  const [restInfo, setRestInfo] = useState({
    sales_man: "",
    payment_mode: "Cash",
    notes: "",
    stock_location: "Warehouse",
  });
  const toast = useToast();

  useEffect(() => {
    setAllProducts(storeProductsData);
    console.log("store prod", store_login_user);
  }, [storeProductsData]);

  useScanDetection({
    onComplete: (code) => {
      const prod = allProducts?.find((o) => o.product_bar_code == code);
      const allReadyExist = addedItems.some(
        (elem) => elem.product_bar_code === code
      );
      !allReadyExist && setAddedItems([...addedItems, prod]);
    },
  });

  useEffect(() => {
    setVendorLists(store_vendor_list);
  }, [store_vendor_list]);

  // Optimized calculation using useMemo to prevent unnecessary recalculations
  const calculatedTotals = useMemo(() => {
    if (!addedItems.length) {
      return {
        subTotal: 0,
        sGstTotal: 0,
        cGstTotal: 0,
        discount: 0,
        grandTotal: 0
      };
    }

    // Single pass through addedItems for all calculations
    const totals = addedItems.reduce((acc, obj) => {
      const quantity = Number(obj?.billing_quantity || 0);
      const price = Number(obj?.purchase_price || 0);
      const discountPerItem = Number(obj?.discount_in_rs || 0);
      const sGst = Number(obj?.s_gst || 0);
      const cGst = Number(obj?.c_gst || 0);

      return {
        subTotalGet: acc.subTotalGet + (price * quantity),
        discount: acc.discount + (discountPerItem * quantity),
        sGstTotal: acc.sGstTotal + (sGst * quantity),
        cGstTotal: acc.cGstTotal + (cGst * quantity)
      };
    }, { subTotalGet: 0, discount: 0, sGstTotal: 0, cGstTotal: 0 });

    const subTotal = totals.subTotalGet - (totals.sGstTotal + totals.cGstTotal);
    const grandTotal = subTotal + totals.sGstTotal + totals.cGstTotal;

    return {
      subTotal,
      sGstTotal: totals.sGstTotal,
      cGstTotal: totals.cGstTotal,
      discount: totals.discount,
      grandTotal
    };
  }, [addedItems]);

  // Update allTotals when calculated values change
  useEffect(() => {
    setAllTotals(prev => ({
      ...prev,
      ...calculatedTotals
    }));
  }, [calculatedTotals]);

  // Optimized final calculations using useMemo
  const finalTotals = useMemo(() => {
    const { subTotal, sGstTotal, cGstTotal, discount, additional_charges, amount_paid, fully_paid } = allTotals;
    
    // Calculate grand total with discount and additional charges
    const baseTotal = subTotal + sGstTotal + cGstTotal;
    const totalWithCharges = baseTotal + Number(additional_charges || 0);
    const grandTotal = totalWithCharges - Number(discount || 0);
    
    // Calculate outstanding amount
    const outstanding = fully_paid ? 0 : grandTotal - Number(amount_paid || 0);
    
    return {
      grandTotal,
      outstanding
    };
  }, [allTotals.subTotal, allTotals.sGstTotal, allTotals.cGstTotal, allTotals.discount, allTotals.additional_charges, allTotals.amount_paid, allTotals.fully_paid]);

  // Update final totals when they change
  useEffect(() => {
    setAllTotals(prev => ({
      ...prev,
      ...finalTotals
    }));
  }, [finalTotals]);

  const handleOnSelect = useCallback((item) => {
    const allReadyExist = addedItems.some(
      (elem) => elem.product_full_name === item.product_full_name
    );
    if (!allReadyExist) {
      setAddedItems(prev => [...prev, item]);
    }
  }, [addedItems]);

  const updateFieldChanged = useCallback((index) => (e) => {
    const { name, value } = e.target;
    
    setAddedItems(prev => {
      const newArr = [...prev];
      const item = { ...newArr[index] };
      
      switch (name) {
        case "quantity":
          item.billing_quantity = value;
          break;
        case "purchase_price":
          item.purchase_price = value;
          break;
        case "discount":
          item.discount_in_rs = value;
          break;
      }
      
      // Recalculate amount_total
      item.amount_total =
        Number(item.billing_quantity || 0) *
        Number(item.purchase_price || 0) -
        Number(item.billing_quantity || 0) *
        Number(item.discount_in_rs || 0);
      
      newArr[index] = item;
      return newArr.filter(Boolean);
    });
  }, []);

  const changeGst = useCallback((index) => (e) => {
    const { name, value } = e.target;
    
    setAddedItems(prev => {
      const newArr = [...prev];
      const item = { ...newArr[index] };
      
      switch (name) {
        case "s_gst":
          item.s_gst = value;
          item.c_gst = value; // Both s_gst and c_gst are set to same value
          break;
        case "hsnCode":
          item.hsn_code = value;
          break;
        case "mrp":
          item.mrp = value;
          break;
      }
      
      newArr[index] = item;
      return newArr.filter(Boolean);
    });
  }, []);

  const deleteFeild = useCallback((index) => {
    setAddedItems(prev => {
      const newArr = [...prev];
      newArr.splice(index, 1);
      return newArr;
    });
  }, []);

  const submitPurchase = useCallback(async (adminId) => {
    if (!addedItems.length) {
      toast({
        title: "Please add products",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const requestData = {
      store_id: store_login_user.store_id,
      vendor_id: selectedVendor.id,
      vendor_firm_name: selectedVendor.firm_name,
      sale_man_name: restInfo.sales_man,
      user_id: store_login_user.id,
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
    };

    try {
      const response = await fetch(URLDomain + "/APP-API/Billing/purchaseStoreProducts", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseJson = await response.json();
      
      if (responseJson.purchase_insert) {
        reloadData();
        setAddedItems([]);
        toast({
          title: "Purchase Inserted Successfully",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Purchase Not Inserted",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Purchase submission error:", error);
      toast({
        title: "Error submitting purchase",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }, [addedItems, selectedVendor, restInfo, allTotals, PurchaseDate, store_login_user, reloadData, toast]);

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
          <div className="card">
            <div className="card-header align-items-center d-flex px-5">
              <h4 className="card-title mb-0 flex-grow-1">Purchase</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
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
                          onChange={(date) => setPurchaseDate(Date.parse(date))}
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
                              items={allProducts}
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
                                ],
                              }}
                              resultStringKeyName="product_full_name"
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
                            <th scope="col">MRP</th>
                            <th scope="col">QTY</th>
                            <th scope="col">
                              <BiRupee />
                              PRICE
                            </th>
                            <th scope="col">DISCOUNT</th>
                            <th scope="col">HSN</th>
                            {/* <th scope="col">SGST</th> */}
                            {/* <th scope="col">CGST</th> */}
                            <th scope="col">AMOUNT</th>
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
                                      <td width={"10%"} className="fw-medium">
                                        {index + 1}
                                      </td>
                                      <td width={"40%"}>
                                        {items.product_full_name}
                                      </td>
                                      <td width={"10%"}>
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
                                          style={{ width: "100%" }}
                                          placeholder="0"
                                        />
                                      </td>
                                      <td width={"10%"}>
                                        <input
                                          type="number"
                                          name="purchase_price"
                                          value={items.purchase_price}
                                          onChange={updateFieldChanged(index)}
                                          className="invoice_input"
                                          style={{ width: "100%" }}
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
                                          style={{ width: "100%" }}
                                          placeholder="0"
                                        />
                                      </td>
                                      <td width={"10%"}>
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
                                      {/* <td width={"10%"} ><input type="number" onChange={changeGst(index)} name="s_gst" value={items.s_gst} className="invoice_input" style={{ width: "3rem" }} placeholder="0" /></td> */}
                                      {/* <td width={"10%"} ><input type="number" onChange={changeGst(index)} name="c_gst" value={items.s_gst} disabled className="invoice_input" style={{ width: "3rem" }} placeholder="0" /></td> */}
                                      <td width={"10%"}>
                                        <input
                                          type="number"
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
                            <option selected>Select your payment method</option>
                            <option value="Cash">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="Bank Transfer">Bank Transfer</option>
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
                            <option value="Warehouse">Warehouse</option>
                            <option value="Store">Store</option>
                          </select>
                        </div>

                        <div className="py-3 px-5 mt-5">
                          <button
                            type="button"
                            onClick={submitPurchase}
                            class="btn btn-success waves-effect waves-light w-100 "
                          >
                            Submit
                          </button>
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
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "600",
                              color: "black",
                            }}
                          >
                            <BiRupee />{" "}
                            {allTotals.subTotal.toLocaleString("en-IN")}
                          </h5>
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
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "600",
                              color: "black",
                            }}
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
                          </h5>
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
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "600",
                              color: "black",
                            }}
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
                          </h5>
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
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "600",
                              color: "black",
                            }}
                          >
                            +<BiRupee />{" "}
                            {allTotals.sGstTotal.toLocaleString("en-IN")}
                          </h5>
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
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "600",
                              color: "black",
                            }}
                          >
                            +<BiRupee />{" "}
                            {allTotals.cGstTotal.toLocaleString("en-IN")}
                          </h5>
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
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "600",
                              color: "black",
                            }}
                          >
                            <BiRupee />{" "}
                            {allTotals.grandTotal.toLocaleString("en-IN")}
                          </h5>
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
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "600",
                              color: "black",
                            }}
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
                          </h5>
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
                          <h5
                            style={{
                              fontSize: 14,
                              margin: 0,
                              fontWeight: "600",
                              color: "green",
                            }}
                          >
                            <BiRupee />{" "}
                            {allTotals.outstanding
                              ? allTotals.outstanding.toLocaleString("en-IN")
                              : 0}
                          </h5>
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
    </>
  );
});

Purchased.displayName = 'Purchased';
