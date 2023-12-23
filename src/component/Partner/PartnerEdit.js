import { useContext } from "react";
import { useEffect, useState } from "react";
import ContextData from "../../context/MainContext";
import URLDomain from "../../URL";
import { FaFacebookF } from 'react-icons/fa';
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { FaLinkedinIn, FaMapMarkedAlt } from 'react-icons/fa';
import Cookies from 'universal-cookie';
const cookies = new Cookies();


const PartnerEdit = () => {

    const { user, Store_bussiness_info, storeBussinessRelode } = useContext(ContextData);
    const adminStoreId = cookies.get("adminStoreId");
    const [Store_bussiness_infoEdit, setPartner] = useState(Store_bussiness_info);
    const [isLoading, setIL] = useState(false);
    const [logo, setLogo] = useState();
    const [banner, setBanner] = useState();

    useEffect(() => {
        setPartner(Store_bussiness_info);
    }, [Store_bussiness_info]);

    const updateBusinessInfo = () => {

        setIL(true);

        fetch(URLDomain + "/APP-API/Billing/updatePartner", {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                ...Store_bussiness_infoEdit
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("respond business info ", responseJson)
                setIL(false);
                storeBussinessRelode()
           
            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    const updateImage = () => {

        setIL(true);
        
        console.log("sesodine", logo, "banner", banner);

        const formData = new FormData();

        logo ? formData.append(`file`, logo, logo.name) : formData.append("file", banner, banner.name);
        logo ? formData.append(`logo`, logo.name) : formData.append("banner", banner.name);
        formData.append('store_id', adminStoreId);
        formData.append('old_logo', Store_bussiness_info?.logo);
        formData.append('old_banner', Store_bussiness_info?.banner);

        console.log("formdata", formData)
        fetch(URLDomain + "/APP-API/Billing/UpdateStoreLogo", {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("respond", responseJson)
                storeBussinessRelode()
                setIL(false);
                // if (responseJson.user) {
                //     alert("Member Exists");
                // } else {
                //     console.log("added");
                // }
                // document.getElementsByClassName("btn-close")[0].click();
            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    return (
        <>
            <div>
                <div className="position-relative mx-n4 mt-n4">
                    <div className="profile-wid-bg profile-setting-img">
                        <img src={banner ? URL.createObjectURL(banner) : Store_bussiness_info?.banner} className="profile-wid-img" alt="" />
                        <div className="overlay-content">
                            <div className="text-end p-3">
                                <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                                    <input id="profile-foreground-img-file-input" onChange={e => setBanner(e.target.files[0])} type="file" className="profile-foreground-img-file-input" />
                                    {banner ? <>
                                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Updating </a> : <button type="button" onClick={updateImage} className="btn btn-primary">Update</button>}

                                              </> : <label htmlFor="profile-foreground-img-file-input" className="profile-photo-edit btn btn-light">
                                        <i className="ri-image-edit-line align-bottom me-1" /> Change Cover
                                    </label>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xxl-3">
                        <div className="card mt-n5">
                            <div className="card-body p-4">
                                <div className="text-center">
                                    <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                                        <img src={logo ? URL.createObjectURL(logo) : Store_bussiness_info?.logo} className="rounded-circle avatar-xl img-thumbnail user-profile-image" alt="user-profile-image" />
                                        <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                            <input id="profile-img-file-input" onChange={e => setLogo(e.target.files[0])} type="file" className="profile-img-file-input" />
                                            <label htmlFor="profile-img-file-input" className="profile-photo-edit avatar-xs">
                                                <span className="avatar-title rounded-circle bg-light text-body">
                                                    <i className="ri-camera-fill" />
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <h5 className="fs-16 mb-1">{Store_bussiness_info?.buss_name}</h5>
                                    <p className="text-muted mb-0">{Store_bussiness_info.store_slug_name}</p>
                                    {logo &&  <>
                                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Updating </a> : <button type="button" onClick={updateImage} className="btn btn-primary">Update</button>}

                                              </>
                                    }
                                </div>
                            </div>
                        </div>
                     
                    </div>
                    {/*end col*/}
                    <div className="col-xxl-9">
                        <div className="card mt-xxl-n5">
                            <div className="card-header">
                                <ul className="nav nav-tabs-custom rounded card-header-tabs border-bottom-0" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active" data-bs-toggle="tab" href="#personalDetails" role="tab">
                                            <i className="fas fa-home" />
                                            Business Info
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" data-bs-toggle="tab" href="#changePassword" role="tab">
                                            <i className="far fa-user" />
                                            Address
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" data-bs-toggle="tab" href="#contact" role="tab">
                                            <i className="far fa-envelope" />
                                            Contact
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" data-bs-toggle="tab" href="#privacy" role="tab">
                                            <i className="far fa-envelope" />
                                            Privacy & Terms
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" data-bs-toggle="tab" href="#delivery_charge" role="tab">
                                            <i className="far fa-envelope" />
                                           Delivery & Charge
                                        </a>
                                    </li>

                                </ul>
                            </div>
                            <div className="card-body p-4">
                                <div className="tab-content">
                                    <div className="tab-pane active" id="personalDetails" role="tabpanel">
                                        <form action="javascript:void(0);">
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="firstnameInput" className="form-label">Business  Name</label>
                                                        <input type="text" className="form-control" id="firstnameInput" value={Store_bussiness_infoEdit?.buss_name} onChange={e => setPartner({ ...Store_bussiness_infoEdit, buss_name: e.target.value })} placeholder="Enter your firstname" />
                                                    </div>
                                                </div>
                                                {/*end col*/}

                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="emailInput" className="form-label">Email
                                                            Address</label>
                                                        <input type="email" value={Store_bussiness_infoEdit?.company_email} onChange={e => setPartner({ ...Store_bussiness_infoEdit, company_email: e.target.value })} className="form-control" id="emailInput" placeholder="Enter your email" />
                                                    </div>
                                                </div>
                                                {/*end col*/}
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="designationInput" className="form-label">Tag Link</label>
                                                        <input type="text" value={Store_bussiness_infoEdit?.tag_line} onChange={e => setPartner({ ...Store_bussiness_infoEdit, tag_line: e.target.value })} className="form-control" id="designationInput" placeholder="Designation" />
                                                    </div>
                                                </div>
                                                {/*end col*/}
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="websiteInput1" className="form-label">Website</label>
                                                        <input type="text" value={Store_bussiness_infoEdit?.website} onChange={e => setPartner({ ...Store_bussiness_infoEdit, website: e.target.value })} className="form-control" id="websiteInput1" placeholder="www.example.com" />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="websiteInput1" className="form-label">GST NO</label>
                                                        <input type="text" value={Store_bussiness_infoEdit?.gst_no} onChange={e => setPartner({ ...Store_bussiness_infoEdit, gst_no: e.target.value })} className="form-control" id="websiteInput1" placeholder="GST NO" />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="websiteInput1" className="form-label">Fssai NO</label>
                                                        <input type="text" value={Store_bussiness_infoEdit?.fassai_no} onChange={e => setPartner({ ...Store_bussiness_infoEdit, fassai_no: e.target.value })} className="form-control" id="websiteInput1" placeholder="Fssai NO" />
                                                    </div>
                                                </div>

                                                {/*end col*/}
                                                
                                                <div className="col-lg-12">
                                                    <div className="mb-3 pb-2">
                                                        <label htmlFor="exampleFormControlTextarea" className="form-label">Description</label>
                                                        <textarea className="form-control" value={Store_bussiness_infoEdit?.about_us} onChange={e => setPartner({ ...Store_bussiness_infoEdit, about_us: e.target.value })} id="exampleFormControlTextarea" placeholder="Enter your description" rows={3} />
                                                    </div>
                                                </div>
                                                {/*end col*/}

                                            </div>
                                            {/*end row*/}
                                        </form>
                                    </div>
                                    {/*end tab-pane*/}
                                    <div className="tab-pane" id="changePassword" role="tabpanel">
                                        <form action="javascript:void(0);">
                                            <div className="row g-2">
                                                <div className="col-lg-12">
                                                    <div className="mb-3">
                                                        <label htmlFor="cityInput" className="form-label">Address 1</label>
                                                        <input type="text" value={Store_bussiness_infoEdit?.strteet_linn1} onChange={e => setPartner({ ...Store_bussiness_infoEdit, strteet_linn1: e.target.value })} className="form-control" id="cityInput" placeholder="City" />
                                                    </div>
                                                </div>
                                                {/*end col*/}
                                                <div className="col-lg-12">
                                                    <div className="mb-3">
                                                        <label htmlFor="countryInput" className="form-label">Address 2</label>
                                                        <input type="text" value={Store_bussiness_infoEdit?.strteet_linn2} onChange={e => setPartner({ ...Store_bussiness_infoEdit, strteet_linn2: e.target.value })} className="form-control" id="countryInput" placeholder="Country" />
                                                    </div>
                                                </div>
                                                {/*end col*/}
                                                <div className="col-lg-4">
                                                    <div className="mb-3">
                                                        <label htmlFor="countryInput" className="form-label">Area</label>
                                                        <input type="text" value={Store_bussiness_infoEdit?.area} onChange={e => setPartner({ ...Store_bussiness_infoEdit, area: e.target.value })} className="form-control" id="countryInput" placeholder="Country" />
                                                    </div>
                                                </div>
                                                {/*end col*/}
                                                <div className="col-lg-4">
                                                    <div className="mb-3">
                                                        <label htmlFor="cityInput" className="form-label">City</label>
                                                        <input type="text" value={Store_bussiness_infoEdit?.city} onChange={e => setPartner({ ...Store_bussiness_infoEdit, city: e.target.value })} className="form-control" id="cityInput" placeholder="City" />
                                                    </div>
                                                </div>
                                                {/*end col*/}
                                                <div className="col-lg-4">
                                                    <div className="mb-3">
                                                        <label htmlFor="countryInput" className="form-label">State</label>
                                                        <input type="text" value={Store_bussiness_infoEdit?.state} onChange={e => setPartner({ ...Store_bussiness_infoEdit, state: e.target.value })} className="form-control" id="countryInput" placeholder="Country" />
                                                    </div>
                                                </div>
                                                {/*end col*/}
                                                <div className="col-lg-4">
                                                    <div className="mb-3">
                                                        <label htmlFor="zipcodeInput" className="form-label">Zip
                                                            Code</label>
                                                        <input type="text" value={Store_bussiness_infoEdit?.pin_code} onChange={e => setPartner({ ...Store_bussiness_infoEdit, pin_code: e.target.value })} className="form-control" minLength={5} maxLength={6} id="zipcodeInput" placeholder="Enter zipcode" />
                                                    </div>
                                                </div>

                                                <div className="col-lg-4">
                                                    <div className="mb-3">
                                                        <label htmlFor="zipcodeInput" className="form-label">Latitude</label>
                                                        <input type="text" value={Store_bussiness_infoEdit?.lat} onChange={e => setPartner({ ...Store_bussiness_infoEdit, lat: e.target.value })} className="form-control"  id="latInput" placeholder="Enter latitude" />
                                                    </div>
                                                </div>


                                                <div className="col-lg-4">
                                                    <div className="mb-3">
                                                        <label htmlFor="zipcodeInput" className="form-label">Longitude</label>
                                                        <input type="text" value={Store_bussiness_infoEdit?.lng} onChange={e => setPartner({ ...Store_bussiness_infoEdit, lng: e.target.value })} className="form-control"  id="lngInput" placeholder="Enter longitude" />
                                                    </div>
                                                </div>
                                                {/*end col*/}
                                            </div>
                                            {/*end row*/}
                                        </form>
                                    </div>
                                    {/*end tab-pane*/}
                                    <div className="tab-pane" id="contact" role="tabpanel">
                                        <form>
                                            <div id="newlink">
                                                <div id={1}>
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="mb-3">
                                                                <label htmlFor="phonenumberInput" className="form-label">Teliphone
                                                                    Number</label>
                                                                <input type="number" maxLength={10} minLength={10} value={Store_bussiness_infoEdit?.teliphone1} onChange={e => setPartner({ ...Store_bussiness_infoEdit, teliphone1: e.target.value })} className="form-control" id="phonenumberInput" placeholder="Enter your phone number" defaultValue="+(1) 987 6543" />
                                                            </div>
                                                        </div>
                                                        {/*end col*/}
                                                        <div className="col-lg-6">
                                                            <div className="mb-3">
                                                                <label htmlFor="phonenumberInput" className="form-label"> Alternate Teliphone
                                                                    Number</label>
                                                                <input type="number" maxLength={10} minLength={10} value={Store_bussiness_infoEdit?.teliphone2} onChange={e => setPartner({ ...Store_bussiness_infoEdit, teliphone2: e.target.value })} className="form-control" id="phonenumberInput" placeholder="Enter your phone number" defaultValue="+(1) 987 6543" />
                                                            </div>
                                                        </div>
                                                        {/*end col*/}
                                                        <div className="col-lg-6">
                                                            <div className="mb-3">
                                                                <label htmlFor="phonenumberInput" className="form-label">Primary Phone
                                                                    Number</label>
                                                                <input type="number" maxLength={10} minLength={10} value={Store_bussiness_infoEdit?.mobile1} onChange={e => setPartner({ ...Store_bussiness_infoEdit, mobile1: e.target.value })} className="form-control" id="phonenumberInput" placeholder="Enter Primary phone number" defaultValue="+(1) 987 6543" />
                                                            </div>
                                                        </div>
                                                        {/*end col*/}
                                                        <div className="col-lg-6">
                                                            <div className="mb-3">
                                                                <label htmlFor="phonenumberInput" className="form-label"> Alternate Phone
                                                                    Number</label>
                                                                <input type="number" maxLength={10} minLength={10} value={Store_bussiness_infoEdit?.mobile2} onChange={e => setPartner({ ...Store_bussiness_infoEdit, mobile2: e.target.value })} className="form-control" id="phonenumberInput" placeholder="Enter your phone number" defaultValue="+(1) 987 6543" />
                                                            </div>
                                                        </div>
                                                        {/*end col*/}
                                                    </div>
                                                    {/*end row*/}
                                                </div>
                                            </div>
                                            {/*end col*/}
                                        </form>
                                    </div>
                                    {/*end tab-pane*/}

                                    <div className="tab-pane" id="privacy" role="tabpanel">
                                        <form>
                                            <div id="newlink">
                                                <div id={1}>
                                                    <div className="row">
                                                    <div className="col-lg-12">
                                                    <div className="mb-3 pb-2">
                                                        <label htmlFor="exampleFormControlTextarea" className="form-label">Privacy & Policy</label>
                                                        <textarea className="form-control" value={Store_bussiness_infoEdit?.privacy} onChange={e => setPartner({ ...Store_bussiness_infoEdit, privacy: e.target.value })} id="exampleFormControlTextarea" placeholder="Privacy & Policy" rows={6} />
                                                    </div>
                                                   </div>


                                                   <div className="col-lg-12">
                                                    <div className="mb-3 pb-2">
                                                        <label htmlFor="exampleFormControlTextarea" className="form-label">Terms & Condition</label>
                                                        <textarea className="form-control" value={Store_bussiness_infoEdit?.terms} onChange={e => setPartner({ ...Store_bussiness_infoEdit, terms: e.target.value })} id="exampleFormControlTextarea" placeholder="Terms & Condition" rows={6} />
                                                    </div>
                                                   </div>

                                                   <div className="col-lg-12">
                                                    <div className="mb-3 pb-2">
                                                        <label htmlFor="exampleFormControlTextarea" className="form-label">Returns Policy</label>
                                                        <textarea className="form-control" value={Store_bussiness_infoEdit?.returns} onChange={e => setPartner({ ...Store_bussiness_infoEdit, returns: e.target.value })} id="exampleFormControlTextarea" placeholder="Returns Policy" rows={6} />
                                                    </div>
                                                   </div>


                                                   <div className="col-lg-12">
                                                    <div className="mb-3 pb-2">
                                                        <label htmlFor="exampleFormControlTextarea" className="form-label">Shiiping Condition</label>
                                                        <textarea className="form-control" value={Store_bussiness_infoEdit?.shiiping} onChange={e => setPartner({ ...Store_bussiness_infoEdit, shiiping: e.target.value })} id="exampleFormControlTextarea" placeholder="Shiiping Condition" rows={6} />
                                                    </div>
                                                   </div>


                                                       
                                                    </div>
                                                    {/*end row*/}
                                                </div>
                                            </div>
                                            {/*end col*/}
                                        </form>
                                    </div>
                                    {/*end tab-pane*/}


                                    <div className="tab-pane" id="delivery_charge" role="tabpanel">
                                    <form action="javascript:void(0);">
                                            <div className="row g-2">
                                            
                                                <div className="col-lg-4">
                                                    <div className="mb-3">
                                                        <label htmlFor="countryInput" className="form-label">Minimum Order Value ₹ </label>
                                                        <input type="number" value={Store_bussiness_infoEdit?.minimum_order} onChange={e => setPartner({ ...Store_bussiness_infoEdit, minimum_order: e.target.value })} className="form-control" id="countryInput" placeholder="Minimum Order Value" />
                                                    </div>
                                                </div>
                                                {/*end col*/}
                                                <div className="col-lg-4">
                                                    <div className="mb-3">
                                                        <label htmlFor="cityInput" className="form-label">Carry Bag Required (Item Quantity)</label>
                                                        <input type="text" value={Store_bussiness_infoEdit?.carry_bag_charge_minimum_qty} onChange={e => setPartner({ ...Store_bussiness_infoEdit, carry_bag_charge_minimum_qty: e.target.value })} className="form-control" id="cityInput" placeholder="Carry Bag Required (Item Quantity)" />
                                                    </div>
                                                </div>
                                                {/*end col*/}
                                                <div className="col-lg-4">
                                                    <div className="mb-3">
                                                        <label htmlFor="countryInput" className="form-label">Carry Bag Charge ₹ </label>
                                                        <input type="text" value={Store_bussiness_infoEdit?.carry_bag_charge} onChange={e => setPartner({ ...Store_bussiness_infoEdit, carry_bag_charge: e.target.value })} className="form-control" id="countryInput" placeholder="Carry Bag Charge" />
                                                    </div>
                                                </div>
                                                {/*end col*/}
                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="zipcodeInput" className="form-label">Delivery Charge (Min Order Value)
                                                            </label>
                                                        <input type="text" value={Store_bussiness_infoEdit?.shipping} onChange={e => setPartner({ ...Store_bussiness_infoEdit, shipping: e.target.value })} className="form-control" minLength={5} maxLength={6} id="zipcodeInput" placeholder="Delivery Charge (Min Order Value)" />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6">
                                                    <div className="mb-3">
                                                        <label htmlFor="zipcodeInput" className="form-label">Delivery Charge ₹ </label>
                                                        <input type="text" value={Store_bussiness_infoEdit?.charges} onChange={e => setPartner({ ...Store_bussiness_infoEdit, charges: e.target.value })} className="form-control"  id="latInput" placeholder="Delivery Charge" />
                                                    </div>
                                                </div>


                                                
                                                {/*end col*/}
                                            </div>
                                            {/*end row*/}
                                        </form>
                                    </div>
                                    {/*end tab-pane*/}



                                    <div className="col-lg-12">
                                        <div className="hstack gap-2 justify-content-end">
                                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Updating </a> : <button type="button" onClick={updateBusinessInfo} className="btn btn-primary">Update</button>}

                                        </div>
                                    </div>
                                    {/*end col*/}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*end col*/}

                       {/*end card*/}
                       <div className="card">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="flex-grow-1">
                                        <h5 className="card-title mb-0">Social Links</h5>
                                    </div>
                                  
                                </div>
                                <div className="mb-3 d-flex">
                                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                                        <span className="avatar-title rounded-circle fs-16 bg-light text-dark border">
                                            <FaMapMarkedAlt />
                                        </span>
                                    </div>
                                    <input type="text" value={Store_bussiness_infoEdit?.google_map_link} onChange={e => setPartner({ ...Store_bussiness_infoEdit, google_map_link: e.target.value })} className="form-control" id="gitUsername" placeholder="https://www.google.com/maps/embed?#########" />
                                </div>
                                <div className="mb-3 d-flex">
                                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                                        <span className="avatar-title rounded-circle fs-16 bg-primary text-light">
                                            <FaFacebookF />
                                        </span>
                                    </div>
                                    <input type="text" value={Store_bussiness_infoEdit?.facebook} onChange={e => setPartner({ ...Store_bussiness_infoEdit, facebook: e.target.value })} className="form-control" id="gitUsername" placeholder="https://www.facebook.com/xxxxxxxxxx/" />
                                </div>
                                <div className="mb-3 d-flex">
                                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                                        <span className="avatar-title rounded-circle fs-16" style={{ background: "#d85252" }}>
                                            <AiOutlineInstagram />
                                        </span>
                                    </div>
                                    <input type="text" value={Store_bussiness_infoEdit?.instagram} onChange={e => setPartner({ ...Store_bussiness_infoEdit, instagram: e.target.value })} className="form-control" id="websiteInput" placeholder="https://www.instagram.com/xxxxxxxx" />
                                </div>
                                <div className="mb-3 d-flex">
                                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                                        <span className="avatar-title rounded-circle fs-16 bg-success">
                                            <FaLinkedinIn />
                                        </span>
                                    </div>
                                    <input type="text" value={Store_bussiness_infoEdit?.linkedin} onChange={e => setPartner({ ...Store_bussiness_infoEdit, linkedin: e.target.value })} className="form-control" id="dribbleName" placeholder="https://www.linkedin.com/in/xxxxxxx-xxxxxx-xxxxxx/" />
                                </div>
                                <div className="d-flex">
                                    <div className="avatar-xs d-block flex-shrink-0 me-3">
                                        <span className="avatar-title rounded-circle fs-16" style={{ background: "#1e5dff" }}>
                                            <AiOutlineTwitter />
                                        </span>
                                    </div>
                                    <input type="text" value={Store_bussiness_infoEdit?.twitter} onChange={e => setPartner({ ...Store_bussiness_infoEdit, twitter: e.target.value })} className="form-control" id="pinterestName" placeholder="https://twitter.com/xxxxxxxxxx" />
                                </div>

                                <div className="col-lg-12 mt-2">
                                        <div className="hstack gap-2 justify-content-end">
                                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Updating </a> : <button type="button" onClick={updateBusinessInfo} className="btn btn-primary">Update</button>}

                                        </div>
                                    </div>
                            </div>
                        </div>
                        {/*end card*/}

                </div>
            </div>
        </>
    )

}

export default PartnerEdit;