import { useState, useContext, useRef, useEffect } from "react";
import URL from "../../../URL";
import Cookies from "universal-cookie";
import ContextData from "../../../context/MainContext";
import { queryClient } from "../../../App";

const cookies = new Cookies();

export const AddExpensesForm = (props) => {
  const { getToast } = useContext(ContextData);
  const [isLoading, setIL] = useState(false);

  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");

  const [expenses, setExpenses] = useState({
    store_id: adminStoreId,
    type: "Food",
    payment_type: "Cash",
    amount: "",
    notes: "",
  });

  useEffect(() => {}, []);

  const AddVendorAction = () => {
    if (expenses.type == "") {
      getToast({
        title: "Expenses Type  Requird",
        dec: "Requird",
        status: "error",
      });
    } else if (expenses.payment_type == "") {
      getToast({
        title: "Payment type Requird",
        dec: "Requird",
        status: "error",
      });
    } else if (expenses.amount == "") {
      getToast({
        title: "Amount Requird",
        dec: "Requird",
        status: "error",
      });
    } else {
      setIL(true);

      const formData = new FormData();

      formData.append("store_id", expenses.store_id);
      formData.append("adminId", adminId);
      formData.append("type", expenses.type);
      formData.append("payment_type", expenses.payment_type);
      formData.append("amount", expenses.amount);
      formData.append("notes", expenses.notes);

      fetch(URL + "/APP-API/Billing/addStoreExpenses", {
        method: "POST",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("respond vendor upload", responseJson);

          queryClient.invalidateQueries({
            queryKey: ["expense_list_load"],
          });
          setIL(false);

          if (responseJson.is_vendor_alredy == 1) {
            getToast({
              title: "Vendor Added Already",
              dec: "Successful",
              status: "success",
            });
            // reloadData();
            setIL(false);
          } else {
            console.log("added");
            // addDataToCurrentGlobal({ type: "plots", payload: storeBrandsData });
            getToast({
              title: "Vendor Added ",
              dec: "Successful",
              status: "success",
            });
            // reloadData();
            setIL(false);
          }
          setIL(false);

          setExpenses({
            type: "",
            amount: "",
            notes: "",
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
        <div className="col-md-3">
          <div className="mb-3">
            <label htmlFor="firstNameinput" className="form-label text-danger">
              Expenses Type
            </label>
            <div>
              <button
                type="button"
                class="btn btn-light dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {expenses.type ? expenses.type : "Select Type"}
              </button>
              <div class="dropdown-menu">
                <a
                  class="dropdown-item"
                  onClick={() =>
                    setExpenses({
                      ...expenses,
                      type: "Food",
                    })
                  }
                  href="#"
                >
                  Food{" "}
                </a>
                <a
                  class="dropdown-item"
                  onClick={() =>
                    setExpenses({
                      ...expenses,
                      type: "Transport",
                    })
                  }
                  href="#"
                >
                  Transport{" "}
                </a>

                <a
                  class="dropdown-item"
                  onClick={() =>
                    setExpenses({
                      ...expenses,
                      type: "Fuel",
                    })
                  }
                  href="#"
                >
                  Fuel{" "}
                </a>

                <a
                  class="dropdown-item"
                  onClick={() =>
                    setExpenses({
                      ...expenses,
                      type: "Rent",
                    })
                  }
                  href="#"
                >
                  Rent{" "}
                </a>

                <a
                  class="dropdown-item"
                  onClick={() =>
                    setExpenses({
                      ...expenses,
                      type: "Electricity Bill",
                    })
                  }
                  href="#"
                >
                  Electricity Bill{" "}
                </a>

                <a
                  class="dropdown-item"
                  onClick={() =>
                    setExpenses({
                      ...expenses,
                      type: "Maintenance",
                    })
                  }
                  href="#"
                >
                  Maintenance{" "}
                </a>

                <a
                  class="dropdown-item"
                  onClick={() =>
                    setExpenses({
                      ...expenses,
                      type: "Installation",
                    })
                  }
                  href="#"
                >
                  Installation{" "}
                </a>

                <a
                  class="dropdown-item"
                  onClick={() =>
                    setExpenses({
                      ...expenses,
                      type: "Construction",
                    })
                  }
                  href="#"
                >
                  Construction{" "}
                </a>
                <a
                  class="dropdown-item"
                  onClick={() =>
                    setExpenses({
                      ...expenses,
                      type: "Other",
                    })
                  }
                  href="#"
                >
                  Other{" "}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="mb-3">
            <label htmlFor="firstNameinput" className="form-label text-danger">
              Payment Type
            </label>
            <div>
              <button
                type="button"
                class="btn btn-light dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {expenses.payment_type
                  ? expenses.payment_type
                  : "Select payment_type"}
              </button>
              <div class="dropdown-menu">
                <a
                  class="dropdown-item"
                  onClick={() =>
                    setExpenses({
                      ...expenses,
                      payment_type: "Cash",
                    })
                  }
                  href="#"
                >
                  Cash{" "}
                </a>
                <a
                  class="dropdown-item"
                  onClick={() =>
                    setExpenses({
                      ...expenses,
                      payment_type: "UPI",
                    })
                  }
                  href="#"
                >
                  UPI{" "}
                </a>

                <a
                  class="dropdown-item"
                  onClick={() =>
                    setExpenses({
                      ...expenses,
                      payment_type: "Bank Transfer",
                    })
                  }
                  href="#"
                >
                  Bank Transfer{" "}
                </a>
                <a
                  class="dropdown-item"
                  onClick={() =>
                    setExpenses({
                      ...expenses,
                      payment_type: "Cheque",
                    })
                  }
                  href="#"
                >
                  Cheque{" "}
                </a>
              </div>
            </div>
          </div>
        </div>
        {/*end col*/}

        <div className="col-md-6">
          <div className="mb-3">
            <label
              htmlFor="compnayNameinput"
              className="form-label text-danger"
            >
              Expenses Amount
            </label>
            <input
              type="text"
              onChange={(e) =>
                setExpenses({ ...expenses, amount: e.target.value })
              }
              value={expenses.amount}
              className="form-control"
              placeholder=" Expenses Amount"
              id="compnayNameinput"
            />
          </div>
        </div>

        <div className="col-md-12">
          <div className="mb-3">
            <label htmlFor="compnayNameinput" className="form-label text-dark ">
              Notes
            </label>
            <textarea
              onChange={(e) =>
                setExpenses({
                  ...expenses,
                  notes: e.target.value,
                })
              }
              value={expenses.notes}
              class="form-control"
              id="exampleFormControlTextarea5"
              rows="2"
            ></textarea>
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
                onClick={AddVendorAction}
                className="btn btn-primary"
              >
                Add Expenses
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
