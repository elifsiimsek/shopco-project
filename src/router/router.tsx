import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import ShopPage from "../pages/ShopPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import WishlistPage from "../pages/WishlistPage";
import OnSalePage from "../pages/collections/OnSalePage";
import NewArrivalsCatolog from "../pages/collections/NewArrivalsCatalog";
import BrandsPage from "../pages/collections/BrandsPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import AccountPage from "./../pages/AccountPage";
import ProtectedRoute from "./ProtectedRoute";
import Cart from "../pages/Cart";
import AdminPanel from "../sections/auth/admin/admin-layout";
import { NotFound } from "../pages/NotFound";

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
      { path: "new-arrivals", element: <NewArrivalsCatolog /> },
      { path: "brands", element: <BrandsPage /> },
      { path: "cart", element: <Cart /> },
      { path: "wishlist", element: <WishlistPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      {
        path: "account",
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },

  {
    path: "admin",
    element: (
      <ProtectedRoute adminOnly>
        <AdminPanel />
      </ProtectedRoute>
    ),
  },
  { path: "admin/*", element: <NotFound /> },
]);

export default router;
