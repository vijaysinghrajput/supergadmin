import React, { useReducer, useState, useEffect } from "react";
import Context from "./MainContext";
import { reducer } from "../reducer/reducer";
import Cookies from "universal-cookie";
import URL from "../URL";
import { useToast } from "@chakra-ui/react";

const cookies = new Cookies();

const ContextProvider = (props) => {
  const toast = useToast();
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const MainData = {
    isLoading: false,
    auth: {
      isUserLogin: false,
    },
    Store_bussiness_info: [],
    adminId: cookies.get("adminId"),
  };

  const functionality = {
    fetchAllData: (payload) => dispatch({ type: "FETCH_ALL_DATA", payload }),
    setUserLogin: (credentials) =>
      dispatch({ type: "USER_LOGIN", credentials }),
    addDataToCurrentGlobal: (data) => dispatch({ type: "ADD_DATA", data }),
    setGloabalLoading: (data) => dispatch({ type: "LOADING", data }),
    removeDataToCurrentGlobal: (data) =>
      dispatch({ type: "REMOVE_DATA", data }),
    updateDataToCurrentGlobal: (data, where) =>
      dispatch({ type: "UPDATE_DATA", data, where }),
    // getStoreData: () => {
    //   dispatch({ type: "SOTRE_DATA", data });
    // },
    logOut: () => {
      cookies.remove("isUserLogin");
      cookies.remove("adminId");
      cookies.remove("adminPartnerId");
      cookies.remove("adminEmail");
      cookies.remove("adminMobile");
      cookies.remove("adminRoal");
      cookies.remove("adminStoreId");
      cookies.remove("adminStoreType");
      dispatch({ type: "LOGOUT" });
    },

    getToast: (e) => {
      toast({
        title: e.title,
        description: e.desc,
        status: e.status,
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    },
  };

  useEffect(async () => {
    async function fetchData() {
      const data = await fetch(URL + "/APP-API/Billing/Store_bussiness_info", {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          store_id: MainData.adminId,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => responseJson);

      return data;
    }

    const data = await fetchData();

    MainData.Store_bussiness_info = data;

    console.log("data", data);

    functionality.fetchAllData({ store_data: data });
  }, []);

  const [MainDataExport, dispatch] = useReducer(reducer, MainData);

  return (
    <Context.Provider
      value={{
        ...MainDataExport,
        ...functionality,
        allDataLoaded,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
