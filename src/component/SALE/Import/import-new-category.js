import { useState, useContext, useEffect } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext';
import Multiselect from 'multiselect-react-dropdown';
import { useRef } from 'react';

const cookies = new Cookies();

export const ImportNewCategory = (props) => {

    const { masterCategoryData, storeCategoryData, getToast, reloadData } = useContext(ContextData);
    const [filteredCategoryData, setFilterCategoryData] = useState([]);
    const [isLoading, setIL] = useState(false);
    const getSelectedItemsRef = useRef(null);
    const [getAllSelectedItems, setAllSelectedItems] = useState([]);
    const adminStoreId = cookies.get("adminStoreId");
    const adminId = cookies.get("adminId");
    const adminStoreType = cookies.get("adminStoreType");
    const [showMasterData, setShowMasterData] = useState(masterCategoryData);
    const [showStoreData, setShowStoreData] = useState(storeCategoryData);

    // const [masterCategoryData, setmasterCategoryData] = useState({
    //     'store_id': adminStoreId,
    //     'Category_type': adminStoreType,
    //     'category_name': null,
    //     'Category_feature_image': null,
    //     'date': +new Date(),
    // });

    useEffect(() => {

        // const getSelectedItemsRef = useRef(null);

        let obj3 = []

        showMasterData.map(function (a) {
            let matched = storeCategoryData.filter(b => a.id === b.master_category_id);
            if (matched.length) {
                // obj3.push({ name: a.name, matched: true });
            } else {
                if (a.category_level == 0) {
                    obj3.push({
                        key: a.category_name,
                        id: a.id,
                        cat: 'Group 1',
                        category_type: a.category_type,
                        category_image: a.category_image,
                        category_level: a.category_level,
                        deceptions: a.deceptions,
                        date: a.date
                    });
                }

            }
        })
        setFilterCategoryData(obj3);

        // console.log("filter", res)


    }, [storeCategoryData]);



    const AddCategoryToSeller = () => {


        // console.log('category', getSelectedItemsRef.current.state.selectedValues)

        if (getSelectedItemsRef.current.state.selectedValues[0] === undefined) {
            getToast({ title: "Please Select Category", dec: "Requird", status: "error" });
        }
        else {
            setIL(true);


            fetch(URL + "/APP-API/Billing/importStoreCategory", {
                method: 'POST',
                header: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({

                    store_id: adminStoreId,
                    adminId:adminId,
                    Category: getSelectedItemsRef.current.state.selectedValues

                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log("respond plot upload", responseJson)
                    if (responseJson.success) {

                        reloadData();
                        getToast({ title: "Category Added ", dec: "Successful", status: "success" });
                        getSelectedItemsRef.current.resetSelectedValues();


                    } else {
                        console.log("added");
                        // addDataToCurrentGlobal({ type: "plots", payload: storeCategoryData });
                        reloadData();
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
                        <label htmlFor="firstNameinput" className="form-label">Select Category</label>
                        {filteredCategoryData.length && (

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
                                options={filteredCategoryData}
                                ref={getSelectedItemsRef}
                            // showCheckbox
                            />

                        )}

                    </div>
                </div>{/*end col*/}

                <div className="col-lg-12">
                    <div className="text-center mt-2">
                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Adding </a> : <button type="button" onClick={AddCategoryToSeller} className="btn btn-primary">Add Category</button>}
                    </div>
                </div>{/*end col*/}
            </div>{/*end row*/}
        </>
    )

}
