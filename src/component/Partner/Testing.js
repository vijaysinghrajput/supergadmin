import React, { Component } from 'react';
import { Redirect, Link, withRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

import ImageUploader from 'react-images-upload';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';
import URL from '../../URL'

const cookies = new Cookies()


class AddNewJob extends Component {

    UPLOAD_ENDPOINT = URL + "/APP-API/Product/uploadjobMultijobs";


    constructor(props) {

        super(props);

        this.state = {
            isClickedAdd: false,
            maximum_salary: '',
            city: '',
            address: '',
            UserID: null,
            job_type: null,
            file: null,
            min_salary: null,
            job_decreption: '',
            mobile: '',
            City: 'Gorakhpur',
            state: 'Uttar Pradesh',
            CityData: [],
            job_gender: null,
            paymentPending: true,
            clickedPaymen: false,
        }

        this.handleNext = this.handleNext.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.Savejob_headline = this.Savejob_headline.bind(this)
        this.onSubmit = this.onSubmit.bind(this)




    }



    async RazorPay(last_id) {


        const options = {
            key: "rzp_live_NFK2oQGRZ18riT", // Enter the Key ID generated from the Dashboard
            // amount: this.state.FinalTotalAmount*100,
            amount: 1 * 100,
            currency: "INR",
            name: "Paaji's",
            description: "Skyably IT Solution",
            image: "/assets/images/icon/logo/18.jpg",
            // order_id: 345434,
            handler: async (response) => {
                try {

                    this.updatePaymentStatus(response.razorpay_payment_id, last_id)

                    // alert(response.razorpay_payment_id)

                } catch (err) {
                    console.log(err);
                }
            },

            prefill: {
                name: await cookies.get('user_name'),
                "contact": await cookies.get('user_mobile_number'),
            },
            notes: {
                job_headline: "Gorakhpur",
            },
            theme: {
                color: "#61dafb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }



    async onSubmit(e) {




        e.preventDefault()


        this.setState({ isClickedAdd: true, })



        const { address, job_type, job_gender, file, min_salary, maximum_salary, job_decreption, City, mobile, } = this.state;


        if (job_type === null) {

            this.setState({ isClickedAdd: false, })
            var msg = '** Please Select Job type ';
            toast.error(msg)
        }
        if (job_gender === null) {

            this.setState({ isClickedAdd: false, })
            var msg = '** Please Select Job Gender ';
            toast.error(msg)
        }


        else if (min_salary === null) {
            this.setState({ isClickedAdd: false, })

            var msg = '** Minimum Salary Requird';
            toast.error(msg)

        }

        else if (job_decreption == '') {
            this.setState({ isClickedAdd: false, })

            var msg = '** Please fill Job details';
            toast.error(msg)

        }



        else if (City === null) {
            this.setState({ isClickedAdd: false, })

            var msg = '** City Requird';
            toast.error(msg)

        }


        else if (address === '') {
            this.setState({ isClickedAdd: false, })

            var msg = '** Enter address';
            toast.error(msg)

        }


        else if (mobile === '') {
            this.setState({ isClickedAdd: false, })

            var msg = '** Enter Mobile Number';
            toast.error(msg)

        }

        else if (file === null) {
            this.setState({ isClickedAdd: false, })

            var msg = '** Please upload photos';
            toast.error(msg)

        }
        else {


            var msg = 'Your data is uploading | Please wait .. '
            toast.info(msg)

            const res = await this.Savejob_headline(this.state.file);

            // console.log(res.data);


            if (res.data.status == 'success') {
                var msg = 'Job Listed Successfully '
                toast.success(msg)


                this.props.history.push('/user-job-listing');

                // this.RazorPay(res.data.last_id)

            }
            else {
                var msg = 'Job Listing Failed'
                toast.error(msg)
            }

        }








    }



    onChangeImage(pictureFiles) {
        this.setState({
            file: pictureFiles,

        });
    }


    handleBack() {

        this.props.history.goBack();

    }

    handleNext(Routation) {
        this.props.history.push(Routation);
    }



    async onChange(e) {

        if (e.target.id === 'job_type') {
            this.setState({ job_type: e.target.value });
        }
        if (e.target.id === 'job_gender') {
            this.setState({ job_gender: e.target.value });
        }

        else if (e.target.id === 'min_salary') {
            this.setState({ min_salary: e.target.value });
            // console.log(e.target.value);
        }
        else if (e.target.id === 'maximum_salary') {
            this.setState({ maximum_salary: e.target.value });
            // console.log(e.target.value);
        }

        else if (e.target.id === 'job_decreption') {
            this.setState({ job_decreption: e.target.value });
            // console.log(e.target.value);
        }


        else if (e.target.id === 'address') {
            this.setState({ address: e.target.value });


        }
        else if (e.target.id === 'City') {
            this.setState({ City: e.target.value });
            // console.log(e.target.value);
        }



        else if (e.target.id === 'mobile') {
            this.setState({ mobile: e.target.value });
            // console.log(e.target.value);
        }


    }



    async componentDidMount() {

        var UserID = await cookies.get('UserID');
        this.setState({ UserID })

        this.fetchCity()


    }


    async fetchCity() {
        var headers = new Headers();
        headers.append("X-CSCAPI-KEY", "N0t1eVBYeGZrdWN6cWsyYmxzenFuajhXaHlzZGZRQVliSnJiRHh6bg==");

        var requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        };

        await fetch("https://api.countrystatecity.in/v1/countries/IN/states/UP/cities", requestOptions)
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({ CityData: responseJson })
            })
            .catch((error) => {
                // console.error(error);

            });
    }




    render() {



        return (
            <div>

                <div class="row mx-0">
                    <div class="col mt-3">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb bg-dark">
                                <li class="breadcrumb-item">

                                    <a onClick={() => this.handleBack()} class="text-white">Back</a>

                                </li>
                                <li class="breadcrumb-item">
                                    <a >Post New Job</a>
                                </li>

                            </ol>
                        </nav>
                    </div>

                </div>


                <div class="col  px-3 text-center">


                    <form onSubmit={this.onSubmit} class="form-signin shadow">

                        <div class="form-group float-label">
                            <label class="form-control-label">Job Type</label>
                        </div>

                        <div class="form-group float-label">
                            <select onChange={this.onChange} class="form-control" id="job_type" autofocus>

                                <option value={null}></option>
                                <option value="Local Job">Local Job</option>
                                <option value="Telecaller">Telecaller</option>
                                <option value="Delivery Boy">Delivery Boy</option>
                                <option value="Driver">Driver</option>
                                <option value="Cook">Cook</option>
                                <option value="Accountant">Accountant</option>
                                <option value="Receptionist">Receptionist</option>
                                <option value="Sales /Marketing Executive">Sales /Marketing Executive</option>
                                <option value="Computer Operator">Computer Operator</option>
                                <option value="Sales Executive">Sales Executive</option>
                                <option value="Front Office Manager">Front Office Manager</option>
                                <option value="Front Office Coordinator">Front Office Coordinator</option>
                                <option value="HR">HR</option>
                                <option value="Business Development Manager">Business Development Manager</option>
                                <option value="Customer Relation Manager">Customer Relation Manager</option>
                                <option value="Technician">Technician</option>
                                <option value="Electician">Electician</option>
                                <option value="Teacher Job">Teacher Job</option>
                                <option value="Home Tutor">Home Tutor</option>
                                <option value="Data Entry /Back Office">Data Entry /Back Office</option>
                                <option value="Others">Others</option>



                            </select>
                        </div>

                        <div class="form-group float-label">
                            <label class="form-control-label">Gender Type</label>
                        </div>

                        <div class="form-group float-label">
                            <select onChange={this.onChange} class="form-control" id="job_gender" autofocus>

                                <option value={null}></option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="All Gender">All Gender</option>




                            </select>
                        </div>




                        <div class="form-group float-label">
                            <label class="form-control-label">Minimum Salary </label>
                        </div>

                        <div class="form-group float-label">
                            <input onChange={this.onChange} type="number" id="min_salary" class="form-control" autofocus />
                        </div>


                        <div class="form-group float-label">
                            <label class="form-control-label">Maximum Salary </label>
                        </div>

                        <div class="form-group float-label">
                            <input onChange={this.onChange} type="number" id="maximum_salary" class="form-control" autofocus />
                        </div>













                        <div class="form-group float-label">
                            <label class="form-control-label">Job Details (Job की कुछ जानकारी ) </label>
                        </div>

                        <div class="form-group float-label">

                            <textarea id="job_decreption" onChange={this.onChange} rows="4" cols="50" class="form-control" autofocus>
                            </textarea>

                        </div>




                        <div class="form-group float-label">
                            <label class="form-control-label">Contact Address  </label>
                        </div>

                        <div class="form-group float-label">
                            <input onChange={this.onChange} type="address" id="address" class="form-control" autofocus />
                        </div>


                        <div class="form-group float-label">
                            <label class="form-control-label">Contact City </label>
                        </div>

                        <div class="form-group float-label">
                            <select onChange={this.onChange} class="form-control" value={this.state.City} id="City" autofocus>


                                <option value={null}></option>

                                {this.state.CityData.map((item, key) => {
                                    return (
                                        <option value={item.name}>{item.name}</option>
                                    )
                                })}
                                {/* <option  value="">Room</option> */}



                            </select>
                        </div>


                        <div class="form-group float-label">
                            <label class="form-control-label">Mobile </label>
                        </div>
                        <div class="form-group float-label">
                            <input onChange={this.onChange} type="tel" id="mobile" class="form-control" autofocus />
                        </div>






                        <div class="form-group float-label">

                            <ImageUploader
                                withIcon={true}
                                buttonText='Choose Feature Image'
                                onChange={this.onChangeImage}
                                imgExtension={['.jpg', '.jpeg', '.png', '.gif']}
                                maxFileSize={5242880}
                                singleImage={true}
                                withPreview={true}
                            />

                        </div>



                        <div class="row">

                            {this.state.isClickedAdd ?
                                null
                                :
                                (
                                    <button type="submit" class="btn btn-lg btn-default btn-rounded shadow">Add Listing</button>

                                )}




                        </div>


                    </form>

                </div>
                <ToastContainer />


            </div>





        );

    }

    async Savejob_headline(files) {

        const formData = new FormData();

        this.state.file.map((item, i) => {
            formData.append(`avatar[]`, item, item.name);
        })
        formData.append('user_id', this.state.UserID)
        formData.append('job_type', this.state.job_type)
        formData.append('job_gender', this.state.job_gender)
        formData.append('min_salary', this.state.min_salary)
        formData.append('maximum_salary', this.state.maximum_salary)
        formData.append('job_decreption', this.state.job_decreption)
        formData.append('address', this.state.address)
        formData.append('City', this.state.City)
        formData.append('state', this.state.state)
        formData.append('mobile', this.state.mobile)



        return await axios.post(this.UPLOAD_ENDPOINT, formData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        });

    }



    updatePaymentStatus(razorpay_payment_id, last_id) {

        fetch(URL + "/APP-API/Product/updatePaymentStatus", {
            method: 'post',
            header: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                razorpay_payment_id: razorpay_payment_id,
                last_id: last_id,


            })

        })
            .then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status == 'OK') {
                    var msg = 'Payment successfully'
                    toast.success(msg)
                }
                else {
                    var msg = 'Payment Failed'
                    toast.error(msg)
                }

            })
            .catch((error) => {
                // console.error(error);

            });

    }
}

export default withRouter(AddNewJob);