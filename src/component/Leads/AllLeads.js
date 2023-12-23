import { Link } from "react-router-dom";


const AllLeads = () => {

    return (
        <>
            <div>
                {/* start page title */}
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Leads</h4>
                        </div>
                    </div>
                </div>
                {/* end page title */}
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="card">
                                    <div className="card-header align-items-center d-flex">
                                        <h4 className="card-title mb-0 flex-grow-1">Deals Status</h4>
                                        <div className="flex-shrink-0">
                                            <div className="dropdown card-header-dropdown">
                                                <a className="text-reset dropdown-btn" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    <span className="text-muted">02 Nov 2021 to 31 Dec 2021<i className="mdi mdi-chevron-down ms-1" /></span>
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-end">
                                                    <a className="dropdown-item" href="#">Today</a>
                                                    <a className="dropdown-item" href="#">Last Week</a>
                                                    <a className="dropdown-item" href="#">Last Month</a>
                                                    <a className="dropdown-item" href="#">Current Year</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>{/* end card header */}
                                    <div className="card-body">
                                        <div className="table-responsive table-card">
                                            <table className="table table-borderless table-hover table-nowrap align-middle mb-0">
                                                <thead className="table-light">
                                                    <tr className="text-muted">
                                                        <th scope="col">Name</th>
                                                        <th scope="col" style={{ width: '20%' }}>Last Contacted</th>
                                                        <th scope="col">Sales Representative</th>
                                                        <th scope="col" style={{ width: '16%' }}>Status</th>
                                                        <th scope="col" style={{ width: '12%' }}>Deal Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Absternet LLC</td>
                                                        <td>Sep 20, 2021</td>
                                                        <td><img src="assets/images/users/avatar-1.jpg" alt="" className="avatar-xs rounded-circle me-2" />
                                                            <a href="#javascript: void(0);" className="text-body fw-medium">Donald Risher</a></td>
                                                        <td><span className="badge badge-soft-success p-2">Deal Won</span></td>
                                                        <td><div className="text-nowrap">$100.1K</div></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Raitech Soft</td>
                                                        <td>Sep 23, 2021</td>
                                                        <td><img src="assets/images/users/avatar-2.jpg" alt="" className="avatar-xs rounded-circle me-2" />
                                                            <a href="#javascript: void(0);" className="text-body fw-medium">Sofia Cunha</a></td>
                                                        <td><span className="badge badge-soft-warning p-2">Intro Call</span></td>
                                                        <td><div className="text-nowrap">$150K</div></td>
                                                    </tr>
                                                    <tr>
                                                        <td>William PVT</td>
                                                        <td>Sep 27, 2021</td>
                                                        <td><img src="assets/images/users/avatar-3.jpg" alt="" className="avatar-xs rounded-circle me-2" />
                                                            <a href="#javascript: void(0);" className="text-body fw-medium">Luis Rocha</a></td>
                                                        <td><span className="badge badge-soft-danger p-2">Stuck</span></td>
                                                        <td><div className="text-nowrap">$78.18K</div></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Loiusee LLP</td>
                                                        <td>Sep 30, 2021</td>
                                                        <td><img src="assets/images/users/avatar-4.jpg" alt="" className="avatar-xs rounded-circle me-2" />
                                                            <a href="#javascript: void(0);" className="text-body fw-medium">Vitoria Rodrigues</a></td>
                                                        <td><span className="badge badge-soft-success p-2">Deal Won</span></td>
                                                        <td><div className="text-nowrap">$180K</div></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Apple Inc.</td>
                                                        <td>Sep 30, 2021</td>
                                                        <td><img src="assets/images/users/avatar-6.jpg" alt="" className="avatar-xs rounded-circle me-2" />
                                                            <a href="#javascript: void(0);" className="text-body fw-medium">Vitoria Rodrigues</a></td>
                                                        <td><span className="badge badge-soft-info p-2">New Lead</span></td>
                                                        <td><div className="text-nowrap">$78.9K</div></td>
                                                    </tr>
                                                </tbody>{/* end tbody */}
                                            </table>{/* end table */}
                                        </div>{/* end table responsive */}
                                    </div>{/* end card body */}
                                </div>{/* end card */}
                            </div>{/* end col */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default AllLeads;