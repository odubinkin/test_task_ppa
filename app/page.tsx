import { cookies } from "next/headers";

import { CurrencySelector } from "@/components/CurrencySelector";
import { PropertyCard } from "@/components/PropertyCard";
import { type CurrencyCode, isCurrencyCode } from "@/lib/currency";
import { getProperties } from "@/lib/properties";

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
  const properties = getProperties();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-end px-6 py-4">
        <CurrencySelector currentCurrency={currentCurrency} />
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold">Объекты недвижимости</h1>
          <p className="text-sm text-zinc-600">Текущая валюта: {currentCurrency}</p>
        </div>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {properties.map((property) => (
            <PropertyCard key={property.name} property={property} currency={currentCurrency} />
          ))}
        </section>
      </main>
    </div>
  );
}
