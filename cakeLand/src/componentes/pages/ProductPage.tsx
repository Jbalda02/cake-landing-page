import { useEffect, useState } from "react";

import List from "../pageComponents/List";
import { PageShell, Section } from "../ui/Layout";
import { EmptyState } from "../ui/Feedback";
import { ButtonLink } from "../ui/Button";
import { getProductsByType } from "../../services/userQueries";
import { Product } from "../../types";

const CATEGORIES = [
  { key: "torta", label: "Tortas", blurb: "Bizcochos de capas, rellenos y cubiertas a pedido." },
  { key: "pie", label: "Pies", blurb: "Masas quebradas horneadas el mismo día." },
  { key: "frio", label: "Postres fríos", blurb: "Cheesecakes, mousses y tiramisús." },
  { key: "otro", label: "Otros", blurb: "Galletas, cupcakes y antojos de temporada." },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

function Productos() {
  const [productsByType, setProductsByType] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<CategoryKey | "todos">("todos");

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      // Fetch every category in parallel instead of four sequential awaits
      const results = await Promise.all(
        CATEGORIES.map(async (c) => [c.key, await getProductsByType(c.key)] as const)
      );
      if (cancelled) return;
      setProductsByType(Object.fromEntries(results));
      setLoading(false);
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleCategories =
    activeFilter === "todos" ? CATEGORIES : CATEGORIES.filter((c) => c.key === activeFilter);

  const totalProducts = Object.values(productsByType).reduce((n, list) => n + list.length, 0);

  return (
    <PageShell>
      {/* Page header */}
      <div className="border-b border-cream-200 bg-plum-sheen">
        <div className="container py-14 text-center md:py-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
            Carta completa
          </p>
          <h1 className="font-display text-4xl font-semibold text-cream-50 md:text-5xl">
            Nuestro menú
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-plum-200">
            Todo se hornea por encargo con 24 horas de anticipación. Los precios incluyen la
            decoración base.
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="sticky top-[68px] z-30 border-b border-cream-200 bg-cream-50/95 backdrop-blur-md md:top-[76px]">
        <div className="container flex gap-2 overflow-x-auto py-4">
          {[{ key: "todos" as const, label: "Todos" }, ...CATEGORIES].map((c) => {
            const isActive = activeFilter === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setActiveFilter(c.key)}
                aria-pressed={isActive}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-plum-700 text-cream-50 shadow-soft"
                    : "border border-cream-300 bg-white text-ink-soft hover:border-plum-300 hover:text-plum-700"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {!loading && totalProducts === 0 ? (
        <Section className="bg-cream-100">
          <EmptyState
            title="El menú está vacío por ahora"
            description="Estamos actualizando la carta. Escríbenos y te contamos qué tenemos disponible esta semana."
            action={<ButtonLink to="/contact">Contáctanos</ButtonLink>}
          />
        </Section>
      ) : (
        visibleCategories.map((category, index) => {
          const items = productsByType[category.key] ?? [];
          if (!loading && items.length === 0) return null;

          return (
            <Section
              key={category.key}
              id={category.key}
              className={index % 2 === 0 ? "bg-cream-100" : "bg-cream-50"}
            >
              <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
                    {category.label}
                  </h2>
                  <p className="mt-2 text-sm text-ink-soft">{category.blurb}</p>
                </div>
                {!loading && (
                  <span className="rounded-full bg-plum-50 px-4 py-1.5 text-xs font-medium text-plum-700">
                    {items.length} {items.length === 1 ? "producto" : "productos"}
                  </span>
                )}
              </div>

              <List products={items} loading={loading} skeletonCount={4} />
            </Section>
          );
        })
      )}
    </PageShell>
  );
}

export default Productos;
