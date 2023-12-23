import { useState, useContext } from 'react';
import URL from '../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../context/MainContext';
// import Roles from '../Settings/Master/Roles';

const cookies = new Cookies();

export const AddCustomerForm = (props) => {

    const { addDataToCurrentGlobal, roles } = useContext(ContextData);
    const [isLoading, setIL] = useState(false);
    const bussnessID = cookies.get("userBussiness_id");
    const [memberDetails, setMemberDetails] = useState({
        name: "",
        email: "",
        mobile: "",
        role: "Empolyee",
        bussiness_id: bussnessID,
        date: Math.round(+new Date() / 1000),
        image: "",
        address: "",
        city: ""
    });

    const AddMember = () => {
        setIL(true);
        fetch(URL + "/APP-API/App/insertQuery", {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                ...memberDetails
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("respond", responseJson)
                if (responseJson.user) {
                    alert("Member Exists");
                } else {
                    console.log("added");
                    addDataToCurrentGlobal({ type: "employes", payload: memberDetails });
                }
                setIL(false);
                document.getElementsByClassName("btn-close")[0].click();
            })
            .catch((error) => {
                //  console.error(error);
            });
    };

    return (
        <>
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="firstNameinput" className="form-label">Full Name</label>
                        <input type="text" onChange={e => setMemberDetails({ ...memberDetails, name: e.target.value })} value={memberDetails.name} className="form-control" placeholder="Enter your full name" id="firstNameinput" />
                    </div>
                </div>{/*end col*/}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="mobilenumberInput" className="form-label">Mobile Number</label>
                        <input type="tel" onChange={e => setMemberDetails({ ...memberDetails, mobile: e.target.value })} value={memberDetails.mobile} className="form-control" placeholder="+(91) 8889964666" id="mobilenumberInput" />
                    </div>
                </div>{/*end col*/}
                <div className="col-md-12">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label">Email</label>
                        <input type="email" onChange={e => setMemberDetails({ ...memberDetails, email: e.target.value })} value={memberDetails.email} className="form-control" placeholder="Enter email" id="compnayNameinput" />
                    </div>
                </div>{/*end col*/}
                {/* Image section */}
                {/* <div class="col-lg-12">
                    <div class="card-body">
                        <p class="text-muted">FilePond is a JavaScript library with profile picture-shaped file upload variation.</p>
                        <div class="avatar-xl mx-auto">
                            <input type="file" class="filepond filepond-input-circle"
                                name="filepond" accept="image/png, image/jpeg, image/gif" />
                        </div>
                    </div>
                </div> */}
                <div className="col-md-12">
                    <div className="mb-3">
                        <label htmlFor="address1ControlTextarea" className="form-label">Address</label>
                        <input type="text" onChange={e => setMemberDetails({ ...memberDetails, address: e.target.value })} className="form-control" placeholder="Address 1" id="address1ControlTextarea" />
                    </div>
                </div>{/*end col*/}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="citynameInput" className="form-label">City</label>
                        <input type="text" onChange={e => setMemberDetails({ ...memberDetails, city: e.target.value })} className="form-control" placeholder="Enter your city" id="citynameInput" />
                    </div>
                </div>{/*end col*/}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="ForminputRole" className="form-label">Role</label>
                        <select id="ForminputRole" onChange={e => setMemberDetails({ ...memberDetails, role: e.target.value })} className="form-select" data-choices data-choices-sorting="true">
                            {roles?.map((role, i) => {
                                return (
                                    <option value={role.role_name}>{role.role_name}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>{/*end col*/}
                <div className="col-lg-12">
                    <div className="text-center mt-2">
                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Updating </a> : <button type="button" onClick={AddMember} className="btn btn-primary">Add</button>}
                    </div>
                </div>{/*end col*/}
            </div>{/*end row*/}
        </>
    )

}