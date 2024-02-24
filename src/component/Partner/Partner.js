import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ContextData from "../../context/MainContext";
import { BusinessInfo } from "./component/BusinessInfo";
import { Address } from "./component/Address";
import { ContactComp } from "./component/ContactComp";
import { PrivacyTermsComp } from "./component/PrivacyTermsComp";
import { DeliverySettingComp } from "./component/DeliverySettingComp";
import { Stack, Skeleton } from "@chakra-ui/react";

// import { ImportNewArea } from "./Import/import-new-area";
// import { ImportNewDelSlots } from "./Import/import-new-del-slots";

import swal from "sweetalert";
import { useToast } from "@chakra-ui/react";

import URLDomain from "../../URL";
import { useMutation, useQuery } from "react-query";
import Cookies from "universal-cookie";
import { queryClient } from "../../App";
const cookies = new Cookies();

const Partner = () => {
  const [showData, setShowDeliveyData] = useState(null);
  const [showDataSlot, setShowDataSlot] = useState(null);

  const adminStoreId = cookies.get("adminStoreId");
  const adminId = cookies.get("adminId");

  const [isDataLoding, setisDataLoding] = useState(true);

  const [showDataBusiness, setShowDataBusiness] = useState(null);

  const toast = useToast();
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

  async function fetchData() {
    const data = await fetch(
      URLDomain + "/APP-API/Billing/Store_bussiness_info",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          store_id: adminStoreId,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => responseJson);

    return data;
  }

  const {
    data: store_business_information,
    isError,
    isLoading: isLoadingAPI,
    isFetching,
  } = useQuery({
    queryKey: ["store_business_information"],
    queryFn: (e) => fetchData(),
  });

  useEffect(() => {
    console.log("search product", store_business_information, isLoadingAPI);

    if (store_business_information) {
      setShowDataBusiness(store_business_information.Store_bussiness_info);
      setShowDeliveyData(store_business_information.store_delivery_area);
      setShowDataSlot(store_business_information.store_delivery_slot);
      setisDataLoding(false);
    }

    // console.log("product", showData);
  }, [store_business_information, isLoadingAPI]);

  const STORY_HEADERS = [
    {
      prop: "area",
      title: "Area",
      isFilterable: true,
      isSortable: true,
      cell: (row) => {
        return <p> {row.area + ", " + row.city} </p>;
      },
    },
    {
      prop: "action",
      title: "Action",

      cell: (row) => {
        return (
          <i
            className="ri-delete-bin-2-line text-danger"
            style={{
              color: "red",
              fontSize: "20px",
              borderRadius: "14px",
              cursor: "pointer",
            }}
            onClick={() =>
              deleteAction(
                row.id,
                row.area + ", " + row.city + ", " + row.state,
                "store_delivery_area"
              )
            }
          />
        );
      },
    },
  ];

  const deleteAction = (del_id, area_name, table_name) => {
    swal({
      title: "Remove | " + area_name,
      text: "Once deleted, you will not be able to recover this area !",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((deleteProductFromStore) => {
      if (deleteProductFromStore) {
        fetch(URLDomain + "/APP-API/Billing/deleteStoreDeliveryArea", {
          method: "POST",
          header: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            del_id: del_id,
            table_name: table_name,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.delete) {
              getToast({
                title: "Area Deleted ",
                dec: "Successful",
                status: "success",
              });
            } else {
              getToast({ title: "ERROR", dec: "ERROR", status: "error" });
            }

            for (let i = 0; i < 10; i++) {
              document.getElementsByClassName("btn-close")[i].click();
            }
          })
          .catch((error) => {
            //  console.error(error);
          });

        swal("Deletet", {
          icon: "success",
        });

        // storeBussinessRelode();
      } else {
        swal("Nothing Change!");
        // storeBussinessRelode();
      }
    });
  };

  return (
    <>
      {isDataLoding ? (
        <Stack>
          <Skeleton height="100px" />
          <Skeleton height="100px" />
          <Skeleton height="100px" />
        </Stack>
      ) : (
        <>
          <div className="profile-foreground position-relative mx-n4 mt-n4">
            <div className="profile-wid-bg">
              <img
                src={showDataBusiness?.banner}
                alt=""
                className="profile-wid-img"
              />
            </div>
          </div>
          <div className="pt-4 mb-4 mb-lg-3 pb-lg-4">
            <div className="row g-4">
              <div className="col-auto">
                <div className="avatar-lg">
                  <img
                    src={showDataBusiness?.logo}
                    alt="user-img"
                    className="img-thumbnail rounded-circle"
                  />
                </div>
              </div>
              {/*end col*/}
              <div className="col">
                <div className="p-2">
                  <h3 className="text-white mb-1">
                    {showDataBusiness?.buss_name}
                  </h3>
                  <p className="text-white-75">{showDataBusiness?.tag_line}</p>
                  <div className="hstack text-white-50 gap-1">
                    <div className="me-2">
                      <i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle" />
                      {showDataBusiness?.area},{showDataBusiness?.city}
                    </div>
                    <div>
                      <i className="ri-store-line me-1 text-white-75 fs-16 align-middle" />
                      {showDataBusiness?.store_slug_name}
                    </div>
                  </div>
                </div>
              </div>
              {/*end col*/}
            </div>
            {/*end row*/}
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div>
                <div className="d-flex">
                  {/* Nav tabs */}
                  <ul
                    className="nav nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <a
                        className="nav-link fs-14 active"
                        data-bs-toggle="tab"
                        href="#overview-tab"
                        role="tab"
                      >
                        <i className="ri-airplay-fill d-inline-block d-md-none" />{" "}
                        <span className="d-none d-md-inline-block">
                          Business Info
                        </span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link fs-14"
                        data-bs-toggle="tab"
                        href="#Address"
                        role="tab"
                      >
                        <i className="ri-list-unordered d-inline-block d-md-none" />{" "}
                        <span className="d-none d-md-inline-block">
                          Address
                        </span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link fs-14"
                        data-bs-toggle="tab"
                        href="#contact"
                        role="tab"
                      >
                        <i className="ri-price-tag-line d-inline-block d-md-none" />{" "}
                        <span className="d-none d-md-inline-block">
                          Contact
                        </span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link fs-14"
                        data-bs-toggle="tab"
                        href="#PrivacyTerms"
                        role="tab"
                      >
                        <i className="ri-folder-4-line d-inline-block d-md-none" />{" "}
                        <span className="d-none d-md-inline-block">
                          Privacy & Terms
                        </span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link fs-14"
                        data-bs-toggle="tab"
                        href="#delivery_charge"
                        role="tab"
                      >
                        <i className="ri-folder-4-line d-inline-block d-md-none" />{" "}
                        <span className="d-none d-md-inline-block">
                          Delivery Setting
                        </span>
                      </a>
                    </li>
                  </ul>
                  <div className="flex-shrink-0">
                    <Link to="/company/edit" className="btn btn-success">
                      <i className="ri-edit-box-line align-bottom" /> Edit Info
                    </Link>
                  </div>
                </div>
                {/* Tab panes */}
                <div className="tab-content pt-4 text-muted">
                  <div
                    className="tab-pane active"
                    id="overview-tab"
                    role="tabpanel"
                  >
                    <BusinessInfo data={showDataBusiness} />
                  </div>
                  <div className="tab-pane fade" id="Address" role="tabpanel">
                    <Address data={showDataBusiness} />
                  </div>

                  {/*end tab-pane*/}
                  <div className="tab-pane fade" id="contact" role="tabpanel">
                    <ContactComp data={showDataBusiness} />
                  </div>

                  {/*end tab-pane*/}
                  <div
                    className="tab-pane fade"
                    id="PrivacyTerms"
                    role="tabpanel"
                  >
                    <PrivacyTermsComp data={showDataBusiness} />
                  </div>

                  {/*end tab-pane*/}
                  <div
                    className="tab-pane fade"
                    id="delivery_charge"
                    role="tabpanel"
                  >
                    <DeliverySettingComp dataSlot={showDataSlot} />
                  </div>
                  {/*end tab-pane*/}

                  {/*end tab-pane*/}
                </div>
                {/*end tab-content*/}
              </div>
            </div>
            {/*end col*/}

            <div className="row">
              <div className="col-lg-12">
                <div>
                  <div
                    className="modal fade"
                    id="importdeliveryarea"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered w-50">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="myModalLabel">
                            ADD Delivery Area
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          />
                        </div>
                        <div className="modal-body">
                          {/* <ImportNewArea /> */}
                        </div>
                      </div>
                      {/*end modal-content*/}
                    </div>

                    {/*end modal-dialog*/}
                  </div>
                  {/*end modal*/}
                </div>
              </div>
              {/* end col */}
            </div>
            {/*end row*/}

            <div className="row">
              <div className="col-lg-12">
                <div>
                  <div
                    className="modal fade"
                    id="importdeliveryslot"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered w-50">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="myModalLabel">
                            ADD Delivery Slot
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          />
                        </div>
                        <div className="modal-body">
                          {/* <ImportNewDelSlots /> */}
                        </div>
                      </div>
                      {/*end modal-content*/}
                    </div>
                    {/*end modal-dialog*/}
                  </div>
                  {/*end modal*/}
                </div>
              </div>
              {/* end col */}
            </div>

            {/*end row*/}
          </div>
        </>
      )}
    </>
  );
};

export default Partner;
