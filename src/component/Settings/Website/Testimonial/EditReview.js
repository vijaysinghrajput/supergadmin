import { useState, useContext } from 'react';
import URLDomain from '../../../../URL';
import Cookies from 'universal-cookie';
import ContextData from '../../../../context/MainContext';
import Dropzone from 'react-dropzone'
import { useEffect } from 'react';

const cookies = new Cookies();

export const EditReview = ({ editableTestimonial }) => {

    const { updateDataToCurrentGlobal, getToast } = useContext(ContextData);
    const bussnessID = cookies.get("userBussiness_id");
    const [reviewDetails, setReviews] = useState({
        'bussiness_id': bussnessID,
        'customer_name': '',
        'city': '',
        'status': '1',
        'reviews': '',
    });

    const SubmitReview = () => {
        fetch(URLDomain + "/APP-API/App/updateReview", {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ ...reviewDetails })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.user) {
                    alert("Member Exists");
                } else {
                    console.log("added");
                    updateDataToCurrentGlobal({ type: "reviews", payload: reviewDetails }, { key: "id", value: reviewDetails.id });
                    getToast({ title: "Review Edited", dec: "", status: "success" });
                }
                for (let i = 0; i < 10; i++) {
                    document.getElementsByClassName("btn-close")[i].click();
                }
            })
            .catch((error) => {
                //  console.error(error);
            });
    };

    useEffect(() => {
        setReviews(editableTestimonial);
        // console.log("hey naveet", editableTestimonial);
    }, [editableTestimonial])

    return (
        <>
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="mobilenumberInput" className="form-label">Customer Name</label>
                        <input type="text" onChange={e => setReviews({ ...reviewDetails, customer_name: e.target.value })} value={reviewDetails.customer_name} className="form-control" placeholder="Name" id="mobilenumberInput" />
                    </div>
                </div>{/*end col*/}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label">City</label>
                        <input type="text" onChange={e => setReviews({ ...reviewDetails, city: e.target.value })} value={reviewDetails.city} className="form-control" placeholder="Enter Location" id="compnayNameinput" />
                    </div>
                </div>{/*end col*/}
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="compnayNameinput" className="form-label">Reviews</label>
                        <input type="text" onChange={e => setReviews({ ...reviewDetails, reviews: e.target.value })} value={reviewDetails.reviews} className="form-control" placeholder="Reviews here" id="compnayNameinput" />
                    </div>
                </div>{/*end col*/}
                <div className="col-lg-12">
                    <div className="text-center mt-2">
                        <button type="button" onClick={SubmitReview} className="btn btn-primary">Submit</button>
                    </div>
                </div>{/*end col*/}
            </div>{/*end row*/}
        </>
    )

}