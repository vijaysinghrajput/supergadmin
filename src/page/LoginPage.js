import { useState, useContext, useEffect } from 'react';
import URL from '../URL';
import Data from '../context/MainContext';
import Cookies from 'universal-cookie';
import { Navigate, useNavigate } from 'react-router-dom';

const cookies = new Cookies();


const LoginPage = () => {

    const [mobile, setMobile] = useState();
    const [password, setPassword] = useState();
    const [isLoading, setLoading] = useState();
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [userDetails, setUserDetails] = useState([]);
    const { setUserLogin, auth } = useContext(Data);

    const navigate = useNavigate();

    const authenticateUser = () => {
        setError(false);
        setLoading(true);
        fetch(URL + "/APP-API/Billing/Login", {
            method: 'post',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                mobile,
                password
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("result login", responseJson);
                if (responseJson.Login === "done") {
                    if (responseJson.data[0].status === "1") {
                        setUserDetails(responseJson.data[0]);
                        loginUser(responseJson.data[0])
                    } else {
                        setError(true);
                        setErrorMessage("Contact Authority..!!")
                    }
                } else {
                    setError(true);
                    setErrorMessage("Credential Invalid")
                }
            })
            .catch((error) => {
                //  console.error(error);
            });
    }

    const loginUser = (userDetails) => {
        cookies.set('isUserLogin', true, { maxAge: 9999999999 });
        cookies.set('adminEmail', userDetails.email, { maxAge: 9999999999 });
        cookies.set('adminId', userDetails.id, { maxAge: 9999999999 });
        cookies.set('adminMobile', userDetails.mobile, { maxAge: 9999999999 });
        cookies.set('adminRoal', userDetails.roal, { maxAge: 9999999999 });
        cookies.set('adminPartnerId', userDetails.partner_id, { maxAge: 9999999999 });
        cookies.set('adminStoreId', userDetails.store_id, { maxAge: 9999999999 });
        cookies.set('adminStoreType', userDetails.store_type, { maxAge: 9999999999 });
        setUserLogin({ user_info: userDetails });
        navigate("/");
    }

    // const validateOtp = () => {
    //     setLoading(true);
    //     console.log("user", userDetails);
    //     if (Number(inputOTP) === OTP) {
    //         cookies.set('isUserLogin', true, { maxAge: 9999999999 });
    //         cookies.set('userID', userDetails.id, { maxAge: 9999999999 });
    //         cookies.set('userBussiness_id', userDetails.bussiness_id, { maxAge: 9999999999 });
    //         cookies.set('userName', userDetails.name, { maxAge: 9999999999 });
    //         cookies.set('userMobile', userDetails.mobile, { maxAge: 9999999999 });
    //         setUserLogin({ user_info: userDetails });
    //         navigate("/");

    //     } else setWrongOTP(true);
    // }

    if (auth.isUserLogin && cookies.get("userID")) {
        return <Navigate to="/" />
    } else return (
        <>
            <div className="auth-page-wrapper pt-5">
                {/* auth page bg */}
                <div className="auth-one-bg-position auth-one-bg" id="auth-particles">
                    <div className="bg-overlay" />
                    <div className="shape">
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1440 120">
                            <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z" />
                        </svg>
                    </div>
                </div>
                {/* auth page content */}
                <div className="auth-page-content">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <h2 className="d-inline-block text-light" style={{ fontSize: 26 }}>
                                            {/* <img src="assets/images/logo-light.png" alt="" height={20} /> */}
                                            Mart Pay
                                        </h2>
                                    </div>
                                    <p className="mt-3 fs-15 fw-medium">Admin Login</p>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-8 col-lg-6 col-xl-5">
                                <div className="card mt-4">
                                    <div className="card-body p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Welcome Back !</h5>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <form>
                                                <div className="mb-3">
                                                    <label htmlFor="Mobile" className="form-label">Mobile</label>
                                                    <input onChange={e => setMobile(e.target.value)} type="number" maxLength={10} value={mobile} className="form-control" id="Mobile" placeholder="Enter Phones" />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="Password" className="form-label">Password</label>
                                                    <input onChange={e => setPassword(e.target.value)} type="password" value={password} className="form-control" id="Password" placeholder="Password" />
                                                </div>
                                                {error && <div class="alert alert-danger alert-dismissible alert-solid alert-label-icon fade show mb-xl-0 mt-2" role="alert">
                                                    <i class="ri-error-warning-line label-icon"></i><strong>{errorMessage}</strong>
                                                </div>}
                                                <div className="mt-4">
                                                    <button className="btn btn-success w-100" type='button' onClick={authenticateUser}>Sign In</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default LoginPage;