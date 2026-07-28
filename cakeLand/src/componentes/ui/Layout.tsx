import { ReactNode } from "react";
import NavBar from "../pageComponents/Navbar";
import Footer from "../pageComponents/Footer";

/**
 * Page shell. Every route previously repeated the navbar/footer wiring and
 * each one got the flex column slightly wrong, which is why the footer used to
 * float mid-page on short routes.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream-100">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="container">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "dark",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  tone?: "dark" | "light";
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  const titleColor = tone === "light" ? "text-cream-50" : "text-ink";
  const subColor = tone === "light" ? "text-plum-200" : "text-ink-soft";
  const eyebrowColor = tone === "light" ? "text-gold-300" : "text-plum-600";

  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${eyebrowColor}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`text-3xl font-semibold md:text-4xl lg:text-5xl ${titleColor}`}>{title}</h2>
      {subtitle && <p className={`mt-4 text-base leading-relaxed md:text-lg ${subColor}`}>{subtitle}</p>}
    </div>
  );
}
