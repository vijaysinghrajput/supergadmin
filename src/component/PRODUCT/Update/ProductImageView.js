import { useState, useContext, useRef, useEffect } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext';

import { useToast } from '@chakra-ui/react';

const cookies = new Cookies();

export const ProductImageView = (EditProductData) => {  

    const toast = useToast();

    const { storeCategoryData, storeBrandsData, storeProductUnits, addDataToCurrentGlobal,  reloadData } = useContext(ContextData);
    const [isLoading, setIL] = useState(false);




    const adminStoreId = cookies.get("adminStoreId");

    const [productDetails, setproductDetails] = useState({
        'store_id': adminStoreId,
        'product_name': '',
        'product_image': { length: 0 },



    });



    useEffect(() => {
        // console.log("productDetails",EditProductData)
        setproductDetails({...EditProductData.productDetails  });
        
        // console.log("hey naveet", editablePlot);
    }, [EditProductData.productDetails])
 

 






 




    return (
        <>
            <div className="row">

            <div className="col-md-12 my-2 bg-light p-2">
               
               <h5 className=' text-dark'>  {productDetails.product_name} {productDetails.product_size} {productDetails.product_unit} </h5>
                   
                
                
                </div>

  

           



                <div className="col-md-12">
                    <div className="mb-3">
                      

                        <img  src={productDetails.product_image} alt="" style={{ width:'100%', height: '500px', borderRadius: '14px' }} />


                    </div>
                </div>
            
        
                
            
            </div>
        </>
    )

}