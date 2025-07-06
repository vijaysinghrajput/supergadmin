import React, { Suspense, lazy, useContext, useMemo } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { PrimeReactProvider } from "primereact/api";
import Cookies from "universal-cookie";

import ContextData from "./context/MainContext";
import MainContainer from "./component/Shared/MainContainer";
import Loading from "./component/Shared/Loading";

// Lazy load components
const HomePage = lazy(() => import("./page/HomePage"));
const StockDashPage = lazy(() => import("./page/StockDashPage"));
const LoginPage = lazy(() => import("./page/LoginPage"));
const Partner = lazy(() => import("./component/Partner/Partner"));
const PartnerEdit = lazy(() => import("./component/Partner/PartnerEdit"));
const BannerSettings = lazy(() =>
  import("./component/Settings/Website/Banner")
);
const PurchaseIndex = lazy(() => import("./component/PURCHASE/purchase-index"));
const ExpairyManagement = lazy(() =>
  import("./component/PURCHASE/expairy-management")
);
const VendorManagement = lazy(() =>
  import("./component/PURCHASE/vendor-management")
);
const ExpensesManagement = lazy(() =>
  import("./component/PURCHASE/expenses-management")
);
const SaleIndex = lazy(() => import("./component/SALE/sale-index"));
const CustomerManagement = lazy(() =>
  import("./component/SALE/customer-management")
);
const PurchaseHistory = lazy(() =>
  import("./component/PURCHASE/purchase-history")
);
const PurchaseHistoryRecord = lazy(() =>
  import("./component/PURCHASE/purchase-history-record")
);
const ExpiryHistoryRecord = lazy(() =>
  import("./component/PURCHASE/expiry-history-record")
);
const OnlineSale = lazy(() => import("./component/online/online-sale"));
const OnlineSalesHistoryRecord = lazy(() =>
  import("./component/online/online-sales-history-record")
);
const SalesHistory = lazy(() => import("./component/SALE/sale-history"));
const SalesHistoryRecord = lazy(() =>
  import("./component/SALE/sales-history-record")
);
const ProductIndex = lazy(() => import("./component/PRODUCT/product-index"));
const ProductManagement = lazy(() =>
  import("./component/PRODUCT/product-management")
);
const ProductByCategory = lazy(() =>
  import("./component/PRODUCT/product-by-category")
);
const ProductByParentCategory = lazy(() =>
  import("./component/PRODUCT/product-by-parent-category")
);
const ProductByBrand = lazy(() =>
  import("./component/PRODUCT/product-by-brand")
);
const CategoryManagement = lazy(() =>
  import("./component/PRODUCT/category-management")
);
const BrandManagement = lazy(() =>
  import("./component/PRODUCT/brand-management")
);
const Stocks = lazy(() => import("./component/STOCK/Stocks"));
const Purchased = lazy(() =>
  import("./component/BILLING/Purchased").then((module) => ({
    default: module.Purchased,
  }))
);
const Sale = lazy(() =>
  import("./component/BILLING/Sale").then((module) => ({
    default: module.Sale,
  }))
);
const LowStock = lazy(() => import("./component/STOCK/low-stocks"));
const StocksHistory = lazy(() =>
  import("./component/STOCK/product-stocks-history")
);
const Employee = lazy(() => import("./component/Employee/Employee"));
const DeliveryBoyManagment = lazy(() =>
  import("./component/Delivery/delivery-boy")
);
const CouponManagment = lazy(() =>
  import("./component/Delivery/coupon-managment")
);
const SaleDashboard = lazy(() => import("./component/Dashboard/SaleDashboard"));
const AnalyticsDashboard = lazy(() =>
  import("./component/Dashboard/AnalyticsDashboard")
);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const cookies = new Cookies();

