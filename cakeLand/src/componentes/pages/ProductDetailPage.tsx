import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTriangleExclamation,
  faMinus,
  faPlus,
  faCartShopping,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import { PageShell } from "../ui/Layout";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Feedback";
import { UserContext } from "../contexts/UserContext";
import { CartItem, Product } from "../../types";
import { getProductsByUID, getUserCart, updateUserCart } from "../../services/userQueries";
import { formatPrice } from "../../lib/format";

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const user = userContext?.user;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);

  // NOTE: every hook below must run on every render. The previous version
  // returned early when the context or product was missing and *then* called
  // useEffect, which crashes React with "rendered fewer hooks than expected"
  // as soon as the product resolves.
  useEffect(() => {
    let cancelled = false;
    const loadCart = async () => {
      if (!user?.id) {
        setCart([]);
        return;
      }
      const fetchedCart = await getUserCart(user.id);
      if (!cancelled) setCart(fetchedCart);
    };
    loadCart();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    let cancelled = false;
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);
      try {
        const fetched = await getProductsByUID(productId);
        if (!cancelled) setProduct(fetched);
      } catch (error) {
        console.error("Error fetching product:", error);
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  /**
   * Writes the cart once, on demand. The old code also had an effect that
   * persisted `cart` on every change, which fired with an empty array on mount
   * and raced the initial load.
   */
  const addToCart = async (): Promise<boolean> => {
    if (!user || !product) {
      toast.error("Inicia sesión para agregar productos");
      navigate("/login");
      return false;
    }
    if (quantity < 1) {
      toast.error("La cantidad debe ser al menos 1");
      return false;
    }

    const existingIndex = cart.findIndex((item) => item.product.id === product.id);

    // Build a new array/objects rather than mutating state in place
    const updatedCart: CartItem[] =
      existingIndex > -1
        ? cart.map((item, i) =>
            i === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
          )
        : [...cart, { product, quantity }];

    setSaving(true);
    try {
      await updateUserCart(user.id, updatedCart);
      setCart(updatedCart);
      // Keep the navbar badge in sync
      userContext?.setUser((prev) => (prev ? { ...prev, cart: updatedCart } : prev));
      toast.success("Se agregó al carrito");
      return true;
    } catch {
      toast.error("No pudimos actualizar tu carrito");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const buyNow = async () => {
    const ok = await addToCart();
    // Previously navigated to "/" — buying should land on the cart
    if (ok && user) navigate(`/kart/${user.id}`);
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center gap-3">
          <Spinner />
          <p className="text-ink-soft">Cargando producto…</p>
        </div>
      </PageShell>
    );
  }

  if (!product) {
    return (
      <PageShell>
        <div className="container flex min-h-[50vh] flex-col items-center justify-center text-center">
          <h1 className="font-display text-3xl font-semibold text-ink">Producto no encontrado</h1>
          <p className="mt-3 text-ink-soft">Puede que ya no esté disponible en la carta.</p>
          <Link
            to="/products"
            className="mt-8 rounded-full bg-plum-700 px-6 py-3 text-sm font-medium text-cream-50 hover:bg-plum-800"
          >
            Volver al menú
          </Link>
        </div>
      </PageShell>
    );
  }

  const soldOut = product.disponible === false;
  const images = product.imgurl;

  return (
    <PageShell>
      <Toaster position="bottom-center" />

      <div className="container py-8 md:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Migas de pan" className="mb-8 flex items-center gap-2 text-sm text-ink-muted">
          <Link to="/" className="transition-colors hover:text-plum-700">
            Inicio
          </Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[9px]" />
          <Link to="/products" className="transition-colors hover:text-plum-700">
            Menú
          </Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[9px]" />
          <span className="truncate text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-soft">
              {images.length > 1 ? (
                <Fade arrows={false} duration={4000} transitionDuration={500}>
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="aspect-square w-full bg-cream-100 bg-contain bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${img})` }}
                      role="img"
                      aria-label={`${product.name} — imagen ${index + 1}`}
                    />
                  ))}
                </Fade>
              ) : images.length === 1 ? (
                <img
                  src={images[0]}
                  alt={product.name}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center bg-cream-200 text-ink-muted">
                  Sin imagen
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            {soldOut && (
              <span className="mb-4 inline-block rounded-full bg-ink/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                Agotado
              </span>
            )}

            <h1 className="font-display text-3xl font-semibold leading-tight text-ink md:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <p className="mt-4 font-display text-3xl font-semibold text-plum-700">
              {formatPrice(product.precio)}
            </p>

            {product.numPorciones > 0 && (
              <p className="mt-1 text-sm text-ink-muted">
                Rinde aproximadamente {product.numPorciones} porciones
              </p>
            )}

            <p className="mt-6 leading-relaxed text-ink-soft">{product.descripcion}</p>

            {/* Quantity + actions */}
            <div className="mt-8 rounded-3xl border border-cream-200 bg-white p-5 shadow-soft">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-1 rounded-full border border-cream-300 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Disminuir cantidad"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-plum-700 transition-colors hover:bg-plum-50 disabled:opacity-40"
                  >
                    <FontAwesomeIcon icon={faMinus} className="text-xs" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={quantity}
                    aria-label="Cantidad"
                    onChange={(e) => {
                      // Clamp: the old input defaulted to 0 and let you add
                      // "zero" of a product to the cart.
                      const next = Number(e.target.value);
                      setQuantity(Number.isFinite(next) ? Math.min(99, Math.max(1, next)) : 1);
                    }}
                    className="w-12 border-none bg-transparent text-center text-sm font-semibold text-ink focus:ring-0"
                  />
                  <button
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    aria-label="Aumentar cantidad"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-plum-700 transition-colors hover:bg-plum-50"
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-xs" />
                  </button>
                </div>

                <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                  <Button onClick={buyNow} disabled={saving || soldOut} className="flex-1">
                    Comprar ahora
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={addToCart}
                    disabled={saving || soldOut}
                    className="flex-1"
                  >
                    <FontAwesomeIcon icon={faCartShopping} className="text-xs" />
                    Añadir al carrito
                  </Button>
                </div>
              </div>

              <p className="mt-4 border-t border-cream-200 pt-4 text-sm text-ink-soft">
                Subtotal:{" "}
                <span className="font-semibold text-ink">
                  {formatPrice(product.precio * quantity)}
                </span>
              </p>
            </div>

            {/* Ingredients & allergens */}
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {product.ingredientes.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink">Ingredientes</h2>
                  <ul className="mt-4 space-y-2">
                    {product.ingredientes.map((name, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm text-ink-soft">
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="mt-1 text-[10px] text-plum-500"
                        />
                        {capitalise(name)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.alergenos.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink">Alérgenos</h2>
                  <ul className="mt-4 space-y-2">
                    {product.alergenos.map((name, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm text-ink-soft">
                        <FontAwesomeIcon
                          icon={faTriangleExclamation}
                          className="mt-1 text-[10px] text-gold-500"
                        />
                        {capitalise(name)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default ProductDetailPage;
