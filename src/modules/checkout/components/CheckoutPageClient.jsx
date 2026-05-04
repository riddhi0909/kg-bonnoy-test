"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client/react";
import { productsPath } from "@/constants/routes";
import { useCurrency } from "@/modules/common/providers/currency-context";
import { useCart } from "@/modules/cart/hooks/useCart";
import { parsePrice } from "@/modules/product/utils/parse-price";
import { GET_CHECKOUT_DATA } from "@/modules/checkout/api/queries";
import {
  ADD_CART_ITEMS,
  CHECKOUT_ORDER,
  EMPTY_CART,
  UPDATE_SHIPPING_METHOD,
} from "@/modules/checkout/api/mutations";
import { validateCheckoutForm } from "@/modules/checkout/utils/checkout-validation";

/**
 * @param {{ locale: string }} props
 */
export function CheckoutPageClient({ locale }) {
  const { lines, clear } = useCart();
  const { format } = useCurrency();
  const [form, setForm] = useState({
    billingFirstName: "",
    billingLastName: "",
    billingCompany: "",
    billingCountry: "FR",
    billingAddress1: "",
    billingAddress2: "",
    billingCity: "",
    billingState: "",
    billingPostcode: "",
    billingEmail: "",
    billingPhone: "",
    shippingFirstName: "",
    shippingLastName: "",
    shippingCompany: "",
    shippingCountry: "FR",
    shippingAddress1: "",
    shippingAddress2: "",
    shippingCity: "",
    shippingState: "",
    shippingPostcode: "",
  });
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});
  const [checkoutError, setCheckoutError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [syncingRemoteCart, setSyncingRemoteCart] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  function toCountryEnum(code) {
    const v = String(code || "").toUpperCase();
    return /^[A-Z]{2}$/.test(v) ? v : "FR";
  }

  function formatVariationLabel(name) {
    return String(name ?? "")
      .replace(/^pa_/i, "")
      .replace(/[_-]+/g, " ")
      .trim();
  }

  const { data, loading, refetch } = useQuery(GET_CHECKOUT_DATA, {
    fetchPolicy: "network-only",
    errorPolicy: "all",
    variables: {
      billingCountry: toCountryEnum(form.billingCountry),
      shippingCountry: toCountryEnum(
        shipToDifferentAddress ? form.shippingCountry : form.billingCountry,
      ),
    },
  });
  const [emptyCartRemote] = useMutation(EMPTY_CART);
  const [addCartItems] = useMutation(ADD_CART_ITEMS);
  const [updateShippingMethod] = useMutation(UPDATE_SHIPPING_METHOD);
  const [checkoutOrder] = useMutation(CHECKOUT_ORDER);

  const remoteCart = data?.cart ?? null;
  const remoteContents = remoteCart?.contents?.nodes ?? [];
  const hasRemoteItems = remoteContents.length > 0;
  const localSubtotal = useMemo(
    () =>
      lines.reduce((sum, line) => {
        const unit = Number(line?.unitPriceBase);
        const qty = Number(line?.qty);
        if (!Number.isFinite(unit) || !Number.isFinite(qty) || qty <= 0) return sum;
        return sum + unit * qty;
      }, 0),
    [lines],
  );
  const displaySubtotal = hasRemoteItems
    ? parsePrice(remoteCart?.subtotal || "0")
    : localSubtotal;
  const displayShipping = hasRemoteItems
    ? parsePrice(remoteCart?.shippingTotal || "0")
    : 0;
  const displayTotal = hasRemoteItems
    ? parsePrice(remoteCart?.total || "0")
    : localSubtotal;

  const shippingRates = useMemo(() => {
    const packs = data?.cart?.availableShippingMethods ?? [];
    return packs
      .flatMap((p) => p?.rates ?? [])
      .map((rate) => ({
        ...rate,
        value:
          rate?.methodId && Number.isFinite(rate?.instanceId)
            ? `${rate.methodId}:${rate.instanceId}`
            : rate?.methodId || "",
      }))
      .filter((rate) => rate.value);
  }, [data]);

  useEffect(() => {
    const chosen = remoteCart?.chosenShippingMethods?.[0] || "";
    if (chosen && shippingRates.some((r) => r.value === chosen)) {
      setSelectedShippingMethod(chosen);
      return;
    }
    if (!selectedShippingMethod && shippingRates[0]?.value) {
      setSelectedShippingMethod(shippingRates[0].value);
    }
  }, [remoteCart?.chosenShippingMethods, shippingRates, selectedShippingMethod]);

  const paymentMethods = useMemo(() => {
    return data?.paymentGateways?.nodes ?? [];
  }, [data]);

  const countryOptions = useMemo(() => {
    const codes = data?.countries ?? [];
    let display = null;
    try {
      display = new Intl.DisplayNames([locale === "fr" ? "fr" : "en"], {
        type: "region",
      });
    } catch {
      display = null;
    }
    return codes.map((code) => ({
      code,
      name: display?.of(code) || code,
    }));
  }, [data, locale]);

  const billingStates = data?.billingStates ?? [];
  const shippingStates = data?.shippingStates ?? [];

  useEffect(() => {
    if (selectedPaymentMethod || paymentMethods.length === 0) return;
    const first = paymentMethods[0]?.id;
    if (first) setSelectedPaymentMethod(first);
  }, [paymentMethods, selectedPaymentMethod]);

  function onFieldChange(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function inferDatabaseId(line) {
    if (Number.isFinite(line.databaseId)) return Number(line.databaseId);
    if (typeof line.id === "string" && /^\d+$/.test(line.id)) {
      return Number(line.id);
    }
    if (typeof line.id === "string") {
      try {
        const decoded = atob(line.id);
        const match = decoded.match(/:(\d+)$/);
        if (match?.[1]) return Number(match[1]);
      } catch {
        return null;
      }
    }
    return null;
  }

  const syncLocalLinesToWooCart = useCallback(async () => {
    const items = lines
      .map((line) => {
        const variationId = Number(line?.variationId);
        const hasVariationId = Number.isInteger(variationId) && variationId > 0;
        const variation = Array.isArray(line?.variation)
          ? line.variation
              .map((attr) => ({
                attributeName: String(attr?.attributeName ?? "").trim(),
                attributeValue: String(attr?.attributeValue ?? "").trim(),
              }))
              .filter((attr) => attr.attributeName && attr.attributeValue)
          : [];
        return {
          productId: inferDatabaseId(line),
          quantity: line.qty,
          variationId: hasVariationId ? variationId : undefined,
          variation: variation.length > 0 ? variation : undefined,
        };
      })
      .filter((line) => Number.isFinite(line.productId));

    if (!items.length) return;

    try {
      await emptyCartRemote();
    } catch (err) {
      const msg = String(err?.message || "");
      // WooGraphQL may throw "Cart is empty" for emptyCart; safe to continue.
      if (!msg.toLowerCase().includes("cart is empty")) {
        throw err;
      }
    }
    await addCartItems({ variables: { items } });
  }, [lines, emptyCartRemote, addCartItems]);

  useEffect(() => {
    if (hasRemoteItems || !lines.length || syncingRemoteCart) return;
    let active = true;
    (async () => {
      setSyncingRemoteCart(true);
      try {
        await syncLocalLinesToWooCart();
        await refetch();
      } catch (err) {
        if (active) {
          setCheckoutError(
            err?.message || "Impossible de synchroniser le panier WooCommerce",
          );
        }
      } finally {
        if (active) setSyncingRemoteCart(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [hasRemoteItems, lines, syncingRemoteCart, refetch, syncLocalLinesToWooCart]);

  async function onRefreshShipping() {
    setCheckoutError("");
    try {
      setSyncingRemoteCart(true);
      await syncLocalLinesToWooCart();
      await refetch();
    } catch (err) {
      setCheckoutError(err?.message || "Impossible de mettre à jour les méthodes de livraison");
    } finally {
      setSyncingRemoteCart(false);
    }
  }

  async function onPlaceOrder(e) {
    e.preventDefault();
    if (!lines.length && !hasRemoteItems) return;
    setCheckoutError("");
    const nextErrors = validateCheckoutForm(form, shipToDifferentAddress);
    if (!selectedPaymentMethod || paymentMethods.length === 0) {
      nextErrors.paymentMethod = "Sélectionnez un mode de paiement";
    }
    if (shippingRates.length > 0 && !selectedShippingMethod) {
      nextErrors.shippingMethod = "Sélectionnez une méthode de livraison";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setPlacing(true);
    try {
      setSyncingRemoteCart(true);
      await syncLocalLinesToWooCart();
      const latest = await refetch();
      const latestRates =
        latest?.data?.cart?.availableShippingMethods
          ?.flatMap((p) => p?.rates ?? [])
          .map((rate) =>
            rate?.methodId && Number.isFinite(rate?.instanceId)
              ? `${rate.methodId}:${rate.instanceId}`
              : rate?.methodId || "",
          )
          .filter(Boolean) ?? [];

      const shippingToSend = selectedShippingMethod || latestRates[0] || "";
      if (shippingToSend) {
        await updateShippingMethod({
          variables: { shippingMethods: [shippingToSend] },
        });
      }

      const billing = {
        firstName: form.billingFirstName,
        lastName: form.billingLastName,
        company: form.billingCompany || "",
        country: form.billingCountry,
        address1: form.billingAddress1,
        address2: form.billingAddress2 || "",
        city: form.billingCity,
        state: form.billingState || "",
        postcode: form.billingPostcode,
        email: form.billingEmail,
        phone: form.billingPhone,
      };
      const shipping = shipToDifferentAddress
        ? {
            firstName: form.shippingFirstName,
            lastName: form.shippingLastName,
            company: form.shippingCompany || "",
            country: form.shippingCountry,
            address1: form.shippingAddress1,
            address2: form.shippingAddress2 || "",
            city: form.shippingCity,
            state: form.shippingState || "",
            postcode: form.shippingPostcode,
          }
        : {
            firstName: form.billingFirstName,
            lastName: form.billingLastName,
            company: form.billingCompany || "",
            country: form.billingCountry,
            address1: form.billingAddress1,
            address2: form.billingAddress2 || "",
            city: form.billingCity,
            state: form.billingState || "",
            postcode: form.billingPostcode,
          };

      const { data: checkoutRes } = await checkoutOrder({
        variables: {
          input: {
            paymentMethod: selectedPaymentMethod,
            shippingMethod: shippingToSend ? [shippingToSend] : [],
            shipToDifferentAddress,
            billing,
            shipping,
          },
        },
      });

      if (!checkoutRes?.checkout?.order?.id) {
        throw new Error("Le paiement WooCommerce a échoué");
      }
      setOrderResult(checkoutRes.checkout.order);
      clear();
      setPlaced(true);
    } catch (err) {
      setCheckoutError(err?.message || "Impossible de passer la commande");
    } finally {
      setSyncingRemoteCart(false);
      setPlacing(false);
    }
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-bold">Commande confirmée</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Merci. Votre commande a bien été reçue.
        </p>
        {orderResult?.orderNumber ? (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Commande n°{orderResult.orderNumber}
          </p>
        ) : null}
        <Link
          href={productsPath(locale)}
          className="mt-6 inline-flex rounded bg-zinc-900 px-5 py-2.5 text-white"
        >
          Continuer mes achats
        </Link>
      </div>
    );
  }

  if (!hasRemoteItems && !syncingRemoteCart && !lines.length) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-bold">Paiement</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Votre panier est vide.
        </p>
        <Link
          href={productsPath(locale)}
          className="mt-6 inline-flex rounded bg-zinc-900 px-5 py-2.5 text-white"
        >
          Voir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <form
        onSubmit={onPlaceOrder}
        className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <h1 className="text-2xl font-bold">Paiement</h1>
        {checkoutError ? (
          <p className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {checkoutError}
          </p>
        ) : null}
        {Object.keys(errors).length > 0 ? (
          <p className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Veuillez compléter tous les champs obligatoires.
          </p>
        ) : null}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input value={form.billingFirstName} onChange={(e) => onFieldChange("billingFirstName", e.target.value)} placeholder="Prénom" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
          <input value={form.billingLastName} onChange={(e) => onFieldChange("billingLastName", e.target.value)} placeholder="Nom" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
          <input value={form.billingEmail} onChange={(e) => onFieldChange("billingEmail", e.target.value)} type="email" placeholder="E-mail" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900 sm:col-span-2" />
          <input value={form.billingPhone} onChange={(e) => onFieldChange("billingPhone", e.target.value)} placeholder="Téléphone" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900 sm:col-span-2" />
          <input value={form.billingAddress1} onChange={(e) => onFieldChange("billingAddress1", e.target.value)} placeholder="Adresse ligne 1" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900 sm:col-span-2" />
          <input value={form.billingAddress2} onChange={(e) => onFieldChange("billingAddress2", e.target.value)} placeholder="Adresse ligne 2" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900 sm:col-span-2" />
          <input value={form.billingCity} onChange={(e) => onFieldChange("billingCity", e.target.value)} placeholder="Ville" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
          <input value={form.billingPostcode} onChange={(e) => onFieldChange("billingPostcode", e.target.value)} placeholder="Code postal" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
          {billingStates.length > 0 ? (
            <select
              value={form.billingState}
              onChange={(e) => onFieldChange("billingState", e.target.value)}
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="">Région / Département</option>
              {billingStates.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={form.billingState}
              onChange={(e) => onFieldChange("billingState", e.target.value)}
              placeholder="Région / Département"
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          )}
          <select
            value={form.billingCountry}
            onChange={(e) => onFieldChange("billingCountry", e.target.value)}
            className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {countryOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <label className="mt-5 inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={shipToDifferentAddress}
            onChange={(e) => setShipToDifferentAddress(e.target.checked)}
          />
          Livrer à une adresse différente
        </label>

        {shipToDifferentAddress ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input value={form.shippingFirstName} onChange={(e) => onFieldChange("shippingFirstName", e.target.value)} placeholder="Prénom livraison" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
            <input value={form.shippingLastName} onChange={(e) => onFieldChange("shippingLastName", e.target.value)} placeholder="Nom livraison" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
            <input value={form.shippingAddress1} onChange={(e) => onFieldChange("shippingAddress1", e.target.value)} placeholder="Adresse livraison ligne 1" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900 sm:col-span-2" />
            <input value={form.shippingAddress2} onChange={(e) => onFieldChange("shippingAddress2", e.target.value)} placeholder="Adresse livraison ligne 2" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900 sm:col-span-2" />
            <input value={form.shippingCity} onChange={(e) => onFieldChange("shippingCity", e.target.value)} placeholder="Ville livraison" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
            <input value={form.shippingPostcode} onChange={(e) => onFieldChange("shippingPostcode", e.target.value)} placeholder="Code postal livraison" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900" />
            {shippingStates.length > 0 ? (
              <select
                value={form.shippingState}
                onChange={(e) => onFieldChange("shippingState", e.target.value)}
                className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="">Région livraison</option>
                {shippingStates.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={form.shippingState}
                onChange={(e) => onFieldChange("shippingState", e.target.value)}
                placeholder="Région livraison"
                className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              />
            )}
            <select
              value={form.shippingCountry}
              onChange={(e) => onFieldChange("shippingCountry", e.target.value)}
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            >
              {countryOptions.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          <div>
            <h2 className="text-base font-semibold">Méthode de livraison</h2>
            <div className="mt-2 space-y-2">
              <button
                type="button"
                onClick={onRefreshShipping}
                className="rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
              >
                Actualiser les méthodes de livraison
              </button>
              {shippingRates.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Aucune méthode de livraison disponible pour cette adresse.
                </p>
              ) : (
                shippingRates.map((rate) => (
                  <label key={`${rate.id}-${rate.value}`} className="flex items-center justify-between rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700">
                    <span className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="shipping_method"
                        value={rate.value}
                        checked={selectedShippingMethod === rate.value}
                        onChange={(e) => setSelectedShippingMethod(e.target.value)}
                      />
                      {rate.label || rate.methodId}
                    </span>
                    <span className="text-sm font-medium">{format(parsePrice(rate.cost || "0"))}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold">Mode de paiement</h2>
            <div className="mt-2 space-y-2">
              {paymentMethods.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Aucun mode de paiement WordPress disponible.
                </p>
              ) : null}
              {paymentMethods.map((gateway) => (
                <label key={gateway.id} className="block rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700">
                  <span className="inline-flex items-center gap-2 text-sm font-medium">
                    <input
                      type="radio"
                      name="payment_method"
                      value={gateway.id}
                      checked={selectedPaymentMethod === gateway.id}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    {gateway.title || gateway.id}
                  </span>
                  {gateway.description ? (
                    <p className="mt-1 text-xs text-zinc-500">{gateway.description}</p>
                  ) : null}
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={placing || loading}
          className="mt-6 inline-flex rounded bg-zinc-900 px-5 py-2.5 text-white disabled:opacity-50"
        >
          {placing ? "Commande en cours..." : "Valider la commande"}
        </button>
      </form>

      <aside className="h-fit rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold">Récapitulatif</h2>
        <ul className="mt-4 space-y-3">
          {!hasRemoteItems ? (
            <li className="text-sm text-zinc-500">
              Synchronisation du panier WordPress en cours...
            </li>
          ) : null}
          {(hasRemoteItems
            ? remoteContents.map((item) => {
                const p = item?.product?.node;
                return {
                  id: item?.key || p?.id || String(Math.random()),
                  name: p?.name || "Produit",
                  qty: item?.quantity || 1,
                  total: parsePrice(item?.total || p?.price || "0"),
                  variation: Array.isArray(item?.variation) ? item.variation : [],
                };
              })
            : lines.map((line) => ({
                id: line?.id || String(Math.random()),
                name: line?.name || "Produit",
                qty: Number(line?.qty) > 0 ? Number(line.qty) : 1,
                total:
                  (Number(line?.unitPriceBase) > 0 ? Number(line.unitPriceBase) : 0) *
                  (Number(line?.qty) > 0 ? Number(line.qty) : 1),
                variation: Array.isArray(line?.variation) ? line.variation : [],
              }))
          ).map((line) => (
            <li key={line.id} className="flex items-start justify-between gap-3">
              <div className="text-sm text-zinc-700 dark:text-zinc-300">
                <p>
                  {line.name} × {line.qty}
                </p>
                {line.variation.length > 0 ? (
                  <div className="mt-1 space-y-1">
                    {line.variation.map((attr, index) => (
                      <p
                        key={`${attr.attributeName}-${index}`}
                        className="text-xs text-zinc-500 dark:text-zinc-400"
                      >
                        {formatVariationLabel(attr.attributeName)}:{" "}
                        {String(attr.attributeValue ?? "").trim()}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
              <span className="text-sm font-medium">{format(line.total)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Sous-total</span>
              <span>{format(displaySubtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Livraison</span>
              <span>{format(displayShipping)}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3 font-semibold dark:border-zinc-800">
            <span>Total</span>
            <span>{format(displayTotal)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
