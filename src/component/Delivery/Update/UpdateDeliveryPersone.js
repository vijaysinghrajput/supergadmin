import { useState, useContext, useRef, useEffect } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext'; 
import Alert from 'react-bootstrap/Alert';
import { useToast } from '@chakra-ui/react';

const cookies = new Cookies();

export const UpdateDeliveryPersone = (EditVendorData) => { 

    const { storeCategoryData, storeBrandsData, storeProductUnits, addDataToCurrentGlobal,  storeBussinessRelode } = useContext(ContextData);
    const [isLoading, setIL] = useState(false);
    const toast = useToast();



    const adminStoreId = cookies.get("adminStoreId");
    const adminStoreType = cookies.get("adminStoreType");
    const adminId = cookies.get("adminId");

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

    const [vendorDetails, setvendorDetails] = useState({
        'store_id': adminStoreId,
        id:'',
        name:'',
        mobile:'',
        bike_number:'',
        bike_name:'',



    });

    useEffect(() => {
        // console.log("vendorDetails",EditVendorData)
        setvendorDetails({...EditVendorData.vendorDetails  });
        // console.log("hey naveet", editablePlot);
    }, [EditVendorData.vendorDetails])


  


    const UpdateProductAction = () => {

        if (vendorDetails.name == '') {
            getToast({ title: "Delivery Persone Name Requird", dec: "Requird", status: "error" });
        }
       
        else if (vendorDetails.mobile == '') {
            getToast({ title: "Delivery Persone Mobile Requird", dec: "Requird", status: "error" });
        }
       
      
        else {  


            setIL(true);
            const formData = new FormData();

          
            formData.append('store_id', vendorDetails.store_id)
            formData.append('adminId', adminId)
            formData.append('id', vendorDetails.id)
            formData.append('name', vendorDetails.name)
            formData.append('mobile', vendorDetails.mobile)
            formData.append('bike_name', vendorDetails.bike_name)
            formData.append('bike_number', vendorDetails.bike_number)
   


            fetch(URL + "/APP-API/Billing/deliveryPersoneUpdate", {
                method: 'POST',
                header: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: formData
            }).then((response) => response.json())
                .then((responseJson) => {
                    // console.log("respond product upload", responseJson)
                    if (responseJson.success) {

                        getToast({ title: "Persone Updated ", dec: "Successful", status: "success" });
                        storeBussinessRelode();
 
                    } else {
                      
                        // addDataToCurrentGlobal({ type: "plots", payload: storeBrandsData });
                        getToast({ title: "error", dec: "error", status: "error" });
                        storeBussinessRelode();
                    }
                    setIL(false);
                    setvendorDetails([])
                 

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
                        <label htmlFor="compnayNameinput" className="form-label text-danger">Persone Name</label>
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
                        <label htmlFor="compnayNameinput" className="form-label text-dark">Vehicle Name</label>
                        <input type="text" onChange={e => setvendorDetails({ ...vendorDetails, bike_name: e.target.value })}
                            value={vendorDetails.bike_name} className="form-control" placeholder="Vehicle Name" id="compnayNameinput" />
                    </div>
                </div>

 

              

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label  text-dark ">Vehicle Number</label>
                        <input type="text" onChange={e => setvendorDetails({ ...vendorDetails, bike_number: e.target.value })}
                            value={vendorDetails.bike_number} className="form-control" placeholder="Vehicle Number" id="compnayNameinput" />
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