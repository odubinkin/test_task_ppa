"use client";

import { useRouter } from "next/navigation";

import { type CurrencyCode, getSupportedCurrencies } from "@/lib/currency";

const CURRENCY_COOKIE_NAME = "currency";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/**
 * Dropdown widget for currency selection. Stores selected currency in cookie
 * and requests server component refresh to keep SSR output in sync.
 */
export function CurrencySelector({ currentCurrency }: { currentCurrency: CurrencyCode }) {
  const router = useRouter();
  const currencies = getSupportedCurrencies();

  const handleCurrencyChange = (nextCurrency: CurrencyCode): void => {
    document.cookie = `${CURRENCY_COOKIE_NAME}=${nextCurrency}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
    router.refresh();
  };

  return (
    <label className="flex items-center gap-3 text-sm text-zinc-600" htmlFor="currency-select">
      <span>Валюта:</span>
      <select
        id="currency-select"
        className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-300"
        value={currentCurrency}
        onChange={(event) => handleCurrencyChange(event.target.value as CurrencyCode)}
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </label>
  );
}
