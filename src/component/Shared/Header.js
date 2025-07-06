/* eslint-disable */
import { Link } from "react-router-dom";
import { useState, useContext, useRef, useEffect } from "react";
import ContextData from "../../context/MainContext";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Switch from "react-switch";

const cookies = new Cookies();

const Header = () => {
  const { logOut, auth, Store_bussiness_info } = useContext(ContextData);
  const data = useContext(ContextData);
  const [checked, setChecked] = useState(false);
  const handleChangeStore = (nextChecked) => {
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
    767 < e &&
      document.querySelector(".hamburger-icon").classList.toggle("open"),
      "horizontal" === document.documentElement.getAttribute("data-layout") &&
        (document.body.classList.contains("menu")
          ? document.body.classList.remove("menu")
          : document.body.classList.add("menu")),
      "vertical" === document.documentElement.getAttribute("data-layout") &&
        (e < 1025 && 767 < e
          ? (document.body.classList.remove("vertical-sidebar-enable"),
            "sm" == document.documentElement.getAttribute("data-sidebar-size")
              ? document.documentElement.setAttribute("data-sidebar-size", "")
              : document.documentElement.setAttribute(
                  "data-sidebar-size",
                  "sm"
                ))
          : 1025 < e
          ? (document.body.classList.remove("vertical-sidebar-enable"),
            "lg" == document.documentElement.getAttribute("data-sidebar-size")
              ? document.documentElement.setAttribute("data-sidebar-size", "sm")
              : document.documentElement.setAttribute(
                  "data-sidebar-size",
                  "lg"
                ))
          : e <= 767 &&
            (document.body.classList.add("vertical-sidebar-enable"),
            document.documentElement.setAttribute("data-sidebar-size", "lg"))),
      "twocolumn" == document.documentElement.getAttribute("data-layout") &&
        (document.body.classList.contains("twocolumn-panel")
          ? document.body.classList.remove("twocolumn-panel")
          : document.body.classList.add("twocolumn-panel"));

    // sessionStorage.setItem("data-sidebar-size", "sm");
    // sessionStorage.setItem("defaultAttribute", '{"lang":"en","data-layout":"vertical","data-topbar":"light","data-sidebar":"dark","data-sidebar-size":"sm"}');
  };

  if (!auth.isUserLogin && !cookies.get("adminId")) {
    return <Navigate to="/login" />;
  } else
    return (
      <>
        <header id="page-topbar" className="topbar-shadow">
          <div className="layout-width">
            <div className="navbar-header">
              <div className="d-flex">
                {/* LOGO */}
                <div className="navbar-brand-box horizontal-logo">
                  <a href="index.html" className="logo logo-dark">
                    <span className="logo-sm">
                      <img
                        src="/assets/images/logo-sm.png"
                        alt=""
                        height={22}
                      />
                    </span>
                    <span className="logo-lg">
                      <img
                        src="/assets/images/logo-dark.png"
                        alt=""
                        height={17}
                      />
                    </span>
                  </a>
                  <a href="index.html" className="logo logo-light">
                    <span className="logo-sm">
                      <img
                        src="/assets/images/logo-sm.png"
                        alt=""
                        height={22}
                      />
                    </span>
                    <span className="logo-lg">
                      <img
                        src="/assets/images/logo-light.png"
                        alt=""
                        height={17}
                      />
                    </span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={ExpandSlider}
                  className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                  id="topnav-hamburger-icon"
                >
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
                    <Link to="/billing/sale">
                      {" "}
                      <Button variant="success" className="mx-2">
                        {" "}
                        SALE{" "}
                      </Button>{" "}
                    </Link>
                    <Link to="/billing/purchased">
                      {" "}
                      <Button variant="dark"> PURCHASE </Button>
                    </Link>
                  </ButtonGroup>
                </div>

                <div className="dropdown ms-sm-3 header-item topbar-user">
                  <button
                    type="button"
                    className="btn"
                    id="page-header-user-dropdown"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="d-flex align-items-center">
                      <img
                        className="rounded-circle header-profile-user"
                        src="https://cdn-icons-png.flaticon.com/512/3541/3541871.png"
                      />
                    </span>
                  </button>
                  <div className="dropdown-menu dropdown-menu-end">
                    <div className="dropdown-item" onClick={logOut}>
                      <i className="mdi mdi-logout text-muted fs-16 align-middle me-1" />{" "}
                      <span className="align-middle" data-key="t-logout">
                        Logout
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </>
    );
};

export default Header;
