import { useState, useContext, useRef, useEffect } from "react";
import URL from "../../../URL";
import Cookies from "universal-cookie";
import ContextData from "../../../context/MainContext";
import { queryClient } from "../../../App";

const cookies = new Cookies();

export const AddCustomerForm = (props) => {
  const { getToast } = useContext(ContextData);
  const [isLoading, setIL] = useState(false);

  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");

  const [customerDetails, setcustomerDetails] = useState({
    store_id: adminStoreId,
    name: "",
    mobile: "NA",
    address: "",
    city: "Gorakhpur",
    state: "",
    pin_code: "",
  });

  useEffect(() => {}, []);

  const AddcustomerAction = () => {
    if (customerDetails.name == "") {
      getToast({
        title: "customer Contact Name Requird",
        dec: "Requird",
        status: "error",
      });
    } else if (customerDetails.mobile == "") {
      getToast({
        title: "customer Contact Mobile Requird",
        dec: "Requird",
        status: "error",
      });
    } else {
      setIL(true);

      const formData = new FormData();

      formData.append("store_id", customerDetails.store_id);
      formData.append("adminId", adminId);
      formData.append("name", customerDetails.name);
      formData.append("mobile", customerDetails.mobile);
      formData.append("address", customerDetails.address);
      formData.append("city", customerDetails.city);
      formData.append("state", customerDetails.state);
      formData.append("pin_code", customerDetails.pin_code);

      fetch(URL + "/APP-API/Billing/addStoreCustomer", {
        method: "POST",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("respond customer upload", responseJson);

          queryClient.invalidateQueries({
            queryKey: ["customer_list_load"],
          });
          setIL(false);

          if (responseJson.is_customer_alredy == 1) {
            getToast({
              title: "customer Added Already",
              dec: "Successful",
              status: "success",
            });
          } else {
            console.log("added");
            // addDataToCurrentGlobal({ type: "plots", payload: storeBrandsData });
            getToast({
              title: "customer Added ",
              dec: "Successful",
              status: "success",
            });
          }
          setIL(false);

          setcustomerDetails({
            store_id: adminStoreId,
            name: "",
            mobile: "",
            address: "",
            city: "",
            state: "",
            pin_code: "",
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

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label
              htmlFor="compnayNameinput"
              className="form-label text-danger"
            >
              Contact Name
            </label>
            <input
              type="text"
              onChange={(e) =>
                setcustomerDetails({ ...customerDetails, name: e.target.value })
              }
              value={customerDetails.name}
              className="form-control"
              placeholder="Contact Name"
              id="compnayNameinput"
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label
              htmlFor="compnayNameinput"
              className="form-label text-danger"
            >
              Contact Mobile
            </label>
            <input
              type="text"
              onChange={(e) =>
                setcustomerDetails({
                  ...customerDetails,
                  mobile: e.target.value,
                })
              }
              value={customerDetails.mobile}
              className="form-control"
              placeholder="Contact Mobile"
              id="compnayNameinput"
            />
          </div>
        </div>

        <div className="col-md-12">
          <div className="mb-3">
            <label htmlFor="compnayNameinput" className="form-label text-dark ">
              Address
            </label>
            <textarea
              onChange={(e) =>
                setcustomerDetails({
                  ...customerDetails,
                  address: e.target.value,
                })
              }
              value={customerDetails.address}
              class="form-control"
              id="exampleFormControlTextarea5"
              rows="1"
            ></textarea>
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label
              htmlFor="compnayNameinput"
              className="form-label  text-dark "
            >
              City
            </label>
            <input
              type="text"
              onChange={(e) =>
                setcustomerDetails({ ...customerDetails, city: e.target.value })
              }
              value={customerDetails.city}
              className="form-control"
              placeholder="City"
              id="compnayNameinput"
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="compnayNameinput" className="form-label  text-dark">
              State
            </label>
            <input
              type="text"
              onChange={(e) =>
                setcustomerDetails({
                  ...customerDetails,
                  state: e.target.value,
                })
              }
              value={customerDetails.state}
              className="form-control"
              placeholder="State"
              id="compnayNameinput"
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="compnayNameinput" className="form-label  text-dark">
              Pincode
            </label>
            <input
              type="text"
              onChange={(e) =>
                setcustomerDetails({
                  ...customerDetails,
                  pin_code: e.target.value,
                })
              }
              value={customerDetails.pin_code}
              className="form-control"
              placeholder="Pincode"
              id="compnayNameinput"
            />
          </div>
        </div>

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
                onClick={AddcustomerAction}
                className="btn btn-primary"
              >
                Add Customer
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
