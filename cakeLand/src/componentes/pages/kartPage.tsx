import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCartShopping, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";

import { PageShell } from "../ui/Layout";
import { Button, ButtonLink } from "../ui/Button";
import { EmptyState, Spinner } from "../ui/Feedback";
import { UserContext } from "../contexts/UserContext";
import { getUserCart, updateUserCart } from "../../services/userQueries";
import { CartItem } from "../../types";
import { cartSubtotal, formatPrice } from "../../lib/format";

const DELIVERY_FEE = 3.5;

export default function CartPage() {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadCart = async () => {
      if (!user?.id) {
        // Auth is still resolving on first paint; stop the spinner either way
        if (!cancelled) setLoading(false);
        return;
      }
      const userCart = await getUserCart(user.id);
      if (!cancelled) {
        setCart(userCart);
        setLoading(false);
      }
    };

    loadCart();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  /** Persists a new cart and mirrors it into context so the navbar badge follows. */
  const persist = async (updated: CartItem[]) => {
    if (!user?.id) return;
    setCart(updated);
    userContext?.setUser((prev) => (prev ? { ...prev, cart: updated } : prev));
    try {
      await updateUserCart(user.id, updated);
    } catch {
      toast.error("No pudimos guardar los cambios");
    }
  };

  const removeItem = async (productId: string) => {
    setBusyId(productId);
    // Removing an item used to navigate straight to checkout — it now just
    // updates the cart and stays put.
    await persist(cart.filter((item) => item.product.id !== productId));
    setBusyId(null);
    toast.success("Producto eliminado");
  };

  const changeQuantity = async (productId: string, delta: number) => {
    const updated = cart.map((item) =>
      item.product.id === productId
        ? { ...item, quantity: Math.min(99, Math.max(1, item.quantity + delta)) }
        : item
    );
    await persist(updated);
  };

  // Subtotal is derived from the cart being rendered. The old page summed
  // `user.cart` from context, so the total disagreed with the rows on screen.
  const subtotal = cartSubtotal(cart);
  const total = subtotal + (cart.length > 0 ? DELIVERY_FEE : 0);

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center gap-3">
          <Spinner />
          <p className="text-ink-soft">Cargando tu carrito…</p>
        </div>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <div className="container py-20">
          <EmptyState
            icon={<FontAwesomeIcon icon={faCartShopping} />}
            title="Inicia sesión para ver tu carrito"
            description="Guardamos tus productos para que puedas retomar el pedido cuando quieras."
            action={<ButtonLink to="/login">Ingresar</ButtonLink>}
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
          <p className="text-sm text-ink-muted">Hola, {user.firstName || "invitado"}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink md:text-4xl">
            Tu carrito
          </h1>
        </header>

        {cart.length === 0 ? (
          <EmptyState
            icon={<FontAwesomeIcon icon={faCartShopping} />}
            title="Tu carrito está vacío"
            description="Explora el menú y agrega tu primer postre."
            action={<ButtonLink to="/products">Ver el menú</ButtonLink>}
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Items */}
            <ul className="space-y-4">
              {cart.map((item) => (
                <li
                  key={item.product.id}
                  className="flex gap-4 rounded-3xl border border-cream-200 bg-white p-4 shadow-soft sm:p-5"
                >
                  <Link
                    to={`/products/${item.product.id}`}
                    className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-cream-200 sm:h-28 sm:w-28"
                  >
                    {item.product.imgurl?.[0] ? (
                      <img
                        src={item.product.imgurl[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={`/products/${item.product.id}`}
                          className="font-display text-lg font-semibold text-ink hover:text-plum-700"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-0.5 text-sm text-ink-muted">
                          {formatPrice(item.product.precio)} c/u
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        disabled={busyId === item.product.id}
                        aria-label={`Eliminar ${item.product.name}`}
                        className="shrink-0 rounded-full p-2 text-ink-muted transition-colors hover:bg-blush-100 hover:text-blush-500 disabled:opacity-40"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1 rounded-full border border-cream-300 p-0.5">
                        <button
                          onClick={() => changeQuantity(item.product.id, -1)}
                          disabled={item.quantity <= 1}
                          aria-label="Disminuir cantidad"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-plum-700 hover:bg-plum-50 disabled:opacity-40"
                        >
                          <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => changeQuantity(item.product.id, 1)}
                          aria-label="Aumentar cantidad"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-plum-700 hover:bg-plum-50"
                        >
                          <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                        </button>
                      </div>

                      <span className="font-semibold text-ink">
                        {formatPrice(item.product.precio * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl border border-cream-200 bg-white p-6 shadow-soft">
                <h2 className="font-display text-xl font-semibold text-ink">Resumen</h2>

                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between text-ink-soft">
                    <dt>Subtotal</dt>
                    <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-ink-soft">
                    <dt>Envío</dt>
                    <dd className="font-medium text-ink">{formatPrice(DELIVERY_FEE)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-cream-200 pt-3 text-base">
                    <dt className="font-semibold text-ink">Total</dt>
                    <dd className="font-display text-xl font-semibold text-plum-700">
                      {formatPrice(total)}
                    </dd>
                  </div>
                </dl>

                <Button
                  className="mt-6 w-full"
                  size="lg"
                  onClick={() => navigate(`/checkout/${user.id}`)}
                >
                  Proceder al pago
                </Button>

                <Link
                  to="/products"
                  className="mt-4 block text-center text-sm text-plum-700 hover:underline"
                >
                  Seguir comprando
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </PageShell>
  );
}
