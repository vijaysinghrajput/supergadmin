import { useState, useContext, useRef, useEffect } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext'; 
import Alert from 'react-bootstrap/Alert';

const cookies = new Cookies();

export const UpdateProductStockComp = (EditProductData) => {

    const { storeCategoryData, storeBrandsData, storeProductUnits, addDataToCurrentGlobal, getToast, reloadData } = useContext(ContextData);
    const [isLoading, setIL] = useState(false);



    const adminStoreId = cookies.get("adminStoreId");
    const adminStoreType = cookies.get("adminStoreType");
    const adminId = cookies.get("adminId");

 
    const [productDetails, setproductDetails] = useState({
        'store_id': adminStoreId,
        'id':0,
        'product_name': '',
        'price': 0,
        'discount_in_percent': 0,
        'discount_in_rs': 0,
        'sale_price': 0,
        'hsn_code': '',
        'i_gst': 0,
        'c_gst': 0,
        's_gst': 0,
        'margin_in_rs': '',


    });

    useEffect(() => {
        // console.log("productDetails",EditProductData)
        setproductDetails({...EditProductData.productDetails  });
        // console.log("hey naveet", editablePlot);
    }, [EditProductData.productDetails])


  


    const UpdateProductAction = () => {

     

            setIL(true);
            const formData = new FormData();

          
            formData.append('id', productDetails.id)
            formData.append('store_id', productDetails.store_id)
            formData.append('adminId', adminId)
            formData.append('stock_quantity', productDetails.stock_quantity)
            formData.append('stok_warehouse_qty', productDetails.stok_warehouse_qty)
            formData.append('stock_alert_quantity', productDetails.stock_alert_quantity)
            formData.append('warehouse_stock_alert_quantity', productDetails.warehouse_stock_alert_quantity)
            formData.append('product_name', productDetails.product_name+ " "+productDetails.product_size+" "+productDetails.product_unit)



            fetch(URL + "/APP-API/Billing/UpdateStoreProductsStock", {
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

                        getToast({ title: "Stock Updated ", dec: "Successful", status: "success" });
                        reloadData();
 
                    } else {
                      
                        // addDataToCurrentGlobal({ type: "plots", payload: storeBrandsData });
                        getToast({ title: "error", dec: "error", status: "error" });
                        reloadData();
                    }
                    setIL(false);
                    setproductDetails([])
                  
                 

                    for (let i = 0; i < 10; i++) {
                        document.getElementsByClassName("btn-close")[i].click();
                    }
                })
                .catch((error) => {
                    //  console.error(error);
                });
        
    };

    const setPricing = (value) => {
        setproductDetails({ ...productDetails, price: value, sale_price: value, discount_in_rs: 0 })
    }
    const setDiscount = (value) => {
        let dicountPerc = ((productDetails.price - productDetails.sale_price) / productDetails.price) * 10

        setproductDetails({ ...productDetails, discount_in_rs: value, sale_price: productDetails.price - value, discount_in_percent: dicountPerc })
    }
    const setSalePricing = (value) => {
        setproductDetails({ ...productDetails, sale_price: value })
    }
 



    return (
        <>
            <div className="row">

                <div className="col-md-12 my-2 bg-light p-2">
               
               <h1 className=' text-dark'>  {productDetails.product_name} {productDetails.product_size} {productDetails.product_unit} </h1>
                   
                
                
                </div>

          

                <div className="col-md-12">
                    <div className='row'>
                        <div className='col-sm-6'>
                            <div className="mb-3">
                                <label htmlFor="compnayNameinput" className="form-label">Store Stock</label>
                                <input type="number" onChange={e => setproductDetails({ ...productDetails, stock_quantity: e.target.value,  })} value={productDetails.stock_quantity} className="form-control" placeholder="Store Stock" id="compnayNameinput" />
                            </div>

                        </div>
                        <div className='col-sm-6'>
                            <div className="mb-3">
                                <label htmlFor="compnayNameinput" className="form-label">Warehouse Stock</label>
                                <input type="number" onChange={e => setproductDetails({ ...productDetails, stok_warehouse_qty: e.target.value,  })} value={productDetails.stok_warehouse_qty} className="form-control" placeholder="Warehouse Stock" id="compnayNameinput" />
                            </div>

                        </div>
                     
                    </div>


                </div>

                <div className="col-md-12">
                    <div className='row'>
                     
                        <div className='col-sm-6'>
                            <div className="mb-3">
                                <label htmlFor="compnayNameinput" className="form-label">Store Alert Quantity</label>
                                <input type="number" onChange={e => setproductDetails({ ...productDetails, stock_alert_quantity: e.target.value,  })} value={productDetails.stock_alert_quantity} className="form-control" placeholder="Store Alert Quantity" id="compnayNameinput" />
                            </div>

                        </div>

                        <div className='col-sm-6'>
                            <div className="mb-3">
                                <label htmlFor="compnayNameinput" className="form-label">Warehouse Alert Quantity</label>
                                <input type="number" onChange={e => setproductDetails({ ...productDetails, warehouse_stock_alert_quantity: e.target.value,  })} value={productDetails.warehouse_stock_alert_quantity} className="form-control" placeholder="Warehouse Alert Quantity" id="compnayNameinput" />
                            </div>

                        </div>
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