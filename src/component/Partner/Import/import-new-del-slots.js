import { useState, useContext, useEffect } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext';
import Multiselect from 'multiselect-react-dropdown';
import { useRef } from 'react';
import { useToast } from '@chakra-ui/react';

const cookies = new Cookies();

export const ImportNewDelSlots = (props) => {

    const { master_delivery_slot, store_delivery_slot,  storeBussinessRelode } = useContext(ContextData);
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


    const [showMasterData, setShowMasterData] = useState(master_delivery_slot);
    const [showStoreData, setShowStoreData] = useState(store_delivery_slot);

    useEffect(() => {
        setShowStoreData(store_delivery_slot); 
    }, [store_delivery_slot]) 

    // const [master_delivery_slot, setmaster_delivery_slot] = useState({
    //     'store_id': adminStoreId,
    //     'brand_type': adminStoreType,
    //     'brand_name': null,
    //     'brand_feature_image': null,
    //     'date': +new Date(),
    // });
    useEffect(() => {

        // const getSelectedItemsRef = useRef(null);

        let obj3 = []

        showMasterData.map(function (a) {
            let matched = store_delivery_slot.filter(b => (a.slot_name === b.slot_name));
            if (matched.length) {
               
            } else {
                obj3.push({
                    key: ((Number(a.slot_time_start) > 12)? Number(a.slot_time_start) -12 : Number(a.slot_time_start))+" "+a.start_time_postfix+ " To "+((Number(a.slot_time_end) > 12)? Number(a.slot_time_end) -12 : Number(a.slot_time_end))+" "+a.end_time_postfix+" - "+a.slot_name+" Delivery",
                    id: a.id,
                    cat: 'Group 1',
                    ...a
                    
                });
            }
        })

        

        setFilterBrandData(obj3);

        console.log("filter ---->", showStoreData);
        console.log("filter 222 ---->", store_delivery_slot);

        // console.log("filter", res)


    }, [store_delivery_slot]);


 
      

    const AddBrandToSeller = () => {

        if (getSelectedItemsRef.current.state.selectedValues[0] === undefined) {
            getToast({ title: "Please Select Brands", dec: "Requird", status: "error" });
        }
        else {
            setIL(true);


            fetch(URL + "/APP-API/Billing/importStoreDeliverySlot", {
                method: 'POST',
                header: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({

                    store_id: adminStoreId,
                    adminId:adminId,
                    slot: getSelectedItemsRef.current.state.selectedValues

                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    // console.log("respond plot upload", responseJson)
                    if (responseJson.success) {
                        getToast({ title: "Slots Added ", dec: "Successful", status: "success" });
                        getSelectedItemsRef.current.resetSelectedValues();

                    } else {
                        console.log("added");
                        // addDataToCurrentGlobal({ type: "plots", payload: store_delivery_slot });
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

                storeBussinessRelode();
        }


    };

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="mb-3">
                        <label htmlFor="firstNameinput" className="form-label">Select Delivery Slot</label>
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

                    </div>
                </div>{/*end col*/}


                <div className="col-lg-12">
                    <div className="text-center mt-2">
                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Adding </a> : <button type="button" onClick={AddBrandToSeller} className="btn btn-primary">Add Slot</button>}
                    </div>
                </div>{/*end col*/}
            </div>{/*end row*/}
        </>
    )

}
