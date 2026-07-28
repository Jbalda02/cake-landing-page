import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWheatAwn,
  faTruckFast,
  faHeart,
  faArrowRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

// The source hero is 8000×4179 (1.8 MB). These pre-scaled variants cut it to
// ~59 kB on a desktop viewport; the browser picks the smallest that fits.
import heroWebp1920 from "./assets/cakeHero-1920.webp";
import heroWebp1280 from "./assets/cakeHero-1280.webp";
import heroWebp768 from "./assets/cakeHero-768.webp";
import heroJpg1920 from "./assets/cakeHero-1920.jpg";
import heroJpg1280 from "./assets/cakeHero-1280.jpg";
import heroJpg768 from "./assets/cakeHero-768.jpg";
import List from "./componentes/pageComponents/List";
import { PageShell, Section, SectionHeading } from "./componentes/ui/Layout";
import { ButtonLink } from "./componentes/ui/Button";
import { Product } from "./types";
import { getProductsByStarred } from "./services/userQueries";

const features = [
  {
    icon: faWheatAwn,
    title: "Ingredientes reales",
    body: "Mantequilla, chocolate belga y fruta de temporada. Nada de mezclas industriales ni conservantes.",
  },
  {
    icon: faHeart,
    title: "Hecho a tu medida",
    body: "Sabores, rellenos y decoración a pedido. Cuéntanos la ocasión y lo diseñamos contigo.",
  },
  {
    icon: faTruckFast,
    title: "Entrega el mismo día",
    body: "Horneamos la madrugada de la entrega y llevamos tu pedido a cualquier punto de Guayaquil.",
  },
];

const steps = [
  { n: "01", title: "Elige tu postre", body: "Explora el menú o pídenos un diseño desde cero." },
  { n: "02", title: "Personalízalo", body: "Define porciones, sabor y decoración para la ocasión." },
  { n: "03", title: "Recíbelo fresco", body: "Coordinamos fecha y hora, y lo entregamos recién hecho." },
];

function Main() {
  const [starredProducts, setStarredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      const products = await getProductsByStarred(true);
      // Guard against setting state after unmount (StrictMode double-invokes)
      if (cancelled) return;
      setStarredProducts(products);
      setLoading(false);
    };

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageShell>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative isolate flex min-h-[560px] items-center overflow-hidden md:min-h-[680px]">
        <picture>
          <source
            type="image/webp"
            srcSet={`${heroWebp768} 768w, ${heroWebp1280} 1280w, ${heroWebp1920} 1920w`}
            sizes="100vw"
          />
          <img
            src={heroJpg1280}
            srcSet={`${heroJpg768} 768w, ${heroJpg1280} 1280w, ${heroJpg1920} 1920w`}
            sizes="100vw"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
        </picture>
        {/* Scrim: the old hero put gray-700 text straight onto the photo,
            which was unreadable over the lighter areas of the image. */}
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-plum-950/90 via-plum-950/70 to-plum-950/30 md:from-plum-950/85 md:via-plum-950/55 md:to-transparent"
          aria-hidden="true"
        />

        <div className="container py-20">
          <div className="max-w-xl animate-fade-up">
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
              <FontAwesomeIcon icon={faStar} className="text-[10px]" />
              Repostería artesanal · Guayaquil
            </p>

            <h1 className="font-display text-4xl font-semibold leading-[1.1] text-cream-50 sm:text-5xl lg:text-6xl">
              Postres que se recuerdan
              <span className="block text-gold-300">mucho después de la última porción</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-cream-200 sm:text-lg">
              Descubre nuestra selección más fina de tortas, pies y postres fríos hechos a medida
              para tu celebración.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/products" size="lg" className="bg-gold-400 text-plum-950 hover:bg-gold-300">
                Ver el menú
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </ButtonLink>
              <ButtonLink
                to="/contact"
                size="lg"
                variant="secondary"
                className="border-cream-200/40 bg-white/10 text-cream-50 backdrop-blur-sm hover:border-cream-100 hover:bg-white/20"
              >
                Encargar a medida
              </ButtonLink>
            </div>

            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-cream-100/20 pt-6">
              {[
                { k: "+300", v: "pedidos entregados" },
                { k: "24 h", v: "de anticipación" },
                { k: "100 %", v: "hecho a mano" },
              ].map((stat) => (
                <div key={stat.v}>
                  <dt className="font-display text-2xl font-semibold text-gold-300">{stat.k}</dt>
                  <dd className="text-xs uppercase tracking-wider text-cream-200/80">{stat.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Features */}
      <Section className="bg-cream-50">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-cream-200 bg-white p-7 shadow-soft transition-shadow hover:shadow-lift"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-plum-50 text-plum-700">
                <FontAwesomeIcon icon={f.icon} className="text-lg" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------------- Starred products */}
      <Section className="bg-plum-sheen">
        <SectionHeading
          eyebrow="Los favoritos de la casa"
          title="Nuestros productos estrella"
          subtitle="Las recetas que nuestros clientes vuelven a pedir una y otra vez."
          tone="light"
        />

        <div className="mt-12">
          <List products={starredProducts} loading={loading} />

          {!loading && starredProducts.length === 0 && (
            <p className="text-center text-sm text-plum-200">
              Aún no hay destacados publicados. Revisa el menú completo para ver todo lo que
              horneamos.
            </p>
          )}
        </div>

        <div className="mt-14 text-center">
          <ButtonLink to="/products" size="lg" className="bg-gold-400 text-plum-950 hover:bg-gold-300">
            Menú completo
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </ButtonLink>
        </div>
      </Section>

      {/* ------------------------------------------------------------- Process */}
      <Section className="bg-cream-100">
        <SectionHeading
          eyebrow="Cómo funciona"
          title="Tu pedido en tres pasos"
          subtitle="Sin formularios interminables. Nos cuentas qué celebras y nosotros nos encargamos del resto."
        />

        <ol className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n} className="relative rounded-3xl bg-white p-8 shadow-soft">
              <span className="font-display text-5xl font-semibold text-cream-300">{step.n}</span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ----------------------------------------------------------- CTA band */}
      <section className="bg-blush-100">
        <div className="container py-16 md:py-20">
          <div className="flex flex-col items-center gap-8 rounded-4xl bg-plum-900 px-8 py-14 text-center md:px-16">
            <SectionHeading
              eyebrow="¿Tienes algo en mente?"
              title="Diseñemos tu torta juntos"
              subtitle="Escríbenos por WhatsApp y recibe una propuesta con boceto y precio el mismo día."
              tone="light"
            />
            <ButtonLink
              to="/contact"
              size="lg"
              className="bg-gold-400 text-plum-950 hover:bg-gold-300"
            >
              Hablar con nosotros
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export default Main;
