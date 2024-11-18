import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Main from "./App";
import LoginPage from "./componentes/pages/LoginPage";
import Productos from "./componentes/pages/ProductPage";
import ReginsterPage from "./componentes/pages/Register";
import ContactPage from "./componentes/pages/ContactPage";
import ProductDetailPage from "./componentes/pages/ProductDetailPage.tsx";
import { UserProvider } from "./componentes/contexts/UserContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./componentes/pages/errorPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import CartPage from "./componentes/pages/kartPage.tsx"; // Remove .tsx if not necessary
import CheckoutPage from './componentes/pages/CheckoutPage.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/login",
    element: <LoginPage></LoginPage>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/products",
    element: <Productos></Productos>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/products/:productId",
    element: <ProductDetailPage></ProductDetailPage>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/register",
    element: <ReginsterPage></ReginsterPage>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/contact",
    element: <ContactPage></ContactPage>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path:'/kart/:userid',
    element: <CartPage></CartPage>,
    errorElement:<ErrorPage></ErrorPage>
  },
  {
    path:'/checkout/:userid',
    element:<CheckoutPage></CheckoutPage>,
    errorElement:<ErrorPage></ErrorPage>
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="816219725719-1md3bkjm93hulcchpog2vrfj98r6glu6.apps.googleusercontent.com">
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
