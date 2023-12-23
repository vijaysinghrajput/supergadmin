import { Link, useNavigate } from "react-router-dom";
import { ImBook } from 'react-icons/im';
import { AiFillDashboard } from 'react-icons/ai';
import { AiFillSetting } from 'react-icons/ai';
import { FcSalesPerformance } from 'react-icons/fc';
import { BiPurchaseTagAlt } from 'react-icons/bi';
import { FaProductHunt } from 'react-icons/fa';
import { AiOutlineStock } from 'react-icons/ai';
import { BsFillRecordCircleFill } from 'react-icons/bs';



import { RiUserSettingsFill } from 'react-icons/ri';

const Sidebar = () => {

    const navigate = useNavigate();
    return (
        <>
            <div className="app-menu navbar-menu" >
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
                    <button type="button" className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover" id="vertical-hover">
                        <i className="ri-record-circle-line" />
                    </button>
                </div>
                <div id="scrollbar">
                    <div className="container-fluid">
                        <ul className="navbar-nav" id="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link menu-link" href="#sidebarAuth" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarAuth">
                                    <AiFillDashboard  size={24} style={{ fill: "#e9e9e9" }} /><span data-key="t-authentication">DASHBOARD</span>
                                </a>
                                <div className="collapse menu-dropdown" id="sidebarAuth">
                                    <ul className="nav nav-sm flex-column">
                                        <li className="nav-item">
                                            <Link to="/stock-dashboard" className="nav-link" data-key="t-cover">Stock Dashboard
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li className="menu-title"><i className="ri-more-fill" /> <span data-key="t-pages">MANAGEMENT</span></li>

                   

                            <li className="nav-item">
                                <a className="nav-link menu-link" href="#sales-managmenet" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sales-managmenet">
                                    <FcSalesPerformance size={24} style={{ fill: "#e9e9e9" }} /> <span data-key="t-authentication">SALES</span>
                                </a>
                                <div className="collapse menu-dropdown" id="sales-managmenet">
                                    <ul className="nav nav-sm flex-column">

                                    <li className="nav-item">
                                            <Link to="/billing/sale" className="nav-link" data-key="t-cover"> SALE
                                            </Link>
                                        </li>

                                        <li className="nav-item">
                                            <Link to="/salesManagement/sales-history" className="nav-link" data-key="t-cover"> SALES HISTORY
                                            </Link>
                                        </li>

                                        <li className="nav-item">
                                            <Link to="/salesManagement/customers" className="nav-link" data-key="t-cover"> CUSTOMER
                                            </Link>
                                        </li>

                                    </ul>
                                </div>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link menu-link" href="#purchase-management" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="purchase-management">
                                <BiPurchaseTagAlt size={24} style={{ fill: "#e9e9e9" }} /> <span data-key="t-authentication">PURCHASE</span>
                                </a>
                                <div className="collapse menu-dropdown" id="purchase-management">
                                    <ul className="nav nav-sm flex-column">
                                    <li className="nav-item">
                                            <Link to="/billing/purchased" className="nav-link" data-key="t-cover"> PURCHASE
                                            </Link>
                                        </li>

                                        <li className="nav-item">
                                            <Link to="/purchaseManagement/purchase-history" className="nav-link" data-key="t-cover"> PURCHASE HISTORY
                                            </Link>
                                        </li>
                                       
                                        <li className="nav-item">
                                            <Link to="/purchaseManagement/vendor" className="nav-link" data-key="t-cover"> VENDOR
                                            </Link>
                                        </li>
                                        
                                    </ul>
                                </div>
                            </li>
                            
                            <li className="nav-item">
                                <a className="nav-link menu-link" href="#product-management" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="product-management">
                                <FaProductHunt size={24} style={{ fill: "#e9e9e9" }} /><span data-key="t-authentication">PRODUCT</span>
                                </a>
                                <div className="collapse menu-dropdown" id="product-management">
                                    <ul className="nav nav-sm flex-column">
                                        <li className="nav-item">
                                            <Link to="/productManagement/category" className="nav-link" data-key="t-cover"> CATEGORY
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/productManagement/brand" className="nav-link" data-key="t-cover"> BRAND
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/productManagement/product" className="nav-link" data-key="t-cover"> PRODUCT
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            
                            <li className="nav-item">
                                <a className="nav-link menu-link" href="#stocks-management" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="stocks-management">
                                <AiOutlineStock size={24} style={{ fill: "#e9e9e9" }} /><span data-key="t-authentication">STOCK</span>
                                </a>
                                <div className="collapse menu-dropdown" id="stocks-management">
                                    <ul className="nav nav-sm flex-column">
                                        <li className="nav-item">
                                            <Link to="/product-stocks" className="nav-link" data-key="t-cover"> STOCKS
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/low-stocks" className="nav-link" data-key="t-cover">LOW STOCKS
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/product-stocks-history" className="nav-link" data-key="t-cover"> STOCKS HISTORY
                                            </Link>
                                        </li>

                                    </ul>
                                </div>
                            </li>

                            {/* <li className="menu-title"><i className="ri-more-fill" /> <span data-key="t-pages">Settings</span></li> */}
                            
                            <li className="nav-item">
                                <a className="nav-link menu-link" href="#onlineManagment" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="onlineManagment">
                                <BsFillRecordCircleFill size={24} style={{ fill: "#e9e9e9" }} /> <span data-key="t-dashboards">ONLINE ORDER </span>
                                </a>
                                <div className="collapse menu-dropdown" id="onlineManagment">
                                    <ul className="nav nav-sm flex-column">
                                        <li className="nav-item">
                                            <Link to="/online/order" className="nav-link"> ORDER </Link>
                                            <Link to="/online/delivery" className="nav-link" data-key="t-cover"> DELIVERY</Link>
                                            <Link to="/online/coupon" className="nav-link" data-key="t-cover"> COUPON</Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>
  

                         
                            <li className="menu-title"><i className="ri-more-fill" /> <span data-key="t-pages">Settings</span></li>
                            <li className="nav-item">
                                <a className="nav-link menu-link" href="#websiteSettings" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="websiteSettings">
                                    <AiFillSetting size={24} style={{ fill: "#e9e9e9" }} /> <span data-key="t-authentication">Website Settings</span>
                                </a>
                                <div className="collapse menu-dropdown" id="websiteSettings">
                                    <ul className="nav nav-sm flex-column">
                                    <li className="nav-item">
                                            <Link to="/settings/banners" className="nav-link" data-key="t-cover"> Banners
                                            </Link>
                                        </li>
                                        {/*
                                        <li className="nav-item">
                                            <Link to="/settings/testimonial" className="nav-link" data-key="t-cover"> Testimonial
                                            </Link>
                                        </li> */}
                                        <li className="nav-item">
                                            <Link to="/company" className="nav-link" data-key="t-cover"> Company Info
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
    )

}

export default Sidebar;