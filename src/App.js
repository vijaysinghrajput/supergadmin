import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";

import HomePage from "./page/HomePage";
import StockDashPage from "./page/StockDashPage";

import MainContainer from "./component/Shared/MainContainer";
// import CustomerDetails from './component/Employee/CustomerDetails';
// import EditCustomer from './component/Employee/EditCustomer';
import LoginPage from "./page/LoginPage";
// import AllLeads from './component/Leads/AllLeads';
// import ContextProvider from './context/contextProvider';
import Partner from "./component/Partner/Partner";
import PartnerEdit from "./component/Partner/PartnerEdit";
import { ChakraProvider } from "@chakra-ui/react";
// import Roles from './component/Settings/Master/Roles';
// import Sallery from './component/Employee/Sallary';
// import BuyLeads from './component/Leads/BuyLeads';
// import ManageLeads from './component/Leads/ManageLeads';
// import AddPlots from './component/Plot/AddPlots';
import BannerSettings from "./component/Settings/Website/Banner";
// import TestimonialSettings from './component/Settings/Website/Testimonial/Testimonial';

import PurchaseIndex from "./component/PURCHASE/purchase-index";
import ExpairyManagement from "./component/PURCHASE/expairy-management";

import VendorManagement from "./component/PURCHASE/vendor-management";
import ExpensesManagement from "./component/PURCHASE/expenses-management";

import DeliveryManagment from "./component/Delivery/delivery-managment";
import DeliveryBoyManagment from "./component/Delivery/delivery-boy";

import CouponManagment from "./component/Delivery/coupon-managment";

import SaleIndex from "./component/SALE/sale-index";
import CustomerManagement from "./component/SALE/customer-management";

import PurchaseHistory from "./component/PURCHASE/purchase-history";
import PurchaseHistoryRecord from "./component/PURCHASE/purchase-history-record";
import ExpiryHistoryRecord from "./component/PURCHASE/expiry-history-record";

import OnlineSale from "./component/online/online-sale";
import OnlineSalesHistoryRecord from "./component/online/online-sales-history-record";

import SalesHistory from "./component/SALE/sale-history";
import SalesHistoryRecord from "./component/SALE/sales-history-record";

import ProductIndex from "./component/PRODUCT/product-index";
import ProductManagement from "./component/PRODUCT/product-management";
import ProductByCategory from "./component/PRODUCT/product-by-category";
import ProductByParentCategory from "./component/PRODUCT/product-by-parent-category";
import ProductByBrand from "./component/PRODUCT/product-by-brand";

import CategoryManagement from "./component/PRODUCT/category-management";
import BrandManagement from "./component/PRODUCT/brand-management";
import Stocks from "./component/STOCK/Stocks";
import { Purchased } from "./component/BILLING/Purchased";
import { Sale } from "./component/BILLING/Sale";
import LowStock from "./component/STOCK/low-stocks";
import StocksHistory from "./component/STOCK/product-stocks-history";

import Employee from "./component/Employee/Employee";

import { useContext } from "react";
import ContextData from "./context/MainContext";
import Loading from "./component/Shared/Loading";
import Cookies from "universal-cookie";
import { PrimeReactProvider } from "primereact/api";
import SaleDashboard from "./component/Dashboard/SaleDashboard";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // refetchInterval: 1000,
    },
  },
});
const cookies = new Cookies();

const App = () => {
  const { isLoading } = useContext(ContextData);
  const adminId = cookies.get("adminId");

  // console.log("admin",adminId)
  if (isLoading && adminId) {
    return <Loading />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider resetCSS={true}>
        <BrowserRouter>
          {/* <ContextProvider> */}
          <PrimeReactProvider>
            <MainContainer>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stock-dashboard" element={<StockDashPage />} />
                <Route path="/dashboard">
                  <Route path="sales" element={<SaleDashboard />} />
                </Route>
                <Route path="/purchaseManagement">
                  <Route index element={<PurchaseIndex />} />
                  <Route path="purchase" element={<VendorManagement />} />
                  <Route path="vendor" element={<VendorManagement />} />
                  <Route path="expenses" element={<ExpensesManagement />} />
                  <Route path="expairy" element={<ExpairyManagement />} />
                  <Route
                    path="purchase-history"
                    element={<PurchaseHistory />}
                  />
                  <Route
                    path="/purchaseManagement/purchase-history-record/:orderID/:vendorID"
                    element={<PurchaseHistoryRecord />}
                  />
                  <Route
                    path="/purchaseManagement/expiry-history-record/:orderID/:vendorID"
                    element={<ExpiryHistoryRecord />}
                  />
                </Route>
                <Route path="/salesManagement">
                  <Route index element={<SaleIndex />} />
                  <Route path="sales-history" element={<SalesHistory />} />
                  <Route path="customers" element={<CustomerManagement />} />
                  <Route
                    path="/salesManagement/sales-history-record/:orderID/:customer_mobile"
                    element={<SalesHistoryRecord />}
                  />
                  <Route
                    path="/salesManagement/customer-history-record/:customerID/:customer_mobile"
                    element={<SalesHistoryRecord />}
                  />
                </Route>
                <Route path="/billing">
                  <Route index element={<h4>BILLING</h4>} />
                  <Route path="purchased" element={<Purchased />} />
                  <Route path="sale" element={<Sale />} />
                </Route>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/product-stocks" element={<Stocks />} />
                <Route path="/low-stocks" element={<LowStock />} />
                <Route
                  path="/product-stocks-history"
                  element={<StocksHistory />}
                />
                <Route path="/productManagement">
                  <Route index element={<ProductIndex />} />
                  <Route path="product" element={<ProductManagement />} />
                  <Route
                    path="/productManagement/product-by-brand/:brandID/:brandName"
                    element={<ProductByBrand />}
                  />
                  <Route
                    path="/productManagement/product-by-category/:subcatID/:subcatName"
                    element={<ProductByCategory />}
                  />
                  <Route
                    path="/productManagement/product-by-parent-category/:subcatID/:subcatName"
                    element={<ProductByParentCategory />}
                  />
                  <Route path="category" element={<CategoryManagement />} />
                  <Route path="brand" element={<BrandManagement />} />
                </Route>
                <Route path="/online">
                  <Route index element={<h4>Online 11</h4>} />
                  <Route path="/online/order" element={<OnlineSale />} />
                  <Route
                    path="/online/online-sales-history-record/:orderID/:customer_address/:order_type"
                    element={<OnlineSalesHistoryRecord />}
                  />
                  <Route
                    path="/online/delivery-boy"
                    element={<DeliveryBoyManagment />}
                  />
                  <Route path="/online/coupon" element={<CouponManagment />} />
                </Route>
                <Route path="/settings/banners" element={<BannerSettings />} />
                <Route path="/company" element={<Partner />} />
                <Route path="/company/edit" element={<PartnerEdit />} />
                <Route path="/employee" element={<Employee />} />
              </Routes>
            </MainContainer>
          </PrimeReactProvider>
          {/* </ContextProvider> */}
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default App;
