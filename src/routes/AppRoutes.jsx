import { Navigate, Route, Routes } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";


import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import VerifyPasscode from "../pages/VerifyPassCode";
import Posts from "../pages/Posts";
import Category from "../pages/Category";
import NotFound from "../pages/NotFound";
import Subcategories from "../pages/Subcategory";
import Product from "../pages/Product";
import ProductVariant from "../pages/ProductVariant"
import OrderFullfilment from "../pages/OrderFullfilment"

export default function AppRoutes() {
  return (
    <Routes>
      {/* Guests only */}
      <Route element={<PublicRoute />}>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Route>
      <Route path="/verify-passcode" element={<VerifyPasscode/> } />

      {/* Logged-in users only */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/category" element={<Category />} />
          <Route path="/sub-category" element={<Subcategories />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product-variant" element={<ProductVariant />} />
          <Route path="/order-fullfilment" element={<OrderFullfilment />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