const App = React.memo(() => {
  const { isLoading } = useContext(ContextData);
  const adminId = cookies.get("adminId");

  const mainContent = useMemo(
    () => (
      <MainContainer>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<Loading />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="/stock-dashboard"
            element={
              <Suspense fallback={<Loading />}>
                <StockDashPage />
              </Suspense>
            }
          />
          <Route path="/dashboard">
            <Route
              path="sales"
              element={
                <Suspense fallback={<Loading />}>
                  <SaleDashboard />
                </Suspense>
              }
            />
            <Route
              path="analytics"
              element={
                <Suspense fallback={<Loading />}>
                  <AnalyticsDashboard />
                </Suspense>
              }
            />
          </Route>
          <Route path="/purchaseManagement">
            <Route
              index
              element={
                <Suspense fallback={<Loading />}>
                  <PurchaseIndex />
                </Suspense>
              }
            />
            <Route
              path="purchase"
              element={
                <Suspense fallback={<Loading />}>
                  <VendorManagement />
                </Suspense>
              }
            />
            <Route
              path="vendor"
              element={
                <Suspense fallback={<Loading />}>
                  <VendorManagement />
                </Suspense>
              }
            />
            <Route
              path="expenses"
              element={
                <Suspense fallback={<Loading />}>
                  <ExpensesManagement />
                </Suspense>
              }
            />
            <Route
              path="expairy"
              element={
                <Suspense fallback={<Loading />}>
                  <ExpairyManagement />
                </Suspense>
              }
            />
            <Route
              path="purchase-history"
              element={
                <Suspense fallback={<Loading />}>
                  <PurchaseHistory />
                </Suspense>
              }
            />
            <Route
              path="/purchaseManagement/purchase-history-record/:orderID/:vendorID"
              element={
                <Suspense fallback={<Loading />}>
                  <PurchaseHistoryRecord />
                </Suspense>
              }
            />
            <Route
              path="/purchaseManagement/expiry-history-record/:orderID/:vendorID"
              element={
                <Suspense fallback={<Loading />}>
                  <ExpiryHistoryRecord />
                </Suspense>
              }
            />
          </Route>
          <Route path="/salesManagement">
            <Route
              index
              element={
                <Suspense fallback={<Loading />}>
                  <SaleIndex />
                </Suspense>
              }
            />
            <Route
              path="sales-history"
              element={
                <Suspense fallback={<Loading />}>
                  <SalesHistory />
                </Suspense>
              }
            />
            <Route
              path="customers"
              element={
                <Suspense fallback={<Loading />}>
                  <CustomerManagement />
                </Suspense>
              }
            />
            <Route
              path="/salesManagement/sales-history-record/:orderID/:customer_mobile"
              element={
                <Suspense fallback={<Loading />}>
                  <SalesHistoryRecord />
                </Suspense>
              }
            />
            <Route
              path="/salesManagement/customer-history-record/:customerID/:customer_mobile"
              element={
                <Suspense fallback={<Loading />}>
                  <SalesHistoryRecord />
                </Suspense>
              }
            />
          </Route>
          <Route path="/billing">
            <Route index element={<h4>BILLING</h4>} />
            <Route
              path="purchased"
              element={
                <Suspense fallback={<Loading />}>
                  <Purchased />
                </Suspense>
              }
            />
            <Route
              path="sale"
              element={
                <Suspense fallback={<Loading />}>
                  <Sale />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="/login"
            element={
              <Suspense fallback={<Loading />}>
                <LoginPage />
              </Suspense>
            }
          />
          <Route
            path="/product-stocks"
            element={
              <Suspense fallback={<Loading />}>
                <Stocks />
              </Suspense>
            }
          />
          <Route
            path="/low-stocks"
            element={
              <Suspense fallback={<Loading />}>
                <LowStock />
              </Suspense>
            }
          />
          <Route
            path="/product-stocks-history"
            element={
              <Suspense fallback={<Loading />}>
                <StocksHistory />
              </Suspense>
            }
          />
          <Route path="/productManagement">
            <Route
              index
              element={
                <Suspense fallback={<Loading />}>
                  <ProductIndex />
                </Suspense>
              }
            />
            <Route
              path="product"
              element={
                <Suspense fallback={<Loading />}>
                  <ProductManagement />
                </Suspense>
              }
            />
            <Route
              path="/productManagement/product-by-brand/:brandID/:brandName"
              element={
                <Suspense fallback={<Loading />}>
                  <ProductByBrand />
                </Suspense>
              }
            />
            <Route
              path="/productManagement/product-by-category/:subcatID/:subcatName"
              element={
                <Suspense fallback={<Loading />}>
                  <ProductByCategory />
                </Suspense>
              }
            />
            <Route
              path="/productManagement/product-by-parent-category/:subcatID/:subcatName"
              element={
                <Suspense fallback={<Loading />}>
                  <ProductByParentCategory />
                </Suspense>
              }
            />
            <Route
              path="category"
              element={
                <Suspense fallback={<Loading />}>
                  <CategoryManagement />
                </Suspense>
              }
            />
            <Route
              path="brand"
              element={
                <Suspense fallback={<Loading />}>
                  <BrandManagement />
                </Suspense>
              }
            />
          </Route>
          <Route path="/online">
            <Route index element={<h4>Online 11</h4>} />
            <Route
              path="/online/order"
              element={
                <Suspense fallback={<Loading />}>
                  <OnlineSale />
                </Suspense>
              }
            />
            <Route
              path="/online/online-sales-history-record/:orderID/:customer_address/:order_type"
              element={
                <Suspense fallback={<Loading />}>
                  <OnlineSalesHistoryRecord />
                </Suspense>
              }
            />
            <Route
              path="/online/delivery-boy"
              element={
                <Suspense fallback={<Loading />}>
                  <DeliveryBoyManagment />
                </Suspense>
              }
            />
            <Route
              path="/online/coupon"
              element={
                <Suspense fallback={<Loading />}>
                  <CouponManagment />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="/settings/banners"
            element={
              <Suspense fallback={<Loading />}>
                <BannerSettings />
              </Suspense>
            }
          />
          <Route
            path="/company"
            element={
              <Suspense fallback={<Loading />}>
                <Partner />
              </Suspense>
            }
          />
          <Route
            path="/company/edit"
            element={
              <Suspense fallback={<Loading />}>
                <PartnerEdit />
              </Suspense>
            }
          />
          <Route
            path="/employee"
            element={
              <Suspense fallback={<Loading />}>
                <Employee />
              </Suspense>
            }
          />
        </Routes>
      </MainContainer>
    ),
    []
  );

  if (isLoading && adminId) {
    return <Loading />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider resetCSS={true}>
        <BrowserRouter>
          <PrimeReactProvider>{mainContent}</PrimeReactProvider>
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  );
});

App.displayName = "App";

export default App;
