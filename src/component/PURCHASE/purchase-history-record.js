import { BiRupee } from "react-icons/bi";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import ContextData from "../../context/MainContext";
import "react-datepicker/dist/react-datepicker.css";
import { Flex } from "@chakra-ui/react";

import { Stack, Skeleton } from "@chakra-ui/react";

import URLDomain from "../../URL";

import Cookies from "universal-cookie";
const cookies = new Cookies();

const PurchaseHistoryRecord = () => {
  const { orderID } = useParams();
  const { vendorID } = useParams();

  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");
  const [isDataLoding, setisDataLoding] = useState(true);

  const {
    store_vendor_list,
    store_vendor_purchase_record,
    store_vendor_purchase_record_products,
  } = useContext(ContextData);
  const [
    store_vendor_purchase_record_data,
    setstore_vendor_purchase_record_data,
  ] = useState([]);

  const [selectedVendor, setSelectedVendor] = useState({});
  const [addedItems, setAddedItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await fetch(URLDomain + "/APP-API/Billing/purchase_history_record", {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          store_id: adminStoreId,
          vender_id: vendorID,
          order_id: orderID,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setstore_vendor_purchase_record_data(
            responseJson.store_vendor_purchase_record[0]
          );
          setSelectedVendor(responseJson.vendordata[0]);
          setAddedItems(responseJson.store_vendor_purchase_record_products);

          setisDataLoding(false);
        });
    }
    fetchData();
  }, []);

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
          <div className="card" id="demo">
            <div className="card-body">
              {isDataLoding ? (
                <Stack>
                  <Skeleton height="100px" />
                  <Skeleton height="50px" />
                  <Skeleton height="100px" />
                  <Skeleton height="50px" />
                  <Skeleton height="100px" />
                </Stack>
              ) : (
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
                              Firm Name:{" "}
                              <strong>{selectedVendor?.firm_name}</strong>
                            </h6>
                            <h6 className="">
                              Firm Phone:{" "}
                              <strong>{selectedVendor?.phone}</strong>
                            </h6>
                            <h6 className="">
                              Address:{" "}
                              <strong>
                                {selectedVendor?.address} {selectedVendor?.city}{" "}
                                {selectedVendor?.pin_code}{" "}
                                {selectedVendor?.state}
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
                              Contact Name:{" "}
                              <strong>{selectedVendor?.name}</strong>
                            </h6>
                            <h6 className="">
                              Contact Mobile:{" "}
                              <strong>{selectedVendor?.mobile}</strong>
                            </h6>
                            <h6 className="">
                              Contact Roal:{" "}
                              <strong>{selectedVendor?.contact_roal}</strong>
                            </h6>
                          </div>
                        </div>

                        <div className="col-lg-4 col-print-4">
                          <div className="px-5 border-left">
                            <h6 className="">
                              Credit Amt :{" "}
                              <strong> {selectedVendor?.value_credit} </strong>
                            </h6>
                            <h6 className="">
                              Email:{" "}
                              <strong>{selectedVendor?.firm_email}</strong>
                            </h6>
                            <h6 className="">
                              GST: <strong>{selectedVendor?.gst_no}</strong>
                            </h6>
                            <h6 className="">
                              FSSAI: <strong>{selectedVendor?.fssai_no}</strong>
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-12">
                      <div className="table-responsive mt-4 mt-xl-0">
                        <table className="table table-active table-hover table-striped align-middle table-nowrap mb-0">
                          <thead>
                            <tr>
                              <th scope="col">NO</th>
                              <th scope="col">ITEMS</th>
                              <th scope="col">QTY</th>
                              <th scope="col">
                                <Flex alignItems={"center"}>
                                  <BiRupee />
                                  MRP
                                </Flex>
                              </th>
                              <th scope="col">
                                <Flex alignItems={"center"}>
                                  <BiRupee />
                                  Rate
                                </Flex>
                              </th>
                              <th scope="col">
                                <Flex alignItems={"center"}>
                                  <BiRupee />
                                  PRICE
                                </Flex>
                              </th>
                              <th scope="col">DIS %</th>

                              <th scope="col">SGST</th>
                              <th scope="col">CGST</th>
                              <th scope="col">AMT</th>
                              <th scope="col">NET AMT</th>
                            </tr>
                          </thead>
                          <tbody>
                            {addedItems.length && addedItems ? (
                              addedItems.map((items, index) => {
                                return (
                                  <>
                                    {items && (
                                      <tr>
                                        <td className="fw-medium">
                                          {index + 1}
                                        </td>
                                        <td
                                          style={{ whiteSpace: "break-spaces" }}
                                        >
                                          {items.product_full_name}
                                        </td>
                                        <td>
                                          <Flex
                                            fontWeight={"600"}
                                            fontSize={14}
                                            alignItems={"center"}
                                          >
                                            {items.quantity}
                                          </Flex>
                                        </td>
                                        <td>
                                          <Flex
                                            fontWeight={"600"}
                                            fontSize={14}
                                            alignItems={"center"}
                                          >
                                            ₹ {items.mrp}
                                          </Flex>
                                        </td>
                                        <td>
                                          <Flex
                                            fontWeight={"600"}
                                            fontSize={14}
                                            alignItems={"center"}
                                          >
                                            <BiRupee />{" "}
                                            {parseFloat(items.rate).toFixed(2)}
                                          </Flex>
                                        </td>
                                        <td>
                                          <Flex
                                            fontWeight={"600"}
                                            fontSize={14}
                                            alignItems={"center"}
                                          >
                                            <BiRupee />{" "}
                                            {parseFloat(items.price).toFixed(2)}
                                          </Flex>
                                        </td>
                                        <td>
                                          <Flex
                                            fontWeight={"600"}
                                            fontSize={14}
                                            alignItems={"center"}
                                          >
                                            {items.discount} %
                                          </Flex>
                                        </td>

                                        <td>
                                          <Flex
                                            fontWeight={"600"}
                                            fontSize={14}
                                            alignItems={"center"}
                                          >
                                            <BiRupee /> {items.s_gst}
                                          </Flex>
                                        </td>
                                        <td>
                                          <Flex
                                            fontWeight={"600"}
                                            fontSize={14}
                                            alignItems={"center"}
                                          >
                                            <BiRupee /> {items.c_gst}
                                          </Flex>
                                        </td>
                                        <td>
                                          <Flex
                                            fontWeight={"600"}
                                            fontSize={14}
                                            alignItems={"center"}
                                          >
                                            <BiRupee />{" "}
                                            {parseFloat(
                                              items.total_amount
                                            ).toFixed(2)}
                                          </Flex>
                                        </td>
                                        <td>
                                          <Flex
                                            fontWeight={"600"}
                                            fontSize={14}
                                            alignItems={"center"}
                                          >
                                            <BiRupee />{" "}
                                            {parseFloat(
                                              items.net_amount
                                            ).toFixed(2)}
                                          </Flex>
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
                    <div className="col-md-12 border-top border-bottom mt-5">
                      <div className="row">
                        <div className="col-md-6 col-print-6">
                          <div className="d-flex py-3 px-5 justify-content-between align-items-center">
                            <h5
                              style={{
                                fontSize: 14,
                                margin: 0,
                                fontWeight: "600",
                                color: "black",
                              }}
                            >
                              Order Number
                            </h5>
                            <h5
                              style={{
                                fontSize: 14,
                                margin: 0,
                                fontWeight: "600",
                                color: "black",
                              }}
                            >
                              {store_vendor_purchase_record_data.order_id}
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
                              Purchase Date
                            </h5>
                            <h5
                              style={{
                                fontSize: 14,
                                margin: 0,
                                fontWeight: "600",
                                color: "black",
                              }}
                            >
                              {store_vendor_purchase_record_data.purchaes_date}
                            </h5>
                          </div>
                          <div className="d-flex py-3 px-5 justify-content-between align-items-center ">
                            <h5
                              style={{
                                fontSize: 14,
                                margin: 0,
                                fontWeight: "600",
                                color: "black",
                              }}
                            >
                              Total Items
                            </h5>
                            <h5
                              style={{
                                fontSize: 14,
                                margin: 0,
                                fontWeight: "600",
                                color: "black",
                              }}
                            >
                              {store_vendor_purchase_record_data.no_of_items}{" "}
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
                              Billing Date
                            </h5>
                            <h5
                              style={{
                                fontSize: 14,
                                margin: 0,
                                fontWeight: "600",
                                color: "black",
                              }}
                            >
                              {store_vendor_purchase_record_data.date}{" "}
                              {store_vendor_purchase_record_data.time}
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
                              {store_vendor_purchase_record_data.payment_mode}
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
                              {store_vendor_purchase_record_data.sale_man_name}
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
                              Stock Location
                            </h5>
                            <h5
                              style={{
                                fontSize: 14,
                                margin: 0,
                                fontWeight: "600",
                                color: "black",
                              }}
                            >
                              {store_vendor_purchase_record_data.stock_location}
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
                              Notes
                            </h5>
                            <h5
                              style={{
                                fontSize: 14,
                                margin: 0,
                                fontWeight: "600",
                                color: "black",
                              }}
                            >
                              {store_vendor_purchase_record_data.notes}
                            </h5>
                          </div>
                        </div>
                        <div
                          className="col-md-6 col-print-6 px-0 py-3"
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
                              {store_vendor_purchase_record_data.sub_total}
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
                              {store_vendor_purchase_record_data.s_gst}
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
                              {store_vendor_purchase_record_data.c_gst}
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
                              Discount SCM
                            </h5>
                            <Flex
                              fontWeight={"600"}
                              fontSize={14}
                              alignItems={"center"}
                            >
                              -<BiRupee />
                              {store_vendor_purchase_record_data.discount}
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
                              Discount CD
                            </h5>
                            <Flex
                              fontWeight={"600"}
                              fontSize={14}
                              alignItems={"center"}
                            >
                              -<BiRupee />
                              {store_vendor_purchase_record_data.discount_cd}
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
                              {store_vendor_purchase_record_data.extra_charge}
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
                              {store_vendor_purchase_record_data.total_payment}
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
                              Amount Paid
                            </h5>
                            <Flex
                              fontWeight={"600"}
                              fontSize={14}
                              alignItems={"center"}
                            >
                              <BiRupee />{" "}
                              {store_vendor_purchase_record_data.amount_paid}
                            </Flex>
                          </div>
                          <div className="d-flex pt-3 px-5 justify-content-between align-items-center">
                            <h5
                              style={{
                                fontSize: 14,
                                margin: 0,
                                fontWeight: "600",
                                color: "red",
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
                              {store_vendor_purchase_record_data.outstanding}
                            </Flex>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="hstack gap-2 justify-content-center mb-2 d-print-none mt-4">
                      <a
                        href="javascript:window.print()"
                        class="btn btn-success"
                      >
                        <i class="ri-printer-line align-bottom me-1"></i> Print
                      </a>
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

export default PurchaseHistoryRecord;
