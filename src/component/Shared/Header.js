/* eslint-disable */
import { Link } from "react-router-dom";
import { useState, useContext, useRef, useEffect } from 'react';
import ContextData from "../../context/MainContext";
import { Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Switch from "react-switch";


const cookies = new Cookies();

const Header = () => {

    const { logOut, auth ,Store_bussiness_info} = useContext(ContextData); 
    const data = useContext(ContextData);
    const [checked, setChecked] = useState(false); 
  const handleChangeStore = nextChecked => {
    setChecked(nextChecked);
  };

//   useEffect(() => {
//     // sessionStorage.setItem("data-sidebar-size", "sm");
//     //     sessionStorage.setItem("defaultAttribute", '{"lang":"en","data-layout":"vertical","data-topbar":"light","data-sidebar":"dark","data-sidebar-size":"sm"}');
    
//         var e = document.documentElement.clientWidth;
//          767 < e && document.querySelector(".hamburger-icon").classList.toggle("open"),
//           "horizontal" === document.documentElement.getAttribute("data-layout") && (document.body.classList.contains("menu") ? document.body.classList.remove("menu") : document.body.classList.add("menu")),
//           "vertical" === document.documentElement.getAttribute("data-layout") && (e < 1025 && 767 < e ? (document.body.classList.remove("vertical-sidebar-enable"), 
//           "sm" == document.documentElement.getAttribute("data-sidebar-size") ? document.documentElement.setAttribute("data-sidebar-size", "") : document.documentElement.setAttribute("data-sidebar-size", "sm")) : 1025 < e ? (document.body.classList.remove("vertical-sidebar-enable"),
//           "lg" == document.documentElement.getAttribute("data-sidebar-size") ? document.documentElement.setAttribute("data-sidebar-size", "sm") : document.documentElement.setAttribute("data-sidebar-size", "lg")) : e <= 767 && (document.body.classList.add("vertical-sidebar-enable"),
//            document.documentElement.setAttribute("data-sidebar-size", "lg"))), 
//            "twocolumn" == document.documentElement.getAttribute("data-layout") && (document.body.classList.contains("twocolumn-panel") ? document.body.classList.remove("twocolumn-panel") : document.body.classList.add("twocolumn-panel"))
       
//    },[]);

    const ExpandSlider = () => {
    

        var e = document.documentElement.clientWidth;
        767 < e && document.querySelector(".hamburger-icon").classList.toggle("open"),
         "horizontal" === document.documentElement.getAttribute("data-layout") && (document.body.classList.contains("menu") ? document.body.classList.remove("menu") : document.body.classList.add("menu")),
         "vertical" === document.documentElement.getAttribute("data-layout") && (e < 1025 && 767 < e ? (document.body.classList.remove("vertical-sidebar-enable"), 
         "sm" == document.documentElement.getAttribute("data-sidebar-size") ? document.documentElement.setAttribute("data-sidebar-size", "") : document.documentElement.setAttribute("data-sidebar-size", "sm")) : 1025 < e ? (document.body.classList.remove("vertical-sidebar-enable"),
         "lg" == document.documentElement.getAttribute("data-sidebar-size") ? document.documentElement.setAttribute("data-sidebar-size", "sm") : document.documentElement.setAttribute("data-sidebar-size", "lg")) : e <= 767 && (document.body.classList.add("vertical-sidebar-enable"),
          document.documentElement.setAttribute("data-sidebar-size", "lg"))), 
          "twocolumn" == document.documentElement.getAttribute("data-layout") && (document.body.classList.contains("twocolumn-panel") ? document.body.classList.remove("twocolumn-panel") : document.body.classList.add("twocolumn-panel"))
      


        // sessionStorage.setItem("data-sidebar-size", "sm");
        // sessionStorage.setItem("defaultAttribute", '{"lang":"en","data-layout":"vertical","data-topbar":"light","data-sidebar":"dark","data-sidebar-size":"sm"}');
    }


    if (!auth.isUserLogin && !cookies.get("adminId")) {
        return <Navigate to="/login" />;
    } else return (
        <>
            <header id="page-topbar" className="topbar-shadow">
                <div className="layout-width">
                    <div className="navbar-header">
                        <div className="d-flex">
                            {/* LOGO */}
                            <div className="navbar-brand-box horizontal-logo">
                                <a href="index.html" className="logo logo-dark">
                                    <span className="logo-sm">
                                        <img src="/assets/images/logo-sm.png" alt="" height={22} />
                                    </span>
                                    <span className="logo-lg">
                                        <img src="/assets/images/logo-dark.png" alt="" height={17} />
                                    </span>
                                </a>
                                <a href="index.html" className="logo logo-light">
                                    <span className="logo-sm">
                                        <img src="/assets/images/logo-sm.png" alt="" height={22} />
                                    </span>
                                    <span className="logo-lg">
                                        <img src="/assets/images/logo-light.png" alt="" height={17} />
                                    </span>
                                </a>
                            </div>
             
                            <button type="button" onClick={ExpandSlider} className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger" id="topnav-hamburger-icon">
                                <span className="hamburger-icon">
                                    <span />
                                    <span />
                                    <span />
                                </span>
                            </button>


                        </div>

                     
                        
                        <div className="d-flex align-items-center">

                            <div>
   <ButtonGroup aria-label="Basic example" className="mx-2">
   <Link to="/billing/sale" >   <Button variant="success" className="mx-2"> SALE </Button> </Link>
   <Link to="/billing/purchased">  <Button variant="dark">  PURCHASE </Button></Link>
    </ButtonGroup>
                            </div>

                            <div>

                            <ButtonGroup aria-label="Basic example" className="mx-2">
                            <h3 className="text-bold"> Store    </h3>
                            <Switch onChange={handleChangeStore} checked={checked} />
                           
    </ButtonGroup>
                            </div>

                        <div className="p-0" aria-labelledby="page-header-search-dropdown">
                                    <form className="p-3">
                                        <div className="form-group m-0">
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Search ..." aria-label="Recipient's username" />
                                                <button className="btn btn-primary" type="submit"><i className="mdi mdi-magnify" /></button>
                                            </div>
                                        </div>
                                    </form>
                             </div>


                            


                            <div className="dropdown topbar-head-dropdown ms-1 header-item">
                                <button type="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle" id="page-header-notifications-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="bx bx-bell fs-22" />
                                    <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">3<span className="visually-hidden">unread messages</span></span>
                                </button>
                                <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0" aria-labelledby="page-header-notifications-dropdown">
                                    <div className="dropdown-head bg-primary bg-pattern rounded-top">
                                        <div className="p-3">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <h6 className="m-0 fs-16 fw-semibold text-white"> Notifications </h6>
                                                </div>
                                                <div className="col-auto dropdown-tabs">
                                                    <span className="badge badge-soft-light fs-13"> 4 New</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-2 pt-2">
                                            <ul className="nav nav-tabs dropdown-tabs nav-tabs-custom" data-dropdown-tabs="true" id="notificationItemsTab" role="tablist">
                                                <li className="nav-item waves-effect waves-light">
                                                    <a className="nav-link active" data-bs-toggle="tab" href="#all-noti-tab" role="tab" aria-selected="true">
                                                        All (4)
                                                    </a>
                                                </li>
                                                <li className="nav-item waves-effect waves-light">
                                                    <a className="nav-link" data-bs-toggle="tab" href="#messages-tab" role="tab" aria-selected="false">
                                                        Messages
                                                    </a>
                                                </li>
                                                <li className="nav-item waves-effect waves-light">
                                                    <a className="nav-link" data-bs-toggle="tab" href="#alerts-tab" role="tab" aria-selected="false">
                                                        Alerts
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="tab-content" id="notificationItemsTabContent">
                                        <div className="tab-pane fade show active py-2 ps-2" id="all-noti-tab" role="tabpanel">
                                            <div data-simplebar style={{ maxHeight: '300px' }} className="pe-2">
                                                <div className="text-reset notification-item d-block dropdown-item position-relative">
                                                    <div className="d-flex">
                                                        <div className="avatar-xs me-3">
                                                            <span className="avatar-title bg-soft-info text-info rounded-circle fs-16">
                                                                <i className="bx bx-badge-check" />
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <a href="#!" className="stretched-link">
                                                                <h6 className="mt-0 mb-2 lh-base">Your <b>Elite</b> author Graphic
                                                                    Optimization <span className="text-secondary">reward</span> is
                                                                    ready!
                                                                </h6>
                                                            </a>
                                                            <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                                                <span><i className="mdi mdi-clock-outline" /> Just 30 sec ago</span>
                                                            </p>
                                                        </div>
                                                        <div className="px-2 fs-15">
                                                            <div className="form-check notification-check">
                                                                <input className="form-check-input" type="checkbox" defaultValue id="all-notification-check01" />
                                                                <label className="form-check-label" htmlFor="all-notification-check01" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-reset notification-item d-block dropdown-item position-relative active">
                                                    <div className="d-flex">
                                                        <img src="/assets/images/users/avatar-2.jpg" className="me-3 rounded-circle avatar-xs" alt="user-pic" />
                                                        <div className="flex-1">
                                                            <a href="#!" className="stretched-link">
                                                                <h6 className="mt-0 mb-1 fs-13 fw-semibold">Angela Bernier</h6>
                                                            </a>
                                                            <div className="fs-13 text-muted">
                                                                <p className="mb-1">Answered to your comment on the cash flow forecast's
                                                                    graph 🔔.</p>
                                                            </div>
                                                            <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                                                <span><i className="mdi mdi-clock-outline" /> 48 min ago</span>
                                                            </p>
                                                        </div>
                                                        <div className="px-2 fs-15">
                                                            <div className="form-check notification-check">
                                                                <input className="form-check-input" type="checkbox" defaultValue id="all-notification-check02" defaultChecked />
                                                                <label className="form-check-label" htmlFor="all-notification-check02" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-reset notification-item d-block dropdown-item position-relative">
                                                    <div className="d-flex">
                                                        <div className="avatar-xs me-3">
                                                            <span className="avatar-title bg-soft-danger text-danger rounded-circle fs-16">
                                                                <i className="bx bx-message-square-dots" />
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <a href="#!" className="stretched-link">
                                                                <h6 className="mt-0 mb-2 fs-13 lh-base">You have received <b className="text-success">20</b> new messages in the conversation
                                                                </h6>
                                                            </a>
                                                            <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                                                <span><i className="mdi mdi-clock-outline" /> 2 hrs ago</span>
                                                            </p>
                                                        </div>
                                                        <div className="px-2 fs-15">
                                                            <div className="form-check notification-check">
                                                                <input className="form-check-input" type="checkbox" defaultValue id="all-notification-check03" />
                                                                <label className="form-check-label" htmlFor="all-notification-check03" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-reset notification-item d-block dropdown-item position-relative">
                                                    <div className="d-flex">
                                                        <img src="/assets/images/users/avatar-8.jpg" className="me-3 rounded-circle avatar-xs" alt="user-pic" />
                                                        <div className="flex-1">
                                                            <a href="#!" className="stretched-link">
                                                                <h6 className="mt-0 mb-1 fs-13 fw-semibold">Maureen Gibson</h6>
                                                            </a>
                                                            <div className="fs-13 text-muted">
                                                                <p className="mb-1">We talked about a project on linkedin.</p>
                                                            </div>
                                                            <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                                                <span><i className="mdi mdi-clock-outline" /> 4 hrs ago</span>
                                                            </p>
                                                        </div>
                                                        <div className="px-2 fs-15">
                                                            <div className="form-check notification-check">
                                                                <input className="form-check-input" type="checkbox" defaultValue id="all-notification-check04" />
                                                                <label className="form-check-label" htmlFor="all-notification-check04" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="my-3 text-center">
                                                    <button type="button" className="btn btn-soft-success waves-effect waves-light">View
                                                        All Notifications <i className="ri-arrow-right-line align-middle" /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade py-2 ps-2" id="messages-tab" role="tabpanel" aria-labelledby="messages-tab">
                                            <div data-simplebar style={{ maxHeight: '300px' }} className="pe-2">
                                                <div className="text-reset notification-item d-block dropdown-item">
                                                    <div className="d-flex">
                                                        <img src="/assets/images/users/avatar-3.jpg" className="me-3 rounded-circle avatar-xs" alt="user-pic" />
                                                        <div className="flex-1">
                                                            <a href="#!" className="stretched-link">
                                                                <h6 className="mt-0 mb-1 fs-13 fw-semibold">James Lemire</h6>
                                                            </a>
                                                            <div className="fs-13 text-muted">
                                                                <p className="mb-1">We talked about a project on linkedin.</p>
                                                            </div>
                                                            <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                                                <span><i className="mdi mdi-clock-outline" /> 30 min ago</span>
                                                            </p>
                                                        </div>
                                                        <div className="px-2 fs-15">
                                                            <div className="form-check notification-check">
                                                                <input className="form-check-input" type="checkbox" defaultValue id="messages-notification-check01" />
                                                                <label className="form-check-label" htmlFor="messages-notification-check01" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-reset notification-item d-block dropdown-item">
                                                    <div className="d-flex">
                                                        <img src="/assets/images/users/avatar-2.jpg" className="me-3 rounded-circle avatar-xs" alt="user-pic" />
                                                        <div className="flex-1">
                                                            <a href="#!" className="stretched-link">
                                                                <h6 className="mt-0 mb-1 fs-13 fw-semibold">Angela Bernier</h6>
                                                            </a>
                                                            <div className="fs-13 text-muted">
                                                                <p className="mb-1">Answered to your comment on the cash flow forecast's
                                                                    graph 🔔.</p>
                                                            </div>
                                                            <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                                                <span><i className="mdi mdi-clock-outline" /> 2 hrs ago</span>
                                                            </p>
                                                        </div>
                                                        <div className="px-2 fs-15">
                                                            <div className="form-check notification-check">
                                                                <input className="form-check-input" type="checkbox" defaultValue id="messages-notification-check02" />
                                                                <label className="form-check-label" htmlFor="messages-notification-check02" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-reset notification-item d-block dropdown-item">
                                                    <div className="d-flex">
                                                        <img src="/assets/images/users/avatar-6.jpg" className="me-3 rounded-circle avatar-xs" alt="user-pic" />
                                                        <div className="flex-1">
                                                            <a href="#!" className="stretched-link">
                                                                <h6 className="mt-0 mb-1 fs-13 fw-semibold">Kenneth Brown</h6>
                                                            </a>
                                                            <div className="fs-13 text-muted">
                                                                <p className="mb-1">Mentionned you in his comment on 📃 invoice #12501.
                                                                </p>
                                                            </div>
                                                            <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                                                <span><i className="mdi mdi-clock-outline" /> 10 hrs ago</span>
                                                            </p>
                                                        </div>
                                                        <div className="px-2 fs-15">
                                                            <div className="form-check notification-check">
                                                                <input className="form-check-input" type="checkbox" defaultValue id="messages-notification-check03" />
                                                                <label className="form-check-label" htmlFor="messages-notification-check03" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-reset notification-item d-block dropdown-item">
                                                    <div className="d-flex">
                                                        <img src="/assets/images/users/avatar-8.jpg" className="me-3 rounded-circle avatar-xs" alt="user-pic" />
                                                        <div className="flex-1">
                                                            <a href="#!" className="stretched-link">
                                                                <h6 className="mt-0 mb-1 fs-13 fw-semibold">Maureen Gibson</h6>
                                                            </a>
                                                            <div className="fs-13 text-muted">
                                                                <p className="mb-1">We talked about a project on linkedin.</p>
                                                            </div>
                                                            <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                                                <span><i className="mdi mdi-clock-outline" /> 3 days ago</span>
                                                            </p>
                                                        </div>
                                                        <div className="px-2 fs-15">
                                                            <div className="form-check notification-check">
                                                                <input className="form-check-input" type="checkbox" defaultValue id="messages-notification-check04" />
                                                                <label className="form-check-label" htmlFor="messages-notification-check04" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="my-3 text-center">
                                                    <button type="button" className="btn btn-soft-success waves-effect waves-light">View
                                                        All Messages <i className="ri-arrow-right-line align-middle" /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade p-4" id="alerts-tab" role="tabpanel" aria-labelledby="alerts-tab">
                                            <div className="w-25 w-sm-50 pt-3 mx-auto">
                                                <img src="/assets/images/svg/bell.svg" className="img-fluid" alt="user-pic" />
                                            </div>
                                            <div className="text-center pb-5 mt-2">
                                                <h6 className="fs-18 fw-semibold lh-base">Hey! You have no any notifications </h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="dropdown ms-sm-3 header-item topbar-user">
                                <button type="button" className="btn" id="page-header-user-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="d-flex align-items-center">
                                        <img className="rounded-circle header-profile-user" src="/assets/images/users/avatar-1.jpg" />
                                        <span className="text-start ms-xl-2">
                                            {/* <span classNam d-xl-inline-block ms-1 fw-medium user-name-text">{user.user_info.name}</span>
                                            <span classNam d-xl-block ms-1 fs-12 text-muted user-name-sub-text">{user.user_info.role}</span> */}
                                        </span>
                                    </span>
                                </button>
                                <div className="dropdown-menu dropdown-menu-end">
                                    {/* item*/}
                                    {/* <h6 className="dropdown-header">Welcome {user.user_info.name}!</h6> */}
                                    <Link className="dropdown-item" to="/profile"><i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1" /> <span className="align-middle">Profile</span></Link>
                                    <div className="dropdown-item" onClick={logOut}><i className="mdi mdi-logout text-muted fs-16 align-middle me-1" /> <span className="align-middle" data-key="t-logout">Logout</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )

}

export default Header;