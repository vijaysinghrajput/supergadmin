import { useState, useContext, useEffect } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext';
import Multiselect from 'multiselect-react-dropdown';
import { useRef } from 'react';
import { useToast } from '@chakra-ui/react';

const cookies = new Cookies();

export const ImportNewArea = (props) => {

    const {Store_bussiness_info, master_delivery_area, store_delivery_area,  storeBussinessRelode } = useContext(ContextData);
    const [filteredBrandsData, setFilterBrandData] = useState([]);
    const [isLoading, setIL] = useState(false);
    const getSelectedItemsRef = useRef(null);
    const [getAllSelectedItems, setAllSelectedItems] = useState([]);
    const adminStoreId = cookies.get("adminStoreId");
    const adminStoreType = cookies.get("adminStoreType");
    const adminId = cookies.get("adminId");
    const toast = useToast();

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


    const [showMasterData, setShowMasterData] = useState(master_delivery_area);
    const [showStoreData, setShowStoreData] = useState(store_delivery_area);

    useEffect(() => {
        setShowStoreData(store_delivery_area); 
    }, [store_delivery_area])

    // const [master_delivery_area, setmaster_delivery_area] = useState({
    //     'store_id': adminStoreId,
    //     'brand_type': adminStoreType,
    //     'brand_name': null,
    //     'brand_feature_image': null,
    //     'date': +new Date(),
    // });
    useEffect(() => {

        // const getSelectedItemsRef = useRef(null);

        console.log("Store_bussiness_info.city",Store_bussiness_info.city)

        let obj3 = []

        showMasterData.map(function (a) {
            let matched = store_delivery_area.filter(b => ((a.area === b.area) && (a.city === b.city)));
            if (matched.length) {
                // obj3.push({ name: a.name, matched: true });
            } else if ((a.city.replace(/\s/g, "-").toLowerCase()) ==(Store_bussiness_info.city).replace(/\s/g, "-").toLowerCase()) {
                obj3.push({
                    key: a.area+ ", "+a.city+", "+a.state,
                    id: a.id,
                    cat: 'Group 1',
                    area: a.area,
                    city: a.city,
                    state: a.state,
                    
                });
            }
        })

        setFilterBrandData(obj3);

        console.log("filter ---->", showStoreData);
        console.log("filter 222 ---->", store_delivery_area);

        // console.log("filter", res)


    }, [store_delivery_area]);



    const AddBrandToSeller = () => {

        if (getSelectedItemsRef.current.state.selectedValues[0] === undefined) {
            getToast({ title: "Please Select Brands", dec: "Requird", status: "error" });
        }
        else {
            setIL(true);


            fetch(URL + "/APP-API/Billing/importStoreDeliveryArea", {
                method: 'POST',
                header: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({

                    store_id: adminStoreId,
                    adminId:adminId,
                    area: getSelectedItemsRef.current.state.selectedValues

                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    // console.log("respond plot upload", responseJson)
                    if (responseJson.success) {
                        storeBussinessRelode();
                        getToast({ title: "Area Added ", dec: "Successful", status: "success" });
                        getSelectedItemsRef.current.resetSelectedValues();

                    } else {
                        console.log("added");
                        // addDataToCurrentGlobal({ type: "plots", payload: store_delivery_area });
                        getToast({ title: "Failed Something Error", dec: "Successful", status: "error" });
                    }
                    storeBussinessRelode();
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
                        <label htmlFor="firstNameinput" className="form-label">Select Delivery Area</label>
                        {filteredBrandsData.length && (

                            <Multiselect
                                displayValue="key"
                                onKeyPressFn={function noRefCheck() { }}
                                onSearch={function noRefCheck() { }}
                                onRemove={() => {
                                    setAllSelectedItems(getSelectedItemsRef.current.state.selectedValues)
                                }}
                                onSelect={() => {
                                    setAllSelectedItems(getSelectedItemsRef.current.state.selectedValues)
                                }}
                                options={filteredBrandsData}
                                ref={getSelectedItemsRef}
                            // showCheckbox
                            />

                        )}
  <p><small>Can't find your area ? CALL US - 639-1000-415</small></p>

                    </div>
                </div>{/*end col*/}


                <div className="col-lg-12">
                    <div className="text-center mt-2">
                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Adding </a> : <button type="button" onClick={AddBrandToSeller} className="btn btn-primary">Add Area</button>}
                    </div>
                </div>{/*end col*/}
            </div>{/*end row*/}
        </>
    )

}
