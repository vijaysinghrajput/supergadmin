import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContextData from '../../context/MainContext';
import URLDomain from '../../URL';

const ManageLeads = () => {

    const { user } = useContext(ContextData);

    const [leadForm, setLeadForm] = useState({
        platform: "self",
        lead_status: 1,
        added_date: +new Date(),
        order_id: Math.floor(Math.random() * (99999 - 10000 + 1) + 10000),
        bussiness_id: user.user_info.bussiness_id
    });

    useEffect(() => {
        console.log("asedfbaskdbf", leadForm)
    }, [leadForm]);

    const addLead = () => {
        console.log("all data", {
            ...leadForm
        })
        fetch(URLDomain + "/APP-API/App/addLead", {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                ...leadForm
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

    return (
        <div>
            <div class="card">
                <div class="card-body p-0">
                    <div class="alert alert-danger border-0 rounded-0 m-0 d-flex align-items-center" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle text-danger me-2 icon-sm"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        <div class="flex-grow-1 text-truncate">
                            You don't have any leads
                        </div>
                        <div class="flex-shrink-0">
                            <a href='javascript:void(0)' data-bs-toggle="modal" data-bs-target="#addLeads" class="text-reset text-decoration-underline"><b>Add Now</b></a>
                        </div>
                    </div>

                    <div class="row align-items-end">
                        <div class="col-sm-8">
                            <div class="p-3">
                                <div class="">
                                    <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#addLeads" class="btn btn-success">Add Lead</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            {/*  <div class="px-3">
                                <img src="assets/images/user-illustarator-2.png" class="img-fluid" alt="" />
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="addLeads" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered w-75">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="myModalLabel">Add Leads</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="live-preview">
                                                <div className="row gy-4">
                                                    <div className="col-xxl-6 col-md-6">
                                                        <div>
                                                            <label htmlFor="name" className="form-label">Name</label>
                                                            <input type="text" onChange={e => setLeadForm({ ...leadForm, name: e.target.value })} className="form-control" id="name" />
                                                        </div>
                                                    </div>
                                                    <div className="col-xxl-6 col-md-6">
                                                        <div>
                                                            <label htmlFor="basiInput" className="form-label">Phone</label>
                                                            <input type="number" onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })} className="form-control" id="basiInput" />
                                                        </div>
                                                    </div>
                                                    <div className="col-xxl-6 col-md-6">
                                                        <div>
                                                            <label htmlFor="basiInput" className="form-label">Alternative Phone</label>
                                                            <input type="number" onChange={e => setLeadForm({ ...leadForm, altPhone: e.target.value })} className="form-control" id="basiInput" />
                                                        </div>
                                                    </div>
                                                    <div className="col-xxl-6 col-md-6">
                                                        <div>
                                                            <label htmlFor="basiInput" className="form-label">Email</label>
                                                            <input type="email" onChange={e => setLeadForm({ ...leadForm, email: e.target.value })} className="form-control" id="basiInput" />
                                                        </div>
                                                    </div>
                                                    <div className="col-xxl-6 col-md-6">
                                                        <div>
                                                            <label htmlFor="name" className="form-label">City</label>
                                                            <input type="text" onChange={e => setLeadForm({ ...leadForm, city: e.target.value })} className="form-control" id="name" />
                                                        </div>
                                                    </div>
                                                    <div class="col-xxl-6 col-md-6">
                                                        <div>
                                                            <label for="exampleFormControlTextarea5" class="form-label">Lead Comment
                                                            </label>
                                                            <textarea onChange={e => setLeadForm({ ...leadForm, comment: e.target.value })} class="form-control" id="exampleFormControlTextarea5"
                                                                rows="3"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/*end row*/}
                                            </div>
                                            <div className="d-none code-view">
                                                <pre className="language-markup" style={{ height: '450px' }}><code>&lt;!-- Basic Input --&gt;{"\n"}&lt;div&gt;{"\n"}{"    "}&lt;label for="basiInput" class="form-label"&gt;Basic Input&lt;/label&gt;{"\n"}{"    "}&lt;input type="password" class="form-control" id="basiInput"&gt;{"\n"}&lt;/div&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Input with Label --&gt;{"\n"}&lt;div&gt;{"\n"}{"    "}&lt;label for="labelInput" class="form-label"&gt;Input with Label&lt;/label&gt;{"\n"}{"    "}&lt;input type="password" class="form-control" id="labelInput"&gt;{"\n"}&lt;/div&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Input with Placeholder --&gt;{"\n"}&lt;div&gt;{"\n"}{"    "}&lt;label for="placeholderInput" class="form-label"&gt;Input with Placeholder&lt;/label&gt;{"\n"}{"    "}&lt;input type="password" class="form-control" id="placeholderInput" placeholder="Placeholder"&gt;{"\n"}&lt;/div&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Input with Value --&gt;{"\n"}&lt;div&gt;{"\n"}{"    "}&lt;label for="valueInput" class="form-label"&gt;Input with Value&lt;/label&gt;{"\n"}{"    "}&lt;input type="text" class="form-control" id="valueInput" value="Input value"&gt;{"\n"}&lt;/div&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Readonly Plain Text Input --&gt;{"\n"}&lt;div&gt;{"\n"}{"    "}&lt;label for="readonlyPlaintext" class="form-label"&gt;Readonly Plain Text Input&lt;/label&gt;{"\n"}{"    "}&lt;input type="text" class="form-control-plaintext" id="readonlyPlaintext" value="Readonly input" readonly&gt;{"\n"}&lt;/div&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Readonly Input --&gt;{"\n"}&lt;div&gt;{"\n"}{"    "}&lt;label for="readonlyInput" class="form-label"&gt;Readonly Input&lt;/label&gt;{"\n"}{"    "}&lt;input type="text" class="form-control" id="readonlyInput" value="Readonly input" readonly&gt;{"\n"}&lt;/div&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Disabled Input --&gt;{"\n"}&lt;div&gt;{"\n"}{"    "}&lt;label for="disabledInput" class="form-label"&gt;Disabled Input&lt;/label&gt;{"\n"}{"    "}&lt;input type="text" class="form-control" id="disabledInput" value="Disabled input" disabled&gt;{"\n"}&lt;/div&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Input with Icon --&gt;{"\n"}&lt;div&gt;{"\n"}{"    "}&lt;label for="iconInput" class="form-label"&gt;Input with Icon&lt;/label&gt;{"\n"}{"    "}&lt;div class="form-icon"&gt;{"\n"}{"        "}&lt;input type="email" class="form-control form-control-icon" id="iconInput" placeholder="example@gmail.com"&gt;{"\n"}{"        "}&lt;i class="ri-mail-unread-line"&gt;&lt;/i&gt;{"\n"}{"    "}&lt;/div&gt;{"\n"}&lt;/div&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Input with Icon Right --&gt;{"\n"}&lt;div&gt;{"\n"}{"    "}&lt;label for="iconrightInput" class="form-label"&gt;Input with Icon Right&lt;/label&gt;{"\n"}{"    "}&lt;div class="form-icon right"&gt;{"\n"}{"        "}&lt;input type="email" class="form-control form-control-icon" id="iconrightInput" placeholder="example@gmail.com"&gt;{"\n"}{"        "}&lt;i class="ri-mail-unread-line"&gt;&lt;/i&gt;{"\n"}{"    "}&lt;/div&gt;{"\n"}&lt;/div&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Input Date --&gt;{"\n"}&lt;div&gt;{"\n"}{"    "}&lt;label for="exampleInputdate" class="form-label"&gt;Input Date&lt;/label&gt;{"\n"}{"    "}&lt;input type="date" class="form-control" id="exampleInputdate"&gt;{"\n"}&lt;/div&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Input Time --&gt;{"\n"}&lt;div&gt;{"\n"}{"    "}&lt;label for="exampleInputtime" class="form-label"&gt;Input Time&lt;/label&gt;{"\n"}{"    "}&lt;input type="time" class="form-control" id="exampleInputtime" value="08:56 AM"&gt;{"\n"}&lt;/div&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Input Password --&gt;{"\n"}&lt;div&gt;{"\n"}{"    "}&lt;label for="exampleInputpassword" class="form-label"&gt;Input Password&lt;/label&gt;{"\n"}{"    "}&lt;input type="password" class="form-control" id="exampleInputpassword" value="44512465"&gt;{"\n"}&lt;/div&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Example Textarea --&gt;{"\n"}&lt;div&gt;{"\n"}{"    "}&lt;label for="exampleFormControlTextarea5" class="form-label"&gt;Example Textarea&lt;/label&gt;{"\n"}{"    "}&lt;textarea class="form-control" id="exampleFormControlTextarea5" rows="3"&gt;&lt;/textarea&gt;{"\n"}&lt;/div&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Form Text --&gt;{"\n"}&lt;div&gt;{"\n"}{"    "}&lt;label for="formtextInput" class="form-label"&gt;Form Text&lt;/label&gt;{"\n"}{"    "}&lt;input type="password" class="form-control" id="formtextInput"&gt;{"\n"}{"    "}&lt;div id="passwordHelpBlock" class="form-text"&gt;{"\n"}{"        "}Must be 8-20 characters long.{"\n"}{"    "}&lt;/div&gt;{"\n"}&lt;/div&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Color Picker --&gt;{"\n"}&lt;div&gt;{"\n"}{"    "}&lt;label for="colorPicker" class="form-label"&gt;Color Picker&lt;/label&gt;{"\n"}{"    "}&lt;input type="color" class="form-control form-control-color w-100" id="colorPicker" value="#364574"&gt;{"\n"}&lt;/div&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Input Border Style --&gt;{"\n"}&lt;div&gt;{"\n"}{"    "}&lt;label for="borderInput" class="form-label"&gt;Input Border Style&lt;/label&gt;{"\n"}{"    "}&lt;input type="text" class="form-control border-dashed" id="borderInput" placeholder="Enter your name"&gt;{"\n"}&lt;/div&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Datalist example --&gt;{"\n"}&lt;label for="exampleDataList" class="form-label"&gt;Datalist example&lt;/label&gt;{"\n"}&lt;input class="form-control" list="datalistOptions" id="exampleDataList" placeholder="Search your country..."&gt;{"\n"}&lt;datalist id="datalistOptions"&gt;{"\n"}{"    "}&lt;option value="Switzerland"&gt;{"\n"}{"    "}&lt;option value="New York"&gt;{"\n"}{"    "}&lt;option value="France"&gt;{"\n"}{"    "}&lt;option value="Spain"&gt;{"\n"}{"    "}&lt;option value="Chicago"&gt;{"\n"}{"    "}&lt;option value="Bulgaria"&gt;{"\n"}{"    "}&lt;option value="Hong Kong"&gt;{"\n"}&lt;/datalist&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Rounded Input --&gt;{"\n"}&lt;div&gt;{"\n"}{"    "}&lt;label for="exampleInputrounded" class="form-label"&gt;Rounded Input&lt;/label&gt;{"\n"}{"    "}&lt;input type="text" class="form-control rounded-pill" id="exampleInputrounded" placeholder="Enter your name"&gt;{"\n"}&lt;/div&gt;</code>{"\n"}{"\n"}<code>&lt;!-- Floating Input --&gt;{"\n"}&lt;div class="form-floating"&gt;{"\n"}{"    "}&lt;input type="text" class="form-control" id="firstnamefloatingInput" placeholder="Enter your firstname"&gt;{"\n"}{"    "}&lt;label for="firstnamefloatingInput"&gt;Floating Input&lt;/label&gt;{"\n"}&lt;/div&gt;</code></pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*end col*/}
                            </div>
                            <div className="mt-4">
                                <a href="javascript:void(0);" onClick={addLead} className="btn btn-success w-100 waves-effect waves-light">Add</a>
                            </div>
                        </div>
                    </div>{/*end modal-content*/}
                </div>{/*end modal-dialog*/}
            </div>{/*end modal*/}


            <div class="card">
                <div class="card-body p-0">
                    <div class="alert alert-danger border-0 rounded-0 m-0 d-flex align-items-center" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle text-danger me-2 icon-sm"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        <div class="flex-grow-1 text-truncate">
                            You don't have any leads pack.
                        </div>
                        <div class="flex-shrink-0">
                            <Link to="/buyleads" class="text-reset text-decoration-underline"><b>Buy Leads</b></Link>
                        </div>
                    </div>

                    <div class="row align-items-end">
                        <div class="col-sm-8">
                            <div class="p-3">
                                <p class="fs-16 lh-base">Upgrade your plan from a <span class="fw-semibold">Free
                                    trial</span>, to ‘Premium Plan’ <i class="mdi mdi-arrow-right"></i></p>
                                <div class="mt-3">
                                    <Link to="/buyleads" class="btn btn-success">Upgrade Account!</Link>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            {/*  <div class="px-3">
                                <img src="assets/images/user-illustarator-2.png" class="img-fluid" alt="" />
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageLeads;