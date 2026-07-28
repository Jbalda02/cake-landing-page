import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLocationDot, faClock } from "@fortawesome/free-solid-svg-icons";

import logo from "./../../assets/logo-256.webp";

/**
 * Fictional storefront — all contact details below are placeholders.
 * The previous footer routed external URLs through react-router <Link>,
 * which turned them into in-app paths like "/https://…" and 404'd.
 */
const socials = [
  {
    label: "WhatsApp",
    href: "https://wa.me/593999999999",
    icon: faWhatsapp,
    detail: "+593 99 999 9999",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: faInstagram,
    detail: "@nenecakes",
  },
  {
    label: "Correo",
    href: "mailto:hola@nenecakes.ec",
    icon: faEnvelope,
    detail: "hola@nenecakes.ec",
  },
];

export default function Footer() {
  return (
    <footer className="bg-plum-sheen text-cream-100">
      <div className="container py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt=""
                className="h-14 w-14 rounded-full border border-plum-600 object-cover"
              />
              <span className="font-display text-xl font-semibold text-cream-50">Nene Cakes</span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-plum-200">
              Postres artesanales hechos por encargo. Cada torta se hornea el mismo día de la
              entrega.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-plum-600 text-cream-100 transition-all hover:border-gold-400 hover:bg-plum-800 hover:text-gold-300"
                >
                  <FontAwesomeIcon icon={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-2xl font-semibold text-cream-50">
              Contacta y haz tu pedido
            </h3>
            <ul className="mt-6 space-y-4">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-sm text-plum-200 transition-colors hover:text-gold-300"
                  >
                    <FontAwesomeIcon icon={s.icon} className="w-4 text-plum-300 group-hover:text-gold-400" />
                    <span>{s.detail}</span>
                  </a>
                </li>
              ))}
            </ul>

            <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Enlaces del pie">
              <Link to="/products" className="text-plum-200 transition-colors hover:text-gold-300">
                Menú
              </Link>
              <Link to="/contact" className="text-plum-200 transition-colors hover:text-gold-300">
                Contacto
              </Link>
              <Link to="/login" className="text-plum-200 transition-colors hover:text-gold-300">
                Mi cuenta
              </Link>
            </nav>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-display text-2xl font-semibold text-cream-50">Visítanos</h3>
            <div className="mt-6 space-y-4 text-sm text-plum-200">
              <p className="flex gap-3">
                <FontAwesomeIcon icon={faLocationDot} className="mt-1 w-4 shrink-0 text-plum-300" />
                <span>
                  Vía a la Costa, Puerto Azul
                  <br />
                  Guayaquil, Guayas
                  <br />
                  Ecuador
                </span>
              </p>
              <p className="flex gap-3">
                <FontAwesomeIcon icon={faClock} className="mt-1 w-4 shrink-0 text-plum-300" />
                <span>
                  Lunes a sábado
                  <br />
                  9:00 — 19:00
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-plum-700/60 pt-6 text-xs text-plum-300 sm:flex-row">
          <p>© {new Date().getFullYear()} Nene Cakes. Tienda ficticia con fines demostrativos.</p>
          <p>Hecho con cacao y mantequilla en Guayaquil.</p>
        </div>
      </div>
    </footer>
  );
}
