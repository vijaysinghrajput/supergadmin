import { useState, useContext, useRef, useEffect } from "react";
import URL from "../../../URL";
import Cookies from "universal-cookie";
import ContextData from "../../../context/MainContext";
import { useToast } from "@chakra-ui/react";

import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Box,
} from "@chakra-ui/react";
import { queryClient } from "../../../App";

const cookies = new Cookies();

export const UpdateSlotCondition = (upadateValue) => {
  const [isLoading, setIL] = useState(false);
  const toast = useToast();
  const adminStoreId = cookies.get("adminStoreId");

  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
  };

  const [SlotData, setSlotData] = useState({
    store_id: adminStoreId,
    id: 0,
    min_order_value: 0,
    distance_km: 0,
    minium_amount_free_del: 0,
    delivery_charge: 0,
    time_hold_slot: 0,
    today_close_time: 0,
  });

  const [SlotNextSlider, setSlotNextSlider] = useState(SlotData.time_hold_slot);
  const [closeTodaySlider, setcloseTodaySlider] = useState(
    SlotData.today_close_time
  );

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

  useEffect(() => {
    // console.log("SlotData",upadateValue)
    setSlotData({ ...upadateValue.SlotData });
    // console.log("hey naveet", editablePlot);
  }, [upadateValue.SlotData]);

  const UpdateProductAction = () => {
    setIL(true);
    const formData = new FormData();

    formData.append("id", SlotData.id);
    formData.append("store_id", SlotData.store_id);
    formData.append("min_order_value", SlotData.min_order_value);
    formData.append("distance_km", SlotData.distance_km);
    formData.append("minium_amount_free_del", SlotData.minium_amount_free_del);
    formData.append("delivery_charge", SlotData.delivery_charge);
    formData.append("time_hold_slot", SlotData.time_hold_slot);
    formData.append("today_close_time", SlotData.today_close_time);

    fetch(URL + "/APP-API/Billing/updateSlotConditionValue", {
      method: "POST",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setIL(false);

        console.log("change", responseJson);
        queryClient.invalidateQueries({
          queryKey: ["deliveryCondtionData"],
        });
      })
      .catch((error) => {
        //  console.error(error);
      });
  };

  const changeSlotBeforeNextSlot = (val) => {
    setSlotNextSlider(val);
    setSlotData({
      ...SlotData,
      time_hold_slot: val,
    });
  };

  const changeTodaySlotBeforeNextSlot = (val) => {
    setcloseTodaySlider(val);
    setSlotData({
      ...SlotData,
      today_close_time: val,
    });
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12 my-2 bg-light p-2">
          <h5 className=" text-dark">
            {"Update Slot Condition for  "}
            {SlotData.distance_km} KM
          </h5>
        </div>

        <div className="col-md-12">
          <div className="mb-3">
            <label htmlFor="firstNameinput" className="form-label">
              Next Slot Before {SlotData.time_hold_slot} Minuts
            </label>
            <div>
              <Box p={4} pt={10}>
                <Slider
                  defaultValue={SlotData.time_hold_slot}
                  min={1}
                  max={60}
                  step={1}
                  aria-label="slider-ex-6"
                  onChange={(val) => changeSlotBeforeNextSlot(val)}
                >
                  <SliderMark value={0} {...labelStyles}>
                    1 M
                  </SliderMark>

                  <SliderMark value={15} {...labelStyles}>
                    15 M
                  </SliderMark>

                  <SliderMark value={30} {...labelStyles}>
                    30 M
                  </SliderMark>

                  <SliderMark value={45} {...labelStyles}>
                    45 M
                  </SliderMark>
                  <SliderMark value={60} {...labelStyles}>
                    60 M
                  </SliderMark>
                  <SliderMark
                    value={SlotNextSlider}
                    textAlign="center"
                    bg="blue.500"
                    color="white"
                    mt="-10"
                    ml="-5"
                    w="12"
                  >
                    {SlotNextSlider} Minuts
                  </SliderMark>
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="mb-3">
            <label htmlFor="firstNameinput" className="form-label">
              Close Today Slot Before {SlotData.today_close_time} PM
            </label>
            <div>
              <Box p={4} pt={10}>
                <Slider
                  defaultValue={SlotData.today_close_time}
                  min={12}
                  max={23}
                  step={1}
                  aria-label="slider-ex-6"
                  onChange={(val) => changeTodaySlotBeforeNextSlot(val)}
                >
                  <SliderMark value={12} {...labelStyles}>
                    12 PM
                  </SliderMark>

                  <SliderMark value={15} {...labelStyles}>
                    15 PM
                  </SliderMark>

                  <SliderMark value={18} {...labelStyles}>
                    18 PM
                  </SliderMark>

                  <SliderMark value={20} {...labelStyles}>
                    20 PM
                  </SliderMark>
                  <SliderMark value={23} {...labelStyles}>
                    23 PM
                  </SliderMark>
                  <SliderMark
                    value={closeTodaySlider}
                    textAlign="center"
                    bg="blue.500"
                    color="white"
                    mt="-10"
                    ml="-5"
                    w="12"
                  >
                    {closeTodaySlider} PM
                  </SliderMark>
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>
            </div>
          </div>
        </div>
        <div className="col-md-12 mt-4">
          <div className="row">
            <div className="col-sm-4">
              <div className="mb-3">
                <label htmlFor="compnayNameinput" className="form-label">
                  Minimum Order Value for {SlotData.distance_km} M
                </label>
                <input
                  type="number"
                  onChange={(e) =>
                    setSlotData({
                      ...SlotData,
                      min_order_value: e.target.value,
                    })
                  }
                  value={SlotData.min_order_value}
                  className="form-control"
                  placeholder="Minimum Order Value"
                  id="compnayNameinput"
                />
              </div>
            </div>

            <div className="col-sm-4">
              <div className="mb-3">
                <label htmlFor="compnayNameinput" className="form-label ">
                  Free Delivery Above {SlotData.minium_amount_free_del} RS
                </label>
                <input
                  type="number"
                  onChange={(e) =>
                    setSlotData({
                      ...SlotData,
                      minium_amount_free_del: e.target.value,
                    })
                  }
                  value={SlotData.minium_amount_free_del}
                  className="form-control"
                  placeholder=" Free Delivery"
                  id="compnayNameinput"
                />
              </div>
            </div>

            <div className="col-sm-4">
              <div className="mb-3">
                <label htmlFor="compnayNameinput" className="form-label">
                  Delivery Charge for {SlotData.distance_km} KM
                </label>
                <input
                  type="number"
                  onChange={(e) =>
                    setSlotData({
                      ...SlotData,
                      delivery_charge: e.target.value,
                    })
                  }
                  value={SlotData.delivery_charge}
                  className="form-control"
                  placeholder="Discount in Rs"
                  id="compnayNameinput"
                />
              </div>
            </div>
          </div>
        </div>

        {/*end col*/}

        <div className="col-lg-12">
          <div className="text-center mt-2 ">
            {isLoading ? (
              <a href="javascript:void(0)" className="text-success">
                <i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" />{" "}
                Updating{" "}
              </a>
            ) : (
              <button
                type="button"
                onClick={UpdateProductAction}
                className="btn btn-primary"
              >
                Update Details
              </button>
            )}
            <button
              type="button"
              className="ml-2 btn btn-danger"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              {" "}
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
