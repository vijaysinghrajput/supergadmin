import { useState, useContext, useRef, useEffect } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext'; 
import ReactJSBarcode from 'react-jsbarcode';
import ReactToPrint from 'react-to-print';


const cookies = new Cookies();

export const DownloadBarcode = (EditProductData) => {

    const { storeCategoryData, storeBrandsData, storeProductUnits, addDataToCurrentGlobal, getToast, reloadData } = useContext(ContextData);
    const [isLoading, setIL] = useState(false);

    const componentRef = useRef();

    const adminStoreId = cookies.get("adminStoreId");
    const adminStoreType = cookies.get("adminStoreType");
    const adminId = cookies.get("adminId");
    const [how_much_print, sethow_much_print] = useState(0)



  
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

    const printData = () => {
        const indents = [];
        for (const i = 0; i <= how_much_print; i++) {
          indents.push(<span className='indent' key={i}> aaa </span>);
        }
        return indents
    }



    return (

        
        <>
            <div className="row">

                <div className="col-md-12 my-2 bg-light p-2">
               
               <h6 className=' text-dark'>  {productDetails.product_name} {productDetails.product_size} {productDetails.product_unit} </h6>
                   
                
                
                </div>

                <div className="col-md-12">
                  
                            <div className="mb-3">
                                <label htmlFor="compnayNameinput" className="form-label">Print Quantity</label>
                                <input type="number" onChange={e => sethow_much_print(e.target.value )} value={how_much_print} className="form-control" placeholder="Print Quantity" id="compnayNameinput" />
                            </div>


 
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
                      
                        <ReactToPrint
    trigger={() => <button  class="btn btn-danger" > Print Barcode</button>}
    content={() => componentRef.current}
/>
                    </div>
                </div>
            </div>


            <div
                id='section-to-print'
                ref={componentRef}>
                <div className='POS_header px-1'>

                {(() => {
            let td = [];
            for (let i = 1; i <= how_much_print; i++) {
              td.push(
              
                <div className='my-2'>

                

    <div className="col-md-12 d-flex justify-content-center">
    {productDetails.product_bar_code ? <>
                            <ReactJSBarcode
                                value={productDetails.product_bar_code}
                                options={{ format: 'code128', height: 22, }}
                                renderer="canvas"
                                className="barcodeProduct"
                            />
                          
                        </>
                            : null}
        </div>

        <div className="row">

                    
                  
<div className="col-sm-6">
    <h6  className="font-bold">Size {productDetails.product_size} {productDetails.product_unit}</h6>

</div>


<div className="col-sm-6">
    <h6  className="font-bold">Price {productDetails.sale_price} RS</h6>

</div>



</div>    
                  
                



    </div>

              
              );
            }
            return td;
          })()}
                 

                </div>
               
            

         
        
            </div>


        </>
    )

}