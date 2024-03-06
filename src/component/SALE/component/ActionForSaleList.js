import React, { useState, useEffect, useRef } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router";
import swal from "sweetalert";
import { useToast } from "@chakra-ui/react";
import URLDomain from "../../../URL";
import { queryClient } from "../../../App";

export const ActionForSaleList = (row) => {
  const navigate = useNavigate();
  const toast = useToast();
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

  const [SaleRow, setSaleRow] = useState(row.id);

  const deleteAction = (delete_id, plateform, payment, date) => {
    swal({
      title:
        "Delete " +
        payment +
        " RS Sale From Plateform " +
        plateform +
        " Sale Date " +
        date,
      text: "Once deleted, you will not be able to recover this Sale !",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((deleteProductFromStore) => {
      if (deleteProductFromStore) {
        fetch(URLDomain + "/APP-API/Billing/deleteLastSaleRow", {
          method: "POST",
          header: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            id: delete_id,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log("respond delete", responseJson);
            if (responseJson.deleted) {
              queryClient.invalidateQueries({
                queryKey: ["offline_sale_history"],
              });

              getToast({
                title: "Product Deleted ",
                dec: "Successful",
                status: "success",
              });
            } else {
              getToast({ title: "ERROR", dec: "ERROR", status: "error" });
            }
          })
          .catch((error) => {
            //  console.error(error);
          });

        swal("Poof! Your Product  has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Product is safe!");
      }
    });
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="dark" id="dropdown-basic">
        Action
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item
          className="btn btn-primary"
          onClick={() =>
            navigate(
              "/online/online-sales-history-record/" +
                SaleRow.order_id +
                "/" +
                SaleRow.customer_address_id +
                "/" +
                SaleRow.order_type
            )
          }
        >
          Sale Details
        </Dropdown.Item>
        <Dropdown.Item
          variant="secondary"
          onClick={() =>
            deleteAction(
              SaleRow.id,
              SaleRow.plateform,
              SaleRow.total_payment,
              SaleRow.date
            )
          }
        >
          Delete Record
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
