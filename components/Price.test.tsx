import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Price } from "./Price";

/**
 * Price component tests verify THB input conversion and formatted output rendering.
 */
describe("Price", () => {
  /** Verifies THB amount is displayed as a formatted USD value. */
  it("converts THB input to selected currency and renders formatted value", () => {
    render(<Price amountInThb={1000} currency="USD" />);

    expect(screen.getByTestId("price-value")).toHaveTextContent("28,60 $");
  });
});
