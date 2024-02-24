import { useState, useEffect } from "react";
export const PrivacyTermsComp = (showDataBusinessdata) => {
  const [showDataBusiness, setshowDataBusiness] = useState({});
  useEffect(() => {
    setshowDataBusiness({ ...showDataBusinessdata.data });
  }, [showDataBusinessdata.data]);

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Privacy & Policy</h5>
          <p>{showDataBusiness?.privacy}</p>
        </div>

        <div className="card-body">
          <h5 className="card-title mb-3">Terms & Condition</h5>
          <p>{showDataBusiness?.terms}</p>
        </div>

        <div className="card-body">
          <h5 className="card-title mb-3">Returns Policy</h5>
          <p>{showDataBusiness?.returns}</p>
        </div>
        <div className="card-body">
          <h5 className="card-title mb-3">Shipping Condition</h5>
          <p>{showDataBusiness?.shiiping}</p>
        </div>
      </div>
    </>
  );
};
