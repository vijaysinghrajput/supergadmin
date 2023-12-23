import { useState, useContext } from "react";
import ContextData from "../../../../context/MainContext";
import URLDomain from "../../../../URL";
import { ReviewForm } from "./ReviewForm";
import { EditReview } from "./EditReview";


const TestimonialSettings = () => {

    const { reviews, removeDataToCurrentGlobal, getToast, reloadData } = useContext(ContextData);
    const [delID, setDelID] = useState();
    const [editableTestimonial, setEditableTestimonial] = useState({});

    const deleteReview = async () => {
        console.log("kit kat", delID);
        if (!delID) {

            getToast({ title: "Please Wait", dec: "", status: "warning" });
            const data = await reloadData();
            console.log("ashdgfhjasdgfhjasdgfhjg", data);
            data && getToast({ title: "Try now to delete", dec: "", status: "success" });
            for (let i = 0; i < 10; i++) {
                document.getElementsByClassName("btn-close")[i]?.click();
            }

        } else fetch(URLDomain + "/APP-API/App/deleteReview", {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                id: delID
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("respond  --------->", responseJson)
                responseJson.deleted && removeDataToCurrentGlobal({ type: "reviews", payload: delID, where: "id" })
                if (responseJson.deleted) {
                    console.log("added");
                    getToast({ title: "Review Deleted", dec: "", status: "error" });
                } else {
                    alert("500 Error");
                }
                for (let i = 0; i < 10; i++) {
                    document.getElementsByClassName("btn-close")[i].click();
                }
            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    return (
        <>
            <div>
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Testimonial Settings</h4>
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
                                    <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addplots"><i className="ri-add-fill me-1 align-bottom" /> Add Testimonials</button>

                                </div>
                            </div>{/*end col*/}
                        </div>{/*end row*/}
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <div id="customerList">
                                    <div className="table-responsive table-card mb-1">
                                        <table className="table align-middle table-nowrap" id="customerTable">
                                            <thead className="table-light">
                                                <tr>
                                                    <th scope="col" style={{ width: '50px' }}>
                                                        <div className="form-check">
                                                            {/* <input className="form-check-input" type="checkbox" id="checkAll" defaultValue="option" /> */}
                                                        </div>
                                                    </th>
                                                    <th className="sort text-center" data-sort="email">Customer Name</th>
                                                    <th className="sort text-center" data-sort="phone">City</th>
                                                    <th className="sort text-center" data-sort="date">Review</th>
                                                    <th className="sort text-center" data-sort="action">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="list form-check-all">
                                                {reviews?.map((item, i) => {
                                                    return (
                                                        <tr>
                                                            <td className="text-center id"><a href="javascript:void(0);" className="fw-medium link-primary">{i + 1}</a></td>
                                                            <td className="text-center customer_name">{item.customer_name}</td>
                                                            <td className="text-center email">{item.city}</td>
                                                            <td className="text-center date">{item.reviews}</td>
                                                            <td>
                                                                <div className="d-flex justify-content-center gap-2">
                                                                    <div className="edit">
                                                                        <button onClick={() => setEditableTestimonial(item)} className="btn btn-sm btn-success edit-item-btn" data-bs-toggle="modal" data-bs-target="#editBanner">Edit</button>
                                                                    </div>
                                                                    <div className="remove">
                                                                        <button onClick={() => setDelID(item.id)} className="btn btn-sm btn-danger remove-item-btn" data-bs-toggle="modal" data-bs-target="#deleteRecordModal">Remove</button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div>
                            <div className="modal fade" id="addplots" tabIndex={-1} aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered w-50">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="myModalLabel">Add Testimonials</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                        </div>
                                        <div className="modal-body">
                                            <ReviewForm />
                                        </div>
                                    </div>{/*end modal-content*/}
                                </div>{/*end modal-dialog*/}
                            </div>{/*end modal*/}
                        </div>
                    </div>{/* end col */}
                </div>{/*end row*/}
                <div className="modal fade zoomIn" id="deleteRecordModal" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="btn-close" />
                            </div>
                            <div className="modal-body">
                                <div className="mt-2 text-center">
                                    <lord-icon src="https://cdn.lordicon.com/gsqxdxog.json" trigger="loop" colors="primary:#f7b84b,secondary:#f06548" style={{ width: '100px', height: '100px' }} />
                                    <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                                        <h4>Are you Sure ?</h4>
                                        <p className="text-muted mx-4 mb-0">Are you Sure You want to Remove this Record ?</p>
                                    </div>
                                </div>
                                <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                                    <button type="button" className="btn w-sm btn-light" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn w-sm btn-danger " onClick={deleteReview} id="delete-record">Yes, Delete It!</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="editBanner" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered w-50">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="myModalLabel">Edit Plot</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <EditReview editableTestimonial={editableTestimonial} />
                            </div>
                        </div>{/*end modal-content*/}
                    </div>{/*end modal-dialog*/}
                </div>{/*end modal*/}
                <svg className="bookmark-hide">
                    <symbol viewBox="0 0 24 24" stroke="currentColor" fill="var(--color-svg)" id="icon-star"><path strokeWidth=".4" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></symbol>
                </svg>
            </div>
        </>
    )

}

export default TestimonialSettings;