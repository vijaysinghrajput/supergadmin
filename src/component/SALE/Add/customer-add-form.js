import { useState, useContext, useRef, useEffect } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext'; 

const cookies = new Cookies();

export const AddCustomerForm = (props) => {

    const { getToast, reloadData } = useContext(ContextData);
    const [isLoading, setIL] = useState(false);

    const adminStoreId = cookies.get("adminStoreId");
    const adminId = cookies.get("adminId");

    const [vendorDetails, setvendorDetails] = useState({
        'store_id': adminStoreId,
        name:'',
        mobile:'',
        firm_name:'',
        address:'',
        phone:'',
        contact_roal:'',
        city:'',
        pin_code:'',
        firm_email:'',
        gst_no:'',
        fssai_no:'',
       

    });

    useEffect(() => {

    
      

    }, []);



    const AddVendorAction = () => {

     

        if (vendorDetails.name == '') {
            getToast({ title: "Vendor Contact Name Requird", dec: "Requird", status: "error" });
        }
       
        else if (vendorDetails.mobile == '') {
            getToast({ title: "Vendor Contact Mobile Requird", dec: "Requird", status: "error" });
        }
        else if (vendorDetails.contact_roal == '') {
            getToast({ title: "Vendor Contact Roal Requird", dec: "Requird", status: "error" });
        }
        else if (vendorDetails.firm_name == '') {
            getToast({ title: "Firm Name  Requird", dec: "Requird", status: "error" });
        }
        else if (vendorDetails.address == '') {
            getToast({ title: "Vendor Address Requird", dec: "Requird", status: "error" });
        }
        else if (vendorDetails.city == '') {
            getToast({ title: "Vendor City Requird", dec: "Requird", status: "error" });
        }
        else if (vendorDetails.pin_code == '') {
            getToast({ title: "Vendor Pincode Requird", dec: "Requird", status: "error" });
        }
       
        else {


            setIL(true);
          
            const formData = new FormData();
  
            formData.append('store_id', vendorDetails.store_id)
            formData.append('adminId', adminId)
            formData.append('name', vendorDetails.name)
            formData.append('mobile', vendorDetails.mobile)
            formData.append('address', vendorDetails.address)
            formData.append('firm_name', vendorDetails.firm_name)
            formData.append('phone', vendorDetails.phone)
            formData.append('contact_roal', vendorDetails.contact_roal)
            formData.append('city', vendorDetails.city)
            formData.append('pin_code', vendorDetails.pin_code)
            formData.append('firm_email', vendorDetails.firm_email)
            formData.append('gst_no', vendorDetails.gst_no)
            formData.append('fssai_no', vendorDetails.fssai_no)



            fetch(URL + "/APP-API/Billing/addStoreVendor", {
                method: 'POST',
                header: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: formData
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log("respond vendor upload", responseJson)
                      
                    if (responseJson.is_vendor_alredy == 1) {

                        getToast({ title: "Vendor Added Already", dec: "Successful", status: "success" });
                        reloadData();
 
                    } else {
                        console.log("added");
                        // addDataToCurrentGlobal({ type: "plots", payload: storeBrandsData });
                        getToast({ title: "Vendor Added ", dec: "Successful", status: "success" });
                        reloadData();
                    }
                    setIL(false);

                    setvendorDetails({
                        'store_id': adminStoreId,
                        name:'',
                        mobile:'',
                        firm_name:'',
                        address:'',
                        phone:'',
                        contact_roal:'',
                        city:'',
                        pin_code:'',
                        firm_email:'',
                        gst_no:'',
                        fssai_no:'',
                    })
                

                    for (let i = 0; i < 10; i++) {
                        document.getElementsByClassName("btn-close")[i].click();
                    }
                })
                .catch((error) => {
                    //  console.error(error);
                });
        }
    };

 

    return (
        <>
            <div className="row">

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label text-danger">Contact Name</label>
                        <input type="text" onChange={e => setvendorDetails({ ...vendorDetails, name: e.target.value })}
                            value={vendorDetails.name} className="form-control" placeholder="Contact Name" id="compnayNameinput" />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label text-danger">Contact Mobile</label>
                        <input type="text" onChange={e => setvendorDetails({ ...vendorDetails, mobile: e.target.value })}
                            value={vendorDetails.mobile} className="form-control" placeholder="Contact Mobile" id="compnayNameinput" />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label text-danger">Contact Roal</label>
                        <input type="text" onChange={e => setvendorDetails({ ...vendorDetails, contact_roal: e.target.value })}
                            value={vendorDetails.contact_roal} className="form-control" placeholder="Contact Roal" id="compnayNameinput" />
                    </div>
                </div>

              

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label  text-danger ">Firm Name</label>
                        <input type="text" onChange={e => setvendorDetails({ ...vendorDetails, firm_name: e.target.value })}
                            value={vendorDetails.firm_name} className="form-control" placeholder="Firm Name" id="compnayNameinput" />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label text-danger">Firm Phone</label>
                        <input type="text" onChange={e => setvendorDetails({ ...vendorDetails, phone: e.target.value })}
                            value={vendorDetails.phone} className="form-control" placeholder="Firm Phone" id="compnayNameinput" />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label ">Firm Email</label>
                        <input type="text" onChange={e => setvendorDetails({ ...vendorDetails, firm_email: e.target.value })}
                            value={vendorDetails.firm_email} className="form-control" placeholder="Firm Email" id="compnayNameinput" />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label ">GST Number</label>
                        <input type="text" onChange={e => setvendorDetails({ ...vendorDetails, gst_no: e.target.value })}
                            value={vendorDetails.gst_no} className="form-control" placeholder="GST Number" id="compnayNameinput" />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label ">Fssai Number</label>
                        <input type="text" onChange={e => setvendorDetails({ ...vendorDetails, fssai_no: e.target.value })}
                            value={vendorDetails.fssai_no} className="form-control" placeholder="Fssai Number" id="compnayNameinput" />
                    </div>
                </div>



                <div className="col-md-12">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label text-danger ">Address</label>
                        <textarea onChange={e => setvendorDetails({ ...vendorDetails, address: e.target.value })} value={vendorDetails.address} class="form-control" id="exampleFormControlTextarea5" rows="1"></textarea>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label  text-danger ">City</label>
                        <input type="text" onChange={e => setvendorDetails({ ...vendorDetails, city: e.target.value })}
                            value={vendorDetails.city} className="form-control" placeholder="City" id="compnayNameinput" />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label  text-danger">Pincode</label>
                        <input type="text" onChange={e => setvendorDetails({ ...vendorDetails, pin_code: e.target.value })}
                            value={vendorDetails.pin_code} className="form-control" placeholder="Pincode" id="compnayNameinput" />
                    </div>
                </div>



                <div className="col-lg-12">
                    <div className="text-center mt-2">
                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Adding </a> : <button type="button" onClick={AddVendorAction} className="btn btn-primary">Add Vendor</button>}
                    </div>
                </div>
            </div>
        </>
    )

}