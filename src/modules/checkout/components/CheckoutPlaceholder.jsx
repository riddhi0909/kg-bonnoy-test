export function CheckoutPlaceholder() {
  return (
    <div className="prose dark:prose-invert">
      <h1>Checkout</h1>
      <p>
        Wire this page to your WooCommerce checkout mutation or a custom payment
        API. Cart lines are available locally via{" "}
        <code>useCartStore</code> until server cart session is synced.
      </p>
    </div>
  );
}
