import React, { useReducer, useState, useEffect, useMemo, useCallback } from "react";
import Context from "./MainContext";
import { reducer } from "../reducer/reducer";
import Cookies from "universal-cookie";
import URL from "../URL";
import { useToast } from "@chakra-ui/react";

const cookies = new Cookies();

const ContextProvider = React.memo((props) => {
  const toast = useToast();
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  
  // Memoize initial data to prevent recreation on every render
  const MainData = useMemo(() => ({
    isLoading: false,
    auth: {
      isUserLogin: false,
    },
    Store_bussiness_info: [],
    adminId: cookies.get("adminId"),
  }), []);

  const [MainDataExport, dispatch] = useReducer(reducer, MainData);

  // Memoize functionality object to prevent recreation
  const functionality = useMemo(() => ({
    fetchAllData: (payload) => dispatch({ type: "FETCH_ALL_DATA", payload }),
    setUserLogin: (credentials) =>
      dispatch({ type: "USER_LOGIN", credentials }),
    addDataToCurrentGlobal: (data) => dispatch({ type: "ADD_DATA", data }),
    setGloabalLoading: (data) => dispatch({ type: "LOADING", data }),
    removeDataToCurrentGlobal: (data) =>
      dispatch({ type: "REMOVE_DATA", data }),
    updateDataToCurrentGlobal: (data, where) =>
      dispatch({ type: "UPDATE_DATA", data, where }),
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
    getToast: useCallback((e) => {
      toast({
        title: e.title,
        description: e.desc,
        status: e.status,
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }, [toast]),
  }), [toast]);

  // Optimized data fetching with proper error handling and loading states
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!MainData.adminId) return;
      
      try {
        functionality.setGloabalLoading(true);
        
        const response = await fetch(URL + "/APP-API/Billing/Store_bussiness_info", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            store_id: MainData.adminId,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (isMounted) {
          functionality.fetchAllData({ store_data: data });
          setAllDataLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
        if (isMounted) {
          functionality.getToast({
            title: "Error",
            desc: "Failed to load store data",
            status: "error"
          });
        }
      } finally {
        if (isMounted) {
          functionality.setGloabalLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [MainData.adminId, functionality]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    ...MainDataExport,
    ...functionality,
    allDataLoaded,
  }), [MainDataExport, functionality, allDataLoaded]);

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
});

export default ContextProvider;
