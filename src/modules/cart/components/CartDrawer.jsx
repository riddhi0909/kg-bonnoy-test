"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { checkoutPath } from "@/constants/routes";
import { useCurrency } from "@/modules/common/providers/currency-context";
import { useCart } from "@/modules/cart/hooks/useCart";

function formatVariationLabel(name) {
  return String(name ?? "")
    .replace(/^pa_/i, "")
    .replace(/[_-]+/g, " ")
    .trim();
}

/**
 * @param {{ open: boolean; onClose: () => void; locale: string }} props
 */
export function CartDrawer({ open, onClose, locale }) {
  const ANIMATION_MS = 300;
  const { lines, removeLine, updateQty } = useCart();
  const { format } = useCurrency();
  const [isVisible, setIsVisible] = useState(open);
  const [entered, setEntered] = useState(false);

  const subtotal = lines.reduce((s, l) => s + l.unitPriceBase * l.qty, 0);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setEntered(false);
      let raf1 = 0;
      let raf2 = 0;
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setEntered(true));
      });
      return () => {
        if (raf1) cancelAnimationFrame(raf1);
        if (raf2) cancelAnimationFrame(raf2);
      };
    }

    setEntered(false);
    const timeout = setTimeout(() => setIsVisible(false), ANIMATION_MS);
    return () => clearTimeout(timeout);
  }, [open]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[120]" role="dialog" aria-modal="true">
      <button
        type="button"
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Fermer le panier"
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white p-6 shadow-2xl transition-transform duration-300 ease-out dark:bg-zinc-950 ${
          entered ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Votre panier</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-zinc-300 px-2 py-1 text-sm cursor-pointer"
          >
            Fermer
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="mt-8 text-zinc-600 dark:text-zinc-400">
            Votre panier est vide.
          </p>
        ) : (
          <>
            <ul className="mt-6 max-h-[58vh] divide-y divide-zinc-200 overflow-auto dark:divide-zinc-800">
              {lines.map((l) => (
                <li key={l.id} className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{l.name}</p>
                      {Array.isArray(l.variation) && l.variation.length > 0 ? (
                        <div className="mt-1 space-y-1">
                          {l.variation.map((attr, index) => (
                            <p
                              key={`${attr.attributeName}-${index}`}
                              className="text-xs text-zinc-500"
                            >
                              {formatVariationLabel(attr.attributeName)}:{" "}
                              {String(attr.attributeValue ?? "").trim()}
                            </p>
                          ))}
                        </div>
                      ) : null}
                      <p className="text-sm text-zinc-500">{format(l.unitPriceBase)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(l.id)}
                      className="text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      Supprimer
                    </button>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 rounded border border-zinc-300 px-2 py-1">
                    <button
                      type="button"
                      onClick={() => updateQty(l.id, Math.max(1, l.qty - 1))}
                      className="px-1 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="min-w-6 text-center text-sm">{l.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(l.id, l.qty + 1)}
                      className="px-1 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Sous-total</span>
                <span>{format(subtotal)}</span>
              </div>
              <Link
                href={checkoutPath(locale)}
                onClick={onClose}
                className="mt-4 inline-flex w-full items-center justify-center rounded bg-zinc-900 px-4 py-3 text-white"
              >
                Paiement
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
