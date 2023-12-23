import { useState, useContext, useRef, useEffect } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext'; 
import { useToast } from '@chakra-ui/react';

const cookies = new Cookies();

export const AddDeliveryBoyForm = (props) => {

    const {  reloadData } = useContext(ContextData);
    const [isLoading, setIL] = useState(false);

    const adminStoreId = cookies.get("adminStoreId");
    const adminId = cookies.get("adminId");
    const toast = useToast();

    const [vendorDetails, setvendorDetails] = useState({
        'store_id': adminStoreId,
        name:'',
        mobile:'',
        bike_number:'',
        bike_name:'',
     
       

    });


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

    
      

    }, []);



    const AddVendorAction = () => {

     

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
            formData.append('name', vendorDetails.name)
            formData.append('mobile', vendorDetails.mobile)
            formData.append('bike_number', vendorDetails.bike_number)
            formData.append('bike_name', vendorDetails.bike_name)
  



            fetch(URL + "/APP-API/Billing/addStoreDeliveryBoy", {
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

                        getToast({ title: "Delivery Persone Added Already", dec: "Successful", status: "success" });
                        reloadData();
 
                    } else {
                        console.log("added");
                        // addDataToCurrentGlobal({ type: "plots", payload: storeBrandsData });
                        getToast({ title: "Delivery Persone Added ", dec: "Successful", status: "success" });
                        reloadData();
                    }
                    setIL(false);

                    setvendorDetails({
                        'store_id': adminStoreId,
                        name:'',
                        mobile:'',
                        bike_number:'',
                        bike_name:'',
                     
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
                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Adding </a> : <button type="button" onClick={AddVendorAction} className="btn btn-primary">Add Persone</button>}
                    </div>
                </div>
            </div>
        </>
    )

}