import { useState, useEffect } from "react";

export const ContactComp = (showDataBusinessdata) => {
  const [showDataBusiness, setshowDataBusiness] = useState({});
  useEffect(() => {
    setshowDataBusiness({ ...showDataBusinessdata.data });
  }, [showDataBusinessdata.data]);

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Contact</h5>

          <div className="row">
            <div className="col-6 col-md-4">
              <div className="d-flex mt-4">
                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                  <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                  </div>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">Primary Phone Number :</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.mobile1}
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
                  <p className="mb-1">Alternate Phone Number :</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.mobile2}
                  </a>
                </div>
              </div>
            </div>

            {/*end col*/}
          </div>

          <div className="row">
            <div className="col-6 col-md-4">
              <div className="d-flex mt-4">
                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                  <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                  </div>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">Primary Whatsapp Number:</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.teliphone1}
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
                  <p className="mb-1">Alternate Whatsapp Number :</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.teliphone2}
                  </a>
                </div>
              </div>
            </div>

            {/*end col*/}
          </div>
        </div>
        {/*end card-body*/}
      </div>
    </>
  );
};
