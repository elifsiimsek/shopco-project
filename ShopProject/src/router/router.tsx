import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import ShopPage from "../pages/ShopPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import WishlistPage from "../pages/WishlistPage"; 

import OnSalePage from "../pages/collections/OnSalePage";
import NewArrivalsPage from "../pages/collections/NewArrivalsPage";
import BrandsPage from "../pages/collections/BrandsPage"; 

import LoginPage from "../pages/auth/LoginPage"; 
import RegisterPage from "../pages/auth/RegisterPage";
import AccountPage from "./../pages/AccountPage"; 
import ProtectedRoute from "./ProtectedRoute"; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      { index: true, element: <HomePage /> },
      { path: "shop", element: <ShopPage /> },
      { path: "category/:categoryType", element: <ShopPage /> },
      { path: "product/:id", element: <ProductDetailPage /> },
      { path: "on-sale", element: <OnSalePage /> },
      { path: "new-arrivals", element: <NewArrivalsPage /> },
      { path: "brands", element: <BrandsPage /> },
      
      { path: "cart", element: <CartPage /> },
      { path: "wishlist", element: <WishlistPage /> }, 

      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },

      { 
        path: "account", 
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ) 
      },
    ],
  },
]);

export default router;