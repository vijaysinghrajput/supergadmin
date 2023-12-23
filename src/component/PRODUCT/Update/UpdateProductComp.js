import { useState, useContext, useRef, useEffect } from 'react';
import URL from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext';
// import ImageUploader from 'react-images-upload';
import Multiselect from 'multiselect-react-dropdown';
import ReactJSBarcode from 'react-jsbarcode';
import { useToast } from '@chakra-ui/react';

const cookies = new Cookies();

export const UpdateProductComp = (EditProductData) => {  

    const toast = useToast();

    const { storeCategoryData, storeBrandsData, storeProductUnits, addDataToCurrentGlobal,  storeProductRelode } = useContext(ContextData);
    const [isLoading, setIL] = useState(false);

    const getSelectedBrandsRef = useRef(null);
    const [filteredBrandsData, setFilterBrandData] = useState([]);
    const [getAllSelectedBrands, setAllSelectedBrands] = useState([]);

    const getSelectedCategorysRef = useRef(null);
    const [filteredCategorysData, setFilterCategoryData] = useState([]);
    const [getAllSelectedCategorys, setAllSelectedCategorys] = useState([]);
    const [getSelectedCategoryId, setSelectedCategoryId] = useState({ "id": 999 });

    const getSelectedChildCategorysRef = useRef(null);
    const [filteredChildCategorysData, setFilterChildCategoryData] = useState([]);
    const [getAllSelectedChildCategorys, setAllSelectedChildCategorys] = useState([]);


    const adminStoreId = cookies.get("adminStoreId");
    const adminStoreType = cookies.get("adminStoreType");
    const adminId = cookies.get("adminId");

    // `product_name`, `product_uniq_slug_name`, `product_image`, `product_type`, `parent_category_id`,
    //  `category_id`, `brand_id`, `price`, `discount_in_percent`, `sale_price`, `product_size`, `product_unit`, 
    //  `stock_quantity`, `stok_warehouse_qty`, `stock_alert_quantity`, `product_bar_code`,
    //  `deceptions`, `hsn_code`, `i_gst`, `c_gst`, `s_gst`, `expeiry_date`,
    const [productDetails, setproductDetails] = useState({
        'store_id': adminStoreId,
        'product_name': '',
        'product_uniq_slug_name': '',
        'product_image': { length: 0 },
        'product_type': adminStoreType,
        'parent_category_id': '',
        'category_id': '',
        'brand_id': '',
        'purchase_price': 0,
        'price': 0,
        'discount_in_percent': 0,
        'discount_in_rs': 0,
        'sale_price': 0,
        'product_unit': '',
        'product_size': '',
        'product_bar_code': '',
        'deceptions': '',
        'hsn_code': '',
        'i_gst': 0,
        'c_gst': 0,
        's_gst': 0,
        'margin_in_rs': '',


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
 

    useEffect(() => {

        // const getSelectedBrandsRef = useRef(null);

        let brandsData = []

        storeBrandsData.map(function (brand) {


            brandsData.push({
                key: brand.brand_name,
                ...brand

            });

        })

        setFilterBrandData(brandsData);

        let CategorysData = []

        storeCategoryData.map(function (Category) {

            if (Category.category_level == 0) {
                CategorysData.push({
                    key: Category.category_name + " | "+Category.hindi_name+" |",
                    ...Category
                });
            }
        })

        setFilterCategoryData(CategorysData);

    }, []);



    const setChaildCate = (id) => {
        if (id.length) {

            setAllSelectedCategorys(id);
            setSelectedCategoryId(id[0].master_category_id)

            let ChildCategorysData = [];

            const getSelectedCategoryIDD = id[0].master_category_id;


            storeCategoryData.map(function (Category) {
                if (Category.master_category_level == getSelectedCategoryIDD) {
                    ChildCategorysData.push({
                        key: Category.category_name + " | "+Category.hindi_name+" |",
                        ...Category
                    });
                }
            })

            setFilterChildCategoryData(ChildCategorysData);
        }

    }

    const generateBarCode = () => {

        let randNo = (Date.now());
        setproductDetails({ ...productDetails, product_bar_code: randNo })
    }

    const onChangeImage = (pictureFiles) => {
        setproductDetails({ ...productDetails, product_image: pictureFiles })


    }


    const AddProductAction = () => {

        let DisInPerc = Math.round(((productDetails.price - productDetails.sale_price) * 100) / productDetails.price)

       if (getSelectedCategorysRef.current.state.selectedValues[0] === undefined) {
            getToast({ title: "Please Select Category", dec: "Requird", status: "error" });
        }
        else if (getSelectedChildCategorysRef.current.state.selectedValues[0] === undefined) {
            getToast({ title: "Please Select Child Category", dec: "Requird", status: "error" });
        }
        else if (getSelectedBrandsRef.current.state.selectedValues[0] === undefined) {
            getToast({ title: "Please Select Brand", dec: "Requird", status: "error" });
        }
        else if (productDetails.product_size == '') {
            getToast({ title: "Product Size Requird", dec: "Requird", status: "error" });
        }
        else if (productDetails.product_unit == '') {
            getToast({ title: "Product Unit Requird", dec: "Requird", status: "error" });
        }
        else if (productDetails.price == 0) {
            getToast({ title: "Product Price Requird", dec: "Requird", status: "error" });
        }
        else if (productDetails.product_bar_code == null) {
            getToast({ title: "Product BarCode Requird", dec: "Requird", status: "error" });
        }
        else {


            setIL(true);
            const formData = new FormData();

            formData.append('id', productDetails.id)
            formData.append('parent_category_id', getSelectedCategorysRef.current.state.selectedValues[0].master_category_id)
            formData.append('parent_category_name', getSelectedCategorysRef.current.state.selectedValues[0].category_name)
            formData.append('category_id', getSelectedChildCategorysRef.current.state.selectedValues[0].master_category_id)
            formData.append('child_category_name', getSelectedChildCategorysRef.current.state.selectedValues[0].category_name)
            formData.append('brand_id', getSelectedBrandsRef.current.state.selectedValues[0].master_brand_id)
            formData.append('brand_name', getSelectedBrandsRef.current.state.selectedValues[0].brand_name)
            formData.append('purchase_price', productDetails.purchase_price)
            formData.append('price', productDetails.price)
            formData.append('discount_in_percent', DisInPerc)
            formData.append('discount_in_rs', productDetails.discount_in_rs)
            formData.append('sale_price', productDetails.sale_price)
            formData.append('product_size', productDetails.product_size) 
            formData.append('product_unit', productDetails.product_unit)
            formData.append('product_bar_code', productDetails.product_bar_code)
            formData.append('deceptions', productDetails.deceptions)
            formData.append('hsn_code', productDetails.hsn_code)
            formData.append('i_gst', productDetails.i_gst)
            formData.append('c_gst', productDetails.c_gst)
            formData.append('s_gst', productDetails.s_gst)
            formData.append('margin_in_rs', productDetails.margin_in_rs)



            fetch(URL + "/APP-API/Billing/UpdateStoreProductsInformation", {
                method: 'POST',
                header: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                },
                body: formData
            }).then((response) => response.json())
                .then((responseJson) => {
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
                            'product_uniq_slug_name': '',
                            'product_image': { length: 0 },
                            'product_type': adminStoreType,
                            'parent_category_id': '',
                            'category_id': '',
                            'brand_id': '',
                            'purchase_price': '',
                            'price': 0,
                            'discount_in_percent': 0,
                            'discount_in_rs': 0,
                            'sale_price': 0,
                            'product_unit': '',
                            'product_size': '',
                            'product_bar_code': '',
                            'deceptions': '',
                            'hsn_code': '',
                            'i_gst': 0,
                            'c_gst': 0,
                            's_gst': 0,
                            'margin_in_rs': '',
                        }

                    )
                    getSelectedCategorysRef.current.resetSelectedValues();
                    getSelectedChildCategorysRef.current.resetSelectedValues();
                    getSelectedBrandsRef.current.resetSelectedValues();

                    for (let i = 0; i < 10; i++) {
                        document.getElementsByClassName("btn-close")[i].click();
                    }
                })
                .catch((error) => {
                    //  console.error(error);
                });
        }
    };

    const setPricing = (value) => {
        setproductDetails({ ...productDetails, price: value, sale_price: value, discount_in_rs: 0 })
    }
    const setDiscount = (value) => {
        let dicountPerc = ((productDetails.price - productDetails.sale_price) / productDetails.price) * 10

        setproductDetails({ ...productDetails, discount_in_rs: value, sale_price: productDetails.price - value, discount_in_percent: dicountPerc })
    }
    const setSalePricing = (value) => {
        setproductDetails({ ...productDetails, sale_price: value })
    }
    const setBarCode = (value) => {
        value && setproductDetails({ ...productDetails, product_bar_code: value });
        /* if (value = " ") {
            setproductDetails({ ...productDetails, product_bar_code: null })
        } else {
        } */
    }

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
               
               <h5 className=' text-dark'>  {productDetails.product_name} {productDetails.product_size} {productDetails.product_unit} </h5>
                   
                
                
                </div>

  

           



                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="firstNameinput" className="form-label text-danger">Product Category</label>


                        {filteredCategorysData.length && (

                            <Multiselect
                                // singleSelect={true}'
                                selectionLimit={1}
                                displayValue="key"
                                onKeyPressFn={function noRefCheck() { }}
                                onSearch={function noRefCheck() { }}
                                onRemove={() => {
                                    setChaildCate(getSelectedCategorysRef.current.state.selectedValues)
                                }}
                                onSelect={() => {
                                    setChaildCate(getSelectedCategorysRef.current.state.selectedValues)
                                }}
                                options={filteredCategorysData}
                                ref={getSelectedCategorysRef}
                            // showCheckbox
                            />

                        )}

                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="firstNameinput" className="form-label text-danger">Product Child Category</label>
                        {filteredChildCategorysData.length && (

                            <Multiselect
                                // singleSelect={true}
                                selectionLimit={1}
                                displayValue="key"
                                onKeyPressFn={function noRefCheck() { }}
                                onSearch={function noRefCheck() { }}
                                onRemove={() => {
                                    setAllSelectedChildCategorys(getSelectedChildCategorysRef.current.state.selectedValues)
                                }}
                                onSelect={() => {
                                    setAllSelectedChildCategorys(getSelectedChildCategorysRef.current.state.selectedValues)
                                }}
                                options={filteredChildCategorysData}
                                ref={getSelectedChildCategorysRef}
                            // showCheckbox
                            />

                        )}

                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="firstNameinput" className="form-label text-danger">Product Brand</label>
                        {filteredBrandsData.length && (

                            <Multiselect
                                // singleSelect={true}
                                selectionLimit={1}
                                displayValue="key"
                                onKeyPressFn={function noRefCheck() { }}
                                onSearch={function noRefCheck() { }}
                                onRemove={() => {
                                    setAllSelectedBrands(getSelectedBrandsRef.current.state.selectedValues)
                                }}
                                onSelect={() => {
                                    setAllSelectedBrands(getSelectedBrandsRef.current.state.selectedValues)
                                }}
                                options={filteredBrandsData}
                                ref={getSelectedBrandsRef}
                            // showCheckbox
                            />

                        )}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="firstNameinput" className="form-label text-danger">Size & Unit</label>
                        <div className='d-flex'>
                            <input type="text" onChange={e => setproductDetails({ ...productDetails, product_size: e.target.value })} value={productDetails.product_size} className="form-control" placeholder="Product Size" id="address1ControlTextarea" />

                            <button type="button" class="btn btn-light dropdown-toggle"
                                data-bs-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">{productDetails.product_unit ? productDetails.product_unit : "Unit"}</button>
                            <div class="dropdown-menu">
                                {storeProductUnits.map(function (item, i) {
                                    console.log('test');
                                    return <a class="dropdown-item" onClick={() => setproductDetails({ ...productDetails, product_unit: item.unit_name })} href="#">{item.unit_name}</a>
                                })}


                            </div>
                        </div>
                    </div>
                </div>

           
                <div className="col-md-12">
                    <div className='row'>
                        <div className='col-sm-6'>
                            <div className="mb-3">
                                <label htmlFor="compnayNameinput" className="form-label">Purchase Price</label>
                                <input type="number" onChange={e => setproductDetails({ ...productDetails, purchase_price: e.target.value })} value={productDetails.purchase_price} className="form-control" placeholder="Purchase" id="compnayNameinput" />
                            </div>

                        </div>

                        <div className='col-sm-6'>
                            <div className="mb-3">
                                <label htmlFor="compnayNameinput" className="form-label text-danger">Customer Price</label>
                                <input type="number" onChange={e => setPricing(e.target.value)} value={productDetails.price} className="form-control" placeholder="Price" id="compnayNameinput" />
                            </div>

                        </div>

                    </div>


                </div>

                <div className="col-md-12">
                    <div className='row'>

                        <div className='col-sm-6'>
                            <div className="mb-3">
                                <label htmlFor="compnayNameinput" className="form-label">Discount in Rs </label>
                                <input type="number" onChange={e => setDiscount(e.target.value)} value={productDetails.discount_in_rs} className="form-control" placeholder="Discount in Rs" id="compnayNameinput" />

                            </div>

                        </div>
                        <div className='col-sm-6'>
                            <div className="mb-3">
                                <label htmlFor="compnayNameinput" className="form-label">Customer Sale Price</label>
                                <input type="number" onChange={e => setSalePricing(e.target.value)} disabled value={productDetails.sale_price} className="form-control" placeholder="Sale Price" id="compnayNameinput" />
                            </div>

                        </div>
                    </div>


                </div>

                <div className="col-md-12">
                    <div className='row'>
                        <div className='col-sm-4'>
                            <div className="mb-3">
                                <label htmlFor="compnayNameinput" className="form-label">I GST (%)</label>
                                <input type="number" onChange={e => setproductDetails({ ...productDetails, i_gst: e.target.value, c_gst: e.target.value / 2, s_gst: e.target.value / 2 })} value={productDetails.i_gst} className="form-control" placeholder="I GST" id="compnayNameinput" />
                            </div>

                        </div>
                        <div className='col-sm-4'>
                            <div className="mb-3">
                                <label htmlFor="compnayNameinput" className="form-label">C GST (%)</label>
                                <input type="number" onChange={e => setproductDetails({ ...productDetails, c_gst: productDetails.i_gst / 2 })} value={productDetails.c_gst} disabled className="form-control" placeholder="C GST" id="compnayNameinput" />

                            </div>

                        </div>
                        <div className='col-sm-4'>
                            <div className="mb-3">
                                <label htmlFor="compnayNameinput" className="form-label">S GST (%)</label>
                                <input type="number" onChange={e => setproductDetails({ ...productDetails, s_gst: productDetails.i_gst / 2 })} value={productDetails.s_gst} disabled className="form-control" placeholder="S GST" id="compnayNameinput" />
                            </div>

                        </div>
                    </div>


                </div>



                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="mobilenumberInput" className="form-label">HSN Code</label>
                        <input type="text" onChange={e => setproductDetails({ ...productDetails, hsn_code: e.target.value })} value={productDetails.hsn_code} className="form-control" placeholder="HSN Code" id="mobilenumberInput" />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label">Product Margin (RS)</label>
                        <input type="text" onChange={e => setproductDetails({ ...productDetails, margin_in_rs: e.target.value })} value={productDetails.margin_in_rs} className="form-control" placeholder="Product Margin" id="mobilenumberInput" />
                    </div>
                </div>

                <div className="col-md-5 my-3">
                    <div className="mb-3">
                        <label htmlFor="citynameInput" className="form-label text-danger">Barcode</label>
                        <input type="text" name="codes" id="codes" onChange={e => setBarCode(e.target.value)} value={productDetails.product_bar_code} className="form-control" placeholder="Barcode" />
                    </div>
                </div>
                <div className="col-md-7">
                    <div className="mb-3">
                        <div className=' row col-sm-12  justify-content-center'>
                            <div className='col-sm-8'></div>
                            <label className="btn btn-sm btn-danger" onClick={generateBarCode} >Generate Barecode  </label>
                            {/* <div className='col-sm-4'> <i className="ri-add-fill"  /></div> */}
                        </div>


                        {productDetails.product_bar_code ? <>
                            <ReactJSBarcode
                                value={productDetails.product_bar_code}
                                options={{ format: 'code128', height: 30, }}
                                renderer="canvas"
                                className="barcodeProduct"
                            />
                            <button className='btn btn-success btn-sm' onClick={onPrintBarcode}>Download</button>
                        </>
                            : null}
                    </div>
                </div>
                
                <div className="col-md-12">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label ">Deceptions</label>
                        <textarea onChange={e => setproductDetails({ ...productDetails, deceptions: e.target.value })} value={productDetails.deceptions} class="form-control" id="exampleFormControlTextarea5" rows="4"></textarea>
                    </div>
                </div>



                <div className="col-lg-12">
                    <div className="text-center mt-2">
                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Adding </a> : <button type="button" onClick={AddProductAction} className="btn btn-primary">Add Plot</button>}
                    </div>
                </div>
            </div>
        </>
    )

}