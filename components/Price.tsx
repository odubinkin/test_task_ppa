import { type CurrencyCode, formatPriceFromThb } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface PriceProps {
  amountInThb: number;
  currency: CurrencyCode;
  className?: string;
}

/**
 * Displays price converted from THB to selected currency with locale formatting.
 */
export function Price({ amountInThb, currency, className }: PriceProps) {
  const formattedPrice = formatPriceFromThb(amountInThb, currency);

  return (
    <span data-testid="price-value" className={cn(className)}>
      {formattedPrice}
    </span>
  );
}
