import { useState, useContext } from "react";
import { useEffect } from "react";
import ContextData from '../../../context/MainContext';
import URLDomain from "../../../URL";

export default function Roles() {

    const { user, roles, reloadData } = useContext(ContextData);
    const [roleName, setRoleName] = useState("");

    useEffect(() => {
        console.log("sdfasdfasd", roles);
    }, [roles])

    const addRole = () => {
        console.log("kit kat", user.user_info.bussiness_id, roleName);
        fetch(URLDomain + "/APP-API/App/addRoles", {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                role_name: roleName,
                bussiness_id: user.user_info.bussiness_id
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("respond", responseJson)
                if (responseJson.success) {
                    reloadData();
                    document.getElementsByClassName("btn-close")[0].click();
                } else alert("ma chud gyi");
            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    return (
        <div className="col-12">
            <div className="card" id="orderList">
                <div className="card-header border-0">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title mb-0 flex-grow-1">Roles</h5>
                        <div className="flex-shrink-0">
                            <button type="button" className="btn btn-success add-btn" data-bs-toggle="modal" id="create-btn" data-bs-target="#showModal"><i className="ri-add-line align-bottom me-1" /> Create
                                Role</button>
                            <button className="btn btn-soft-danger mx-2" onclick="deleteMultiple()"><i className="ri-delete-bin-2-line" /></button>
                        </div>
                    </div>
                </div>
                <div className="card-body border border-dashed border-end-0 border-start-0">
                    <form>
                        <div className="row g-3">
                            <div className="col-xxl-5 col-sm-6">
                                <div className="search-box">
                                    <input type="text" className="form-control search" placeholder="Search for order ID, customer, order status or something..." />
                                    <i className="ri-search-line search-icon" />
                                </div>
                            </div>
                            {/*end col*/}
                        </div>
                        {/*end row*/}
                    </form>
                </div>
                <div className="card-body pt-0">
                    <div>
                        <ul className="nav nav-tabs nav-tabs-custom nav-success mb-3" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active All py-3" data-bs-toggle="tab" id="All" href="#home1" role="tab" aria-selected="true">
                                    <i className="ri-store-2-fill me-1 align-bottom" /> All Roles
                                </a>
                            </li>
                        </ul>
                        <div className="table-responsive table-card mb-1">
                            <table className="table table-nowrap align-middle" id="home1">
                                <thead className="text-muted table-light">
                                    <tr className="text-uppercase">
                                        <th className="sort" data-sort="id">ID</th>
                                        <th className="sort" data-sort="customer_name">Role Name</th>
                                        <th className="sort" data-sort="status">Status</th>
                                        <th className="sort text-center" data-sort="city">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="list form-check-all">
                                    {roles?.map((role, i) => {
                                        return (
                                            <tr>
                                                <td className="id"><a href="apps-ecommerce-order-details.html" className="fw-medium link-primary">#{i + 1}</a></td>
                                                <td className="customer_name">{role.role_name}</td>
                                                <td className="status"><span className="badge badge-soft-success text-uppercase">Active</span>
                                                </td>
                                                <td>
                                                    <ul className="list-inline hstack gap-2 mb-0 justify-content-center">
                                                        <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="View">
                                                            <a href="apps-ecommerce-order-details.html" className="text-primary d-inline-block">
                                                                <i className="ri-eye-fill fs-16" />
                                                            </a>
                                                        </li>
                                                        <li className="list-inline-item edit" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Edit">
                                                            <a href="#showModal" data-bs-toggle="modal" className="text-primary d-inline-block edit-item-btn">
                                                                <i className="ri-pencil-fill fs-16" />
                                                            </a>
                                                        </li>
                                                        <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Remove">
                                                            <a className="text-danger d-inline-block remove-item-btn" data-bs-toggle="modal" href="#deleteOrder">
                                                                <i className="ri-delete-bin-5-fill fs-16" />
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <div className="noresult" style={{ display: 'none' }}>
                                <div className="text-center">
                                    <lord-icon src="https://cdn.lordicon.com/msoeawqm.json" trigger="loop" colors="primary:#405189,secondary:#0ab39c" style={{ width: '75px', height: '75px' }}>
                                    </lord-icon>
                                    <h5 className="mt-2">Sorry! No Result Found</h5>
                                    <p className="text-muted">We've searched more than 150+ Orders We did
                                        not find any
                                        orders for you search.</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <div className="pagination-wrap hstack gap-2">
                                <a className="page-item pagination-prev disabled" href="#">
                                    Previous
                                </a>
                                <ul className="pagination listjs-pagination mb-0" />
                                <a className="page-item pagination-next" href="#">
                                    Next
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade" id="showModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header bg-light p-3">
                                    <h5 className="modal-title" id="exampleModalLabel">&nbsp;Add Role</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="close-modal" />
                                </div>
                                <form action="#">
                                    <div className="modal-body">
                                        <input type="hidden" id="id-field" />
                                        <div className="mb-3" id="modal-id">
                                            <label htmlFor="orderId" className="form-label">Bussness ID</label>
                                            <input type="text" id="orderId" className="form-control" placeholder={user.user_info.bussiness_id} readOnly />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="customername-field" className="form-label">Role
                                                Name</label>
                                            <input type="text" id="customername-field" onChange={e => setRoleName(e.target.value)} className="form-control" placeholder="Role" required />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <div className="hstack gap-2 justify-content-end">
                                            <button type="button" onClick={addRole} className="btn btn-success" id="add-btn">Add Role</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* Modal */}
                    <div className="modal fade flip" id="deleteOrder" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-body p-5 text-center">
                                    <lord-icon src="https://cdn.lordicon.com/gsqxdxog.json" trigger="loop" colors="primary:#405189,secondary:#f06548" style={{ width: '90px', height: '90px' }} />
                                    <div className="mt-4 text-center">
                                        <h4>You are about to delete a order ?</h4>
                                        <p className="text-muted fs-15 mb-4">Deleting your order will remove
                                            all of
                                            your information from our database.</p>
                                        <div className="hstack gap-2 justify-content-center remove">
                                            <button className="btn btn-link link-success fw-medium text-decoration-none" data-bs-dismiss="modal"><i className="ri-close-line me-1 align-middle" />
                                                Close</button>
                                            <button className="btn btn-danger" id="delete-record">Yes,
                                                Delete It</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*end modal */}
                </div>
            </div>
        </div>

    )
}