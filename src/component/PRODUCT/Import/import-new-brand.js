import { useState, useContext, useEffect } from "react";
import URL from "../../../URL";
import Cookies from "universal-cookie";
import ContextData from "../../../context/MainContext";
import Multiselect from "multiselect-react-dropdown";
import { useRef } from "react";
import { useToast } from "@chakra-ui/react";
import { useQuery } from "react-query";
import URLDomain from "../../../URL";
const cookies = new Cookies();

async function fetchData() {
  const data = await fetch(URLDomain + "/APP-API/Billing/MasterDatas", {
    method: "post",
    header: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((response) => response.json())
    .then((responseJson) => responseJson);

  return data;
}

export const ImportNewBrand = ({ storeBrand }) => {
  const toast = useToast();
  const { reloadData } = useContext(ContextData);
  const [filteredBrandsData, setFilterBrandData] = useState([]);
  const [isLoading, setIL] = useState(false);
  const getSelectedItemsRef = useRef(null);
  const [getAllSelectedItems, setAllSelectedItems] = useState([]);
  const adminStoreId = cookies.get("adminStoreId");
  const adminStoreType = cookies.get("adminStoreType");
  const adminId = cookies.get("adminId");

  const {
    data: MASTER_DATA,
    isError,
    isLoading: isLoadingAPI,
  } = useQuery({
    queryKey: ["MASTER_DATA"],
    queryFn: (e) => fetchData(),
  });

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
    console.log("console log all datas here --------->", MASTER_DATA);

    let obj3 = [];

    MASTER_DATA?.masterBrandsData.map(function (a) {
      let matched = storeBrand.filter((b) => a.id === b.master_brand_id);
      if (matched.length) {
        // obj3.push({ name: a.name, matched: true });
      } else {
        obj3.push({
          key: a.brand_name,
          id: a.id,
          cat: "Group 1",
          brand_type: a.brand_type,
          brand_image: a.brand_image,
          deceptions: a.deceptions,
          date: a.date,
        });
      }
    });

    setFilterBrandData(obj3);

    console.log("filter 222 ---->", storeBrand);

    // console.log("filter", res)
  }, [storeBrand, MASTER_DATA]);

  const AddBrandToSeller = () => {
    if (getSelectedItemsRef.current.state.selectedValues[0] === undefined) {
      getToast({
        title: "Please Select Brands",
        dec: "Requird",
        status: "error",
      });
    } else {
      setIL(true);

      fetch(URL + "/APP-API/Billing/importStoreBrands", {
        method: "POST",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          store_id: adminStoreId,
          adminId: adminId,
          Brands: getSelectedItemsRef.current.state.selectedValues,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("respond plot upload", responseJson);
          if (responseJson.success) {
            getToast({
              title: "Brand Added ",
              dec: "Successful",
              status: "success",
            });
            getSelectedItemsRef.current.resetSelectedValues();
          } else {
            console.log("added");
            // addDataToCurrentGlobal({ type: "plots", payload: storeBrandsData });
            getToast({
              title: "Failed Something Error",
              dec: "Successful",
              status: "error",
            });
          }
          reloadData();
          setIL(false);
          for (let i = 0; i < 10; i++) {
            document.getElementsByClassName("btn-close")[i].click();
          }
        })
        .catch((error) => {
          //  console.error(error);
        });
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="mb-3">
            <label htmlFor="firstNameinput" className="form-label">
              Select Brands
            </label>
            {filteredBrandsData.length && (
              <Multiselect
                displayValue="key"
                onKeyPressFn={function noRefCheck() {}}
                onSearch={function noRefCheck() {}}
                onRemove={() => {
                  setAllSelectedItems(
                    getSelectedItemsRef.current.state.selectedValues
                  );
                }}
                onSelect={() => {
                  setAllSelectedItems(
                    getSelectedItemsRef.current.state.selectedValues
                  );
                }}
                options={filteredBrandsData}
                ref={getSelectedItemsRef}
                // showCheckbox
              />
            )}
          </div>
        </div>
        {/*end col*/}

        <div className="col-lg-12">
          <div className="text-center mt-2">
            {isLoading ? (
              <a href="javascript:void(0)" className="text-success">
                <i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" />{" "}
                Adding{" "}
              </a>
            ) : (
              <button
                type="button"
                onClick={AddBrandToSeller}
                className="btn btn-primary"
              >
                Add Brand
              </button>
            )}
          </div>
        </div>
        {/*end col*/}
      </div>
      {/*end row*/}
    </>
  );
};
