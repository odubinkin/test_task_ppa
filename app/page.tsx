import { cookies } from "next/headers";

import { CurrencySelector } from "@/components/currency-selector";
import { type CurrencyCode, isCurrencyCode } from "@/lib/currency";

const CURRENCY_COOKIE_NAME = "currency";
const FALLBACK_CURRENCY: CurrencyCode = "THB";

/**
 * Reads selected currency from cookies and falls back to THB.
 */
async function getCurrentCurrency(): Promise<CurrencyCode> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(CURRENCY_COOKIE_NAME)?.value;

  if (!cookieValue || !isCurrencyCode(cookieValue)) {
    return FALLBACK_CURRENCY;
  }

  return cookieValue;
}

export default async function Home() {
  const currentCurrency = await getCurrentCurrency();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-end px-6 py-4">
        <CurrencySelector currentCurrency={currentCurrency} />
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Текущая валюта: {currentCurrency}</h1>
      </main>
    </div>
  );
}
