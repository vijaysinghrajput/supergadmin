import Header from "./Header";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useContext } from "react";

import ContextData from "../../context/MainContext";

const MainContainer = ({ children }) => {
  const { Store_bussiness_info } = useContext(ContextData);

  const location = useLocation();

  return (
    <>
      <div>
        <Helmet>
          {" "}
          <title>{Store_bussiness_info?.buss_name}</title>{" "}
        </Helmet>

        {location.pathname === "/login" ? (
          <>{children}</>
        ) : (
          <div id="layout-wrapper">
            <Header />
            <Sidebar />
            <div className="vertical-overlay" />
            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">{children}</div>
              </div>
              <footer className="footer">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-sm-6">© Skyably IT Solution.</div>
                    <div className="col-sm-6">
                      <div className="text-sm-end d-none d-sm-block">
                        Design &amp; Develop by Navneet
                      </div>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MainContainer;
