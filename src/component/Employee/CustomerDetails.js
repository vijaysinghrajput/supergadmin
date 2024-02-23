import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AddCustomerForm } from "./AddCustomerForm";
import ContextData from "../../context/MainContext";
import URLDomain from "../../URL";
import { useDisclosure } from "@chakra-ui/react";
import ConfirmDelete from "../Shared/DeleteConfirmation";


const CustomerDetails = () => {

    const { employes, removeDataToCurrentGlobal, getToast } = useContext(ContextData);
    const data = useContext(ContextData);
    // const [membersList, setMembersList] = useState(employes);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [delID, setDelID] = useState();
    const [showData, setShowData] = useState(employes);

    const search = (i) => {
        const filteredClubs = employes.filter(Club => {
            let ClubLowercase = (
                Club.name
            ).toLowerCase();

            let searchTermLowercase = i.toLowerCase();

            return ClubLowercase.indexOf(searchTermLowercase) > -1;
        })
        // const data = employes.filter(obj => obj.project_name == i);
        setShowData(filteredClubs);
    }

    useEffect(() => {
        setShowData(employes);
    }, [employes]);

    const deleteMem = () => {
        console.log("kit kat", delID);
        fetch(URLDomain + "/APP-API/App/deleteMembers", {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                mobile: delID
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("respond", responseJson)
                responseJson.deleted && removeDataToCurrentGlobal({ type: "employes", payload: delID, where: "mobile" });
                getToast({ title: "Member Deleted", dec: "", status: "error" });
                // if (responseJson.user) {
                //     alert("Member Exists");
                // } else {
                //     console.log("added");
                // }
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
            <ConfirmDelete onOpen={onOpen} isOpen={isOpen} onClose={onClose} deleteMem={deleteMem} />
            <div>
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0">Team</h4>
                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><a href="javascript: void(0);">Pages</a></li>
                                    <Link to="/navneet"><li className="breadcrumb-item active">Team</li></Link>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row g-2">
                            <div className="col-sm-4">
                                <div className="search-box">
                                    <input type="text" className="form-control" onChange={e => search(e.target.value)} placeholder="Search for name, tasks, projects or something..." />
                                    <i className="ri-search-line search-icon" />
                                </div>
                            </div>{/*end col*/}
                            <div className="col-sm-auto ms-auto">
                                <div className="list-grid-nav hstack gap-1">
                                    <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addmembers"><i className="ri-add-fill me-1 align-bottom" /> Add Members</button>
                                </div>
                            </div>{/*end col*/}
                        </div>{/*end row*/}
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <div id="table-pagination">
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
                                                        <th className="sort text-center" data-sort="customer_name">Name</th>
                                                        <th className="sort text-center" data-sort="email">Role</th>
                                                        <th className="sort text-center" data-sort="status">Image</th>
                                                        <th className="sort text-center" data-sort="phone">Phone</th>
                                                        <th className="sort text-center" data-sort="status">Email</th>
                                                        <th className="sort text-center" data-sort="action">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="list form-check-all">
                                                    {showData?.map((item, i) => {
                                                        return (
                                                            <tr>
                                                                <td className="text-center id"><a href="javascript:void(0);" className="fw-medium link-primary">{i + 1}</a></td>
                                                                <td className="text-center customer_name">{item.name}</td>
                                                                <td className="text-center email">{item.roal_name}</td>
                                                                <td className="text-center avatar-xl rounded-circle"><img src={URLDomain + "/APP-API/" + item.image} alt="" style={{ height: '100px', margin: 'auto', borderRadius: '50%', boxShadow: '0 1px 5px 0 grey' }} /></td>
                                                                <td className="text-center status">{item.mobile}</td>
                                                                <td className="text-center status">{item.email}</td>
                                                                <td>
                                                                    <div className="d-flex justify-content-center gap-2">
                                                                        <div className="edit">
                                                                            <Link to={{ pathname: "/customers/edit" }} state={item} className="btn btn-light view-btn">View Profile</Link>
                                                                        </div>
                                                                        {/*         <div className="remove">
                                                                        <button onClick={() => setDelID(item.id)} className="btn btn-sm btn-danger remove-item-btn" data-bs-toggle="modal" data-bs-target="#deleteRecordModal">Remove</button>
                                                                    </div> */}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}

                                                </tbody>
                                            </table>
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
                                </div>
                            </div>{/* end card */}
                        </div>
                        {/* end col */}
                    </div>
                    {/* end col */}
                </div>
                <svg className="bookmark-hide">
                    <symbol viewBox="0 0 24 24" stroke="currentColor" fill="var(--color-svg)" id="icon-star"><path strokeWidth=".4" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></symbol>
                </svg>
            </div>
        </>
    )

}

export default CustomerDetails;