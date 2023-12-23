import { useState, useContext, useRef, useEffect } from "react";
import URL from "../../../URL";
import ContextData from "../../../context/MainContext";
import { useToast } from "@chakra-ui/react";

import URLDomain from "../../../URL";
import Multiselect from "multiselect-react-dropdown";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";

import Cookies from "universal-cookie";
const cookies = new Cookies();

export const AddBannerForm = (props) => {
  const { storeBussinessRelode } = useContext(ContextData);
  const [isLoading, setIL] = useState(false);
  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");
  const getSelectedCategorysRef = useRef(null);
  const getSelectedproductsRef = useRef(null);
  const [categoryData, setcategoryData] = useState([]);
  const [productData, setproductData] = useState([]);
  const [isDataLoding, setisDataLoding] = useState(true);
  const [getAllSelectedCategorys, setAllSelectedCategorys] = useState([]);

  const toast = useToast();

  const [storeBannerData, setstoreBannerData] = useState({
    store_id: adminStoreId,
    image: null,
    type: "TOP",
    item_Id: 0,
    name: null,
  });

  async function fetchData() {
    const data = await fetch(URLDomain + "/APP-API/Billing/add_banner", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        store_id: adminStoreId,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => responseJson);

    return data;
  }

  const {
    data: PURCHASEDATA,
    isError,
    isLoading: isLoadingAPI,
  } = useQuery({
    queryKey: ["PURCHASEDATA"],
    queryFn: (e) => fetchData(),
  });

  useEffect(() => {
    // setsearchProduct(storeProductsData);
    // console.log("search product", PURCHASEDATA, isLoadingAPI);
    if (PURCHASEDATA) {
      setcategoryData(PURCHASEDATA.stores_category);
      setproductData(PURCHASEDATA.stores_products);
      setisDataLoding(false);
    }
  }, [PURCHASEDATA, isLoadingAPI]);

  const setChaildCate = (id) => {
    if (id.length) {
      setstoreBannerData({
        ...storeBannerData,
        item_Id: id[0].master_category_id,
        name: id[0].category_name,
      });
    }
  };

  const setChaildCateProduct = (id) => {
    if (id.length) {
      setstoreBannerData({
        ...storeBannerData,
        item_Id: id[0].id,
        name: id[0].product_full_name,
      });
    }
  };

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

  const AddPlot = () => {
    if (storeBannerData.image == null) {
      getToast({
        title: "Banner Image Requird",
        dec: "Requird",
        status: "error",
      });
    } else {
      setIL(true);
      const formData = new FormData();

      storeBannerData.image &&
        storeBannerData.image.map((item, i) => {
          formData.append(`image`, item, item.name);
        });

      formData.append("store_id", storeBannerData.store_id);
      formData.append("type", storeBannerData.type);
      formData.append("item_Id", storeBannerData.item_Id);
      formData.append("name", storeBannerData.name);

      fetch(URL + "/APP-API/Billing/addStoreBanners", {
        method: "POST",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("respond plot upload", responseJson);
          if (responseJson.success) {
            getToast({
              title: "Banner Added ",
              dec: "Successful",
              status: "success",
            });
            storeBussinessRelode();
          } else {
            console.log("added");
            // addDataToCurrentGlobal({ type: "plots", payload: storeBannerData });
            getToast({ title: "Faild", dec: "", status: "error" });
            storeBussinessRelode();
          }
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
              Type
            </label>
            <div>
              <button
                type="button"
                class="btn btn-light dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {storeBannerData.type ? storeBannerData.type : "Select Type"}
              </button>
              <div class="dropdown-menu">
                <a
                  class="dropdown-item"
                  onClick={() =>
                    setstoreBannerData({ ...storeBannerData, type: "TOP" })
                  }
                  href="#"
                >
                  TOP
                </a>
                <a
                  class="dropdown-item"
                  onClick={() =>
                    setstoreBannerData({ ...storeBannerData, type: "CATEGORY" })
                  }
                  href="#"
                >
                  CATEGORY
                </a>
                <a
                  class="dropdown-item"
                  onClick={() =>
                    setstoreBannerData({ ...storeBannerData, type: "PRODUCT" })
                  }
                  href="#"
                >
                  PRODUCT
                </a>
              </div>
            </div>
          </div>
        </div>
        {/*end col*/}

        {storeBannerData.type == "CATEGORY" ? (
          <div className="col-md-12">
            <div className="mb-3">
              <label
                htmlFor="firstNameinput"
                A
                className="form-label text-danger"
              >
                Product Category
              </label>

              {isDataLoding == false ? (
                <Multiselect
                  // singleSelect={true}
                  selectionLimit={1}
                  displayValue="category_name"
                  onKeyPressFn={function noRefCheck() {}}
                  onSearch={function noRefCheck() {}}
                  onRemove={() => {
                    setChaildCate(
                      getSelectedCategorysRef.current.state.selectedValues
                    );
                  }}
                  onSelect={() => {
                    setChaildCate(
                      getSelectedCategorysRef.current.state.selectedValues
                    );
                  }}
                  options={categoryData}
                  ref={getSelectedCategorysRef}
                  // showCheckbox
                />
              ) : null}
            </div>
          </div>
        ) : null}

        {storeBannerData.type == "PRODUCT" ? (
          <div className="col-md-12">
            <div className="mb-3">
              <label
                htmlFor="firstNameinput"
                A
                className="form-label text-danger"
              >
                Product
              </label>

              {isDataLoding == false ? (
                <Multiselect
                  // singleSelect={true}
                  selectionLimit={1}
                  displayValue="product_full_name"
                  onKeyPressFn={function noRefCheck() {}}
                  onSearch={function noRefCheck() {}}
                  onRemove={() => {
                    setChaildCateProduct(
                      getSelectedproductsRef.current.state.selectedValues
                    );
                  }}
                  onSelect={() => {
                    setChaildCateProduct(
                      getSelectedproductsRef.current.state.selectedValues
                    );
                  }}
                  options={productData}
                  ref={getSelectedproductsRef}
                  // showCheckbox
                />
              ) : null}
            </div>
          </div>
        ) : null}
        <div className="col-md-12">
          <div className="mb-3">
            <label htmlFor="address1ControlTextarea" className="form-label">
              Banner Image (Size -Width 1000 px * Height 250 px)
            </label>
            <input
              multiple
              type="file"
              onChange={(e) =>
                setstoreBannerData({
                  ...storeBannerData,
                  image: [...e.target.files],
                })
              }
              className="form-control"
              id="address1ControlTextarea"
            />
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
                onClick={AddPlot}
                className="btn btn-primary"
              >
                Add Banner
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
