import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { AuthProvider } from "@/contexts/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CustomerHome from "./pages/CustomerHome";
import SearchResults from "./pages/SearchResults";
import VendorStorefront from "./pages/VendorStorefront";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderTracking from "./pages/OrderTracking";
import ShopsPage from "./pages/ShopsPage";
import Profile from "./pages/Profile";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerLayout from "./components/layout/CustomerLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Protected customer routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<CustomerLayout />}>
                    <Route path="/home" element={<CustomerHome />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/shops" element={<ShopsPage />} />
                    <Route path="/vendors/:slug" element={<VendorStorefront />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:orderId/track" element={<OrderTracking />} />
                    <Route path="/profile" element={<Profile />} />
                  </Route>
                </Route>

                {/* Vendor protected route */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                </Route>

                {/* Placeholder routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
