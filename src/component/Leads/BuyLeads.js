import React, { useState, useContext } from 'react';
import { HiCash } from 'react-icons/hi';
import { useEffect } from 'react';
import ContextData from '../../context/MainContext';
import URLDomain from '../../URL';
import { Checkbox, CheckboxGroup } from '@chakra-ui/react';

const BuyLeads = () => {

    const [leadOptionType, setLeadOptionType] = useState({});
    const { leadsPricing, user } = useContext(ContextData);
    const [states, setStates] = useState();
    const [allCitys, setCitys] = useState();
    const lead_quantity = [10, 20, 50, 100, 200, 300, 500, 1000, 1200, 1500, 2000, 3000, 5000];

    useEffect(() => {
        console.log("iouwert", leadOptionType);
    }, [leadOptionType]);

    const orderLeads = () => {
        console.log("all data", {
            order_id: Math.floor(Math.random() * (99999 - 10000 + 1) + 10000),
            bussiness_id: user.user_info.bussiness_id,
            lead_cost: leadOptionType.rate_per_leads * leadOptionType.lead_quantity,
            order_date: +new Date(),
            payment_status: 0,
            transaction_id: 0,
            order_status: 1,
            ...leadOptionType
        })
        fetch(URLDomain + "/APP-API/App/leadsOrder", {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                order_id: Math.floor(Math.random() * (99999 - 10000 + 1) + 10000),
                bussiness_id: user.user_info.bussiness_id,
                lead_cost: leadOptionType.rate_per_leads * leadOptionType.lead_quantity,
                order_date: +new Date(),
                payment_status: 0,
                transaction_id: 0,
                order_status: 1,
                ...leadOptionType
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("respond", responseJson)
                for (let i = 0; i < 10; i++) {
                    document.getElementsByClassName("btn-close")[i].click();
                }
            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    const getStates = () => {
        var headers = new Headers();
        headers.append("X-CSCAPI-KEY", "bkJWS0xjWG04OEJxNGRHS1B0cjRWZGdqZUJxRGVpYlBmNGYwcnBUMw==");

        var requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        };

        fetch("https://api.countrystatecity.in/v1/countries/IN/states", requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log("respond", responseJson);
                // setStates(responseJson);
                setStates([{ name: "Uttar Pradesh", iso2: "UP" }]);
                setCitys([{ name: "Gorakhpur", iso2: "GKP" }, { name: "Lucknow", iso2: "LKO" }, { name: "Khushinagar", iso2: "KUS" }]);
            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    // const getAllCitys = () => {
    //     var headers = new Headers();
    //     headers.append("X-CSCAPI-KEY", "bkJWS0xjWG04OEJxNGRHS1B0cjRWZGdqZUJxRGVpYlBmNGYwcnBUMw==");

    //     var requestOptions = {
    //         method: 'GET',
    //         headers: headers,
    //         redirect: 'follow'
    //     };

    //     fetch(`https://api.countrystatecity.in/v1/countries/IN/states/${leadOptionType.state}/cities`, requestOptions)
    //         .then((response) => response.json())
    //         .then((responseJson) => {
    //             // console.log("respond", responseJson);
    //             // setCitys(responseJson);
    //         })
    //         .catch((error) => {
    //             //  console.error(error);
    //         });
    // }

    useEffect(() => {
        if (!states) getStates();
    }, [states]);

    // useEffect(() => {
    //     getAllCitys();
    // }, [leadOptionType.state])

    return (
        <div>
            <div className="row justify-content-center mt-5">
                <div className="col-lg-5">
                    <div className="text-center mb-4 pb-2">
                        <h4 className="fw-semibold fs-22">Choose the plan that's right for you</h4>
                        <p className="text-muted mb-4 fs-15">Simple pricing. No hidden fees. Advanced features for
                            you business.</p>
                    </div>
                </div>
                {/*end col*/}
            </div>
            {/*end row*/}
            <div className="row justify-content-center">
                <div className="col-xl-9">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card pricing-box">
                                <div className="card-body p-4 m-2">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            <h5 className="mb-1" style={{ fontSize: 18, fontWeight: "700" }}>Standerd Plan</h5>
                                            <p className="text-muted mb-0">For Startup</p>
                                        </div>
                                        <div className="avatar-sm">
                                            <div className="avatar-title bg-light rounded-circle text-primary">
                                                <HiCash size={24} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <h2><span style={{ fontSize: 12, fontWeight: "700" }}>Starting @ </span><sup><small>$</small></sup>19 <span className="fs-13 text-muted">/Month</span></h2>
                                    </div>
                                    <hr className="my-4 text-muted" />
                                    <div>
                                        <ul className="list-unstyled text-muted vstack gap-3">
                                            <li>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0 text-success me-1">
                                                        <i className="ri-checkbox-circle-fill fs-15 align-middle" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        Upto <b>3</b> Projects
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0 text-success me-1">
                                                        <i className="ri-checkbox-circle-fill fs-15 align-middle" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        Upto <b>299</b> Customers
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0 text-success me-1">
                                                        <i className="ri-checkbox-circle-fill fs-15 align-middle" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        Scalable Bandwidth
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0 text-success me-1">
                                                        <i className="ri-checkbox-circle-fill fs-15 align-middle" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <b>5</b> FTP Login
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0 text-danger me-1">
                                                        <i className="ri-close-circle-fill fs-15 align-middle" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <b>24/7</b> Support
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0 text-danger me-1">
                                                        <i className="ri-close-circle-fill fs-15 align-middle" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <b>Unlimited</b> Storage
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0 text-danger me-1">
                                                        <i className="ri-close-circle-fill fs-15 align-middle" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        Domain
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                        <div className="mt-4">
                                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#buyStanderd" onClick={() => setLeadOptionType({ state: "Uttar Pradesh" })} className="btn btn-success w-100 waves-effect waves-light">Buy</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*end col*/}
                        <div className="col-lg-6">
                            <div className="card pricing-box ribbon-box right">
                                <div className="card-body p-4 m-2">
                                    <div className="ribbon-two ribbon-two-danger"><span>Popular</span></div>
                                    <div>
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <h5 className="mb-1" style={{ fontSize: 18, fontWeight: "700" }}>Premium Plan</h5>
                                                <p className="text-muted mb-0">Professional plans</p>
                                            </div>
                                            <div className="avatar-sm">
                                                <div className="avatar-title bg-light rounded-circle text-primary">
                                                    <i className="ri-medal-line fs-20" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <h2><sup><small>$</small></sup> 29<span className="fs-13 text-muted">/Month</span></h2>
                                        </div>
                                    </div>
                                    <hr className="my-4 text-muted" />
                                    <div>
                                        <ul className="list-unstyled vstack gap-3 text-muted">
                                            <li>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0 text-success me-1">
                                                        <i className="ri-checkbox-circle-fill fs-15 align-middle" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        Upto <b>15</b> Projects
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0 text-success me-1">
                                                        <i className="ri-checkbox-circle-fill fs-15 align-middle" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <b>Unlimited</b> Customers
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0 text-success me-1">
                                                        <i className="ri-checkbox-circle-fill fs-15 align-middle" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        Scalable Bandwidth
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0 text-success me-1">
                                                        <i className="ri-checkbox-circle-fill fs-15 align-middle" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <b>12</b> FTP Login
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0 text-success me-1">
                                                        <i className="ri-checkbox-circle-fill fs-15 align-middle" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <b>24/7</b> Support
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0 text-danger me-1">
                                                        <i className="ri-close-circle-fill fs-15 align-middle" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <b>Unlimited</b> Storage
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0 text-danger me-1">
                                                        <i className="ri-close-circle-fill fs-15 align-middle" />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        Domain
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                        <div className="mt-4">
                                            <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#buyPremium" onClick={() => setLeadOptionType({})} className="btn btn-success w-100 waves-effect waves-light">Buy</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Modal */}
                            <div className="modal fade" id="buyStanderd" tabIndex={-1} aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered w-50">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="myModalLabel">Buy Leads</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                        </div>
                                        <div className="modal-body">
                                            <div className="row d-flex align-items-center">
                                                <div className="col-6">
                                                    <h5>Select Leads Type</h5>
                                                </div>
                                                <div className="col-6">
                                                    <button type="button" class="btn btn-light dropdown-toggle w-100"
                                                        data-bs-toggle="dropdown" aria-haspopup="true"
                                                        aria-expanded="false">{leadOptionType.project_type ? `${leadOptionType.project_type}` : "Select Type"}</button>
                                                    <div class="dropdown-menu">
                                                        {leadsPricing?.map((leads, i) => {
                                                            return (
                                                                <>
                                                                    {leads.leads_type == "Standard" && <a class="dropdown-item" onClick={() => setLeadOptionType({ ...leadOptionType, ...leads, lead_type: "" })} href="#">{leads.project_type}</a>}
                                                                </>
                                                            )
                                                        })}
                                                        {/* <a class="dropdown-item" onClick={() => setLeadOptionType({ leads: "50", price: "500" })} href="#">50 Leads ( 500 Rs)</a> */}
                                                    </div>
                                                </div>
                                                {leadOptionType.rate_per_leads && <div className="col-12 d-flex justify-content-between my-2">
                                                    <h5>Rate per leads</h5>
                                                    <h5 style={{ fontWeight: "700", marginRight: 20 }}> ₹{leadOptionType.rate_per_leads}/lead</h5>
                                                </div>}
                                                {leadOptionType.rate_per_leads && <>
                                                    <div className="col-6">
                                                        <h5>Select Number of Leads</h5>
                                                    </div>
                                                    <div className="col-6">
                                                        <button type="button" class="btn btn-light dropdown-toggle w-100"
                                                            data-bs-toggle="dropdown" aria-haspopup="true"
                                                            aria-expanded="false">{leadOptionType.lead_quantity ? `${leadOptionType.lead_quantity}` : "00"}</button>
                                                        <div class="dropdown-menu">
                                                            {lead_quantity?.map((number, i) => {
                                                                return (
                                                                    <>
                                                                        <a class="dropdown-item" onClick={() => setLeadOptionType({ ...leadOptionType, lead_quantity: number })} href="#">{number}</a>
                                                                    </>
                                                                )
                                                            })}
                                                            {/* <a class="dropdown-item" onClick={() => setLeadOptionType({ leads: "50", price: "500" })} href="#">50 Leads ( 500 Rs)</a> */}
                                                        </div>
                                                    </div>
                                                </>}
                                                {leadOptionType.lead_quantity && <div className="col-12 d-flex justify-content-between my-2">
                                                    <h5>Total</h5>
                                                    <h5 style={{ fontWeight: "700", marginRight: 20 }}> ₹{(leadOptionType.rate_per_leads * leadOptionType.lead_quantity).toLocaleString('en-IN')}</h5>
                                                </div>}
                                                {leadOptionType.lead_quantity && <>
                                                    <div className="col-6 my-2">
                                                        Select State
                                                    </div>
                                                    <div className="col-6">
                                                        <select class="form-select " onChange={e => setLeadOptionType({ ...leadOptionType, state: e.target.value })} aria-label="Default select example">
                                                            {states.map((state, i) => {
                                                                return (
                                                                    <option value={state.iso2}>{state.name}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                </>}
                                                {leadOptionType.lead_quantity && <>
                                                    <div className=" mt-2">
                                                        <div className="row">
                                                            <div className="col-6 my-2">
                                                                Select Citys
                                                            </div>

                                                            <div className="col-6">
                                                                <CheckboxGroup colorScheme="orange" size={"sm"} onChange={e => setLeadOptionType({ ...leadOptionType, citys: e })} >
                                                                    <div className="d-flex" style={{ flexDirection: "column" }}>
                                                                        {allCitys.map((state, i) => {
                                                                            return (
                                                                                <Checkbox value={state.name}>{state.name}</Checkbox>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </CheckboxGroup>
                                                                {/*  <select class="form-select" multiple onChange={e => console.log("asdkjgaksdg", e)} aria-label="Default select example">
                                                                    {allCitys.map((state, i) => {
                                                                        return (
                                                                            <option value="1">{state.name}</option>
                                                                        )
                                                                    })}
                                                                </select> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>}
                                                {leadOptionType.citys && <div className="col-12 my-2">
                                                    <div>
                                                        <label for="exampleFormControlTextarea5" class="form-label">Note
                                                        </label>
                                                        <textarea class="form-control" onChange={e => setLeadOptionType({ ...leadOptionType, notes: e.target.value })} id="exampleFormControlTextarea5" rows="3" style={{ height: 100 }}></textarea>
                                                    </div>
                                                </div>}

                                            </div>
                                            <div className="mt-4">
                                                <a href="javascript:void(0);" onClick={orderLeads} className="btn btn-success w-100 waves-effect waves-light">Buy</a>
                                            </div>
                                        </div>
                                    </div>{/*end modal-content*/}
                                </div>{/*end modal-dialog*/}
                            </div>{/*end modal*/}
                            {/* Modal */}
                            <div className="modal fade" id="buyPremium" tabIndex={-1} aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered w-50">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="myModalLabel">Buy Leads</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                        </div>
                                        <div className="modal-body">
                                            <div className="row d-flex align-items-center">
                                                <div className="col-6">
                                                    <h5>Select Leads Type</h5>
                                                </div>
                                                <div className="col-6">
                                                    <button type="button" class="btn btn-light dropdown-toggle w-100"
                                                        data-bs-toggle="dropdown" aria-haspopup="true"
                                                        aria-expanded="false">{leadOptionType.project_type ? `${leadOptionType.project_type}` : "Select Type"}</button>
                                                    <div class="dropdown-menu">
                                                        {leadsPricing?.map((leads, i) => {
                                                            return (
                                                                <>
                                                                    {leads.leads_type == "Premium" && <a class="dropdown-item" onClick={() => setLeadOptionType({ ...leadOptionType, ...leads, lead_type: "" })} href="#">{leads.project_type}</a>}
                                                                </>
                                                            )
                                                        })}
                                                        {/* <a class="dropdown-item" onClick={() => setLeadOptionType({ leads: "50", price: "500" })} href="#">50 Leads ( 500 Rs)</a> */}
                                                    </div>
                                                </div>
                                                {leadOptionType.rate_per_leads && <div className="col-12 d-flex justify-content-between my-2">
                                                    <h5>Rate per leads</h5>
                                                    <h5 style={{ fontWeight: "700", marginRight: 20 }}> ₹{leadOptionType.rate_per_leads}/lead</h5>
                                                </div>}
                                                {leadOptionType.rate_per_leads && <>
                                                    <div className="col-6">
                                                        <h5>Select Number of Leads</h5>
                                                    </div>
                                                    <div className="col-6">
                                                        <button type="button" class="btn btn-light dropdown-toggle w-100"
                                                            data-bs-toggle="dropdown" aria-haspopup="true"
                                                            aria-expanded="false">{leadOptionType.lead_quantity ? `${leadOptionType.lead_quantity}` : "00"}</button>
                                                        <div class="dropdown-menu">
                                                            {lead_quantity?.map((number, i) => {
                                                                return (
                                                                    <>
                                                                        <a class="dropdown-item" onClick={() => setLeadOptionType({ ...leadOptionType, lead_quantity: number })} href="#">{number}</a>
                                                                    </>
                                                                )
                                                            })}
                                                            {/* <a class="dropdown-item" onClick={() => setLeadOptionType({ leads: "50", price: "500" })} href="#">50 Leads ( 500 Rs)</a> */}
                                                        </div>
                                                    </div>
                                                </>}
                                                {leadOptionType.lead_quantity && <div className="col-12 d-flex justify-content-between my-2">
                                                    <h5>Total</h5>
                                                    <h5 style={{ fontWeight: "700", marginRight: 20 }}> ₹{(leadOptionType.rate_per_leads * leadOptionType.lead_quantity).toLocaleString('en-IN')}</h5>
                                                </div>}
                                                {leadOptionType.lead_quantity && <div className="col-12 my-2">
                                                    <div>
                                                        <label for="exampleFormControlTextarea5" class="form-label">Note
                                                        </label>
                                                        <textarea class="form-control" onChange={e => setLeadOptionType({ ...leadOptionType, notes: e.target.value })} id="exampleFormControlTextarea5" rows="3" style={{ height: 100 }}></textarea>
                                                    </div>
                                                </div>}
                                            </div>
                                            <div className="mt-4">
                                                <a href="javascript:void(0);" onClick={orderLeads} className="btn btn-success w-100 waves-effect waves-light">Buy</a>
                                            </div>
                                        </div>
                                    </div>{/*end modal-content*/}
                                </div>{/*end modal-dialog*/}
                            </div>{/*end modal*/}
                        </div>
                        {/*end col*/}
                    </div>
                    {/*end row*/}
                </div>
                {/*end col*/}
            </div>
            {/*end row*/}
        </div>
    );
};

export default BuyLeads;