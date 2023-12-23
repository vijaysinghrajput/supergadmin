import { useState, useContext } from 'react';
import URL from '../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../context/MainContext';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';

const cookies = new Cookies();

export const AddPlotForm = (props) => {

    const { addDataToCurrentGlobal, getToast, reloadData } = useContext(ContextData);
    const [isLoading, setIL] = useState(false);
    const bussnessID = cookies.get("userBussiness_id");
    const [plotDetails, setPlotDetails] = useState({
        'bussiness_id': bussnessID,
        'property_status': 'Sale',
        'property_type': '',
        'project_name': '',
        'project_location_area': '',
        'plot_total_area_unit': 'sqft',
        'property_decerption': '',
        'project_address': '',
        'project_city': '',
        'project_state': 'Uttar Pradesh',
        'project_feature_image': '',
        'project_video': '',
        'plot_type': '',
        'plot_total_area': '',
        'plot_sizes': 'sqft',
        'plot_rate': '',
        'plot_rate_unit': 'sqft',
        'road_size': '',
        'is_emi_avl': 'NO',
        'booking_min_amount': '',
        'land_possession': '',
        'project_pdf': '',
        'status': '',
        'date': +new Date(),
    });

    const AddPlot = () => {
        console.log("help me", plotDetails);
        setIL(true);
        const formData = new FormData();

        plotDetails.project_feature_image && plotDetails.project_feature_image.map((item, i) => {
            formData.append(`project_feature_image[]`, item, item.name);
        })
        formData.append('bussiness_id', plotDetails.bussiness_id)
        formData.append('project_id', Math.floor(Math.random() * (9999999999 - 1000000000 + 1) + 1000000000));
        formData.append('property_status', plotDetails.property_status)
        formData.append('property_type', plotDetails.property_type)
        formData.append('project_name', plotDetails.project_name)
        formData.append('project_location_area', plotDetails.project_location_area)
        formData.append('property_decerption', plotDetails.property_decerption)
        formData.append('project_address', plotDetails.project_address)
        formData.append('project_city', plotDetails.project_city)
        formData.append('project_state', plotDetails.project_state)
        // formData.append('project_feature_image', plotDetails.project_feature_image[0], plotDetails.project_feature_image[0].name)
        formData.append('project_video', plotDetails.project_video)
        formData.append('plot_type', plotDetails.plot_type)
        formData.append('plot_total_area', `${plotDetails.plot_total_area}/${plotDetails.plot_total_area_unit}`)
        formData.append('plot_sizes', plotDetails.plot_sizes)
        formData.append('plot_rate', `${plotDetails.plot_rate}/${plotDetails.plot_rate_unit}`);
        formData.append('road_size', plotDetails.road_size + "/ft");
        formData.append('is_emi_avl', plotDetails.is_emi_avl);
        formData.append('booking_min_amount', plotDetails.booking_min_amount);
        formData.append('land_possession', plotDetails.land_possession);
        formData.append('project_pdf', plotDetails.project_pdf);
        formData.append('status', plotDetails.status);
        formData.append('date', +new Date());


        fetch(URL + "/APP-API/App/addPlots", {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("respond plot upload", responseJson)
                if (responseJson.user) {
                    alert("Member Exists");
                } else {
                    console.log("added");
                    addDataToCurrentGlobal({ type: "plots", payload: plotDetails });
                    getToast({ title: "Plot Added", dec: "", status: "success" });
                    reloadData();
                }
                setIL(false);
                for (let i = 0; i < 10; i++) {
                    document.getElementsByClassName("btn-close")[i].click();
                }
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
                        <label htmlFor="firstNameinput" className="form-label">Property Status</label>
                        <div>
                            <button type="button" class="btn btn-light dropdown-toggle"
                                data-bs-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">{plotDetails.property_status ? plotDetails.property_status : "Select Status"}</button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, property_status: "Sale" })} href="#">Sale</a>
                                {/* <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, property_status: "Rent" })} href="#">Rent</a> */}
                            </div>
                        </div>
                    </div>
                </div>{/*end col*/}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="firstNameinput" className="form-label">Property Type</label>
                        <div>
                            <button type="button" class="btn btn-light dropdown-toggle"
                                data-bs-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">{plotDetails.property_type ? plotDetails.property_type : "Select Type"}</button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, property_type: "Plot" })} href="#">Plot</a>
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, property_type: "Flat / Apartment" })} href="#">Flat / Apartment</a>
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, property_type: "Commercial Shop" })} href="#">"Commercial Shop</a>
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, property_type: "Residential House" })} href="#">Residential House</a>
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, property_type: "Warehouse / Godown" })} href="#">Warehouse / Godown</a>
                            </div>
                        </div>
                    </div>
                </div>{/*end col*/}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="firstNameinput" className="form-label">Plot Type</label>
                        <div>
                            <button type="button" class="btn btn-light dropdown-toggle"
                                data-bs-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">{plotDetails.plot_type ? plotDetails.plot_type : "Select Type"}</button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, plot_type: "Investment Plot" })} href="#">Investment Plot</a>
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, plot_type: "Residential Plot" })} href="#">Residential Plot</a>
                            </div>
                        </div>
                    </div>
                </div>{/*end col*/}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label">Loaction</label>
                        <input type="text" onChange={e => setPlotDetails({ ...plotDetails, project_location_area: e.target.value })} value={plotDetails.project_location_area} className="form-control" placeholder="Enter Location" id="compnayNameinput" />
                    </div>
                </div>{/*end col*/}
                <div className="col-md-12">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label">Address</label>
                        <input type="text" onChange={e => setPlotDetails({ ...plotDetails, project_address: e.target.value })} value={plotDetails.project_address} className="form-control" placeholder="Enter address" id="compnayNameinput" />
                    </div>
                </div>{/*end col*/}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="citynameInput" className="form-label">City</label>
                        <input type="text" onChange={e => setPlotDetails({ ...plotDetails, project_city: e.target.value })} value={plotDetails.project_city} className="form-control" placeholder="Enter city" id="citynameInput" />
                    </div>
                </div>{/*end col*/}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="address1ControlTextarea" className="form-label">Feture Image</label>
                        <input multiple type="file" onChange={e => setPlotDetails({ ...plotDetails, project_feature_image: [...e.target.files] })} className="form-control" id="address1ControlTextarea" />
                    </div>
                </div>{/*end col*/}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="mobilenumberInput" className="form-label">Title</label>
                        <input type="text" onChange={e => setPlotDetails({ ...plotDetails, project_name: e.target.value })} value={plotDetails.project_name} className="form-control" placeholder="Title" id="mobilenumberInput" />
                    </div>
                </div>{/*end col*/}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label">Discription</label>
                        <textarea onChange={e => setPlotDetails({ ...plotDetails, property_decerption: e.target.value })} value={plotDetails.property_decerption} class="form-control" id="exampleFormControlTextarea5" rows="1"></textarea>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="firstNameinput" className="form-label">Total Project Area</label>
                        <div className='d-flex'>
                            <input type="number" onChange={e => setPlotDetails({ ...plotDetails, plot_total_area: e.target.value })} value={plotDetails.plot_total_area} className="form-control" placeholder="Project Area" id="address1ControlTextarea" />
                            <button type="button" class="btn btn-light dropdown-toggle"
                                data-bs-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">{plotDetails.plot_total_area_unit ? plotDetails.plot_total_area_unit : "Select Size"}</button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, plot_total_area_unit: "sqft" })} href="#">sqft</a>
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, plot_total_area_unit: "diciml" })} href="#">diciml</a>
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, plot_total_area_unit: "acre" })} href="#">acre</a>
                            </div>
                        </div>
                    </div>
                </div>{/*end col*/}

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="address1ControlTextarea" className="form-label">Plot Rate</label>
                        <div className='d-flex'>
                            <input type="number" onChange={e => setPlotDetails({ ...plotDetails, plot_rate: e.target.value })} value={plotDetails.plot_rate} className="form-control" placeholder="Rate" id="address1ControlTextarea" />
                            <button type="button" class="btn btn-light dropdown-toggle"
                                data-bs-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">{plotDetails.plot_rate_unit ? plotDetails.plot_rate_unit : "Select Size"}</button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, plot_rate_unit: "sqft" })} href="#">sqft</a>
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, plot_rate_unit: "diciml" })} href="#">diciml</a>
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, plot_rate_unit: "acre" })} href="#">acre</a>
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, plot_rate_unit: "unit" })} href="#">unit</a>
                            </div>
                        </div>
                    </div>
                </div>{/*end col*/}
                <div className="col-md-4">
                    <div className="mb-3">
                        <label htmlFor="address1ControlTextarea" className="form-label">Road Size</label>
                        <input type="number" onChange={e => setPlotDetails({ ...plotDetails, road_size: e.target.value })} value={plotDetails.road_size} className="form-control" placeholder="Road Size" id="address1ControlTextarea" />
                    </div>
                </div>{/*end col*/}
                <div className="col-md-4">
                    <div className="mb-3">
                        <label htmlFor="address1ControlTextarea" className="form-label">EMI Avilabe</label>
                        <div className='d-flex'>
                            <button type="button" class="btn btn-light dropdown-toggle"
                                data-bs-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">{plotDetails.is_emi_avl ? plotDetails.is_emi_avl : "Select Size"}</button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, is_emi_avl: "YES" })} href="#">YES</a>
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, is_emi_avl: "NO" })} href="#">NO</a>
                            </div>
                        </div>
                    </div>
                </div>{/*end col*/}
                <div className="col-md-4">
                    <div className="mb-3">
                        <label htmlFor="address1ControlTextarea" className="form-label">Land Possession</label>
                        <div className='d-flex'>
                            <button type="button" class="btn btn-light dropdown-toggle"
                                data-bs-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">{plotDetails.land_possession ? plotDetails.land_possession : "Select Possession"}</button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, land_possession: "YES" })} href="#">YES</a>
                                <a class="dropdown-item" onClick={() => setPlotDetails({ ...plotDetails, land_possession: "NO" })} href="#">NO</a>
                            </div>
                        </div>
                    </div>
                </div>{/*end col*/}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="address1ControlTextarea" className="form-label">Minimun Booking Amount</label>
                        <input type="number" onChange={e => setPlotDetails({ ...plotDetails, booking_min_amount: e.target.value })} value={plotDetails.booking_min_amount} className="form-control" placeholder="Min Rate" id="address1ControlTextarea" />
                    </div>
                </div>{/*end col*/}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="address1ControlTextarea" className="form-label">Plot Video</label>
                        <input type="text" onChange={e => setPlotDetails({ ...plotDetails, project_video: e.target.value })} className="form-control" placeholder="Youtube Video Link" id="address1ControlTextarea" />
                    </div>
                </div>{/*end col*/}
                <div className="col-lg-12">
                    <div className="text-center mt-2">
                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Adding </a> : <button type="button" onClick={AddPlot} className="btn btn-primary">Add Plot</button>}
                    </div>
                </div>{/*end col*/}
            </div>{/*end row*/}
        </>
    )

}