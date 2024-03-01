import { useState, useContext, useRef, useEffect } from "react";
import URL from "../../../URL";
import Cookies from "universal-cookie";
import ContextData from "../../../context/MainContext";
import { queryClient } from "../../../App";

const cookies = new Cookies();

export const AddEmployee = (props) => {
  const { getToast } = useContext(ContextData);
  const [isLoading, setIL] = useState(false);

  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");
  const adminStoreType = cookies.get("adminStoreType");

  const [employeeDetails, setemployeeDetails] = useState({
    store_id: adminStoreId,
    name: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    roal: "",
    salary: 0,
  });

  useEffect(() => {}, []);

  const AddemployeeAction = () => {
    if (employeeDetails.name == "") {
      getToast({
        title: "employee  Name Requird",
        dec: "Requird",
        status: "error",
      });
    } else if (employeeDetails.roal == "") {
      getToast({
        title: "employee  Roal Requird",
        dec: "Requird",
        status: "error",
      });
    } else if (employeeDetails.mobile == "") {
      getToast({
        title: "employee  Mobile Requird",
        dec: "Requird",
        status: "error",
      });
    } else {
      setIL(true);

      const formData = new FormData();

      formData.append("store_id", employeeDetails.store_id);
      formData.append("adminId", adminId);
      formData.append("name", employeeDetails.name);
      formData.append("mobile", employeeDetails.mobile);
      formData.append("address", employeeDetails.address);
      formData.append("city", employeeDetails.city);
      formData.append("state", employeeDetails.state);
      formData.append("roal", employeeDetails.roal);
      formData.append("email", employeeDetails.email);
      formData.append("store_type", adminStoreType);
      formData.append("salary", employeeDetails.salary);

      fetch(URL + "/APP-API/Billing/addStoreemployee", {
        method: "POST",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("respond employee upload", responseJson);

          queryClient.invalidateQueries({
            queryKey: ["employee_list_load"],
          });
          setIL(false);

          if (responseJson.is_employee_alredy == 1) {
            getToast({
              title: "employee Added Already",
              dec: "Successful",
              status: "success",
            });
          } else {
            console.log("added");
            // addDataToCurrentGlobal({ type: "plots", payload: storeBrandsData });
            getToast({
              title: "employee Added ",
              dec: "Successful",
              status: "success",
            });
          }
          setIL(false);

          setemployeeDetails({
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
              Name
            </label>
            <input
              type="text"
              onChange={(e) =>
                setemployeeDetails({ ...employeeDetails, name: e.target.value })
              }
              value={employeeDetails.name}
              className="form-control"
              placeholder=" Name"
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
              Mobile
            </label>
            <input
              type="text"
              onChange={(e) =>
                setemployeeDetails({
                  ...employeeDetails,
                  mobile: e.target.value,
                })
              }
              value={employeeDetails.mobile}
              className="form-control"
              placeholder=" Mobile"
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
              Email
            </label>
            <input
              type="text"
              onChange={(e) =>
                setemployeeDetails({
                  ...employeeDetails,
                  email: e.target.value,
                })
              }
              value={employeeDetails.email}
              className="form-control"
              placeholder=" Email"
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
              Roal
            </label>

            <div>
              <button
                type="button"
                class="btn btn-light dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {employeeDetails.roal ? employeeDetails.roal : "Select Roal"}
              </button>
              <div class="dropdown-menu">
                <a
                  class="dropdown-item"
                  onClick={() =>
                    setemployeeDetails({
                      ...employeeDetails,
                      roal: "Helping Staff",
                    })
                  }
                  href="#"
                >
                  Helping Staff{" "}
                </a>
                <a
                  class="dropdown-item"
                  onClick={() =>
                    setemployeeDetails({
                      ...employeeDetails,
                      roal: "Delivery Boy",
                    })
                  }
                  href="#"
                >
                  Delivery Boy{" "}
                </a>

                <a
                  class="dropdown-item"
                  onClick={() =>
                    setemployeeDetails({
                      ...employeeDetails,
                      roal: "Counter Cashier",
                    })
                  }
                  href="#"
                >
                  Counter Cashier{" "}
                </a>

                <a
                  class="dropdown-item"
                  onClick={() =>
                    setemployeeDetails({
                      ...employeeDetails,
                      roal: "Accounted",
                    })
                  }
                  href="#"
                >
                  Accounted{" "}
                </a>

                <a
                  class="dropdown-item"
                  onClick={() =>
                    setemployeeDetails({
                      ...employeeDetails,
                      roal: "Manager",
                    })
                  }
                  href="#"
                >
                  Manager{" "}
                </a>
                <a
                  class="dropdown-item"
                  onClick={() =>
                    setemployeeDetails({
                      ...employeeDetails,
                      roal: "Driver",
                    })
                  }
                  href="#"
                >
                  Driver{" "}
                </a>

                <a
                  class="dropdown-item"
                  onClick={() =>
                    setemployeeDetails({
                      ...employeeDetails,
                      roal: "Sales Person",
                    })
                  }
                  href="#"
                >
                  Sales Person{" "}
                </a>
                <a
                  class="dropdown-item"
                  onClick={() =>
                    setemployeeDetails({
                      ...employeeDetails,
                      roal: "Security Guard",
                    })
                  }
                  href="#"
                >
                  Security Guard{" "}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="mb-3">
            <label htmlFor="compnayNameinput" className="form-label text-dark ">
              Address
            </label>
            <textarea
              onChange={(e) =>
                setemployeeDetails({
                  ...employeeDetails,
                  address: e.target.value,
                })
              }
              value={employeeDetails.address}
              class="form-control"
              id="exampleFormControlTextarea5"
              rows="1"
            ></textarea>
          </div>
        </div>

        <div className="col-md-3">
          <div className="mb-3">
            <label
              htmlFor="compnayNameinput"
              className="form-label  text-dark "
            >
              Salary
            </label>
            <input
              type="text"
              onChange={(e) =>
                setemployeeDetails({
                  ...employeeDetails,
                  salary: e.target.value,
                })
              }
              value={employeeDetails.salary}
              className="form-control"
              placeholder="Salary"
              id="compnayNameinput"
            />
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
                setemployeeDetails({ ...employeeDetails, city: e.target.value })
              }
              value={employeeDetails.city}
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
                setemployeeDetails({
                  ...employeeDetails,
                  state: e.target.value,
                })
              }
              value={employeeDetails.state}
              className="form-control"
              placeholder="State"
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
                onClick={AddemployeeAction}
                className="btn btn-primary"
              >
                Add employee
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
