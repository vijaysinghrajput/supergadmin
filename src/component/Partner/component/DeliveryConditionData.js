import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
import { BiSearch } from "react-icons/bi";
import { Toast } from "primereact/toast";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { DeliverySlotsListTable } from "./DeliverySlotsListTable";
import { UpdateSlotCondition } from "./UpdateSlotCondition";
import { useQuery } from "react-query";

import URLDomain from "../../../URL";
import Cookies from "universal-cookie";
import { queryClient } from "../../../App";

import "primereact/resources/themes/lara-light-cyan/theme.css";
const cookies = new Cookies();

export const DeliveryConditionData = (takingKM) => {
  const navigate = useNavigate();

  const toast = useRef(null);

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [selectedMonthYear, setselectedMonthYear] = useState(null);
  const [UpdateSlotCondtion, setUpdateSlotCondtion] = useState({});

  const [expandedRows, setExpandedRows] = useState(null);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    order_status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [isDataLoding, setisDataLoding] = useState(true);
  const [Sale, setSale] = useState(null);
  const [Distance, setDistance] = useState();

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");

  const [SlotIDChange, setSlotIDChange] = useState(null);

  async function fetchData({ distance }) {
    console.log("hey navneet ======>", distance.data);
    const data = await fetch(
      URLDomain + "/APP-API/Billing/deliveryCondtionData",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          //   Distance_KM: 7,
          Distance_KM: distance.data,
          store_id: adminStoreId,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => responseJson);

    return data;
  }

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       fetchData({ distance: "7" });
  //     }, 1000);

  //     return () => {
  //       clearTimeout(timer);
  //     };
  //   }, [takingKM]);

  const {
    data: deliveryCondtionData,
    isError,
    isLoading: isLoadingAPI,
    isFetching,
  } = useQuery({
    queryKey: ["deliveryCondtionData", takingKM],
    queryFn: (e) => fetchData({ distance: e.queryKey[1] }),
  });
  // fetchData({ distance: e.queryKey[1] }))});

  useEffect(() => {
    setSale([]);
    if (deliveryCondtionData) {
      setSale(deliveryCondtionData.store_delivery_slot);

      console.log("Distance", takingKM.data);
      console.log("data codition", deliveryCondtionData);

      setisDataLoding(false);
    }
  }, [takingKM.data, deliveryCondtionData, isLoadingAPI]);

  const expandAll = () => {
    let _expandedRows = {};

    Sale.forEach((p) => (_expandedRows[`${p.id}`] = true));

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const kmTem = (rowData) => {
    return <p>{rowData.distance_km} KM</p>;
  };
  const minOrderTem = (rowData) => {
    return <p>{rowData.min_order_value} ₹</p>;
  };
  const minOrderforfreeTem = (rowData) => {
    return <p>{rowData.minium_amount_free_del} ₹</p>;
  };
  const deliverychargetem = (rowData) => {
    return <p>{rowData.delivery_charge} ₹</p>;
  };
  const timeholdslottem = (rowData) => {
    return <p>{rowData.time_hold_slot} Minuts</p>;
  };
  const closeslottimetem = (rowData) => {
    return <p>{rowData.today_close_time} PM</p>;
  };

  const ActionButton = (rowData) => {
    return (
      <p
        onClick={() => setUpdateSlotCondtion(rowData)}
        data-bs-toggle="modal"
        data-bs-target="#UpdateProductPricing"
        className="btn btn-primary"
      >
        Change
      </p>
    );
  };

  const getSeverity = (value) => {
    switch (value) {
      case "1":
        return "dark";
      case "2":
        return "success";
      case "3":
        return "warning";

      case "4":
        return "info";
      case "5":
        return "primary";
      case "6":
        return "danger";
      case "7":
        return "dark";
      case "8":
        return "secondery";
      default:
        return null;
    }
  };

  const getSlotName = (value) => {
    switch (value) {
      case "1":
        return "1 Hour Slot";
      case "2":
        return "2 Hour Slot";
      case "3":
        return "3 Hour Slot";

      case "4":
        return "4 Hour Slot";
      case "5":
        return "6 Hour Slot";
      case "6":
        return "8 Hour Slot";
      case "7":
        return "12 Hour Slot";
      case "8":
        return "1 Day Slot";
      default:
        return null;
    }
  };

  const [slotOptionList] = useState([
    "1 Hour Slot",
    "2 Hour Slot",
    "3 Hour Slot",
    "4 Hour Slot",
    "6 Hour Slot",
    "8 Hour Slot",
    "12 Hour Slot",
    "1 Day Slot",
  ]);

  const slotIdOptionList = (options) => {
    return (
      <Dropdown
        value={options.slotting_id}
        options={slotOptionList}
        onChange={(e) => changeSlotIdForNew(e)}
        placeholder="Select a Slot"
        itemTemplate={(option) => {
          return <Tag value={option} severity={getSeverity(option)}></Tag>;
        }}
      />
    );
  };

  const changeSlotIdForNew = async (e) => {
    // console.log("slot id", SlotIDChange);
    // console.log("slot value", e.value);
    // console.log
    const data = await fetch(URLDomain + "/APP-API/Billing/updateSlotId", {
      method: "POST",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        value: e.value,
        SlotId: SlotIDChange,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        queryClient.invalidateQueries({
          queryKey: ["deliveryCondtionData"],
        });
      })
      .catch((error) => {
        //  console.error(error);
      });
  };

  const allowExpansion = (rowData) => {
    return rowData.id.length > 0;
  };

  const header = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
      <Button
        icon="pi pi-minus"
        label="Collapse All"
        onClick={collapseAll}
        text
      />
    </div>
  );

  const rowExpansionTemplate = (data) => {
    // console.log;

    return (
      <div className="p-3">
        <h5>Delivery Slot for {data.distance_km} KM</h5>
        <DeliverySlotsListTable data={data.slotting_id} />
      </div>
    );
  };

  const slotBodyTemp = (rowData) => {
    return (
      <Tag
        onClick={() => setSlotingId(rowData.id)}
        value={getSlotName(rowData.slotting_id)}
        severity={getSeverity(rowData.slotting_id)}
      ></Tag>
    );
  };

  const setSlotingId = (value) => {
    setSlotIDChange(value);
  };

  return (
    <div className="card">
      <DataTable
        value={Sale}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        loading={isFetching}
        header={header}
        tableStyle={{ minWidth: "60rem" }}
      >
        <Column expander={allowExpansion} style={{ width: "5rem" }} />
        <Column
          field="distance_km"
          header="KM"
          sortable
          style={{ width: "10%" }}
          body={kmTem}
        ></Column>

        <Column
          field="slotting_id"
          header="Slot Name"
          body={slotBodyTemp}
          editor={(options) => slotIdOptionList(options)}
          style={{ width: "20%" }}
        ></Column>

        <Column
          field="min_order_value"
          header="Minimum Order"
          sortable
          style={{ width: "15%" }}
          body={minOrderTem}
        ></Column>
        <Column
          field="minium_amount_free_del"
          header="Min Ord for Free Del"
          body={minOrderforfreeTem}
          sortable
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="delivery_charge"
          header="Delivery Charge"
          body={deliverychargetem}
          sortable
          style={{ width: "15%" }}
        ></Column>

        <Column
          field="time_hold_slot"
          header="Minut For Next Slot"
          body={timeholdslottem}
          sortable
          style={{ width: "25%" }}
        ></Column>

        <Column
          field="today_close_time"
          header="Close Slot Time "
          body={closeslottimetem}
          sortable
          style={{ width: "25%" }}
        ></Column>

        <Column
          field="Action"
          header="Action "
          body={ActionButton}
          sortable
          style={{ width: "25%" }}
        ></Column>
      </DataTable>

      <div
        className="modal fade"
        id="UpdateProductPricing"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered w-50">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="myModalLabel">
                Update Slot Condition
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <UpdateSlotCondition SlotData={UpdateSlotCondtion} />
            </div>
          </div>
          {/*end modal-content*/}
        </div>
        {/*end modal-dialog*/}
      </div>
    </div>
  );
};
