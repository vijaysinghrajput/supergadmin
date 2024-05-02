import { useState, useContext, useRef, useEffect } from "react";
// import URL from "../../../URL";
import ContextData from "../../../context/MainContext";
import ImageUploader from "react-images-upload";
import Multiselect from "multiselect-react-dropdown";
import ReactJSBarcode from "react-jsbarcode";
import URLDomain from "../../../URL";
import { useQuery } from "react-query";
import Cookies from "universal-cookie";
import { useToast } from "@chakra-ui/react";

const cookies = new Cookies();

export const AddCategoryForm = (OldcategoryData) => {
  const [isLoading, setIL] = useState(false);
  const toast = useToast();
  const getToast = (e) => {
    toast({
      title: e.title,
      description: e.desc,
      status: e.status,
      duration: 3000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const getSelectedBrandsRef = useRef(null);
  const [filteredBrandsData, setFilterBrandData] = useState([]);
  const [getAllSelectedBrands, setAllSelectedBrands] = useState([]);

  const getSelectedCategorysRef = useRef(null);
  const [filteredCategorysData, setFilterCategoryData] = useState([]);
  const [getAllSelectedCategorys, setAllSelectedCategorys] = useState([]);
  const [getSelectedCategoryId, setSelectedCategoryId] = useState({ id: 999 });

  const getSelectedChildCategorysRef = useRef(null);
  const [filteredChildCategorysData, setFilterChildCategoryData] = useState([]);
  const [getAllSelectedChildCategorys, setAllSelectedChildCategorys] = useState(
    []
  );

  const adminStoreId = cookies.get("adminStoreId");
  const adminStoreType = cookies.get("adminStoreType");
  const adminId = cookies.get("adminId");

  const [storeCategoryData, setstoreCategoryData] = useState([]);

  const [isDataLoding, setisDataLoding] = useState(true);

  const [categoryData, setcategoryData] = useState({
    store_id: adminStoreId,
    category_name: "",
    category_type: adminStoreType,
    category_image: null,
    category_level: 0,
    deceptions: "",
  });

  async function fetchData() {
    const data = await fetch(
      URLDomain + "/APP-API/Billing/masterCategoryDataApi",
      {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          store_id: adminStoreId,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => responseJson);

    return data;
  }

  const {
    data: PRODUCTDATA,
    isError,
    isLoading: isLoadingAPI,
  } = useQuery({
    queryKey: ["PRODUCTDATA"],
    queryFn: (e) => fetchData(),
  });

  useEffect(() => {
    // console.log("search product", PRODUCTDATA, isLoadingAPI);
    if (PRODUCTDATA) {
      setstoreCategoryData(PRODUCTDATA.master_category);
      setFilterCategoryData(PRODUCTDATA.master_category);

      setisDataLoding(false);

      let CategorysData = [];
      storeCategoryData.map(function (Category) {
        if (Category.category_level == 0) {
          CategorysData.push({
            key: Category.category_name,
            ...Category,
          });
        }
      });
      setFilterCategoryData(CategorysData);
    }
  }, [PRODUCTDATA, isLoadingAPI]);

  const onChangeImage = (pictureFiles) => {
    setcategoryData({ ...categoryData, category_image: pictureFiles });
  };

  const AddCategoryAction = () => {
    // console.log("add cat data", categoryData);

    if (categoryData.category_name == "") {
      getToast({
        title: "Category Name Requird",
        dec: "Requird",
        status: "error",
      });
    } else if (categoryData.category_image == null) {
      getToast({
        title: "Category Image Requird",
        dec: "Requird",
        status: "error",
      });
    } else {
      setIL(true);
      const formData = new FormData();
      categoryData.category_image &&
        categoryData.category_image.map((item, i) => {
          formData.append(`category_image`, item, item.name);
        });

      formData.append("store_id", categoryData.store_id);
      formData.append("adminId", adminId);
      formData.append("category_type", categoryData.category_type);
      formData.append("category_name", categoryData.category_name);
      formData.append("category_level", categoryData.category_level);
      formData.append("deceptions", categoryData.deceptions);

      fetch(URLDomain + "/APP-API/Billing/addStoreCategory", {
        method: "POST",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          //   console.log("respond plot upload", responseJson);
          if (responseJson.is_category_alredy == 1) {
            getToast({
              title: "Category Added Already",
              dec: "Successful",
              status: "success",
            });
            // reloadData();
          } else {
            console.log("added");
            // addDataToCurrentGlobal({ type: "plots", payload: storeCategorysData });
            getToast({
              title: "Category Added",
              dec: "Successful",
              status: "success",
            });
            // reloadData();
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

  const setChaildCate = (id) => {
    if (id.length) {
      setcategoryData({
        ...categoryData,
        category_level: id[0].id,
      });
    }
  };

  const removeSelected = () => {
    setcategoryData({
      ...categoryData,
      category_level: 0,
    });
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="mb-3">
            <label
              htmlFor="compnayNameinput"
              className="form-label text-danger"
            >
              Category Name
            </label>
            <input
              type="text"
              onChange={(e) =>
                setcategoryData({
                  ...categoryData,
                  category_name: e.target.value,
                })
              }
              value={categoryData.category_name}
              className="form-control"
              placeholder="New Category Name"
              id="compnayNameinput"
            />
          </div>
        </div>

        <div className="col-md-12">
          <div className="mb-3">
            <label htmlFor="firstNameinput" className="form-label text-danger">
              Parent Category
            </label>
            <p className="my-2">
              Don't Select Parent Category if you are Adding New Parent Category
            </p>

            <p className="my-2">
              यदि आप नई पैरेंट कटेगरी जोड़ रहे हैं तो पैरेंट कटेगरी का चयन न
              करें
            </p>

            {filteredCategorysData.length && (
              <Multiselect
                // singleSelect={true}
                selectionLimit={1}
                displayValue="key"
                onKeyPressFn={function noRefCheck() {}}
                onSearch={function noRefCheck() {}}
                onRemove={() => {
                  removeSelected();
                }}
                onSelect={() => {
                  setChaildCate(
                    getSelectedCategorysRef.current.state.selectedValues
                  );
                }}
                options={filteredCategorysData}
                ref={getSelectedCategorysRef}
                // showCheckbox
              />
            )}
          </div>
        </div>

        <div className="col-md-12">
          <div className="mb-3">
            <label htmlFor="address1ControlTextarea" className="form-label">
              Category Image (Size - 500PX * 500PX)
            </label>
            <input
              multiple
              type="file"
              onChange={(e) =>
                setcategoryData({
                  ...categoryData,
                  category_image: [...e.target.files],
                })
              }
              className="form-control"
              id="address1ControlTextarea"
            />
          </div>
        </div>
        {/*end col*/}

        <div className="col-md-12">
          <div className="mb-3">
            <label htmlFor="compnayNameinput" className="form-label ">
              deceptions
            </label>
            <textarea
              onChange={(e) =>
                setcategoryData({
                  ...categoryData,
                  deceptions: e.target.value,
                })
              }
              value={categoryData.deceptions}
              class="form-control"
              id="exampleFormControlTextarea5"
              rows="4"
            ></textarea>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="text-center mt-2">
            {isLoading ? (
              <a href="javascript:void(0)" className="text-success">
                <i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" />{" "}
                Adding{" "}
              </a>
            ) : (
              <button
                type="button"
                onClick={AddCategoryAction}
                className="btn btn-primary"
              >
                Add Category
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
