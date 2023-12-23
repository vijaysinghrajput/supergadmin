import { useContext ,useState,useEffect} from "react";
import { Link } from "react-router-dom";
import ContextData from "../../context/MainContext";
import URLDomain from "../../URL";
import { FaFacebookF } from 'react-icons/fa';
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { FaLinkedinIn, FaMapMarkedAlt } from 'react-icons/fa';
import { ImportNewArea } from "./Import/import-new-area";
import { ImportNewDelSlots } from "./Import/import-new-del-slots";

import { Col, Row, Table } from "react-bootstrap";
import swal from 'sweetalert';

import {
    DatatableWrapper,
    Filter,
    Pagination,
    PaginationOptions,
    TableBody,
    TableHeader
} from "react-bs-datatable";
import { useToast } from '@chakra-ui/react';


const Partner = () => {

    const {  Store_bussiness_info ,store_delivery_slot,store_delivery_area,storeBussinessRelode} = useContext(ContextData);
    const [showData, setShowDeliveyData] = useState(store_delivery_area);
    const [showDataSlot, setShowDataSlot] = useState(store_delivery_slot);
    const [showDataBusiness, setShowDataBusiness] = useState(Store_bussiness_info);

    
    const toast = useToast();
    const getToast = (e) => {
        toast({
            title: e.title,
            description: e.desc,
            status: e.status,
            duration: 3000,
            isClosable: true,
            position: "bottom-right"
        })
    }

    useEffect(() => {
        setShowDataBusiness(Store_bussiness_info); 
        setShowDeliveyData(store_delivery_area); 
        setShowDataSlot(store_delivery_slot); 
    }, [Store_bussiness_info]) 



    const STORY_HEADERS_SLOTS = [

        {
            prop: "slot_time_start",
            title: "Slots",
            isFilterable: true,
            isSortable: true,
            cell: (row) => {
                return (
                    <p > {((Number(row.slot_time_start) > 12)? Number(row.slot_time_start) -12 : Number(row.slot_time_start))+" "+row.start_time_postfix+ " To "+((Number(row.slot_time_end) > 12)? Number(row.slot_time_end) -12 : Number(row.slot_time_end))+" "+row.end_time_postfix+" - "+row.slot_name+" Delivery"}   </p>
                );
            }
    
        },
        {
            prop: "action",
            title: "Action",
    
            cell: (row) => {
                return (
                    <i className="ri-delete-bin-2-line text-danger"  style={{ color:'red',fontSize:'20px', borderRadius: '14px' ,cursor:'pointer'}}  onClick={() => deleteAction(row.id,((Number(row.slot_time_start) > 12)? Number(row.slot_time_start) -12 : Number(row.slot_time_start))+" "+row.start_time_postfix+ " To "+((Number(row.slot_time_end) > 12)? Number(row.slot_time_end) -12 : Number(row.slot_time_end))+" "+row.end_time_postfix+" - "+row.slot_name+" Delivery",'store_delivery_slot')}  />
                );
            }
        }
  
    ];

    const STORY_HEADERS = [

        {
            prop: "area",
            title: "Area",
            isFilterable: true,
            isSortable: true,
            cell: (row) => {
                return (
                    <p > {row.area+", "+row.city}   </p>
                );
            }
    
        },
        {
            prop: "action",
            title: "Action",
    
            cell: (row) => {
                return (
                    <i className="ri-delete-bin-2-line text-danger"  style={{ color:'red',fontSize:'20px', borderRadius: '14px' ,cursor:'pointer'}}  onClick={() => deleteAction(row.id, row.area+ ", "+row.city+", "+row.state,'store_delivery_area')}  />
                    );
            }
        }
  
    ];

    const deleteAction = (del_id, area_name,table_name) => {

     
        


        swal({
            title: "Remove | "+area_name,
            text: "Once deleted, you will not be able to recover this area !",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((deleteProductFromStore) => {



                if (deleteProductFromStore) {


                    fetch(URLDomain + "/APP-API/Billing/deleteStoreDeliveryArea", {
                        method: 'POST',
                        header: {
                            'Accept': 'application/json',
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            del_id: del_id,
                            table_name: table_name
                        })
                    }).then((response) => response.json())
                        .then((responseJson) => {
                            
                            if (responseJson.delete) {
                                getToast({ title: "Area Deleted ", dec: "Successful", status: "success" });

                            } else {
                                getToast({ title: "ERROR", dec: "ERROR", status: "error" });
                            }

                            for (let i = 0; i < 10; i++) {
                                document.getElementsByClassName("btn-close")[i].click();
                            }
                        })
                        .catch((error) => {
                            //  console.error(error); 
                        });




                    swal("Deletet", {
                        icon: "success",
                    });

                    storeBussinessRelode()
                } else {
                    swal("Nothing Change!");
                    storeBussinessRelode()
                }
            });

    }

    return (
        <>
          
                <div className="profile-foreground position-relative mx-n4 mt-n4">
                    <div className="profile-wid-bg">
                        <img src={showDataBusiness?.banner} alt="" className="profile-wid-img" />
                    </div>
                </div>
                <div className="pt-4 mb-4 mb-lg-3 pb-lg-4">
                    <div className="row g-4">
                        <div className="col-auto">
                            <div className="avatar-lg">
                                <img src={showDataBusiness?.logo} alt="user-img" className="img-thumbnail rounded-circle" />
                            </div>
                        </div>
                        {/*end col*/}
                        <div className="col">
                            <div className="p-2">
                                <h3 className="text-white mb-1">{showDataBusiness.buss_name}</h3>
                                <p className="text-white-75">{showDataBusiness.tag_line}</p>
                                <div className="hstack text-white-50 gap-1">
                                    <div className="me-2"><i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle" />{showDataBusiness.area},
                                        {showDataBusiness.city}</div>
                                    <div><i className="ri-store-line me-1 text-white-75 fs-16 align-middle" />{showDataBusiness.store_slug_name}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*end col*/}
                    </div>
                    {/*end row*/}
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div>
                            <div className="d-flex">
                                {/* Nav tabs */}
                                <ul className="nav nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link fs-14 active" data-bs-toggle="tab" href="#overview-tab" role="tab">
                                            <i className="ri-airplay-fill d-inline-block d-md-none" /> <span className="d-none d-md-inline-block">Business Info</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link fs-14" data-bs-toggle="tab" href="#Address" role="tab">
                                            <i className="ri-list-unordered d-inline-block d-md-none" /> <span className="d-none d-md-inline-block">Address</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link fs-14" data-bs-toggle="tab" href="#contact" role="tab">
                                            <i className="ri-price-tag-line d-inline-block d-md-none" /> <span className="d-none d-md-inline-block">Contact</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link fs-14" data-bs-toggle="tab" href="#PrivacyTerms" role="tab">
                                            <i className="ri-folder-4-line d-inline-block d-md-none" /> <span className="d-none d-md-inline-block">Privacy & Terms</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link fs-14" data-bs-toggle="tab" href="#delivery_charge" role="tab">
                                            <i className="ri-folder-4-line d-inline-block d-md-none" /> <span className="d-none d-md-inline-block">Delivery Setting</span>
                                        </a>
                                    </li>
                                   
                                </ul>
                                <div className="flex-shrink-0">
                                    <Link to="/company/edit" className="btn btn-success"><i className="ri-edit-box-line align-bottom" /> Edit Info</Link>
                                </div>
                            </div>
                            {/* Tab panes */}
                            <div className="tab-content pt-4 text-muted">
                                <div className="tab-pane active" id="overview-tab" role="tabpanel">
                                    <div className="row">
                                        <div className="col-xxl-3">
                                            {/* <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title mb-5">Complete Your Profile</h5>
                                                <div className="progress animated-progress custom-progress progress-label">
                                                    <div className="progress-bar bg-danger" role="progressbar" style={{ width: '30%' }} aria-valuenow={30} aria-valuemin={0} aria-valuemax={100}>
                                                        <div className="label">30%</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                         
                                        </div>
                                        {/*end col*/}
                                        <div className="col-xxl-12">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h5 className="card-title mb-3">About</h5>
                                                    <p>{showDataBusiness.about_us}</p>
                                                    <div className="row">

                                                    <div className="col-6 col-md-4">
                                                            <div className="d-flex mt-4">
                                                                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                                                                    <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                                                                        <i className="ri-arrow-right-circle-fill" />
                                                                    </div>
                                                                </div>
                                                                <div className="flex-grow-1 overflow-hidden">
                                                                    <p className="mb-1">Business Name :</p>
                                                                    <a href="#" className="fw-semibold">{showDataBusiness.buss_name}</a>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-6 col-md-4">
                                                            <div className="d-flex mt-4">
                                                                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                                                                    <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                                                                        <i className="ri-arrow-right-circle-fill" />
                                                                    </div>
                                                                </div>
                                                                <div className="flex-grow-1 overflow-hidden">
                                                                    <p className="mb-1">Tag Line :</p>
                                                                    <a href="#" className="fw-semibold">{showDataBusiness.tag_line}</a>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Company Email :</p>
                <a href="#" className="fw-semibold">{showDataBusiness.company_email}</a>
            </div>
        </div>
    </div>
                                                        {/*end col*/}
                                                    </div>


                                                    <div className="row ">



    <div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Website :</p>
                <a href="#" className="fw-semibold">{showDataBusiness.website}</a>
            </div>
        </div>
    </div>

    <div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">GST NO :</p>
                <a href="#" className="fw-semibold">{showDataBusiness.gst_no}</a>
            </div>
        </div>
    </div>

    <div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Fassai NO :</p>
                <a href="#" className="fw-semibold">{showDataBusiness.fassai_no}</a>
            </div>
        </div>
    </div>
    {/*end col*/}
</div>

<div className="row mt-4">
<div className="col-1 col-md-1">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <a href={showDataBusiness.facebook} target="_blank">  <FaFacebookF/></a>
                  
                </div>
            </div>
           
        </div>
    </div>

    <div className="col-1 col-md-1">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <a href={showDataBusiness.instagram} target="_blank">  <AiOutlineInstagram/></a>
                  
                </div>
            </div>
           
        </div>
    </div>

    <div className="col-1 col-md-1">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <a href={showDataBusiness.twitter} target="_blank">  <AiOutlineTwitter/></a>
                  
                </div>
            </div>
           
        </div>
    </div>

    <div className="col-1 col-md-1">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <a href={showDataBusiness.linkedin} target="_blank">  <FaLinkedinIn/></a>
                  
                </div>
            </div>
           
        </div>
    </div>

    <div className="col-1 col-md-1">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <a href={showDataBusiness.google_map_link} target="_blank">  <FaMapMarkedAlt/></a>
                  
                </div>
            </div>
           
        </div>
    </div>

</div>

                                                    {/*end row*/}
                                                </div>
                                                {/*end card-body*/}
                                            </div>
                                        </div>
                                        {/*end col*/}
                                    </div>
                                    {/*end row*/}
                                </div>
                                <div className="tab-pane fade" id="Address" role="tabpanel">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title mb-3">Address</h5>

                                            <div className="row">

<div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Address Line 1 :</p>
                <a href="#" className="fw-semibold">{showDataBusiness.strteet_linn1}</a>
            </div>
        </div>
    </div>

    <div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Address Line 2 :</p>
                <a href="#" className="fw-semibold">{showDataBusiness.strteet_linn2}</a>
            </div>
        </div>
    </div>

    {/*end col*/}
</div>

<div className="row">

<div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Area:</p>
                <a href="#" className="fw-semibold">{showDataBusiness.area}</a>
            </div>
        </div>
    </div>

    <div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">City :</p>
                <a href="#" className="fw-semibold">{showDataBusiness.city}</a>
            </div>
        </div>
    </div>

    <div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">State :</p>
                <a href="#" className="fw-semibold">{showDataBusiness.state}</a>
            </div>
        </div>
    </div>

    {/*end col*/}
</div>


<div className="row">

<div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Zip Code:</p>
                <a href="#" className="fw-semibold">{showDataBusiness.pin_code}</a>
            </div>
        </div>
    </div>

    <div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Latitude :</p>
                <a href="#" className="fw-semibold">{showDataBusiness.lat}</a>
            </div>
        </div>
    </div>

    <div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Longitude :</p>
                <a href="#" className="fw-semibold">{showDataBusiness.lng}</a>
            </div>
        </div>
    </div>

    {/*end col*/}
</div>

                                        </div>
                                        {/*end card-body*/}
                                    </div>
                                    {/*end card*/}
                                </div>


                                {/*end tab-pane*/}
                                <div className="tab-pane fade" id="contact" role="tabpanel">
                                <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title mb-3">Contact</h5>

                                            <div className="row">

<div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Primary Phone Number :</p>
                <a href="#" className="fw-semibold">{showDataBusiness.mobile1}</a>
            </div>
        </div>
    </div>

    <div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Alternate Phone Number :</p>
                <a href="#" className="fw-semibold">{showDataBusiness.mobile2}</a>
            </div>
        </div>
    </div>

    {/*end col*/}
</div>




<div className="row">

<div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Teliphone Number:</p>
                <a href="#" className="fw-semibold">{showDataBusiness.teliphone1}</a>
            </div>
        </div>
    </div>

    <div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Alternate Teliphone Number :</p>
                <a href="#" className="fw-semibold">{showDataBusiness.teliphone2}</a>
            </div>
        </div>
    </div>

    {/*end col*/}
</div>


                                        </div>
                                        {/*end card-body*/}
                                    </div>
                                    {/*end card*/}
                                </div>

                                {/*end tab-pane*/}
                                <div className="tab-pane fade" id="PrivacyTerms" role="tabpanel">
                                    <div className="card">
                                        <div className="card-body">
                                          
                                                <h5 className="card-title mb-3">Privacy & Policy</h5>
                                                <p>{showDataBusiness.privacy}</p>


                                        </div>

                                        <div className="card-body">
                                          
                                          <h5 className="card-title mb-3">Terms & Condition</h5>
                                          <p>{showDataBusiness.terms}</p>


                                  </div>

                                  <div className="card-body">
                                          
                                          <h5 className="card-title mb-3">Returns Policy</h5>
                                          <p>{showDataBusiness.returns}</p>


                                  </div>
                                  <div className="card-body">
                                          
                                          <h5 className="card-title mb-3">Shipping Condition</h5>
                                          <p>{showDataBusiness.shiiping}</p>


                                  </div>
                                    </div>
                                </div>



                                
                                {/*end tab-pane*/}
                                <div className="tab-pane fade" id="delivery_charge" role="tabpanel">

                                    <div className="card">
                                        <div className="card-body">

                            <div className="col-sm-auto ms-auto">
                                <div className="list-grid-nav hstack gap-1">
                                    <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#importdeliveryarea"><i className="ri-add-fill me-1 align-bottom" /> ADD Delivery Area   </button>
                                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#importdeliveryslot"><i className="ri-add-fill me-1 align-bottom" /> ADD Delivery Slot</button>
                                </div>
                            </div>{/*end col*/}

                                        </div>
                                    </div>


                                    <div className="card mt-2">
                                        <div className="card-body">

                                     
                                            <div className="row">

                                            <div className="col-lg-6">
                        <div className="">
                        <h5 className="card-title mb-3">Delivery Slots</h5>
                            <div className="">
                                <div id="customerList">
                                    <div className="table-responsive table-card mb-1 px-4">
                                        <DatatableWrapper
                                            body={showDataSlot}
                                            headers={STORY_HEADERS_SLOTS}
                                            paginationOptionsProps={{
                                                initialState: {
                                                    rowsPerPage: 5,
                                                    options: [5]
                                                }
                                            }}
                                           
                                        >
                                            <Row className="mb-4 p-2">
                                                <Col
                                                    xs={12}
                                                    lg={4}
                                                    className="d-flex flex-col justify-content-end align-items-end"
                                                >
                                                    <Filter />
                                                </Col>
                                                <Col
                                                    xs={12}
                                                    sm={6}
                                                    lg={4}
                                                    className="d-flex flex-col justify-content-lg-center align-items-center justify-content-sm-start mb-2 mb-sm-0"
                                                >
                                                    {/* <PaginationOptions /> */}
                                                </Col>
                                                <Col
                                                    xs={12}
                                                    sm={6}
                                                    lg={4}
                                                    className="d-flex flex-col justify-content-end align-items-end"
                                                >
                                                    {/* <Pagination /> */}
                                                </Col>
                                            </Row>
                                            <Table
                                                className="table  table-hover">
                                                <TableHeader />
                                                <TableBody />
                                            </Table>
                                        </DatatableWrapper>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                                            <div className="col-lg-6">
                        <div className="">
                        <h5 className="card-title mb-3">Delivery Areas</h5>
                            <div className="">
                                <div id="customerList">
                                    <div className="table-responsive table-card mb-1 px-4">
                                        <DatatableWrapper
                                            body={showData}
                                            headers={STORY_HEADERS}
                                            paginationOptionsProps={{
                                                initialState: {
                                                    rowsPerPage: 5,
                                                    options: [5]
                                                }
                                            }}
                                        >
                                            <Row className="mb-4 p-2">
                                                <Col
                                                    xs={12}
                                                    lg={4}
                                                    className="d-flex flex-col justify-content-end align-items-end"
                                                >
                                                    <Filter />
                                                </Col>
                                                <Col
                                                    xs={12}
                                                    sm={6}
                                                    lg={4}
                                                    className="d-flex flex-col justify-content-lg-center align-items-center justify-content-sm-start mb-2 mb-sm-0"
                                                >
                                                    {/* <PaginationOptions /> */}
                                                </Col>
                                                <Col
                                                    xs={12}
                                                    sm={6}
                                                    lg={4}
                                                    className="d-flex flex-col justify-content-end align-items-end"
                                                >
                                                    <Pagination />
                                                </Col>
                                            </Row>
                                            <Table
                                                className="table  table-hover">
                                                <TableHeader />
                                                <TableBody />
                                            </Table>
                                        </DatatableWrapper>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


          
                                       </div>

                                        </div>
                                    </div>


                                <div className="card mt-3">
                                        <div className="card-body">
                                        <h5 className="card-title mb-3">Delivery Charges</h5>
                                            <div className="row">

<div className="col-4 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Minimum Order Value ₹</p>
                <a href="#" className="fw-semibold">₹ {showDataBusiness.minimum_order}</a>
            </div>
        </div>
    </div>

    <div className="col-4 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Delivery Charge (Min Order Value)</p>
                <a href="#" className="fw-semibold">₹ {showDataBusiness.shipping}</a>
            </div>
        </div>
    </div>

    <div className="col-4 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Delivery Charge ₹ </p>
                <a href="#" className="fw-semibold">₹ {showDataBusiness.charges}</a>
            </div>
        </div>
    </div>

 

    {/*end col*/}
</div>




<div className="row">

<div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Carry Bag Required (Item Quantity)</p>
                <a href="#" className="fw-semibold">{showDataBusiness.carry_bag_charge_minimum_qty	}</a>
            </div>
        </div>
    </div>

<div className="col-6 col-md-4">
        <div className="d-flex mt-4">
            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                    <i className="ri-arrow-right-circle-fill" />
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <p className="mb-1">Carry Bag Charge ₹</p>
                <a href="#" className="fw-semibold">₹ {showDataBusiness.carry_bag_charge}</a>
            </div>
        </div>
    </div>

 

    {/*end col*/}
</div>


                                        </div>
                                        {/*end card-body*/}
                                    </div>
                                    {/*end card*/}
                                </div>
                                {/*end tab-pane*/}

                                {/*end tab-pane*/}
                            </div>
                            {/*end tab-content*/}
                        </div>
                    </div>
                    {/*end col*/}
                    

                    <div className="row">
                    <div className="col-lg-12">
                        <div>
                            <div className="modal fade" id="importdeliveryarea" tabIndex={-1} aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered w-50">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="myModalLabel">ADD Delivery Area</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                        </div>
                                        <div className="modal-body">
                                            <ImportNewArea />
                                        </div>
                                    </div>{/*end modal-content*/}
                                </div>{/*end modal-dialog*/}
                            </div>{/*end modal*/}
                        </div>
                    </div>{/* end col */}
                </div>{/*end row*/}

                <div className="row">
                    <div className="col-lg-12">
                        <div>
                            <div className="modal fade" id="importdeliveryslot" tabIndex={-1} aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered w-50">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="myModalLabel">ADD Delivery Slot</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                        </div>
                                        <div className="modal-body">
                                            <ImportNewDelSlots />
                                        </div>
                                    </div>{/*end modal-content*/}
                                </div>{/*end modal-dialog*/}
                            </div>{/*end modal*/}
                        </div>
                    </div>{/* end col */}
                </div>{/*end row*/}


                </div>
            </>
            
      
    )

}

export default Partner;