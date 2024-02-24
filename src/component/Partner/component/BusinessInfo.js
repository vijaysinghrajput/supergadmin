import { useState, useContext, useRef, useEffect } from "react";

import { FaFacebookF } from "react-icons/fa";
import { AiOutlineInstagram, AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn, FaMapMarkedAlt } from "react-icons/fa";

export const BusinessInfo = (showDataBusinessdata) => {
  const [showDataBusiness, setshowDataBusiness] = useState({});
  useEffect(() => {
    setshowDataBusiness({ ...showDataBusinessdata.data });
  }, [showDataBusinessdata.data]);

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">About</h5>
          <p>{showDataBusiness?.about_us}</p>
          <div className="row">
            <div className="col-6 col-md-4">
              <div className="d-flex mt-4">
                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                  <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                  </div>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">Business Name :</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.buss_name}
                  </a>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-4">
              <div className="d-flex mt-4">
                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                  <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                  </div>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">Tag Line :</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.tag_line}
                  </a>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-4">
              <div className="d-flex mt-4">
                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                  <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                  </div>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">Company Email :</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.company_email}
                  </a>
                </div>
              </div>
            </div>
            {/*end col*/}
          </div>

          <div className="row ">
            <div className="col-6 col-md-4">
              <div className="d-flex mt-4">
                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                  <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                  </div>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">Website :</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.website}
                  </a>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-4">
              <div className="d-flex mt-4">
                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                  <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                  </div>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">GST NO :</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.gst_no}
                  </a>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-4">
              <div className="d-flex mt-4">
                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                  <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                  </div>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">Fassai NO :</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.fassai_no}
                  </a>
                </div>
              </div>
            </div>
            {/*end col*/}
          </div>

          <div className="row mt-4">
            <div className="col-1 col-md-1">
              <div className="d-flex mt-4">
                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                  <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <a href={showDataBusiness?.facebook} target="_blank">
                      {" "}
                      <FaFacebookF />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-1 col-md-1">
              <div className="d-flex mt-4">
                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                  <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <a href={showDataBusiness?.instagram} target="_blank">
                      {" "}
                      <AiOutlineInstagram />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-1 col-md-1">
              <div className="d-flex mt-4">
                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                  <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <a href={showDataBusiness?.twitter} target="_blank">
                      {" "}
                      <AiOutlineTwitter />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-1 col-md-1">
              <div className="d-flex mt-4">
                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                  <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <a href={showDataBusiness?.linkedin} target="_blank">
                      {" "}
                      <FaLinkedinIn />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-1 col-md-1">
              <div className="d-flex mt-4">
                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                  <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <a href={showDataBusiness?.google_map_link} target="_blank">
                      {" "}
                      <FaMapMarkedAlt />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*end row*/}
        </div>
        {/*end card-body*/}
      </div>
    </>
  );
};
