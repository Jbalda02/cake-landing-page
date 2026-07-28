import { FormEvent, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLocationDot, faClock } from "@fortawesome/free-solid-svg-icons";

import { PageShell, Section } from "../ui/Layout";
import { Field } from "../ui/Field";
import { Button } from "../ui/Button";

const channels = [
  {
    icon: faWhatsapp,
    label: "WhatsApp",
    detail: "+593 99 999 9999",
    href: "https://wa.me/593999999999",
    note: "La vía más rápida — respondemos en minutos.",
  },
  {
    icon: faEnvelope,
    label: "Correo",
    detail: "hola@nenecakes.ec",
    href: "mailto:hola@nenecakes.ec",
    note: "Para cotizaciones de eventos y pedidos grandes.",
  },
  {
    icon: faInstagram,
    label: "Instagram",
    detail: "@nenecakes",
    href: "https://www.instagram.com/",
    note: "Mira el trabajo más reciente del taller.",
  },
];

const faqs = [
  {
    q: "¿Con cuánta anticipación debo pedir?",
    a: "Mínimo 24 horas para el menú regular y 72 horas para tortas personalizadas de más de 30 porciones.",
  },
  {
    q: "¿Hacen entregas?",
    a: "Sí, entregamos en todo Guayaquil. El costo de envío se calcula al finalizar el pedido.",
  },
  {
    q: "¿Tienen opciones sin gluten o sin azúcar?",
    a: "Sí. Escríbenos y adaptamos la receta; ten en cuenta que trabajamos en una cocina donde se usa harina de trigo.",
  },
];

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Demo storefront: no backend endpoint is wired up for this form.
    // Capture the form now — currentTarget is null once the handler returns.
    const form = e.currentTarget;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      form.reset();
      toast.success("¡Gracias! Te responderemos muy pronto.");
    }, 600);
  };

  return (
    <PageShell>
      <Toaster position="bottom-center" />

      {/* Header */}
      <div className="bg-plum-sheen">
        <div className="container py-14 text-center md:py-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
            Estamos para ayudarte
          </p>
          <h1 className="font-display text-4xl font-semibold text-cream-50 md:text-5xl">
            Contacto
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-plum-200">
            Cuéntanos qué celebras y te ayudamos a diseñar el postre. Respondemos todos los días
            entre 9:00 y 19:00.
          </p>
        </div>
      </div>

      {/* Channels */}
      <Section className="bg-cream-50 !py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-3xl border border-cream-200 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-plum-200 hover:shadow-lift"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-plum-50 text-plum-700 transition-colors group-hover:bg-plum-700 group-hover:text-cream-50">
                <FontAwesomeIcon icon={c.icon} className="text-lg" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-ink">{c.label}</h2>
              <p className="mt-1 font-medium text-plum-700">{c.detail}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.note}</p>
            </a>
          ))}
        </div>
      </Section>

      {/* Form + info */}
      <Section className="bg-cream-100">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="rounded-3xl border border-cream-200 bg-white p-6 shadow-soft md:p-9">
            <h2 className="font-display text-2xl font-semibold text-ink">Escríbenos</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Completa el formulario y te contactamos con una propuesta.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nombre" name="name" placeholder="Tu nombre" required />
                <Field label="Teléfono" name="phone" type="tel" placeholder="0999999999" required />
              </div>
              <Field
                label="Correo electrónico"
                name="email"
                type="email"
                placeholder="tu@correo.com"
                required
              />
              <Field label="Ocasión" name="occasion" placeholder="Cumpleaños, boda, empresa…" />

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block text-sm font-medium text-ink-soft"
                >
                  Cuéntanos más
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Número de porciones, sabores, fecha de entrega…"
                  className="w-full resize-y rounded-xl border border-cream-300 bg-white px-4 py-3 text-ink placeholder:text-ink-muted transition-colors hover:border-cream-400 focus:border-plum-500"
                />
              </div>

              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
                {submitting ? "Enviando…" : "Enviar mensaje"}
              </Button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl bg-plum-900 p-7 text-cream-100">
              <h2 className="font-display text-2xl font-semibold text-cream-50">El taller</h2>
              <div className="mt-6 space-y-5 text-sm">
                <p className="flex gap-3">
                  <FontAwesomeIcon icon={faLocationDot} className="mt-1 w-4 shrink-0 text-gold-400" />
                  <span className="text-plum-200">
                    Vía a la Costa, Puerto Azul
                    <br />
                    Guayaquil, Guayas — Ecuador
                  </span>
                </p>
                <p className="flex gap-3">
                  <FontAwesomeIcon icon={faClock} className="mt-1 w-4 shrink-0 text-gold-400" />
                  <span className="text-plum-200">
                    Lunes a sábado · 9:00 — 19:00
                    <br />
                    Domingos solo entregas programadas
                  </span>
                </p>
              </div>
              <p className="mt-6 border-t border-plum-700 pt-5 text-xs text-plum-300">
                Atendemos únicamente con cita previa: somos un taller, no una tienda de paso.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">Preguntas frecuentes</h2>
              <dl className="mt-5 space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.q} className="rounded-2xl border border-cream-200 bg-white p-5">
                    <dt className="text-sm font-semibold text-ink">{faq.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-ink-soft">{faq.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
