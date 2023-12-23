import { useState, useContext, useRef, useEffect } from "react";
import URL from "../../../URL";
import Cookies from "universal-cookie";
import ContextData from "../../../context/MainContext";
import Alert from "react-bootstrap/Alert";

const cookies = new Cookies();

export const UpdateProductPriceComp = (EditProductData) => {
  const {
    storeCategoryData,
    storeBrandsData,
    storeProductUnits,
    addDataToCurrentGlobal,
    getToast,
    reloadData,
  } = useContext(ContextData);
  const [isLoading, setIL] = useState(false);

  const adminStoreId = cookies.get("adminStoreId");
  const adminStoreType = cookies.get("adminStoreType");
  const adminId = cookies.get("adminId");

  const [productDetails, setproductDetails] = useState({
    store_id: adminStoreId,
    id: 0,
    product_name: "",
    price: 0,
    discount_in_percent: 0,
    discount_in_rs: 0,
    sale_price: 0,
    hsn_code: "",
    i_gst: 0,
    c_gst: 0,
    s_gst: 0,
    margin_in_rs: "",
  });

  useEffect(() => {
    // console.log("productDetails",EditProductData)
    setproductDetails({ ...EditProductData.productDetails });
    // console.log("hey naveet", editablePlot);
  }, [EditProductData.productDetails]);

  const UpdateProductAction = () => {
    let DisInPerc = Math.round(
      ((productDetails.price - productDetails.sale_price) * 100) /
        productDetails.price
    );

    if (productDetails.price == 0) {
      getToast({
        title: "Product Price Requird",
        dec: "Requird",
        status: "error",
      });
    } else {
      setIL(true);
      const formData = new FormData();

      formData.append("id", productDetails.id);
      formData.append("store_id", productDetails.store_id);
      formData.append("adminId", adminId);
      formData.append("price", productDetails.price);
      formData.append("discount_in_percent", DisInPerc);
      formData.append("discount_in_rs", productDetails.discount_in_rs);
      formData.append("sale_price", productDetails.sale_price);
      formData.append("hsn_code", productDetails.hsn_code);
      formData.append("i_gst", productDetails.i_gst);
      formData.append("c_gst", productDetails.c_gst);
      formData.append("s_gst", productDetails.s_gst);
      formData.append("margin_in_rs", productDetails.margin_in_rs);
      formData.append(
        "product_name",
        productDetails.product_name +
          " " +
          productDetails.product_size +
          " " +
          productDetails.product_unit
      );

      fetch(URL + "/APP-API/Billing/UpdateStoreProductsPrice", {
        method: "POST",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("respond product upload", responseJson);
          if (responseJson.success) {
            getToast({
              title: "Price Updated ",
              dec: "Successful",
              status: "success",
            });
            reloadData();
          } else {
            // addDataToCurrentGlobal({ type: "plots", payload: storeBrandsData });
            getToast({ title: "error", dec: "error", status: "error" });
            reloadData();
          }
          setIL(false);
          setproductDetails([]);
          setproductDetails({
            // 'store_id': adminStoreId,
            // 'product_name': '',
            // 'product_uniq_slug_name': '',
            // 'product_image': { length: 0 },
            // 'product_type': adminStoreType,
            // 'parent_category_id': '',
            // 'category_id': '',
            // 'brand_id': '',
            // 'price': 0,
            // 'discount_in_percent': 0,
            // 'discount_in_rs': 0,
            // 'sale_price': 0,
            // 'product_unit': '',
            // 'product_size': '',
            // 'product_bar_code': '',
            // 'deceptions': '',
            // 'hsn_code': '',
            // 'i_gst': 0,
            // 'c_gst': 0,
            // 's_gst': 0,
            // 'margin_in_rs': '',
          });

          for (let i = 0; i < 10; i++) {
            document.getElementsByClassName("btn-close")[i].click();
          }
        })
        .catch((error) => {
          //  console.error(error);
        });
    }
  };

  const setPricing = (value) => {
    setproductDetails({
      ...productDetails,
      price: value,
      sale_price: value,
      discount_in_rs: 0,
    });
  };
  const setDiscount = (value) => {
    let dicountPerc =
      ((productDetails.price - productDetails.sale_price) /
        productDetails.price) *
      10;

    setproductDetails({
      ...productDetails,
      discount_in_rs: value,
      sale_price: productDetails.price - value,
      discount_in_percent: dicountPerc,
    });
  };
  const setSalePricing = (value) => {
    setproductDetails({ ...productDetails, sale_price: value });
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12 my-2 bg-light p-2">
          <h1 className=" text-dark">
            {" "}
            {productDetails.product_name} {productDetails.product_size}{" "}
            {productDetails.product_unit}{" "}
          </h1>
        </div>

        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-4">
              <div className="mb-3">
                <label
                  htmlFor="compnayNameinput"
                  className="form-label text-danger"
                >
                  Price
                </label>
                <input
                  type="number"
                  onChange={(e) => setPricing(e.target.value)}
                  value={productDetails.price}
                  className="form-control"
                  placeholder="Price"
                  id="compnayNameinput"
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="mb-3">
                <label htmlFor="compnayNameinput" className="form-label">
                  Discount in Rs{" "}
                </label>
                <input
                  type="number"
                  onChange={(e) => setDiscount(e.target.value)}
                  value={productDetails.discount_in_rs}
                  className="form-control"
                  placeholder="Discount in Rs"
                  id="compnayNameinput"
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="mb-3">
                <label htmlFor="compnayNameinput" className="form-label">
                  Sale Price
                </label>
                <input
                  type="number"
                  onChange={(e) => setSalePricing(e.target.value)}
                  disabled
                  value={productDetails.sale_price}
                  className="form-control"
                  placeholder="Sale Price"
                  id="compnayNameinput"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-4">
              <div className="mb-3">
                <label htmlFor="compnayNameinput" className="form-label">
                  I GST (%)
                </label>
                <input
                  type="number"
                  onChange={(e) =>
                    setproductDetails({
                      ...productDetails,
                      i_gst: e.target.value,
                      c_gst: e.target.value / 2,
                      s_gst: e.target.value / 2,
                    })
                  }
                  value={productDetails.i_gst}
                  className="form-control"
                  placeholder="I GST"
                  id="compnayNameinput"
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="mb-3">
                <label htmlFor="compnayNameinput" className="form-label">
                  C GST (%)
                </label>
                <input
                  type="number"
                  onChange={(e) =>
                    setproductDetails({
                      ...productDetails,
                      c_gst: productDetails.i_gst / 2,
                    })
                  }
                  value={productDetails.c_gst}
                  disabled
                  className="form-control"
                  placeholder="C GST"
                  id="compnayNameinput"
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="mb-3">
                <label htmlFor="compnayNameinput" className="form-label">
                  S GST (%)
                </label>
                <input
                  type="number"
                  onChange={(e) =>
                    setproductDetails({
                      ...productDetails,
                      s_gst: productDetails.i_gst / 2,
                    })
                  }
                  value={productDetails.s_gst}
                  disabled
                  className="form-control"
                  placeholder="S GST"
                  id="compnayNameinput"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="mobilenumberInput" className="form-label">
              HSN Code
            </label>
            <input
              type="text"
              onChange={(e) =>
                setproductDetails({
                  ...productDetails,
                  hsn_code: e.target.value,
                })
              }
              value={productDetails.hsn_code}
              className="form-control"
              placeholder="HSN Code"
              id="mobilenumberInput"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="compnayNameinput" className="form-label">
              Product Margin (RS)
            </label>
            <input
              type="text"
              onChange={(e) =>
                setproductDetails({
                  ...productDetails,
                  margin_in_rs: e.target.value,
                })
              }
              value={productDetails.margin_in_rs}
              className="form-control"
              placeholder="Product Margin"
              id="mobilenumberInput"
            />
          </div>
        </div>

        <div className="col-lg-12">
          <div className="text-center mt-2">
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
          </div>
        </div>
      </div>
    </>
  );
};
