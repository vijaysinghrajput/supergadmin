import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ImBook } from "react-icons/im";
import { AiFillDashboard } from "react-icons/ai";
import { AiFillSetting } from "react-icons/ai";
import { FcSalesPerformance } from "react-icons/fc";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { FaProductHunt } from "react-icons/fa";
import { AiOutlineStock } from "react-icons/ai";
import { BsFillRecordCircleFill } from "react-icons/bs";
import { RiUserSettingsFill } from "react-icons/ri";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");

  // Add CSS for smooth transitions
  const sidebarStyles = `
    .nav-link.menu-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.3s ease;
    }
    
    .menu-dropdown {
      transition: all 0.3s ease;
      overflow: hidden;
    }
    
    .menu-dropdown.show {
      animation: slideDown 0.3s ease;
    }
    
    @keyframes slideDown {
      from {
        opacity: 0;
        max-height: 0;
      }
      to {
        opacity: 1;
        max-height: 300px;
      }
    }
    
    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    
    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }
  `;

  // Set active menu based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/dashboard") || path.includes("/stock-dashboard")) {
      setActiveMenu("dashboard");
    } else if (
      path.includes("/billing/sale") ||
      path.includes("/salesManagement")
    ) {
      setActiveMenu("sales");
    } else if (
      path.includes("/billing/purchased") ||
      path.includes("/purchaseManagement")
    ) {
      setActiveMenu("purchase");
    } else if (path.includes("/productManagement")) {
      setActiveMenu("product");
    } else if (
      path.includes("/settings") ||
      path.includes("/company") ||
      path.includes("/employee")
    ) {
      setActiveMenu("settings");
    } else if (path.includes("/online")) {
      setActiveMenu("online");
    } else {
      setActiveMenu("");
    }
  }, [location.pathname]);

  const handleMenuClick = (menuName) => {
    setActiveMenu(activeMenu === menuName ? "" : menuName);
  };
  return (
    <>
      <style>{sidebarStyles}</style>
      <div className="app-menu navbar-menu">
        <div className="navbar-brand-box">
          {/* Dark Logo*/}
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src="/assets/images/logo-sm.png" alt="" height={22} />
            </span>
            <span className="logo-lg">
              <img src="/assets/images/logo-dark.png" alt="" height={17} />
            </span>
          </Link>
          {/* Light Logo*/}
          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src="/assets/images/logo-sm.png" alt="" height={22} />
            </span>
            <span className="logo-lg">
              <img src="/assets/images/logo-light.png" alt="" height={17} />
            </span>
          </Link>
          <button
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover"
          >
            <i className="ri-record-circle-line" />
          </button>
        </div>
        <div id="scrollbar" style={{ maxHeight: "100vh", overflowY: "auto" }}>
          <div className="container-fluid">
            <ul className="navbar-nav" id="navbar-nav">
              <li className="nav-item">
                <Link
                  to="/"
                  className={`nav-link justify-content-start menu-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                >
                  <AiFillDashboard size={24} style={{ fill: "#e9e9e9" }} />
                  <span data-key="t-authentication">DASHBOARD</span>
                </Link>
              </li>

              <li className="menu-title">
                <i className="ri-more-fill" />{" "}
                <span data-key="t-pages">Trade</span>
              </li>

              <li className="nav-item">
                <a
                  className={`nav-link menu-link ${
                    activeMenu === "sales" ? "active" : ""
                  }`}
                  href="#sales-management"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick("sales");
                  }}
                  role="button"
                  aria-expanded={activeMenu === "sales"}
                  aria-controls="sales-management"
                  style={{ transition: "all 0.3s ease" }}
                >
                  <FcSalesPerformance size={24} style={{ fill: "#e9e9e9" }} />
                  <span data-key="t-authentication">SALES</span>
                  {activeMenu === "sales" ? (
                    <IoIosArrowUp size={16} style={{ marginLeft: "auto" }} />
                  ) : (
                    <IoIosArrowDown size={16} style={{ marginLeft: "auto" }} />
                  )}
                </a>
                <div
                  className={`collapse menu-dropdown ${
                    activeMenu === "sales" ? "show" : ""
                  }`}
                  id="sales-management"
                  style={{ transition: "all 0.3s ease" }}
                >
                  <ul className="nav nav-sm flex-column">
                    <li className="nav-item">
                      <Link
                        to="/billing/sale"
                        className={`nav-link ${
                          location.pathname === "/billing/sale" ? "active" : ""
                        }`}
                        data-key="t-cover"
                      >
                        SALE
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/salesManagement/sales-history"
                        className={`nav-link ${
                          location.pathname === "/salesManagement/sales-history"
                            ? "active"
                            : ""
                        }`}
                        data-key="t-cover"
                      >
                        SALES HISTORY
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/salesManagement/customers"
                        className={`nav-link ${
                          location.pathname === "/salesManagement/customers"
                            ? "active"
                            : ""
                        }`}
                        data-key="t-cover"
                      >
                        CUSTOMER
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="nav-item">
                <a
                  className={`nav-link menu-link ${
                    activeMenu === "purchase" ? "active" : ""
                  }`}
                  href="#purchase-management"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick("purchase");
                  }}
                  role="button"
                  aria-expanded={activeMenu === "purchase"}
                  aria-controls="purchase-management"
                  style={{ transition: "all 0.3s ease" }}
                >
                  <BiPurchaseTagAlt size={24} style={{ fill: "#e9e9e9" }} />
                  <span data-key="t-authentication">PURCHASE</span>
                  {activeMenu === "purchase" ? (
                    <IoIosArrowUp size={16} style={{ marginLeft: "auto" }} />
                  ) : (
                    <IoIosArrowDown size={16} style={{ marginLeft: "auto" }} />
                  )}
                </a>
                <div
                  className={`collapse menu-dropdown ${
                    activeMenu === "purchase" ? "show" : ""
                  }`}
                  id="purchase-management"
                  style={{ transition: "all 0.3s ease" }}
                >
                  <ul className="nav nav-sm flex-column">
                    <li className="nav-item">
                      <Link
                        to="/billing/purchased"
                        className={`nav-link ${
                          location.pathname === "/billing/purchased"
                            ? "active"
                            : ""
                        }`}
                        data-key="t-cover"
                      >
                        PURCHASE
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/purchaseManagement/purchase-history"
                        className={`nav-link ${
                          location.pathname ===
                          "/purchaseManagement/purchase-history"
                            ? "active"
                            : ""
                        }`}
                        data-key="t-cover"
                      >
                        PURCHASE HISTORY
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/purchaseManagement/vendor"
                        className={`nav-link ${
                          location.pathname === "/purchaseManagement/vendor"
                            ? "active"
                            : ""
                        }`}
                        data-key="t-cover"
                      >
                        VENDOR
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/purchaseManagement/expenses"
                        className={`nav-link ${
                          location.pathname === "/purchaseManagement/expenses"
                            ? "active"
                            : ""
                        }`}
                        data-key="t-cover"
                      >
                        EXPENSES
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/purchaseManagement/expiry"
                        className={`nav-link ${
                          location.pathname === "/purchaseManagement/expiry"
                            ? "active"
                            : ""
                        }`}
                        data-key="t-cover"
                      >
                        EXPIRY
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="menu-title">
                <i className="ri-more-fill" />{" "}
                <span data-key="t-pages">ITEMS</span>
              </li>

              <li className="nav-item">
                <a
                  className={`nav-link menu-link ${
                    activeMenu === "product" ? "active" : ""
                  }`}
                  href="#product-management"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick("product");
                  }}
                  role="button"
                  aria-expanded={activeMenu === "product"}
                  aria-controls="product-management"
                  style={{ transition: "all 0.3s ease" }}
                >
                  <FaProductHunt size={24} style={{ fill: "#e9e9e9" }} />
                  <span data-key="t-authentication">PRODUCT</span>
                  {activeMenu === "product" ? (
                    <IoIosArrowUp size={16} style={{ marginLeft: "auto" }} />
                  ) : (
                    <IoIosArrowDown size={16} style={{ marginLeft: "auto" }} />
                  )}
                </a>
                <div
                  className={`collapse menu-dropdown ${
                    activeMenu === "product" ? "show" : ""
                  }`}
                  id="product-management"
                  style={{ transition: "all 0.3s ease" }}
                >
                  <ul className="nav nav-sm flex-column">
                    <li className="nav-item">
                      <Link
                        to="/productManagement/category"
                        className={`nav-link ${
                          location.pathname === "/productManagement/category"
                            ? "active"
                            : ""
                        }`}
                        data-key="t-cover"
                      >
                        CATEGORY
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/productManagement/brand"
                        className={`nav-link ${
                          location.pathname === "/productManagement/brand"
                            ? "active"
                            : ""
                        }`}
                        data-key="t-cover"
                      >
                        BRAND
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/productManagement/product"
                        className={`nav-link ${
                          location.pathname === "/productManagement/product"
                            ? "active"
                            : ""
                        }`}
                        data-key="t-cover"
                      >
                        PRODUCT
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="menu-title">
                <i className="ri-more-fill" />{" "}
                <span data-key="t-pages">Settings</span>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link menu-link ${
                    activeMenu === "settings" ? "active" : ""
                  }`}
                  href="#websiteSettings"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick("settings");
                  }}
                  role="button"
                  aria-expanded={activeMenu === "settings"}
                  aria-controls="websiteSettings"
                  style={{ transition: "all 0.3s ease" }}
                >
                  <AiFillSetting size={24} style={{ fill: "#e9e9e9" }} />
                  <span data-key="t-authentication">WEBSITE SETTINGS</span>
                  {activeMenu === "settings" ? (
                    <IoIosArrowUp size={16} style={{ marginLeft: "auto" }} />
                  ) : (
                    <IoIosArrowDown size={16} style={{ marginLeft: "auto" }} />
                  )}
                </a>
                <div
                  className={`collapse menu-dropdown ${
                    activeMenu === "settings" ? "show" : ""
                  }`}
                  id="websiteSettings"
                  style={{ transition: "all 0.3s ease" }}
                >
                  <ul className="nav nav-sm flex-column">
                    <li className="nav-item">
                      <Link
                        to="/settings/banners"
                        className={`nav-link ${
                          location.pathname === "/settings/banners"
                            ? "active"
                            : ""
                        }`}
                        data-key="t-cover"
                      >
                        BANNERS
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/company"
                        className={`nav-link ${
                          location.pathname === "/company" ? "active" : ""
                        }`}
                        data-key="t-cover"
                      >
                        COMPANY INFO
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/employee"
                        className={`nav-link ${
                          location.pathname === "/employee" ? "active" : ""
                        }`}
                        data-key="t-cover"
                      >
                        EMPLOYEE
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="menu-title">
                <i className="ri-more-fill" />
                <span data-key="t-pages">ONLINE</span>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link menu-link ${
                    activeMenu === "online" ? "active" : ""
                  }`}
                  href="#onlineSettings"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick("online");
                  }}
                  role="button"
                  aria-expanded={activeMenu === "online"}
                  aria-controls="onlineSettings"
                  style={{ transition: "all 0.3s ease" }}
                >
                  <AiFillSetting size={24} style={{ fill: "#e9e9e9" }} />
                  <span data-key="t-authentication">ONLINE STORE</span>
                  {activeMenu === "online" ? (
                    <IoIosArrowUp size={16} style={{ marginLeft: "auto" }} />
                  ) : (
                    <IoIosArrowDown size={16} style={{ marginLeft: "auto" }} />
                  )}
                </a>
                <div
                  className={`collapse menu-dropdown ${
                    activeMenu === "online" ? "show" : ""
                  }`}
                  id="onlineSettings"
                  style={{ transition: "all 0.3s ease" }}
                >
                  <ul className="nav nav-sm flex-column">
                    <li className="nav-item">
                      <Link
                        to="/online/order"
                        className={`nav-link ${
                          location.pathname === "/online/order" ? "active" : ""
                        }`}
                      >
                        ONLINE ORDER
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          {/* Sidebar */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
