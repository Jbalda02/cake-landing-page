import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCakeCandles } from "@fortawesome/free-solid-svg-icons";

import logo from "./../../assets/logo-256.webp";

export default function ErrorPage() {
  const error = useRouteError();

  let status: number | null = null;
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    errorMessage = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Error desconocido";
  }

  const isNotFound = status === 404;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-plum-sheen px-5 py-16 text-center">
      <Link to="/" className="mb-10 flex items-center gap-3">
        <img src={logo} alt="" className="h-12 w-12 rounded-full border border-plum-600" />
        <span className="font-display text-xl font-semibold text-cream-50">Nene Cakes</span>
      </Link>

      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-plum-800 text-gold-400">
        <FontAwesomeIcon icon={faCakeCandles} className="text-3xl" />
      </div>

      {status && (
        <p className="mt-8 font-display text-6xl font-semibold text-gold-300 md:text-7xl">
          {status}
        </p>
      )}

      <h1 className="mt-4 font-display text-3xl font-semibold text-cream-50 md:text-4xl">
        {isNotFound ? "Esta página se nos comió alguien" : "Algo salió mal"}
      </h1>

      <p className="mt-4 max-w-md leading-relaxed text-plum-200">
        {isNotFound
          ? "No encontramos lo que buscabas, pero el menú sigue lleno de cosas ricas."
          : "Ocurrió un error inesperado. Intenta de nuevo en unos momentos."}
      </p>

      <p className="mt-6 max-w-md break-words rounded-xl border border-plum-700 bg-plum-950/60 px-4 py-3 font-mono text-xs text-plum-300">
        {errorMessage}
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/"
          className="rounded-full bg-gold-400 px-7 py-3 text-sm font-medium text-plum-950 transition-colors hover:bg-gold-300"
        >
          Volver al inicio
        </Link>
        <Link
          to="/products"
          className="rounded-full border border-plum-600 px-7 py-3 text-sm font-medium text-cream-100 transition-colors hover:border-cream-200 hover:bg-plum-800"
        >
          Ver el menú
        </Link>
      </div>
    </div>
  );
}
