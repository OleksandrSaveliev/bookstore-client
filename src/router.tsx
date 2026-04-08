import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

import HomePage from "./pages/home/Home";
import BookDetailsPage from "./pages/books/BookDetailsPage";
import CartPage from "./pages/cart/CartPage";
import AuthPage from "./pages/auth/AuthPage";
import AccountPage from "./pages/account/AccountPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BookCatalog from "./pages/books/BookCatalog";
import OAuth2RedirectHandler from "./pages/auth/OAuth2RedirectHandler"; // Import the handler

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // --- 1. PUBLIC ROUTES ---
      { index: true, element: <HomePage /> },
      { path: "login", element: <AuthPage /> },
      { path: "signup", element: <AuthPage /> },

      // OAuth2 Landing Route: Matches response.sendRedirect(".../oauth-callback")
      { path: "oauth-callback", element: <OAuth2RedirectHandler /> },

      { path: "app/books/:id", element: <BookDetailsPage /> },

      // --- 2. CLIENT ONLY ROUTES ---
      {
        element: (
          <ProtectedRoute allowedRoles={["ROLE_CLIENT", "ROLE_ADMIN"]} />
        ),
        children: [
          { path: "cart", element: <CartPage /> },
          { path: "account", element: <AccountPage /> },
          {
            path: "profile",
            element: <div className="fade-in">Client Profile</div>,
          },
        ],
      },

      {
        element: (
          <ProtectedRoute
            allowedRoles={["ROLE_CLIENT", "ROLE_EMPLOYEE", "ROLE_ADMIN"]}
          />
        ),
        children: [{ path: "catalog", element: <BookCatalog /> }],
      },

      // --- 3. EMPLOYEE / ADMIN ONLY ROUTES ---
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["ROLE_EMPLOYEE", "ROLE_ADMIN"]} />
        ),
        children: [
          {
            index: true,
            element: <AdminDashboard />,
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
