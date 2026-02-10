"use client";

import { ChevronDown, Landmark } from "lucide-react";
import { useRouter } from "next/navigation";

import { type CurrencyCode, getSupportedCurrencies } from "@/lib/currency";
import { cn } from "@/lib/utils";

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
    <label className="flex items-center gap-3 text-sm text-zinc-700" htmlFor="currency-select">
      <span className="inline-flex items-center gap-2 font-medium">
        <Landmark className="h-4 w-4 text-zinc-500" />
        Валюта
      </span>

      <span className="relative">
        <select
          id="currency-select"
          data-testid="currency-select"
          className={cn(
            "h-10 min-w-32 appearance-none rounded-xl border border-zinc-300 bg-white/90 px-4 pr-9 text-sm font-semibold text-zinc-900 shadow-sm outline-none backdrop-blur",
            "hover:bg-white focus:border-zinc-500 focus:ring-2 focus:ring-zinc-300",
          )}
          value={currentCurrency}
          onChange={(event) => handleCurrencyChange(event.target.value as CurrencyCode)}
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency} data-testid={`currency-option-${currency}`}>
              {currency}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      </span>
    </label>
  );
}
