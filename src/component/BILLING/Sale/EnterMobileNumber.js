import { FcCalendar } from "react-icons/fc";
import { useContext, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import URLDomain from "../../../URL";
import ContextData from "../../../context/MainContext";
import { Flex, Box, Text, VStack, useBoolean, Spinner } from "@chakra-ui/react";
import Cookies from "universal-cookie";
import { useQuery } from "react-query";
import { queryClient } from "../../../App";
const cookies = new Cookies();

const adminStoreId = cookies.get("adminStoreId");

export const EnterMobileNumber = ({
  setSaledate,
  setSelectCustomer,
  Saledate,
  selectedCustomer,
  customerShoppingDetails,
  setcustomerShoppingDetails,
}) => {
  const { store_login_user } = useContext(ContextData);
  const DEFAULT_PHONE = "9999999999";
  const [prompt, setPrompt] = useState(DEFAULT_PHONE);
  const [debouncePrompt, setDPrompt] = useState(DEFAULT_PHONE);
  const [suggestions, setSuggestions] = useState([]);
  const [flag, setFlag] = useBoolean();
  const [show, setShow] = useBoolean();
  const catMenu = useRef(null);

  const closeOpenMenus = (e) => {
    if (show && !catMenu.current?.contains(e.target)) {
      setShow.off();
    }
  };

  console.log("values =======.", suggestions);

  const getCustomerDetails = (mobile, name = "") => {
    setSelectCustomer({ mobile, name });
    // if (store_login_user)
    fetch(URLDomain + "/APP-API/Billing/getCustomerBuyingDetails", {
      method: "POST",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        mobile: mobile,
        name: name,
        store_id: adminStoreId,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("umer -------->", responseJson);
        setcustomerShoppingDetails({
          customer_type: responseJson.customer_type,
          no_of_shopping_time: responseJson.no_of_shopping_time,
          shopping_value: responseJson.shopping_value,
        });
        setSelectCustomer({ ...responseJson.customer });
      })
      .catch((error) => {
        //  console.error(error);
      });
  };

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const search = async ({ prompt }) => {
    // queryClient.invalidateQueries({ queryKey: ["SEARCH_PERSON"] });
    // setSelectCustomer({ mobile });
    // console.log("hey there ------>", store_login_user);
    // if (store_login_user) {
    console.log("hey there ------>", prompt);
    return await fetch(URLDomain + "/APP-API/Billing/search", {
      method: "POST",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        store_id: adminStoreId,
        limit: 10,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // suggestions.push(...responseJson);
        // setFlag.off();
        // setSuggestions(responseJson);
        console.log("search  =======>", responseJson);
        return responseJson;
      })
      .catch((error) => {
        //  console.error(error);
      });
    // }
  };

  const {
    data: SEARCH_PERSON,
    isError,
    isLoading: isLoadingAPI,
    isFetching,
  } = useQuery({
    queryKey: ["SEARCH_PERSON", debouncePrompt],
    queryFn: (e) => search({ prompt: e.queryKey[1] }),
    refetchOnWindowFocus: false,
    initialData: [],
    // refetchInterval: 100,
  });

  console.log("note =====>", SEARCH_PERSON);

  // EFFECT: Debounce Input Value
  useEffect(() => {
    document.addEventListener("mousedown", closeOpenMenus);
    const timer = setTimeout(() => {
      setDPrompt(prompt);
      // prompt !== DEFAULT_PHONE && search({ prompt: prompt });
      // if (phone.length == 10) {
      //   getCustomerDetails(phone);
      // } else {
      //   getCustomerDetails(DEFAULT_PHONE);
      // }
    }, 600);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", closeOpenMenus);
    };
  }, [prompt]);

  return (
    <>
      <div className="col-md-12">
        <div className="row pb-4 align-items-center">
          <div
            className="col-lg-8 px-4"
            style={{ borderRight: "1px solid #c1c1c1" }}
          >
            <div className="row">
              <div
                className="col-md-7 px-5"
                style={{ borderRight: "1px solid #c1c1c1" }}
              >
                {/* <SuggestionDropdown /> */}
                <h4 className="mb-0 text-center mb-4">Enter Mobile Number</h4>
                <div ref={catMenu}>
                  <input
                    type="text"
                    // min="1"
                    // max="10"
                    list="suggestions"
                    class="form-control"
                    onChange={(e) => {
                      setFlag.on();

                      setPrompt(e.target.value);
                    }}
                    value={prompt}
                    placeholder="Mobile..."
                    autocomplete="on"
                    id="search-options"
                    onFocus={() => setShow.on()}
                  />

                  {show ? (
                    <Box
                      boxShadow={"0 1px 5px 0 #cdcdcd"}
                      borderRadius={5}
                      padding={"5px"}
                      position={"absolute"}
                      width={"79%"}
                      zIndex={99}
                      backgroundColor={"#fff"}
                    >
                      {SEARCH_PERSON.map((data, i) => {
                        return (
                          <Box
                            borderRadius={4}
                            _hover={{
                              backgroundColor: "#efefef",
                            }}
                            py={1}
                            onClick={() => {
                              // console.log("hey there on click");
                              setPrompt(data.mobile);
                              getCustomerDetails(data.mobile, data.name);
                              setShow.off();
                            }}
                          >
                            <Text pl={2} fontWeight={"700"}>
                              {data.name ? data.name : data.mobile}
                            </Text>
                          </Box>
                        );
                      })}
                      {isFetching | isLoadingAPI ? (
                        <Flex
                          alignItems={"center"}
                          justifyContent={"center"}
                          pt={1}
                          pb={2}
                        >
                          <Spinner size="sm" />
                        </Flex>
                      ) : null}
                    </Box>
                  ) : null}
                </div>
              </div>
              {selectedCustomer?.mobile ? (
                <div
                  className="col-md-5"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div className="px-5 border-left">
                    <h5 className="">
                      Type:{" "}
                      <strong> {customerShoppingDetails?.customer_type}</strong>
                    </h5>
                    <h5 className="">
                      Times:{" "}
                      <strong>
                        {" "}
                        {customerShoppingDetails?.no_of_shopping_time?.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </h5>
                    <h5 className="">
                      Total:{" "}
                      <strong>
                        {" "}
                        ₹{" "}
                        {customerShoppingDetails?.shopping_value?.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </h5>
                    <h5 className="">
                      Mobile: <strong> {selectedCustomer?.mobile}</strong>
                    </h5>
                    <h5 className="">
                      Name: <strong> {selectedCustomer?.name}</strong>
                    </h5>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="col-lg-4 px-4">
            <Flex
              alignItems={"center"}
              justifyContent={"center"}
              mb={3}
              gap={2}
              fontSize={16}
            >
              Sale Date <FcCalendar />
            </Flex>
            <DatePicker
              selected={Saledate}
              dateFormat="dd-MM-yyyy"
              onChange={(date) => setSaledate(Date.parse(date))}
              className="form-control bg-light border-light custom_date_input"
            />
          </div>
        </div>
      </div>
    </>
  );
};

//

const countries = [
  // { value: "ghana", label: "Ghana" },
  // { value: "nigeria", label: "Nigeria" },
  // { value: "kenya", label: "Kenya" },
  // { value: "southAfrica", label: "South Africa" },
  // { value: "unitedStates", label: "United States" },
  // { value: "canada", label: "Canada" },
  // { value: "germany", label: "Germany" },
];

// export default function SuggestionDropdown({ searchFunc }) {
//   const [pickerItems, setPickerItems] = React.useState(countries);
//   const [selectedItems, setSelectedItems] = React.useState([]);

//   const handleCreateItem = (item) => {
//     console.log("onSelectedItemsChange ====>", item);

//     setPickerItems((curr) => [...curr, item]);
//     setSelectedItems((curr) => [...curr, item]);
//   };

//   const handleSelectedItemsChange = (selectedItems) => {
//     console.log("onSelectedItemsChange ====>", selectedItems);
//     if (selectedItems) {
//       setSelectedItems(selectedItems);
//     }
//   };

//   return (
//     <CUIAutoComplete
//       label="Choose preferred work locations"
//       placeholder="Type a Country"
//       onCreateItem={handleCreateItem}
//       items={pickerItems}
//       selectedItems={selectedItems}
//       onSelectedItemsChange={(changes) =>
//         handleSelectedItemsChange(changes.selectedItems)
//       }
//       // createItemRenderer={(e) => console.log("e= =====>", e)}

//     />
//   );
// }
