import { useState, useContext, useEffect } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext';
import Multiselect from 'multiselect-react-dropdown';
import { useRef } from 'react';
import { useToast } from '@chakra-ui/react';

const cookies = new Cookies();

export const ImportNewProduct = (props) => {

    const toast = useToast();
    const { masterProductsData, storeProductsData,  reloadData } = useContext(ContextData);
    const [filteredProductData, setFilterProductData] = useState([]);
    const [isLoading, setIL] = useState(false);
    const getSelectedItemsRef = useRef(null); 
    const [getAllSelectedItems, setAllSelectedItems] = useState([]);
    const adminStoreId = cookies.get("adminStoreId");
    const adminId = cookies.get("adminId");
    const adminStoreType = cookies.get("adminStoreType");
    const [showMasterData, setShowMasterData] = useState(masterProductsData);
    const [showStoreData, setShowStoreData] = useState(storeProductsData);

    // const [masterProductsData, setmasterProductsData] = useState({
    //     'store_id': adminStoreId,
    //     'Product_type': adminStoreType,
    //     'Product_name': null,
    //     'Product_feature_image': null,
    //     'date': +new Date(),
    // });

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

        // const getSelectedItemsRef = useRef(null);

        if(showMasterData==null){setShowMasterData([])}

        let obj3 = []

        showMasterData.map(function (a) {
            let matched = storeProductsData.filter(b => a.product_uniq_slug_name === b.product_uniq_slug_name);
            if (matched.length) {
                // obj3.push({ name: a.name, matched: true });
            } else { 
                obj3.push({...a });
            }
        })

    
        setFilterProductData(obj3);

        // console.log("filter", res)


    }, [storeProductsData]);



    const AddProductToSeller = () => {

        if (getSelectedItemsRef.current.state.selectedValues[0] === undefined) {
            getToast({ title: "Please Select Product", dec: "Requird", status: "error" });
        }
        else {
            setIL(true);


            fetch(URL + "/APP-API/Billing/importStoreProduct", { 
                method: 'POST',
                header: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({

                    store_id: adminStoreId,
                    adminId:adminId,
                    Product: getSelectedItemsRef.current.state.selectedValues

                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    getSelectedItemsRef.current.resetSelectedValues();
                    if (responseJson.success) {

                        getToast({ title: "Product Added ", dec: "Successful", status: "success" });
                        getSelectedItemsRef.current.resetSelectedValues();

                    } else {
                        console.log("added");
                        // addDataToCurrentGlobal({ type: "plots", payload: storeProductsData });
                        getToast({ title: "Failed Something Error", dec: "Successful", status: "error" });
                    }
                    reloadData();
                    setIL(false);
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
                <div className="col-md-12">
                    <div className="mb-3">
                        <label htmlFor="firstNameinput" className="form-label">Select Product</label>
                        {filteredProductData.length && (

                            <Multiselect
                                displayValue="product_full_name"
                                onKeyPressFn={function noRefCheck() { }}
                                onSearch={function noRefCheck() { }}
                                onRemove={() => {
                                    setAllSelectedItems(getSelectedItemsRef.current.state.selectedValues)
                                }}
                                onSelect={() => {
                                    setAllSelectedItems(getSelectedItemsRef.current.state.selectedValues)
                                }}
                                options={filteredProductData}
                                ref={getSelectedItemsRef}
                            // showCheckbox
                            />

                        )}

                    </div>
                </div>{/*end col*/}


                <div className="col-lg-12">
                    <div className="text-center mt-2">
                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Adding </a> : <button type="button" onClick={AddProductToSeller} className="btn btn-primary">Add Product</button>}
                    </div>
                </div>{/*end col*/}
            </div>{/*end row*/}
        </>
    )

}
