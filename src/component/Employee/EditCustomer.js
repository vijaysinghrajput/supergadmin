import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import URLDomain from "../../URL";
import { useToast } from "@chakra-ui/react";
import { useContext } from "react";
import ContextData from "../../context/MainContext";


const EditCustomer = () => {

    const location = useLocation();
    const toast = useToast();
    const [userInfo, setUserInfo] = useState(location.state);
    const { roles } = useContext(ContextData);

    useEffect(() => {
        console.log("location", userInfo);
    }, [userInfo]);

    const update = () => {
        console.log("kit kat", userInfo);
        // PAN: ""
        // aadhar_no: ""
        // address: "Om Nagar Bashratpur"
        // bank_ac_no: ""
        // bank_ifsc: ""
        // bank_name: "union bank"
        // bussiness_id: "123"
        // city: "Gorakhpur"
        // email: "pranehs@gmail.com"
        // id: "11"
        // image: ""
        // join_date: null
        // mobile: null
        // name: "Vijay Singh"
        // roal_name: "Founder"
        // status: "1"
        const formData = new FormData();

        userInfo.imageUpload ? formData.append(`image`, userInfo.imageUpload, userInfo.imageUpload.name) : formData.append('imagePre', userInfo.image);
        formData.append('bussiness_id', userInfo.bussiness_id);
        formData.append('PAN', userInfo.PAN);
        formData.append('aadhar_no', userInfo.aadhar_no);
        formData.append('address', userInfo.address);
        formData.append('bank_ac_no', userInfo.bank_ac_no);
        formData.append('bank_ifsc', userInfo.bank_ifsc);
        formData.append('bank_name', userInfo.bank_name);
        formData.append('city', userInfo.city);
        formData.append('email', userInfo.email);
        formData.append('id', userInfo.id);
        formData.append('join_date', userInfo.join_date);
        formData.append('mobile', userInfo.mobile);
        formData.append('name', userInfo.name);
        formData.append('roal_name', userInfo.roal_name);
        formData.append('status', userInfo.status);
        formData.append('date', +new Date());

        fetch(URLDomain + "/APP-API/App/updateEmpolyee", {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("respond", responseJson)
                responseJson.respond && toast({
                    title: 'employee Details Updated',
                    status: 'success',
                    duration: 3000,
                    isClosable: false,
                })

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

    // const updateImage = () => {
    //     console.log("sesodine", logo, "banner", banner);

    //     const formData = new FormData();

    //     logo ? formData.append(`file`, logo, logo.name) : formData.append("file", banner, banner.name);
    //     logo ? formData.append(`logo`, logo.name) : formData.append("banner", banner.name);
    //     formData.append('bussiness_id', partner.bussiness_id);

    //     console.log("formdata", formData)
    //     fetch(URLDomain + "/APP-API/App/uploadImage", {
    //         method: 'POST',
    //         header: {
    //             'Accept': 'application/json',
    //             'Content-type': 'application/json'
    //         },
    //         body: formData
    //     }).then((response) => response.json())
    //         .then((responseJson) => {
    //             console.log("respond", responseJson)
    //             // if (responseJson.user) {
    //             //     alert("Member Exists");
    //             // } else {
    //             //     console.log("added");
    //             // }
    //             // document.getElementsByClassName("btn-close")[0].click();
    //         })
    //         .catch((error) => {
    //             //  console.error(error);
    //         });
    // }

    return (
        <>
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <div>
                            <div className="team-list row list-view-filter">
                                <div className="col">
                                    <div className="card team-box">
                                        <div className="card-body">
                                            <p className="text-muted" style={{ fontSize: 16 }}>Edit customer details</p>
                                            <div className="live-preview border-top pt-3">
                                                <form action="javascript:void(0);">
                                                    <div className="row">
                                                        <div className="col-4">
                                                            <div class="card mt-2">
                                                                <div class="card-body p-4">
                                                                    <div class="text-center">
                                                                        <div class="profile-user position-relative d-inline-block mx-auto  mb-4">
                                                                            <img src={userInfo.imageUpload ? URL.createObjectURL(userInfo.imageUpload) : userInfo.image ? URLDomain + "/APP-API/" + userInfo.image : "/assets/images/users/avatar-1.jpg"}
                                                                                class="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                                                                alt="user-profile-image" />
                                                                            <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                                                <input id="profile-img-file-input" onChange={e => setUserInfo({ ...userInfo, imageUpload: e.target.files[0] })}
                                                                                    type="file"
                                                                                    class="profile-img-file-input" />
                                                                                <label for="profile-img-file-input" class="profile-photo-edit avatar-xs">
                                                                                    <span class="avatar-title rounded-circle bg-light text-body">
                                                                                        <i class="ri-camera-fill"></i>
                                                                                    </span>
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                        <h5 class="fs-16 mb-1">{userInfo.name}</h5>
                                                                        {/* <p class="text-muted mb-0">Lead Designer / Developer</p> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="card mt-2">
                                                                <div class="card-body p-4">

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-8">
                                                            <div className="row">

                                                                <div className="col-lg-6">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="teammembersName" className="form-label">Name</label>
                                                                        <input type="text" value={userInfo.name} onChange={e => setUserInfo({ ...userInfo, name: e.target.value })} className="form-control" id="teammembersName" placeholder="Enter name" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="designation" className="form-label">Phone</label>
                                                                        <input type="number" value={userInfo.mobile} onChange={e => setUserInfo({ ...userInfo, mobile: e.target.value })} className="form-control" id="designation" placeholder="Enter phone" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="totalProjects" className="form-label">Email</label>
                                                                        <input type="email" value={userInfo.email} onChange={e => setUserInfo({ ...userInfo, email: e.target.value })} className="form-control" id="totalProjects" placeholder="Enter email" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="formFile" className="form-label">City</label>
                                                                        <input className="form-control" value={userInfo.city} onChange={e => setUserInfo({ ...userInfo, city: e.target.value })} type="text" id="formFile" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="totalTasks" className="form-label">Address</label>
                                                                        <input type="text" value={userInfo.address} onChange={e => setUserInfo({ ...userInfo, address: e.target.value })} className="form-control" id="totalTasks" placeholder="Enter address" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="ForminputRole" className="form-label">Role</label>
                                                                        <select id="ForminputRole" value={userInfo.role} onChange={e => setUserInfo({ ...userInfo, role: e.target.value })} className="form-select" data-choices data-choices-sorting="true">
                                                                            {roles?.map((role, i) => {
                                                                                return (
                                                                                    <option value={role.role_name}>{role.role_name}</option>
                                                                                )
                                                                            })}
                                                                        </select>
                                                                    </div>
                                                                </div>{/*end col*/}
                                                                <div className="col-lg-6">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="designation" className="form-label">Bank Name</label>
                                                                        <input type="text" value={userInfo.bank_name} onChange={e => setUserInfo({ ...userInfo, bank_name: e.target.value })} className="form-control" id="designation" placeholder="Enter bank name" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="totalProjects" className="form-label">Account Number</label>
                                                                        <input type="email" value={userInfo.bank_ac_no} onChange={e => setUserInfo({ ...userInfo, bank_ac_no: e.target.value })} className="form-control" id="totalProjects" placeholder="Enter account number" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="formFile" className="form-label">IFSC Code</label>
                                                                        <input className="form-control" value={userInfo.bank_ifsc} onChange={e => setUserInfo({ ...userInfo, bank_ifsc: e.target.value })} type="text" id="formFile" placeholder="IFSC" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="totalTasks" className="form-label">PAN Number</label>
                                                                        <input type="text" value={userInfo.PAN} onChange={e => setUserInfo({ ...userInfo, PAN: e.target.value })} className="form-control" id="totalTasks" placeholder="Enter pan card number" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="totalTasks" className="form-label">Aadhar Number</label>
                                                                        <input type="text" value={userInfo.aadhar_no} onChange={e => setUserInfo({ ...userInfo, aadhar_no: e.target.value })} className="form-control" id="totalTasks" placeholder="Enter aadhar number" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 d-flex justify-content-center align-items-center">
                                                                    <button type="button" onClick={update} className="btn btn-primary">Update</button>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>{/*end row*/}
                                                </form>
                                            </div>
                                        </div>
                                    </div>{/*end card*/}
                                </div>
                            </div>{/*end row*/}
                            {/* Modal */}
                            <div className="modal fade" id="addmembers" tabIndex={-1} aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="myModalLabel">Add New Members</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                        </div>
                                        <div className="modal-body">
                                            <form>
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="mb-3">
                                                            <label htmlFor="teammembersName" className="form-label">Name</label>
                                                            <input type="text" value={userInfo.name} onChange={e => setUserInfo({ ...userInfo, name: e.target.value })} className="form-control" id="teammembersName" placeholder="Enter name" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="mb-3">
                                                            <label htmlFor="designation" className="form-label">Phone</label>
                                                            <input type="number" value={userInfo.mobile} onChange={e => setUserInfo({ ...userInfo, mobile: e.target.value })} className="form-control" id="designation" placeholder="Enter designation" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label htmlFor="totalProjects" className="form-label">Email</label>
                                                            <input type="email" value={userInfo.email} onChange={e => setUserInfo({ ...userInfo, email: e.target.value })} className="form-control" id="totalProjects" placeholder="Total projects" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label htmlFor="totalTasks" className="form-label">Address</label>
                                                            <input type="number" value={userInfo.address} onChange={e => setUserInfo({ ...userInfo, address: e.target.value })} className="form-control" id="totalTasks" placeholder="Total tasks" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="mb-3">
                                                            <label htmlFor="formFile" className="form-label">City</label>
                                                            <input className="form-control" value={userInfo.city} onChange={e => setUserInfo({ ...userInfo, city: e.target.value })} type="text" id="formFile" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <label htmlFor="ForminputRole" className="form-label">Role</label>
                                                            <select id="ForminputRole" onChange={e => setUserInfo({ ...userInfo, role: e.target.value })} className="form-select" data-choices data-choices-sorting="true">
                                                                <option>Employe</option>
                                                                <option>Jr. Employe</option>
                                                                <option>Sr. Employe</option>
                                                            </select>
                                                        </div>
                                                    </div>{/*end col*/}
                                                    <div className="col-lg-12">
                                                        <div className="hstack gap-2 justify-content-end">
                                                            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Close</button>
                                                            <button type="submit" className="btn btn-success">Add Member</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>{/*end modal-content*/}
                                </div>{/*end modal-dialog*/}
                            </div>{/*end modal*/}
                            <div className="offcanvas offcanvas-end border-0" tabIndex={-1} id="offcanvasExample">
                                {/*end offcanvas-header*/}
                                <div className="offcanvas-body profile-offcanvas p-0">
                                    <div className="team-cover">
                                        <img src="assets/images/small/img-9.jpg" alt="" className="img-fluid" />
                                    </div>
                                    <div className="p-3">
                                        <div className="team-settings">
                                            <div className="row">
                                                <div className="col">
                                                    <div className="bookmark-icon flex-shrink-0 me-2">
                                                        <input type="checkbox" id="favourite13" className="bookmark-input bookmark-hide" />
                                                        <label htmlFor="favourite13" className="btn-star">
                                                            <svg width={20} height={20}>
                                                                <use xlinkHref="#icon-star" />
                                                            </svg>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col text-end dropdown">
                                                    <a href="javascript:void(0);" id="dropdownMenuLink14" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <i className="ri-more-fill fs-17" />
                                                    </a>
                                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuLink14">
                                                        <li><a className="dropdown-item" href="javascript:void(0);"><i className="ri-eye-line me-2 align-middle" />View</a></li>
                                                        <li><a className="dropdown-item" href="javascript:void(0);"><i className="ri-star-line me-2 align-middle" />Favorites</a></li>
                                                        <li><a className="dropdown-item" href="javascript:void(0);"><i className="ri-delete-bin-5-line me-2 align-middle" />Delete</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>{/*end col*/}
                                    </div>
                                    <div className="p-3 text-center">
                                        <img src="assets/images/users/avatar-2.jpg" alt="" className="avatar-lg img-thumbnail rounded-circle mx-auto" />
                                        <div className="mt-3">
                                            <h5 className="fs-15"><a href="javascript:void(0);" className="link-primary">Nancy Martino</a></h5>
                                            <p className="text-muted">Team Leader &amp; HR</p>
                                        </div>
                                        <div className="hstack gap-2 justify-content-center mt-4">
                                            <div className="avatar-xs">
                                                <a href="javascript:void(0);" className="avatar-title bg-soft-secondary text-secondary rounded fs-16">
                                                    <i className="ri-facebook-fill" />
                                                </a>
                                            </div>
                                            <div className="avatar-xs">
                                                <a href="javascript:void(0);" className="avatar-title bg-soft-success text-success rounded fs-16">
                                                    <i className="ri-slack-fill" />
                                                </a>
                                            </div>
                                            <div className="avatar-xs">
                                                <a href="javascript:void(0);" className="avatar-title bg-soft-info text-info rounded fs-16">
                                                    <i className="ri-linkedin-fill" />
                                                </a>
                                            </div>
                                            <div className="avatar-xs">
                                                <a href="javascript:void(0);" className="avatar-title bg-soft-danger text-danger rounded fs-16">
                                                    <i className="ri-dribbble-fill" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row g-0 text-center">
                                        <div className="col-6">
                                            <div className="p-3 border border-dashed border-start-0">
                                                <h5 className="mb-1">124</h5>
                                                <p className="text-muted mb-0">Projects</p>
                                            </div>
                                        </div>{/*end col*/}
                                        <div className="col-6">
                                            <div className="p-3 border border-dashed border-start-0">
                                                <h5 className="mb-1">81</h5>
                                                <p className="text-muted mb-0">Tasks</p>
                                            </div>
                                        </div>{/*end col*/}
                                    </div>{/*end row*/}
                                    <div className="p-3">
                                        <h5 className="fs-15 mb-3">Personal Details</h5>
                                        <div className="mb-3">
                                            <p className="text-muted text-uppercase fw-semibold fs-12 mb-2">Number</p>
                                            <h6>+(256) 2451 8974</h6>
                                        </div>
                                        <div className="mb-3">
                                            <p className="text-muted text-uppercase fw-semibold fs-12 mb-2">Email</p>
                                            <h6>nancymartino@email.com</h6>
                                        </div>
                                        <div>
                                            <p className="text-muted text-uppercase fw-semibold fs-12 mb-2">Location</p>
                                            <h6 className="mb-0">Carson City - USA</h6>
                                        </div>
                                    </div>
                                    <div className="p-3 border-top">
                                        <h5 className="fs-15 mb-4">File Manager</h5>
                                        <div className="d-flex mb-3">
                                            <div className="flex-shrink-0 avatar-xs">
                                                <div className="avatar-title bg-soft-danger text-danger rounded fs-16">
                                                    <i className="ri-image-2-line" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-1"><a href="javascript:void(0);">Images</a></h6>
                                                <p className="text-muted mb-0">4469 Files</p>
                                            </div>
                                            <div className="text-muted">
                                                12 GB
                                            </div>
                                        </div>
                                        <div className="d-flex mb-3">
                                            <div className="flex-shrink-0 avatar-xs">
                                                <div className="avatar-title bg-soft-secondary text-secondary rounded fs-16">
                                                    <i className="ri-file-zip-line" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-1"><a href="javascript:void(0);">Documents</a></h6>
                                                <p className="text-muted mb-0">46 Files</p>
                                            </div>
                                            <div className="text-muted">
                                                3.46 GB
                                            </div>
                                        </div>
                                        <div className="d-flex mb-3">
                                            <div className="flex-shrink-0 avatar-xs">
                                                <div className="avatar-title bg-soft-success text-success rounded fs-16">
                                                    <i className="ri-live-line" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-1"><a href="javascript:void(0);">Media</a></h6>
                                                <p className="text-muted mb-0">124 Files</p>
                                            </div>
                                            <div className="text-muted">
                                                4.3 GB
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 avatar-xs">
                                                <div className="avatar-title bg-soft-primary text-primary rounded fs-16">
                                                    <i className="ri-error-warning-line" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <h6 className="mb-1"><a href="javascript:void(0);">Others</a></h6>
                                                <p className="text-muted mb-0">18 Files</p>
                                            </div>
                                            <div className="text-muted">
                                                846 MB
                                            </div>
                                        </div>
                                    </div>
                                </div>{/*end offcanvas-body*/}
                                <div className="offcanvas-foorter border p-3 hstack gap-3 text-center position-relative">
                                    <button className="btn btn-light w-100"><i className="ri-question-answer-fill align-bottom ms-1" /> Send Message</button>
                                    <a href="pages-profile.html" className="btn btn-primary w-100"><i className="ri-user-3-fill align-bottom ms-1" /> View Profile</a>
                                </div>
                            </div>{/*end offcanvas*/}
                        </div>
                    </div>{/* end col */}
                </div>
            </div>
        </>
    )

}

export default EditCustomer;