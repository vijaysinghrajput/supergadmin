import { Outlet } from "react-router-dom";

const SaleIndex = () => {

    return (
        <>
            <div>
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Sale</h4>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row g-2">
                            <div className="col-sm-4">
                                <div className="search-box">
                                    <input type="text" className="form-control" placeholder="Search for name, tasks, projects or something..." />
                                    <i className="ri-search-line search-icon" />
                                </div>
                            </div>{/*end col*/}
                            <div className="col-sm-auto ms-auto">
                                <div className="list-grid-nav hstack gap-1">
                                    <button type="button" id="dropdownMenuLink1" data-bs-toggle="dropdown" aria-expanded="false" className="btn btn-soft-info btn-icon fs-14"><i className="ri-more-2-fill" /></button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink1">
                                        <li><a className="dropdown-item" href="#">All</a></li>
                                        <li><a className="dropdown-item" href="#">Last Week</a></li>
                                        <li><a className="dropdown-item" href="#">Last Month</a></li>
                                        <li><a className="dropdown-item" href="#">Last Year</a></li>
                                    </ul>
                                    {/* <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addplots"><i className="ri-add-fill me-1 align-bottom" /> Add Plots</button> */}
                                </div>
                            </div>{/*end col*/}
                        </div>{/*end row*/}
                    </div>
                </div>
            </div>
        </>
    )

}

export default SaleIndex;