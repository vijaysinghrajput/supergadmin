import { useState, useContext, useRef, useEffect } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext';

import { useToast } from '@chakra-ui/react';
import ImageUploader from 'react-images-upload';

const cookies = new Cookies();

export const UpdateProductImage = (EditProductData) => {  

    const toast = useToast();

    const {  storeProductRelode } = useContext(ContextData);
    const [isLoading, setIL] = useState(false);




    const adminStoreId = cookies.get("adminStoreId");
    const adminStoreType = cookies.get("adminStoreType");
    const adminId = cookies.get("adminId");


    const [productDetails, setproductDetails] = useState({
        'store_id': adminStoreId,
        'id':'',
        'product_name': '',
        'product_image': '',
        'product_new_image': '',



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
        // console.log("productDetails",EditProductData)
        setproductDetails({...EditProductData.productDetails  });
        
        // console.log("hey naveet", editablePlot);
    }, [EditProductData.productDetails])
 

 






    const onChangeImage = (pictureFiles) => {
        setproductDetails({ ...productDetails, product_new_image: pictureFiles })


    }


    const AddProductAction = () => {




            setIL(true);
            const formData = new FormData();

            productDetails.product_new_image && productDetails.product_new_image.map((item, i) => {
                formData.append(`product_new_image[]`, item, item.name);
            })

            formData.append('id', productDetails.id)
            formData.append('product_image', productDetails.product_image)
   



            fetch(URL + "/APP-API/Billing/UpdateStoreProductsImage", {
                method: 'POST',
                header: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: formData
            }).then((response) => response.json())
                .then((responseJson) => {

                    console.log("update image",responseJson)
                    if (responseJson.success) {

                        getToast({ title: " Updated ", dec: "Successful", status: "success" });
                        storeProductRelode();
 
                    } else {
                      
                        // addDataToCurrentGlobal({ type: "plots", payload: storeBrandsData });
                        getToast({ title: "error", dec: "error", status: "error" });
                        storeProductRelode();
                    }
                    setIL(false);
                    setproductDetails(
                        {
                            'store_id': adminStoreId,
                            'product_name': '',
                            'product_image': '',
                            'product_new_image':'',
                          
                        }

                    )
                

                    for (let i = 0; i < 10; i++) {
                        document.getElementsByClassName("btn-close")[i].click();
                    }
                })
                .catch((error) => {
                    //  console.error(error);
                });
        
    };

  



    return (
        <>
            <div className="row">

            <div className="col-md-12 my-2 bg-light p-2">
               
               <h5 className=' text-dark'>  {productDetails.product_name} {productDetails.product_size} {productDetails.product_unit} </h5>
                   
                
                
                </div>

  

           



                <div className="col-md-12">
                    <div className="mb-3">
                      

                        <img  src={productDetails.product_image} alt="" style={{ height: '200px', borderRadius: '14px' }} />


                    </div>
                </div>
            
        
                
                <div className="col-md-12">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label text-danger">Product New Image </label>
                        <ImageUploader
                            withIcon={true}
                            buttonText='Choose New Product Images'
                            onChange={onChangeImage}
                            imgExtension={['.jpg', '.jpeg', '.png', '.gif']}
                            maxFileSize={5242880}
                            singleImage={true}
                            withPreview={true}
                        />
                    </div>
                </div>



                <div className="col-lg-12">
                    <div className="text-center mt-2">
                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Adding </a> : <button type="button" onClick={AddProductAction} className="btn btn-primary">Update Product Image</button>}
                    </div>
                </div>
            </div>
        </>
    )

}