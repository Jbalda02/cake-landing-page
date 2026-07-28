import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Main from "./App";
import LoginPage from "./componentes/pages/LoginPage";
import Productos from "./componentes/pages/ProductPage";
import RegisterPage from "./componentes/pages/Register";
import ContactPage from "./componentes/pages/ContactPage";
import ProductDetailPage from "./componentes/pages/ProductDetailPage";
import CartPage from "./componentes/pages/kartPage";
import CheckoutPage from "./componentes/pages/CheckoutPage";
import ErrorPage from "./componentes/pages/errorPage";
import { UserProvider } from "./componentes/contexts/UserContext";

const GOOGLE_CLIENT_ID =
  "816219725719-1md3bkjm93hulcchpog2vrfj98r6glu6.apps.googleusercontent.com";

const router = createBrowserRouter([
  { path: "/", element: <Main />, errorElement: <ErrorPage /> },
  { path: "/login", element: <LoginPage />, errorElement: <ErrorPage /> },
  { path: "/products", element: <Productos />, errorElement: <ErrorPage /> },
  { path: "/products/:productId", element: <ProductDetailPage />, errorElement: <ErrorPage /> },
  { path: "/register", element: <RegisterPage />, errorElement: <ErrorPage /> },
  { path: "/contact", element: <ContactPage />, errorElement: <ErrorPage /> },
  { path: "/kart/:userid", element: <CartPage />, errorElement: <ErrorPage /> },
  { path: "/checkout/:userid", element: <CheckoutPage />, errorElement: <ErrorPage /> },
  // Catch-all: unknown URLs previously fell through to a blank page
  { path: "*", element: <ErrorPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
