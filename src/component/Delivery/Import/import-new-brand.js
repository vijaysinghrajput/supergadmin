import { useState, useContext, useEffect } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext';
import Multiselect from 'multiselect-react-dropdown';
import { useRef } from 'react';

const cookies = new Cookies();

export const ImportNewBrand = (props) => {

    const { masterBrandsData, storeBrandsData, getToast, reloadData } = useContext(ContextData);
    const [filteredBrandsData, setFilterBrandData] = useState([]);
    const [isLoading, setIL] = useState(false);
    const getSelectedItemsRef = useRef(null);
    const [getAllSelectedItems, setAllSelectedItems] = useState([]);
    const adminStoreId = cookies.get("adminStoreId");
    const adminStoreType = cookies.get("adminStoreType");
    const adminId = cookies.get("adminId");

    const [showMasterData, setShowMasterData] = useState(masterBrandsData);
    const [showStoreData, setShowStoreData] = useState(storeBrandsData);

    useEffect(() => {
        setShowStoreData(storeBrandsData);
    }, [storeBrandsData])

    // const [masterBrandsData, setmasterBrandsData] = useState({
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
            let matched = storeBrandsData.filter(b => a.id === b.master_brand_id);
            if (matched.length) {
                // obj3.push({ name: a.name, matched: true });
            } else {
                obj3.push({
                    key: a.brand_name,
                    id: a.id,
                    cat: 'Group 1',
                    brand_type: a.brand_type,
                    brand_image: a.brand_image,
                    deceptions: a.deceptions,
                    date: a.date
                });
            }
        })

        setFilterBrandData(obj3);

        console.log("filter ---->", showStoreData);
        console.log("filter 222 ---->", storeBrandsData);

        // console.log("filter", res)


    }, [storeBrandsData]);



    const AddBrandToSeller = () => {

        if (getSelectedItemsRef.current.state.selectedValues[0] === undefined) {
            getToast({ title: "Please Select Brands", dec: "Requird", status: "error" });
        }
        else {
            setIL(true);


            fetch(URL + "/APP-API/Billing/importStoreBrands", {
                method: 'POST',
                header: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({

                    store_id: adminStoreId,
                    adminId:adminId,
                    Brands: getSelectedItemsRef.current.state.selectedValues

                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log("respond plot upload", responseJson)
                    if (responseJson.success) {

                        getToast({ title: "Brand Added ", dec: "Successful", status: "success" });
                        getSelectedItemsRef.current.resetSelectedValues();

                    } else {
                        console.log("added");
                        // addDataToCurrentGlobal({ type: "plots", payload: storeBrandsData });
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
                        <label htmlFor="firstNameinput" className="form-label">Select Brands</label>
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
                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Adding </a> : <button type="button" onClick={AddBrandToSeller} className="btn btn-primary">Add Brand</button>}
                    </div>
                </div>{/*end col*/}
            </div>{/*end row*/}
        </>
    )

}
