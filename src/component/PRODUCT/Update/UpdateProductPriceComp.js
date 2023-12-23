import { useState, useContext, useRef, useEffect } from "react";
import URL from "../../../URL";
import Cookies from "universal-cookie";
import ContextData from "../../../context/MainContext";
import Alert from "react-bootstrap/Alert";
import { useToast } from "@chakra-ui/react";
import ReactJSBarcode from "react-jsbarcode";
const cookies = new Cookies();

export const UpdateProductPriceComp = (EditProductData) => {
  const { storeProductRelode } = useContext(ContextData);
  const [isLoading, setIL] = useState(false);
  const toast = useToast();
  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");

  const [productDetails, setproductDetails] = useState({
    store_id: adminStoreId,
    id: 0,
    product_name: "",
    purchase_price: 0,
    price: 0,
    discount_in_percent: 0,
    discount_in_rs: 0,
    sale_price: 0,
    hsn_code: "",
    i_gst: 0,
    c_gst: 0,
    s_gst: 0,
    priority: 10,
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
    // console.log("productDetails",EditProductData)
    setproductDetails({ ...EditProductData.productDetails });
    // console.log("hey naveet", editablePlot);
  }, [EditProductData.productDetails]);

  const setBarCode = (value) => {
    value && setproductDetails({ ...productDetails, product_bar_code: value });
    /* if (value = " ") {
            setproductDetails({ ...productDetails, product_bar_code: null })
        } else {
        } */
  };

  const generateBarCode = () => {
    let randNo = Date.now();
    setproductDetails({ ...productDetails, product_bar_code: randNo });
  };

  const onPrintBarcode = () => {
    var canvas = document.getElementsByClassName("barcodeProduct")[0];
    var url = canvas.toDataURL("image/png");
    var link = document.createElement("a");
    link.download = `${productDetails.product_bar_code}.png`;
    link.href = url;
    link.click();
  };

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
      formData.append("purchase_price", productDetails.purchase_price);
      formData.append("price", productDetails.price);
      formData.append("discount_in_percent", DisInPerc);
      formData.append("discount_in_rs", productDetails.discount_in_rs);
      formData.append("sale_price", productDetails.sale_price);
      formData.append("hsn_code", productDetails.hsn_code);
      formData.append("product_bar_code", productDetails.product_bar_code);
      formData.append("i_gst", productDetails.i_gst);
      formData.append("c_gst", productDetails.c_gst);
      formData.append("s_gst", productDetails.s_gst);
      formData.append("priority", productDetails.priority);
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
          setIL(false);
          if (responseJson.success) {
            getToast({
              title: "Price Updated ",
              dec: "Successful",
              status: "success",
            });
            storeProductRelode();
          } else {
            // addDataToCurrentGlobal({ type: "plots", payload: storeBrandsData });
            getToast({ title: "error", dec: "error", status: "error" });
            storeProductRelode();
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
            // 'priority': '',
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
          <h5 className=" text-dark">
            {" "}
            {productDetails.product_name} {productDetails.product_size}{" "}
            {productDetails.product_unit}{" "}
          </h5>
        </div>

        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-6">
              <div className="mb-3">
                <label htmlFor="compnayNameinput" className="form-label">
                  Purchase Price
                </label>
                <input
                  type="number"
                  onChange={(e) =>
                    setproductDetails({
                      ...productDetails,
                      purchase_price: e.target.value,
                    })
                  }
                  value={productDetails.purchase_price}
                  className="form-control"
                  placeholder="Purchase"
                  id="compnayNameinput"
                />
              </div>
            </div>

            <div className="col-sm-6">
              <div className="mb-3">
                <label
                  htmlFor="compnayNameinput"
                  className="form-label text-danger"
                >
                  Customer Price
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
          </div>
        </div>

        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-6">
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
            <div className="col-sm-6">
              <div className="mb-3">
                <label htmlFor="compnayNameinput" className="form-label">
                  Customer Sale Price
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
              Priority (1 to 10)
            </label>
            <input
              type="text"
              onChange={(e) =>
                setproductDetails({
                  ...productDetails,
                  priority: e.target.value,
                })
              }
              value={productDetails.priority}
              className="form-control"
              placeholder="Product Margin"
              id="mobilenumberInput"
            />
          </div>
        </div>

        <div className="col-md-5 my-3">
          <div className="mb-3">
            <label htmlFor="citynameInput" className="form-label text-danger">
              Barcode
            </label>
            <input
              type="text"
              name="codes"
              id="codes"
              onChange={(e) => setBarCode(e.target.value)}
              value={productDetails.product_bar_code}
              className="form-control"
              placeholder="Barcode"
            />
          </div>
        </div>
        <div className="col-md-7">
          <div className="mb-3">
            <div className=" row col-sm-12  justify-content-center">
              <div className="col-sm-8"></div>
              <label
                className="btn btn-sm btn-danger"
                onClick={generateBarCode}
              >
                Generate Barecode{" "}
              </label>
              {/* <div className='col-sm-4'> <i className="ri-add-fill"  /></div> */}
            </div>

            {productDetails.product_bar_code ? (
              <>
                <ReactJSBarcode
                  value={productDetails.product_bar_code}
                  options={{ format: "code128", height: 30 }}
                  renderer="canvas"
                  className="barcodeProduct"
                />
                <button
                  className="btn btn-dark  btn-sm"
                  onClick={onPrintBarcode}
                >
                  Download Bar Code
                </button>
              </>
            ) : null}
          </div>
        </div>

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
