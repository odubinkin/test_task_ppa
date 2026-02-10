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
    <div className="catalog-shell min-h-screen text-zinc-900">
      <header className="sticky top-0 z-20 border-b border-white/30 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Phuket Collection</p>
            <p className="text-sm font-medium text-zinc-700">Каталог недвижимости</p>
          </div>
          <CurrencySelector currentCurrency={currentCurrency} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-14 pt-10">
        <div className="mb-8 rounded-2xl border border-white/50 bg-white/65 p-6 shadow-sm backdrop-blur">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">Недвижимость на Пхукете</h1>
          <p className="mt-2 text-sm text-zinc-600">Выберите интересующий вас объект</p>
        </div>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {properties.map((property) => (
            <PropertyCard key={property.name} property={property} currency={currentCurrency} />
          ))}
        </section>
      </main>
    </div>
  );
}
