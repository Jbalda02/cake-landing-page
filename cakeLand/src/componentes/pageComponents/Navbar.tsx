import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faBars, faXmark, faUser } from "@fortawesome/free-solid-svg-icons";

import logo from "./../../assets/logo-256.webp";
import { UserContext } from "../contexts/UserContext";
import { auth } from "./../../../firebaseConfig";
import { cartCount } from "../../lib/format";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/products", label: "Menú" },
  { to: "/contact", label: "Contacto" },
];

function NavBar() {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const setUser = userContext?.setUser;

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close the mobile drawer whenever the route changes
  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogout = async () => {
    // The old handler only cleared local state, so Firebase kept the session
    // and onAuthStateChanged re-populated the user on the next page load.
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
    setUser?.(undefined);
  };

  const itemCount = cartCount(user?.cart ?? []);
  const cartHref = user ? `/kart/${user.id}` : "/login";

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `link-underline text-sm font-medium transition-colors ${
      isActive ? "text-gold-300" : "text-cream-100 hover:text-white"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-plum-950/95 shadow-lift backdrop-blur-md" : "bg-plum-900"
      }`}
    >
      <nav className="container flex items-center justify-between gap-4 py-3" aria-label="Principal">
        <Link to="/" className="flex items-center gap-3" aria-label="Nene Cakes — Inicio">
          <img
            src={logo}
            alt=""
            className="h-12 w-12 rounded-full border border-plum-600 object-cover md:h-14 md:w-14"
          />
          <span className="font-display text-lg font-semibold text-cream-50 md:text-xl">
            Nene Cakes
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-7">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={navLinkClass} end={link.to === "/"}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 border-l border-plum-700 pl-6">
            <Link
              to={cartHref}
              className="relative text-cream-100 transition-colors hover:text-gold-300"
              aria-label={`Carrito (${itemCount} artículos)`}
            >
              <FontAwesomeIcon icon={faCartShopping} className="text-lg" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-plum-950">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-sm text-cream-100">
                  <FontAwesomeIcon icon={faUser} className="text-xs text-plum-300" />
                  {user.firstName}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-plum-600 px-4 py-1.5 text-xs font-medium text-cream-100 transition-colors hover:border-blush-400 hover:text-blush-300"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-cream-50 px-5 py-2 text-sm font-medium text-plum-900 transition-colors hover:bg-gold-300"
              >
                Ingresar
              </Link>
            )}
          </div>
        </div>

        {/* Mobile trigger */}
        <div className="flex items-center gap-4 md:hidden">
          <Link
            to={cartHref}
            className="relative text-cream-100"
            aria-label={`Carrito (${itemCount} artículos)`}
          >
            <FontAwesomeIcon icon={faCartShopping} className="text-lg" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-400 px-1 text-[9px] font-bold text-plum-950">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-cream-100"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            <FontAwesomeIcon icon={open ? faXmark : faBars} className="text-xl" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-plum-800 bg-plum-950 transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="container flex flex-col py-2">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `block border-b border-plum-800/60 py-3.5 text-sm font-medium ${
                    isActive ? "text-gold-300" : "text-cream-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li className="py-4">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-cream-100">
                  {user.firstName} {user.lastName}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-plum-600 px-4 py-2 text-xs font-medium text-blush-300"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block rounded-full bg-cream-50 py-2.5 text-center text-sm font-medium text-plum-900"
              >
                Ingresar
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}

export default NavBar;
