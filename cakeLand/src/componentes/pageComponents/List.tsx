import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { Product } from "../../types";
import { formatPrice } from "../../lib/format";
import { ProductCardSkeleton } from "../ui/Feedback";

interface ListProps {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
}

function ProductCard({ product }: { product: Product }) {
  const cover = product.imgurl?.[0];
  const soldOut = product.disponible === false;

  return (
    <li className="group">
      {/* The whole card is one link — the old markup nested <a><li> inside a
          <ul>, which is invalid HTML and made the card unreachable by keyboard. */}
      <Link
        to={`/products/${product.id}`}
        className="flex h-full flex-col overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-plum-200 hover:shadow-lift"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
          {cover ? (
            <img
              src={cover}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink-muted">
              Sin imagen
            </div>
          )}

          {soldOut && (
            <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              Agotado
            </span>
          )}

          <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3.5 py-1.5 text-sm font-semibold text-plum-900 shadow-soft backdrop-blur-sm">
            {formatPrice(product.precio)}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-semibold leading-snug text-ink">
            {product.name}
          </h3>

          {/* Clamped instead of the old fixed 410px card that clipped mid-word */}
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
            {product.descripcion}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-cream-200 pt-4">
            {product.numPorciones > 0 && (
              <span className="text-xs text-ink-muted">{product.numPorciones} porciones</span>
            )}
            <span className="ml-auto flex items-center gap-1.5 text-sm font-medium text-plum-700 transition-colors group-hover:text-plum-900">
              Ver detalle
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-xs transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default function List({ products, loading = false, skeletonCount = 4 }: ListProps) {
  const gridClass =
    "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  if (loading) {
    return (
      <div className={gridClass} aria-busy="true" aria-label="Cargando productos">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <ul className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  );
}
