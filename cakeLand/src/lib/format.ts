/**
 * Currency helper shared by the catalogue, cart and checkout.
 * Previously each page re-declared its own copy and rendered "12.00$";
 * Ecuador uses USD, so the symbol belongs in front.
 */
const currency = new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatPrice = (amount: number): string =>
  currency.format(Number.isFinite(amount) ? amount : 0);

export const cartSubtotal = (items: { product: { precio: number }; quantity: number }[]): number =>
  items.reduce((total, item) => total + item.product.precio * item.quantity, 0);

export const cartCount = (items: { quantity: number }[]): number =>
  items.reduce((total, item) => total + item.quantity, 0);
