import ratesFromFile from "../exchange_rates.json";

/**
 * Currency code inferred from `exchange_rates.json` keys.
 */
export type CurrencyCode = keyof typeof ratesFromFile;

export type ExchangeRates = Record<CurrencyCode, number>;

const DEFAULT_LOCALE = "ru-RU";
const RATE_KEYS = Object.keys(ratesFromFile) as CurrencyCode[];

/**
 * Checks whether a value is a finite number.
 */
function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Guards THB input amount to keep conversion deterministic.
 */
function assertAmountInThb(amountInThb: number): void {
  if (!isFiniteNumber(amountInThb)) {
    throw new Error("amountInThb must be a finite number");
  }
}

/**
 * Checks whether a string is a supported currency code from `exchange_rates.json`.
 *
 * @param value Raw currency code.
 * @returns `true` when the code exists in rates file keys.
 */
export function isCurrencyCode(value: string): value is CurrencyCode {
  return RATE_KEYS.includes(value as CurrencyCode);
}

/**
 * Validates and normalizes exchange rates shape using keys from `exchange_rates.json`.
 *
 * @param rates Candidate rates object.
 * @returns Strongly typed rates map.
 * @throws If any required currency key is missing or has non-positive/non-finite rate.
 */
export function validateExchangeRates(rates: unknown): ExchangeRates {
  if (!rates || typeof rates !== "object") {
    throw new Error("exchange rates must be an object");
  }

  const ratesRecord = rates as Record<string, unknown>;
  const normalized: Partial<ExchangeRates> = {};

  for (const currency of RATE_KEYS) {
    const rate = ratesRecord[currency];

    if (!isFiniteNumber(rate) || rate <= 0) {
      throw new Error(`exchange rate for ${currency} must be a positive finite number`);
    }

    normalized[currency] = rate;
  }

  return normalized as ExchangeRates;
}

/**
 * Default exchange rates loaded from `exchange_rates.json` and validated at module load.
 */
export const DEFAULT_EXCHANGE_RATES = validateExchangeRates(ratesFromFile);

/**
 * Converts THB amount into selected currency.
 *
 * @param amountInThb Source amount in THB.
 * @param currency Target currency.
 * @param rates Exchange rates map where values are conversion factors from THB.
 * @returns Converted amount.
 */
export function convertFromThb(
  amountInThb: number,
  currency: CurrencyCode,
  rates: ExchangeRates = DEFAULT_EXCHANGE_RATES,
): number {
  assertAmountInThb(amountInThb);
  return amountInThb * rates[currency];
}

/**
 * Formats amount as currency string with locale-aware separators and symbol.
 *
 * @param amount Amount in target currency.
 * @param currency Target currency code.
 * @param locale Intl locale, defaults to `ru-RU`.
 * @returns Formatted currency string.
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  locale: string = DEFAULT_LOCALE,
): string {
  if (!isFiniteNumber(amount)) {
    throw new Error("amount must be a finite number");
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Converts THB amount and formats it as localized currency text.
 *
 * @param amountInThb Source amount in THB.
 * @param currency Target currency.
 * @param locale Intl locale, defaults to `ru-RU`.
 * @param rates Exchange rates map where values are conversion factors from THB.
 * @returns Formatted converted price.
 */
export function formatPriceFromThb(
  amountInThb: number,
  currency: CurrencyCode,
  locale: string = DEFAULT_LOCALE,
  rates: ExchangeRates = DEFAULT_EXCHANGE_RATES,
): string {
  const converted = convertFromThb(amountInThb, currency, rates);
  return formatCurrency(converted, currency, locale);
}
