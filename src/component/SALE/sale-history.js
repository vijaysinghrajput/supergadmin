import { SaleDataTable } from "./component/SaleDataTable";
import { Splitter, SplitterPanel } from "primereact/splitter";

const SalesHistory = () => {
  return (
    <>
      <div>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Counter Sale List</h4>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="row g-2"></div>
            {/*end row*/}
          </div>
        </div>

        <div className="row"></div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <SaleDataTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesHistory;
