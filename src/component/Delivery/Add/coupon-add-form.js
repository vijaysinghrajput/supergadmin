import { useState, useContext, useRef, useEffect } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext'; 
import { useToast } from '@chakra-ui/react';

const cookies = new Cookies();

export const AddCouponForm = (props) => {

    const {  reloadData } = useContext(ContextData);
    const [isLoading, setIL] = useState(false);

    const adminStoreId = cookies.get("adminStoreId");
    const adminId = cookies.get("adminId");
    const toast = useToast();

    const [couponDetails, setCouponDetails] = useState({
        'store_id': adminStoreId,
        coupon_code:'',
        coupon_type:'percentage',
        coupon_discount:'',
        minimum_order_amount:'',
        start_date:'',
        end_date:'',
     
       

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

     
    

        if (couponDetails.coupon_code == '') {
            getToast({ title: "Coupon Code Requird", dec: "Requird", status: "error" });
        }
       
        else if (couponDetails.coupon_discount == '') {
            getToast({ title: "Coupon Discount Requird", dec: "Requird", status: "error" });
        }
        else if (couponDetails.minimum_order_amount == '') {
            getToast({ title: "Minimum Order Amount Requird", dec: "Requird", status: "error" });
        }
        else if (couponDetails.start_date == '') {
            getToast({ title: "Coupon Start Date Requird", dec: "Requird", status: "error" });
        }
        else if (couponDetails.end_date == '') {
            getToast({ title: "Coupon End Date Requird", dec: "Requird", status: "error" });
        }
    
        else {


            setIL(true);
          
            const formData = new FormData();
  
            formData.append('store_id', couponDetails.store_id)
            formData.append('adminId', adminId)
            formData.append('coupon_code', couponDetails.coupon_code)
            formData.append('coupon_type', couponDetails.coupon_type)
            formData.append('coupon_discount', couponDetails.coupon_discount)
            formData.append('minimum_order_amount', couponDetails.minimum_order_amount)
            formData.append('start_date', couponDetails.start_date)
            formData.append('end_date', couponDetails.end_date)
  



            fetch(URL + "/APP-API/Billing/addStoreCouponCode", {
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

                        getToast({ title: "Coupon Added Already", dec: "Successful", status: "success" });
                        reloadData();
 
                    } else {
                        console.log("added");
                        // addDataToCurrentGlobal({ type: "plots", payload: storeBrandsData });
                        getToast({ title: "Coupon  Added ", dec: "Successful", status: "success" });
                        reloadData();
                    }
                    setIL(false);

                    setCouponDetails({
                        'store_id': adminStoreId,
                        coupon_code:'',
                        coupon_type:'percentage',
                        coupon_discount:'',
                        minimum_order_amount:'',
                        start_date:'',
                        end_date:'',
                     
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
                        <label htmlFor="firstNameinput" className="form-label text-danger">Coupon Type</label>
                        <div>
                            <button type="button" class="btn btn-light dropdown-toggle"
                                data-bs-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">{couponDetails.coupon_type ? couponDetails.coupon_type : "Select Coupon Type"}</button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" onClick={() => setCouponDetails({ ...couponDetails, coupon_type: 'percentage' })} href="#">Discount %</a>
                                <a class="dropdown-item" onClick={() => setCouponDetails({ ...couponDetails, coupon_type: 'amount' })} href="#">Flat ₹ </a>
                            </div>
                        </div>
                    </div>
                </div>{/*end col*/}
               

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label text-danger">Coupon Code</label>
                        <input type="text" onChange={e => setCouponDetails({ ...couponDetails, coupon_code: e.target.value })}
                            value={couponDetails.coupon_code} className="form-control" placeholder="Coupon Code" id="compnayNameinput" />
                    </div>
                </div>
 
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label text-danger">{couponDetails.coupon_type=='percentage'?'Discount in %':'Flat ₹ OFF'}</label>
                        <input type="text" onChange={e => setCouponDetails({ ...couponDetails, coupon_discount: e.target.value })}
                            value={couponDetails.coupon_discount} className="form-control" placeholder={couponDetails.coupon_type=='percentage'?'Discount in %':'Flat ₹ OFF'} id="compnayNameinput" />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label text-dark">Minimum Order Value ₹</label>
                        <input type="text" onChange={e => setCouponDetails({ ...couponDetails, minimum_order_amount: e.target.value })}
                            value={couponDetails.minimum_order_amount} className="form-control" placeholder="Minimum Order Value ₹" id="compnayNameinput" />
                    </div>
                </div>

 

              

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label  text-dark ">Start Date</label>
                        <input type="date" data-date-format="YYYY-MM-DD"  onChange={e => setCouponDetails({ ...couponDetails, start_date: e.target.value })}
                            value={couponDetails.start_date} className="form-control" placeholder="Start Date" id="compnayNameinput" />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label  text-dark ">End Date</label>
                        <input type="date" onChange={e => setCouponDetails({ ...couponDetails, end_date: e.target.value })}
                            value={couponDetails.end_date} className="form-control" placeholder="End Date" id="compnayNameinput" />
                    </div>
                </div>

               
           

                <div className="col-lg-12">
                    <div className="text-center mt-2">
                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Adding </a> : <button type="button" onClick={AddVendorAction} className="btn btn-primary">Add Coupon</button>}
                    </div>
                </div>
            </div>
        </>
    )

}