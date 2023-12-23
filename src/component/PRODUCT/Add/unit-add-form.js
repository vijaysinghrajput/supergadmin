import { useState, useContext } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext';

const cookies = new Cookies();

export const AddUnitForm = (props) => {

    const { addDataToCurrentGlobal, getToast, reloadData } = useContext(ContextData);
    const [isLoading, setIL] = useState(false);
    const adminStoreId = cookies.get("adminStoreId");
    const adminStoreType = cookies.get("adminStoreType");
    const adminId = cookies.get("adminId");

    const [storeUnitsData, setstoreUnitsData] = useState({
        'store_id': adminStoreId,
        'unit_type': adminStoreType,
        'unit_name': null,

    });



    const AddUnit = () => {

        if (storeUnitsData.unit_name == null) {
            getToast({ title: "Unit Name ", dec: "Requird", status: "error" });
        }
        else {
            setIL(true);
            const formData = new FormData();


            
            formData.append('store_id', storeUnitsData.store_id)
            formData.append('adminId',adminId)
            formData.append('unit_type', storeUnitsData.unit_type)
            formData.append('unit_name', storeUnitsData.unit_name)



            fetch(URL + "/APP-API/Billing/addStoreUnits", {
                method: 'POST',
                header: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: formData
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log("respond plot upload", responseJson)
                    if (responseJson.is_unit_alredy == 1) {

                        getToast({ title: "Unit Added Already", dec: "Successful", status: "success" });
                        reloadData();
                        setstoreUnitsData(
                            {
                                'store_id': adminStoreId,
                                'unit_type': adminStoreType,
                                'unit_name': null,
                            }
                        )

                    } else {
                        console.log("added");
                        // addDataToCurrentGlobal({ type: "plots", payload: storeUnitsData });
                        getToast({ title: "Unit Added", dec: "Successful", status: "success" });
                        reloadData();
                    }

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
                        <label htmlFor="compnayNameinput" className="form-label">Unit Name (Required)</label>
                        <input type="text" onChange={e => setstoreUnitsData({ ...storeUnitsData, unit_name: e.target.value })} value={storeUnitsData.unit_name} className="form-control" placeholder="Unit Name" id="Unit_name" />
                    </div>
                </div>{/*end col*/}






                <div className="col-lg-12">
                    <div className="text-center mt-2">
                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Adding </a> : <button type="button" onClick={AddUnit} className="btn btn-primary">Add Unit</button>}
                    </div>
                </div>{/*end col*/}
            </div>{/*end row*/}
        </>
    )

}
