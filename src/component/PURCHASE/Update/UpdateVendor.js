import { useState, useContext, useRef, useEffect } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext'; 
import Alert from 'react-bootstrap/Alert';

const cookies = new Cookies();

export const UpdateVendor = (EditVendorData) => {

    const { storeCategoryData, storeBrandsData, storeProductUnits, addDataToCurrentGlobal, getToast, reloadData } = useContext(ContextData);
    const [isLoading, setIL] = useState(false);



    const adminStoreId = cookies.get("adminStoreId");
    const adminStoreType = cookies.get("adminStoreType");
    const adminId = cookies.get("adminId");

 
    const [vendorDetails, setvendorDetails] = useState({
        'store_id': adminStoreId,
        id:'',
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
        deal_items:"",


    });

    useEffect(() => {
        // console.log("vendorDetails",EditVendorData)
        setvendorDetails({...EditVendorData.vendorDetails  });
        // console.log("hey naveet", editablePlot);
    }, [EditVendorData.vendorDetails])


  


    const UpdateProductAction = () => {

        if (vendorDetails.name == '') {
            getToast({ title: "Vendor Contact Name Requird", dec: "Requird", status: "error" });
        }
       
        else if (vendorDetails.mobile == '') {
            getToast({ title: "Vendor Contact Mobile Requird", dec: "Requird", status: "error" });
        }
     
        else if (vendorDetails.firm_name == '') {
            getToast({ title: "Firm Name  Requird", dec: "Requird", status: "error" });
        }
        else if (vendorDetails.address == '') {
            getToast({ title: "Vendor Address Requird", dec: "Requird", status: "error" });
        }
        
      
        else {  


            setIL(true);
            const formData = new FormData();

          
            formData.append('store_id', vendorDetails.store_id)
            formData.append('adminId', adminId)
            formData.append('id', vendorDetails.id)
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


            fetch(URL + "/APP-API/Billing/vendorUpdate", {
                method: 'POST',
                header: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: formData
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log("respond product upload", responseJson)
                    if (responseJson.success) {

                        getToast({ title: "Vendor Updated ", dec: "Successful", status: "success" });
                        reloadData();
 
                    } else {
                      
                        // addDataToCurrentGlobal({ type: "plots", payload: storeBrandsData });
                        getToast({ title: "error", dec: "error", status: "error" });
                        reloadData();
                    }
                    setIL(false);
                    setvendorDetails([])
                    setvendorDetails(
                        {
                        // 'store_id': adminStoreId,
                        // 'product_name': '',
                        // 'product_uniq_slug_name': '',
                        // 'product_image': { length: 0 },
                        // 'product_type': adminStoreType,
                        // 'parent_category_id': '',
                        // 'category_id': '',
                        // 'brand_id': '',
                        // 'price': 0,
                        // 'discount_in_percent': 0,
                        // 'discount_in_rs': 0,
                        // 'sale_price': 0,
                        // 'product_unit': '',
                        // 'product_size': '',
                        // 'product_bar_code': '',
                        // 'deceptions': '',
                        // 'hsn_code': '',
                        // 'i_gst': 0,
                        // 'c_gst': 0,
                        // 's_gst': 0,
                        // 'margin_in_rs': '',
                    }
                        
                    )
                 

                    for (let i = 0; i < 10; i++) {
                        document.getElementsByClassName("btn-close")[i].click();
                    }
                })
                .catch((error) => {
                    //  console.error(error);
                });
        }
    };

    const setPricing = (value) => {
        setvendorDetails({ ...vendorDetails, price: value, sale_price: value, discount_in_rs: 0 })
    }
    const setDiscount = (value) => {
        let dicountPerc = ((vendorDetails.price - vendorDetails.sale_price) / vendorDetails.price) * 10

        setvendorDetails({ ...vendorDetails, discount_in_rs: value, sale_price: vendorDetails.price - value, discount_in_percent: dicountPerc })
    }
    const setSalePricing = (value) => {
        setvendorDetails({ ...vendorDetails, sale_price: value })
    }
 



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

                {/* <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label text-danger">Firm Phone</label>
                        <input type="text" onChange={e => setvendorDetails({ ...vendorDetails, phone: e.target.value })}
                            value={vendorDetails.phone} className="form-control" placeholder="Firm Phone" id="compnayNameinput" />
                    </div>
                </div> */}

                {/* <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label ">Firm Email</label>
                        <input type="text" onChange={e => setvendorDetails({ ...vendorDetails, firm_email: e.target.value })}
                            value={vendorDetails.firm_email} className="form-control" placeholder="Firm Email" id="compnayNameinput" />
                    </div>
                </div> */}

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



                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label text-danger ">Address</label>
                        <input type="text" onChange={e => setvendorDetails({ ...vendorDetails, address: e.target.value })} value={vendorDetails.address}className="form-control" placeholder="Address" id="compnayNameinput" />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label  text-dark ">City</label>
                        <input type="text" onChange={e => setvendorDetails({ ...vendorDetails, city: e.target.value })}
                            value={vendorDetails.city} className="form-control" placeholder="City" id="compnayNameinput" />
                    </div>
                </div>

                {/* <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label  text-dark">Pincode</label>
                        <input type="text" onChange={e => setvendorDetails({ ...vendorDetails, pin_code: e.target.value })}
                            value={vendorDetails.pin_code} className="form-control" placeholder="Pincode" id="compnayNameinput" />
                    </div>
                </div> */}

                <div className="col-md-12">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label text-dark ">Deal Items</label>
                        <textarea onChange={e => setvendorDetails({ ...vendorDetails, deal_items: e.target.value })} value={vendorDetails.deal_items} class="form-control" id="exampleFormControlTextarea5" rows="2"></textarea>
                    </div>
                </div>


                <div className="col-lg-12">
                    <div className="text-center mt-2">
                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Updating </a> : <button type="button" onClick={UpdateProductAction} className="btn btn-primary">Update Details</button>}
                    </div>
                </div>
            </div>
        </>
    )

}