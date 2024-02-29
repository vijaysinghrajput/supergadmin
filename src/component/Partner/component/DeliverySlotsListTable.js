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
import { InputSwitch } from "primereact/inputswitch";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import { useQuery } from "react-query";

import URLDomain from "../../../URL";
import Cookies from "universal-cookie";
import { queryClient } from "../../../App";

import "primereact/resources/themes/lara-light-cyan/theme.css";
const cookies = new Cookies();

export const DeliverySlotsListTable = (slotting_id) => {
  const navigate = useNavigate();

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [selectedMonthYear, setselectedMonthYear] = useState(null);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    order_status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [isDataLoding, setisDataLoding] = useState(true);
  const [SlotData, setSlotData] = useState(null);
  const [SlotId, setSlotId] = useState(null);
  const [SlotIDChange, setSlotIDChange] = useState(null);

  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");

  async function fetchData() {
    const data = await fetch(
      URLDomain + "/APP-API/Billing/delivery_slot_list_data",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          store_id: adminStoreId,
          SlotId: slotting_id.data,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => responseJson);

    return data;
  }

  const {
    data: delivery_slot_list_data,
    isError,
    isLoading: isLoadingAPI,
    isFetching,
  } = useQuery({
    queryKey: ["delivery_slot_list_data"],
    queryFn: (e) => fetchData(),
  });

  useEffect(() => {
    setSlotId(slotting_id.data);

    console.log("slot_id", slotting_id.data);
    setSlotData([]);
    if (delivery_slot_list_data) {
      setSlotData(delivery_slot_list_data.store_delivery_slot_list);
      setisDataLoding(false);
    }
  }, [slotting_id.data, delivery_slot_list_data, isLoadingAPI]);

  const status2BodyTemplate = (rowData) => {
    return (
      <Tag
        onClick={() => setSlotingId(rowData.id)}
        value={rowData.status == 1 ? "Open" : "Close"}
        severity={getSeverity(rowData.status)}
      ></Tag>
    );
  };

  const setSlotingId = (value) => {
    setSlotIDChange(value);
  };

  const slotNameTem = (rowData) => {
    return (
      <p className="text-primary">
        {rowData.slot_time_start} {rowData.start_time_postfix} TO{" "}
        {rowData.slot_time_end} {rowData.end_time_postfix}
      </p>
    );
  };

  const getSeverity = (value) => {
    switch (value) {
      case "1":
        return "success";
      case "0":
        return "danger";

      default:
        return null;
    }
  };

  const [statuses] = useState(["Open", "Close"]);

  const statusEditor = (options) => {
    return (
      <Dropdown
        value={options.status}
        options={statuses}
        onChange={(e) => changeActionStatus(e)}
        placeholder="Select a Status"
        itemTemplate={(option) => {
          return <Tag value={option} severity={getSeverity(option)}></Tag>;
        }}
      />
    );
  };

  const changeActionStatus = async (e) => {
    // console.log
    const data = await fetch(URLDomain + "/APP-API/Billing/updateSlotStatus", {
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
          queryKey: ["delivery_slot_list_data"],
        });
      })
      .catch((error) => {
        //  console.error(error);
      });
  };

  return (
    <div className="card">
      <DataTable
        value={SlotData}
        rows={24}
        selectionMode="single"
        sortMode="multiple"
        // sortField="date"

        editMode="cell"
        removableSort
        stateStorage="session"
        stateKey="dt-state-demo-local"
        emptyMessage="No Sale found."
        tableStyle={{ minWidth: "50rem" }}
        filterDisplay="row"
        loading={isFetching}
        // header={header}
      >
        <Column
          field=""
          header="Slot Time"
          body={slotNameTem}
          sortable
          style={{ width: "25%" }}
        ></Column>

        <Column
          field="slot_name"
          header="Slot Name"
          sortable
          style={{ width: "25%" }}
        ></Column>

        <Column
          field="order_status"
          header="Status"
          body={status2BodyTemplate}
          editor={(options) => statusEditor(options)}
          style={{ width: "20%" }}
        ></Column>
      </DataTable>
    </div>
  );
};
