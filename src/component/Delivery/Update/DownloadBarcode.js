import { useState, useContext, useRef, useEffect } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext'; 
import ReactJSBarcode from 'react-jsbarcode';

const cookies = new Cookies();

export const DownloadBarcode = (EditProductData) => {

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


  


    const onPrintBarcode = () => {
        var canvas = document.getElementsByClassName("barcodeProduct")[0];
        var url = canvas.toDataURL("image/png");
        var link = document.createElement('a');
        link.download = `${productDetails.product_bar_code}.png`;
        link.href = url;
        link.click();
    }



    return (
        <>
            <div className="row">

                <div className="col-md-12 my-2 bg-light p-2">
               
               <h1 className=' text-dark'>  {productDetails.product_name} {productDetails.product_size} {productDetails.product_unit} </h1>
                   
                
                
                </div>

                <div className="col-md-12 d-flex justify-content-center">
                    <div className="mb-3">

                        {productDetails.product_bar_code ? <>
                            <ReactJSBarcode
                                value={productDetails.product_bar_code}
                                options={{ format: 'code128', height: 30, }}
                                renderer="canvas"
                                className="barcodeProduct"
                            />
                          
                        </>
                            : null}
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="text-center mt-2">
                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Updating </a> : <button type="button" onClick={onPrintBarcode} className="btn btn-primary">Download Barcode</button>}
                    </div>
                </div>
            </div>
        </>
    )

}