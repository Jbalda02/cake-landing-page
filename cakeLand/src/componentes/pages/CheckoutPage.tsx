import { FormEvent, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faCreditCard,
  faCircleInfo,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";

import { PageShell } from "../ui/Layout";
import { Button, ButtonLink } from "../ui/Button";
import { Field } from "../ui/Field";
import { EmptyState, Spinner } from "../ui/Feedback";
import { UserContext } from "../contexts/UserContext";
import { getUserCart } from "../../services/userQueries";
import { CartItem } from "../../types";
import { cartSubtotal, formatPrice } from "../../lib/format";

const DELIVERY_FEE = 3.5;

const PAYMENT_METHODS = [
  { value: "bankTransfer", label: "Transferencia bancaria", icon: faBuildingColumns },
  { value: "paypal", label: "PayPal", icon: faPaypal },
  { value: "card", label: "Tarjeta de crédito", icon: faCreditCard },
] as const;

type PaymentMethod = (typeof PAYMENT_METHODS)[number]["value"];

/**
 * Demo payment details only.
 * The previous version shipped a real bank account number and a real national
 * ID for a named individual. Those have been replaced with placeholders.
 */
const PAYMENT_INSTRUCTIONS: Record<PaymentMethod, string[]> = {
  bankTransfer: [
    "Transfiere el total a: Banco Demo · Cuenta de ahorros N.º 000-000-0000",
    "Titular: Nene Cakes S.A. (tienda ficticia)",
    "Envía el comprobante por WhatsApp para confirmar tu pedido.",
  ],
  paypal: [
    "Ingresa a tu cuenta de PayPal.",
    "Envía el total a pagos@nenecakes.ec (dirección de ejemplo).",
    "Adjunta el número de orden en la nota del pago.",
  ],
  card: [
    "Ingresa los datos de tu tarjeta en la pasarela segura.",
    "Recibirás un correo con el comprobante de la transacción.",
  ],
};

export default function CheckoutPage() {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!user?.id) {
        if (!cancelled) setLoading(false);
        return;
      }
      const userCart = await getUserCart(user.id);
      if (!cancelled) {
        setCart(userCart);
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const subtotal = cartSubtotal(cart);
  const total = subtotal + (cart.length > 0 ? DELIVERY_FEE : 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) {
      toast.error("Selecciona un método de pago");
      return;
    }
    // No real payment processor is wired up — this is a demo storefront.
    toast.success("¡Pedido registrado! Te contactaremos para confirmar.");
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center gap-3">
          <Spinner />
          <p className="text-ink-soft">Preparando tu pedido…</p>
        </div>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <div className="container py-20">
          <EmptyState
            title="Inicia sesión para continuar"
            description="Necesitamos tus datos para coordinar la entrega."
            action={<ButtonLink to="/login">Ingresar</ButtonLink>}
          />
        </div>
      </PageShell>
    );
  }

  if (cart.length === 0) {
    return (
      <PageShell>
        <div className="container py-20">
          <EmptyState
            title="No hay nada que pagar"
            description="Agrega productos a tu carrito antes de ir al checkout."
            action={<ButtonLink to="/products">Ver el menú</ButtonLink>}
          />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Toaster position="bottom-center" />

      <div className="container py-12 md:py-16">
        <header className="mb-10">
          <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">Finalizar pedido</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Revisa tus datos y elige cómo quieres pagar.
          </p>
        </header>

        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-gold-300 bg-gold-300/15 p-4 text-sm text-ink-soft">
          <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5 text-gold-500" />
          <p>
            <strong className="text-ink">Tienda de demostración.</strong> No se procesan pagos
            reales y los datos bancarios mostrados son de ejemplo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            {/* Personal details */}
            <fieldset className="rounded-3xl border border-cream-200 bg-white p-6 shadow-soft md:p-8">
              <legend className="px-2 font-display text-xl font-semibold text-ink">
                Datos personales
              </legend>

              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <Field
                  label="Nombre completo"
                  name="fullName"
                  defaultValue={`${user.firstName} ${user.lastName}`.trim()}
                  required
                />
                <Field label="Correo electrónico" name="email" type="email" defaultValue={user.email} required />
                <Field
                  label="Teléfono"
                  name="phone"
                  type="tel"
                  defaultValue={user.phone}
                  placeholder="+593 99 999 9999"
                  required
                  className="sm:col-span-2"
                />
              </div>
            </fieldset>

            {/* Address */}
            <fieldset className="rounded-3xl border border-cream-200 bg-white p-6 shadow-soft md:p-8">
              <legend className="px-2 font-display text-xl font-semibold text-ink">
                Dirección de entrega
              </legend>

              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <Field label="Provincia" name="state" defaultValue="Guayas" required />
                <Field label="Ciudad" name="city" defaultValue="Guayaquil" required />
                <Field label="Vía principal" name="street1" required />
                <Field label="Vía secundaria" name="street2" />
                <Field label="Número / villa" name="number" required />
                <Field label="Referencia" name="reference" placeholder="Casa esquinera, portón blanco" />
              </div>
            </fieldset>

            {/* Payment */}
            <fieldset className="rounded-3xl border border-cream-200 bg-white p-6 shadow-soft md:p-8">
              <legend className="px-2 font-display text-xl font-semibold text-ink">
                Método de pago
              </legend>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {PAYMENT_METHODS.map((method) => {
                  const selected = paymentMethod === method.value;
                  return (
                    <label
                      key={method.value}
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all ${
                        selected
                          ? "border-plum-600 bg-plum-50 text-plum-800"
                          : "border-cream-200 text-ink-soft hover:border-plum-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={selected}
                        // toast used to fire during render here, which is a
                        // side effect in the render phase; it belongs in the handler.
                        onChange={() => setPaymentMethod(method.value)}
                        className="sr-only"
                      />
                      <FontAwesomeIcon icon={method.icon} className="text-xl" />
                      <span className="text-xs font-medium">{method.label}</span>
                    </label>
                  );
                })}
              </div>

              {paymentMethod && (
                <div className="mt-6 rounded-2xl bg-cream-100 p-5">
                  <h3 className="text-sm font-semibold text-ink">Instrucciones</h3>
                  <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-ink-soft">
                    {PAYMENT_INSTRUCTIONS[paymentMethod].map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ol>
                </div>
              )}
            </fieldset>
          </div>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-cream-200 bg-white p-6 shadow-soft">
              <h2 className="font-display text-xl font-semibold text-ink">Tu pedido</h2>

              <ul className="mt-5 space-y-3 border-b border-cream-200 pb-5">
                {cart.map((item) => (
                  <li key={item.product.id} className="flex justify-between gap-3 text-sm">
                    <span className="min-w-0 text-ink-soft">
                      <span className="font-medium text-ink">{item.quantity}×</span>{" "}
                      {item.product.name}
                    </span>
                    <span className="shrink-0 font-medium text-ink">
                      {formatPrice(item.product.precio * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-ink-soft">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <dt>Envío</dt>
                  <dd className="font-medium text-ink">{formatPrice(DELIVERY_FEE)}</dd>
                </div>
                <div className="flex justify-between border-t border-cream-200 pt-3">
                  <dt className="font-semibold text-ink">Total</dt>
                  <dd className="font-display text-xl font-semibold text-plum-700">
                    {formatPrice(total)}
                  </dd>
                </div>
              </dl>

              <Button type="submit" size="lg" className="mt-6 w-full">
                <FontAwesomeIcon icon={faLock} className="text-xs" />
                Confirmar pedido
              </Button>

              <button
                type="button"
                onClick={() => navigate(`/kart/${user.id}`)}
                className="mt-4 w-full text-center text-sm text-plum-700 hover:underline"
              >
                Volver al carrito
              </button>

              <p className="mt-5 text-center text-xs text-ink-muted">
                Al confirmar aceptas nuestros{" "}
                <Link to="/contact" className="underline hover:text-plum-700">
                  términos de pedido
                </Link>
                .
              </p>
            </div>
          </aside>
        </form>
      </div>
    </PageShell>
  );
}
