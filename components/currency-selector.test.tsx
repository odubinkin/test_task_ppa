import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSupportedCurrencies } from "@/lib/currency";

import { CurrencySelector } from "./currency-selector";

const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

/**
 * Removes all cookies between tests to keep assertions deterministic.
 */
function clearAllCookies(): void {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [name] = cookie.trim().split("=");

    if (name) {
      document.cookie = `${name}=; path=/; max-age=0`;
    }
  }
}

/**
 * Currency selector tests verify rendering from rates source and side effects
 * needed for SSR synchronization.
 */
describe("CurrencySelector", () => {
  beforeEach(() => {
    refreshMock.mockClear();
    clearAllCookies();
  });

  /** Verifies widget renders all supported currencies and keeps current value selected. */
  it("renders supported currencies with the provided current value", () => {
    render(<CurrencySelector currentCurrency="EUR" />);

    const select = screen.getByLabelText("Валюта:") as HTMLSelectElement;
    const supportedCurrencies = getSupportedCurrencies();

    expect(select.value).toBe("EUR");
    expect(select.options).toHaveLength(supportedCurrencies.length);

    for (const currency of supportedCurrencies) {
      expect(screen.getByRole("option", { name: currency })).toBeInTheDocument();
    }
  });

  /** Verifies currency change writes cookie and triggers router refresh for new SSR output. */
  it("stores selected currency in cookie and refreshes route on change", () => {
    render(<CurrencySelector currentCurrency="THB" />);

    const select = screen.getByLabelText("Валюта:");

    fireEvent.change(select, { target: { value: "USD" } });

    expect(document.cookie).toContain("currency=USD");
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });
});
