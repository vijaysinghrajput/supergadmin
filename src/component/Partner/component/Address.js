import { useState, useEffect } from "react";

export const Address = (showDataBusinessdata) => {
  const [showDataBusiness, setshowDataBusiness] = useState({});
  useEffect(() => {
    setshowDataBusiness({ ...showDataBusinessdata.data });
  }, [showDataBusinessdata.data]);

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Address</h5>

          <div className="row">
            <div className="col-6 col-md-4">
              <div className="d-flex mt-4">
                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                  <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                  </div>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">Address Line 1 :</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.strteet_linn1}
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
                  <p className="mb-1">Address Line 2 :</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.strteet_linn2}
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
                  <p className="mb-1">Area:</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.area}
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
                  <p className="mb-1">City :</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.city}
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
                  <p className="mb-1">State :</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.state}
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
                  <p className="mb-1">Zip Code:</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.pin_code}
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
                  <p className="mb-1">Latitude :</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.lat}
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
                  <p className="mb-1">Longitude :</p>
                  <a href="#" className="fw-semibold">
                    {showDataBusiness?.lng}
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
