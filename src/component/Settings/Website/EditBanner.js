import { useState, useContext } from 'react';
import URLDomain from '../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../context/MainContext';
import Dropzone from 'react-dropzone'
import { useEffect } from 'react';

const cookies = new Cookies();

export const EditBanner = ({ editableBanner }) => {

    const { updateDataToCurrentGlobal, getToast } = useContext(ContextData);
    const [isLoading, setIL] = useState(false);
    const bussnessID = cookies.get("userBussiness_id");
    const [bannerDetails, setBannerDetails] = useState({
        'bussiness_id': bussnessID,
        'heading': '',
        'sub_heading': '',
        updatedImage: [],
        'image': [],
        'status': '1',
        'date': +new Date(),
    });

    const UpdateBanner = () => {
        console.log("help me", bannerDetails);
        setIL(true);
        const formData = new FormData();

        bannerDetails.updatedImage ? bannerDetails.updatedImage.map((item, i) => {
            formData.append(`image[]`, item, item.name);
        }) : formData.append('imagePre', bannerDetails.image);
        formData.append('bussiness_id', bannerDetails.bussiness_id);
        formData.append('heading', bannerDetails.heading);
        formData.append('id', bannerDetails.id);
        formData.append('sub_heading', bannerDetails.sub_heading);
        // formData.append('image', bannerDetails.image, bannerDetails.image.name);
        formData.append('status', bannerDetails.status);
        formData.append('date', +new Date());


        fetch(URLDomain + "/APP-API/App/updateBanners", {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("respond plot upload", responseJson)
                if (responseJson.user) {
                    alert("Member Exists");
                } else {
                    console.log("added");
                    getToast({ title: "Banner Edited", dec: "", status: "success" });
                    updateDataToCurrentGlobal({ type: "business_banners", payload: bannerDetails }, { key: "id", value: bannerDetails.id })
                }
                setIL(false);
                for (let i = 0; i < 10; i++) {
                    document.getElementsByClassName("btn-close")[i].click();
                }
            })
            .catch((error) => {
                //  console.error(error);
            });
    };

    useEffect(() => {
        setBannerDetails(editableBanner);
        console.log("hey naveet", editableBanner);
    }, [editableBanner])

    return (
        <>
            {bannerDetails !== {} && <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="mobilenumberInput" className="form-label">Heading</label>
                        <input type="text" onChange={e => setBannerDetails({ ...bannerDetails, heading: e.target.value })} value={bannerDetails.heading} className="form-control" placeholder="Title" id="mobilenumberInput" />
                    </div>
                </div>{/*end col*/}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label">Sub Heading</label>
                        <input type="text" onChange={e => setBannerDetails({ ...bannerDetails, sub_heading: e.target.value })} value={bannerDetails.sub_heading} className="form-control" placeholder="Enter Location" id="compnayNameinput" />
                    </div>
                </div>{/*end col*/}
                <div className="col-md-12">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label">Banners</label>
                        <img src={URLDomain + "/APP-API/" + bannerDetails.image} style={{ height: '100px', margin: 'auto', borderRadius: '14px', boxShadow: '0 1px 5px 0 grey' }} alt="" />
                        <Dropzone multiple={false} onDrop={acceptedFiles => setBannerDetails({ ...bannerDetails, updatedImage: acceptedFiles })}>
                            {({ getRootProps, getInputProps }) => (
                                <section className='mt-2'>
                                    <div style={{ padding: 12, borderRadius: 6, border: "1px dashed grey" }} {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p className='text-center'>If you want to update the banner Drag or Drop the banner here..!!</p>
                                    </div>
                                    {bannerDetails.updatedImage && <aside>
                                        <h4>Files</h4>
                                        <ul>{bannerDetails.updatedImage?.map(file => (
                                            <li key={file.path}>
                                                {file.path} - {file.size} bytes
                                            </li>
                                        ))}</ul>
                                    </aside>}
                                </section>
                            )}
                        </Dropzone>
                    </div>
                </div>{/*end col*/}
                {/* <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="address1ControlTextarea" className="form-label">Status</label>
                        <div className='d-flex'>
                            <button type="button" class="btn btn-light dropdown-toggle"
                                data-bs-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">{bannerDetails.status ? bannerDetails.status : "Select Status"}</button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" onClick={() => setBannerDetails({ ...bannerDetails, status: "1" })} href="#">Active</a>
                                <a class="dropdown-item" onClick={() => setBannerDetails({ ...bannerDetails, status: "0" })} href="#">Deactive</a>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="col-lg-12">
                    <div className="text-center mt-2">
                        {isLoading ? <a href="javascript:void(0)" className="text-success"><i className="mdi mdi-loading mdi-spin fs-20 align-middle me-2" /> Updating </a> : <button type="button" onClick={UpdateBanner} className="btn btn-warning">Update</button>}
                    </div>
                </div>{/*end col*/}
            </div>}
        </>
    )

}