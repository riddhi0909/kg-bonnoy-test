"use client";

import Link from "next/link";
import { useCurrency } from "@/modules/common/providers/currency-context";
import { useCart } from "@/modules/cart/hooks/useCart";
import { checkoutPath } from "@/constants/routes";

/**
 * @param {{ locale: string }} props
 */
export function CartPageClient({ locale }) {
  const { lines, removeLine } = useCart();
  const { format, baseCurrency } = useCurrency();

  const subtotal = lines.reduce(
    (acc, l) => acc + l.unitPriceBase * l.qty,
    0,
  );

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Panier</h1>
      {lines.length === 0 ? (
        <p className="mt-6 text-zinc-600 dark:text-zinc-400">Votre panier est vide.</p>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
          {lines.map((l) => (
            <li key={l.id} className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium">{l.name}</p>
                <p className="text-sm text-zinc-500">
                  {format(l.unitPriceBase)} × {l.qty}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeLine(l.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
      {lines.length > 0 ? (
        <div className="mt-8 flex flex-col gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="text-lg font-semibold">
            Sous-total ({baseCurrency}) : {format(subtotal)}
          </p>
          <Link
            href={checkoutPath(locale)}
            className="inline-flex w-fit rounded-lg bg-zinc-900 px-6 py-3 text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Paiement
          </Link>
        </div>
      ) : null}
    </div>
  );
}
