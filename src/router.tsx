import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

import HomePage from "./pages/home/Home";
import BookDetailsPage from "./pages/books/BookDetailsPage";
import CartPage from "./pages/cart/CartPage";
import AuthPage from "./pages/auth/AuthPage";
import AccountPage from "./pages/account/AccountPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // --- 1. PUBLIC ROUTES ---
      { index: true, element: <HomePage /> },
      { path: "login", element: <AuthPage /> },
      { path: "signup", element: <AuthPage /> },
      { path: "app/books/:id", element: <BookDetailsPage /> },

      // --- 2. CLIENT ONLY ROUTES ---
      {
        element: <ProtectedRoute allowedRoles={["ROLE_CLIENT"]} />,
        children: [
          { path: "cart", element: <CartPage /> },
          { path: "account", element: <AccountPage /> },
          {
            path: "profile",
            element: <div className="fade-in">Client Profile</div>,
          },
        ],
      },

      // --- 3. EMPLOYEE ONLY ROUTES ---
      {
        path: "admin",
        element: <ProtectedRoute allowedRoles={["ROLE_EMPLOYEE"]} />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "inventory",
            element: <div className="fade-in">Manage Books</div>,
          },
          {
            path: "clients",
            element: <div className="fade-in">Manage Clients</div>,
          },
        ],
      },

      // --- 4. 404 FALLBACK ---
      {
        path: "*",
        element: (
          <Navigate
            to="/"
            replace
          />
        ),
      },
    ],
  },
]);
