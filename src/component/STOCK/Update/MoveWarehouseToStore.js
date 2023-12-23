import { useState, useContext, useRef, useEffect } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext'; 
import Alert from 'react-bootstrap/Alert';

const cookies = new Cookies();

export const MoveWarehouseToStore = (EditProductData) => {

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
        'resion_for_update':'undefined',
        'no_of_stock_to_move':0,
        'newStorestock':0,
        'newWareHouseStorestock':0,
        'stock_quantity':0,
        'stok_warehouse_qty':0,




    });

    useEffect(() => {
        // console.log("productDetails",EditProductData)
        setproductDetails({...EditProductData.productDetails  });
        // console.log("hey naveet", editablePlot);
    }, [EditProductData.productDetails])


  


    const UpdateProductAction = () => {

     
        if(Number(productDetails.newWareHouseStorestock)>Number(productDetails.stok_warehouse_qty)){
            getToast({ title: "No of Moving Stocks can not be more than Warehouse stocks", dec: "error", status: "error" });
        }
        else if(Number(productDetails.newWareHouseStorestock)==0)
        { 
            getToast({ title: "No of moving stocks must be more than 0", dec: "error", status: "error" });

        }
        else{

            setIL(true);
            const formData = new FormData();

          
            formData.append('id', productDetails.id)
            formData.append('store_id', productDetails.store_id)
            formData.append('adminId', adminId)
            formData.append('stock_quantity', productDetails.newStorestock)
            formData.append('stok_warehouse_qty', productDetails.newWareHouseStorestock)
            formData.append('stock_alert_quantity', productDetails.stock_alert_quantity)
            formData.append('warehouse_stock_alert_quantity', productDetails.warehouse_stock_alert_quantity)
            formData.append('resion_for_update', productDetails.resion_for_update)
            formData.append('coming_from', 'WAREHOUSE')
            formData.append('going_to', 'STORE')
            formData.append('quantity', productDetails.no_of_stock_to_move)
            formData.append('action', 'MOVE')
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
                    setproductDetails({});
                 

                    for (let i = 0; i < 10; i++) {
                        document.getElementsByClassName("btn-close")[i].click();
                    }
                })
                .catch((error) => {
                    //  console.error(error);
                });
          
        }

         
        
    };

    const setPricing = (no_to_move) => {
        // no_of_stock_to_move
     
            var newStorestock = Number(productDetails.stock_quantity)+Number(no_to_move);
            var newWareHouseStorestock = Number(productDetails.stok_warehouse_qty)-Number(no_to_move);
            setproductDetails({ ...productDetails,no_of_stock_to_move:no_to_move, newStorestock: Number(newStorestock), newWareHouseStorestock: Number(newWareHouseStorestock)})
        
       
    }




    return (
        <>
            <div className="row">

                <div className="col-md-12 my-2 bg-light p-2">
               
               <h1 className=' text-dark'>  {productDetails.product_name} {productDetails.product_size} {productDetails.product_unit} | {productDetails.stok_warehouse_qty} Items in Warehouse</h1>
                   
                
                
                </div>

          

                <div className="col-md-12">

                <div className="mb-3">
                <label htmlFor="compnayNameinput" className="form-label">Quantity to Move ({productDetails.stok_warehouse_qty} Items Available) </label>
                <input type="number" 
                 max={Number(productDetails.stok_warehouse_qty)} 
                 onChange={e => setPricing(e.target.value)} 
               value={productDetails.no_of_stock_to_move} className="form-control" placeholder="Warehouse Stock" id="compnayNameinput" />
                <label htmlFor="compnayNameinput" className="form-label text-danger my-2">Updated Warehouse Stock ({productDetails.newWareHouseStorestock})</label>
            </div>



                </div>


                <div className="col-md-12 my-2">

               


            <div className="mb-3">
                            <label htmlFor="compnayNameinput" className="form-label">Store Stock ({productDetails.stock_quantity} Items Available)</label>
                                <input type="number"
                                
                                 disabled
                                 onChange={e => setproductDetails({ ...productDetails, stok_warehouse_qty: e.target.value,  })}
                               value={productDetails.stock_quantity} className="form-control" placeholder="Quantity to Move" id="compnayNameinput" />
                                <label htmlFor="compnayNameinput" className="form-label text-success my-2">Updated Store Stock ({productDetails.newStorestock})</label>
                            </div>
            



</div>
             

                <div className="col-md-12">
                    <div className="mb-3">
                        <label htmlFor="firstNameinput" className="form-label">Resion For Move Stock</label>
                        <div>
                            <button type="button" class="btn btn-light dropdown-toggle"
                                data-bs-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">{productDetails.resion_for_update ? productDetails.resion_for_update : "Select Resion"}</button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" onClick={() => setproductDetails({ ...productDetails, resion_for_update: 'FILL STORE' })} href="#">FILL STORE </a>
                                <a class="dropdown-item" onClick={() => setproductDetails({ ...productDetails, resion_for_update: 'undefined' })} href="#">Not Defined </a>
                            </div>
                        </div>
                    </div>
                </div>{/*end col*/}
               

            


                <div className="col-lg-12">
                    <div className="text-center mt-2">
                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Moving </a> : <button type="button" onClick={UpdateProductAction} className="btn btn-primary">Move Stocks</button>}
                    </div>
                </div>
            </div>
        </>
    )

}