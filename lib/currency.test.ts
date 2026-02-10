import { describe, expect, it } from "vitest";

import {
  DEFAULT_EXCHANGE_RATES,
  convertFromThb,
  formatCurrency,
  formatPriceFromThb,
  isCurrencyCode,
  validateExchangeRates,
} from "./currency";

/**
 * Validation tests ensure rates object is structurally safe before runtime usage.
 */
describe("validateExchangeRates", () => {
  /** Verifies that a fully valid rates map passes validation unchanged. */
  it("validates the expected shape", () => {
    const rates = validateExchangeRates({
      THB: 1,
      USD: 0.0286,
      EUR: 0.0263,
      RUB: 2.57,
    });

    expect(rates).toEqual({
      THB: 1,
      USD: 0.0286,
      EUR: 0.0263,
      RUB: 2.57,
    });
  });

  /** Verifies that missing or non-positive rates are rejected with explicit error. */
  it("throws when at least one currency is missing or invalid", () => {
    expect(() =>
      validateExchangeRates({
        THB: 1,
        USD: 0.0286,
        EUR: 0,
      }),
    ).toThrowError(/EUR/i);
  });
});

/**
 * Type-guard behavior for supported currency codes.
 */
describe("isCurrencyCode", () => {
  /** Verifies only currencies from rates source are accepted. */
  it("returns true only for supported currencies", () => {
    expect(isCurrencyCode("THB")).toBe(true);
    expect(isCurrencyCode("USD")).toBe(true);
    expect(isCurrencyCode("EUR")).toBe(true);
    expect(isCurrencyCode("RUB")).toBe(true);
    expect(isCurrencyCode("GBP")).toBe(false);
  });
});

/**
 * Conversion tests verify raw numeric math from THB to target currencies.
 */
describe("convertFromThb", () => {
  /** Verifies conversion output for all supported currencies with known fixture input. */
  it("converts THB amount to supported currencies", () => {
    const amount = 1000;

    expect(convertFromThb(amount, "THB")).toBeCloseTo(1000, 8);
    expect(convertFromThb(amount, "USD")).toBeCloseTo(28.6, 8);
    expect(convertFromThb(amount, "EUR")).toBeCloseTo(26.3, 8);
    expect(convertFromThb(amount, "RUB")).toBeCloseTo(2570, 8);
  });

  /** Verifies guard behavior for non-finite THB inputs. */
  it("throws for invalid amount", () => {
    expect(() => convertFromThb(Number.NaN, "USD", DEFAULT_EXCHANGE_RATES)).toThrowError(/amountInThb/i);
  });
});

/**
 * Formatter tests verify locale-aware money output for each currency.
 */
describe("formatCurrency", () => {
  /** Verifies output contains correct currency symbols for supported currencies. */
  it("formats values with currency symbols", () => {
    expect(formatCurrency(1000, "THB", "ru-RU")).toContain("฿");
    expect(formatCurrency(1000, "USD", "ru-RU")).toContain("$");
    expect(formatCurrency(1000, "EUR", "ru-RU")).toContain("€");
    expect(formatCurrency(1000, "RUB", "ru-RU")).toContain("₽");
  });

  /** Verifies formatter rejects non-finite inputs. */
  it("throws for invalid amount", () => {
    expect(() => formatCurrency(Number.POSITIVE_INFINITY, "USD")).toThrowError(/amount/i);
  });
});

/**
 * End-to-end utility test for convert + format pipeline.
 */
describe("formatPriceFromThb", () => {
  /** Verifies composed helper returns stable formatted output for known fixture. */
  it("converts and formats in one step", () => {
    const formatted = formatPriceFromThb(1000, "USD", "en-US");
    expect(formatted).toBe("$28.60");
  });
});
