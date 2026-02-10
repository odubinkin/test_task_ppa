import { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type PropertyItem } from "@/lib/properties";

import { PropertyCard } from "./PropertyCard";

vi.mock("next/image", () => {
  function MockNextImage(allProps: Record<string, unknown>) {
    const alt = typeof allProps.alt === "string" ? allProps.alt : "";
    const testId = typeof allProps["data-testid"] === "string" ? allProps["data-testid"] : undefined;
    const src = typeof allProps.src === "string" ? allProps.src : "";
    const onError = typeof allProps.onError === "function" ? allProps.onError : undefined;

    useEffect(() => {
      if (src.includes("unavailable-file-34y3729.jpg") && onError) {
        onError(new Event("error"));
      }
    }, [src, onError]);

    return <span role="img" aria-label={alt} data-testid={testId} onError={onError as React.ReactEventHandler} />;
  }

  return { default: MockNextImage };
});

const baseProperty: PropertyItem = {
  name: "Seaview Residence Phuket",
  description: "Апартаменты с панорамным видом на море и террасой.",
  price: 4_200_000,
  area: 58,
  tags: ["у моря", "инвестиция"],
  image: "seaview-residence-phuket.jpg",
  contacts: {
    telegram: "https://t.me/seaview_phuket",
    phone: "+66-81-245-1100",
    email: "sales@seaview-phuket.example",
  },
};

/**
 * Property card tests verify visible output and conditional sections rendering.
 */
describe("PropertyCard", () => {
  /** Verifies card renders main property details and formatted price block. */
  it("renders title, description, area, image and formatted price", () => {
    render(<PropertyCard property={baseProperty} currency="THB" />);

    expect(screen.getByText(baseProperty.name)).toBeInTheDocument();
    expect(screen.getByText(baseProperty.description)).toBeInTheDocument();
    expect(screen.getByText("58 м²")).toBeInTheDocument();
    expect(screen.getByTestId("property-image")).toBeInTheDocument();
    expect(screen.getByText(/฿/)).toBeInTheDocument();
  });

  /** Verifies contacts render only for available channels and use correct link protocols. */
  it("renders only available contacts with correct href values", () => {
    render(<PropertyCard property={baseProperty} currency="USD" />);

    const telegramLink = screen.getByRole("link", { name: "Telegram" });
    const phoneLink = screen.getByRole("link", { name: "Телефон" });
    const emailLink = screen.getByRole("link", { name: "Email" });

    expect(telegramLink).toHaveAttribute("href", baseProperty.contacts.telegram);
    expect(phoneLink).toHaveAttribute("href", `tel:${baseProperty.contacts.phone}`);
    expect(emailLink).toHaveAttribute("href", `mailto:${baseProperty.contacts.email}`);
    expect(screen.queryByRole("link", { name: "WhatsApp" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "LINE" })).not.toBeInTheDocument();
  });

  /** Verifies optional tags/contacts sections are hidden when no data is provided. */
  it("hides tags and contacts blocks when tags and contacts are empty", () => {
    const propertyWithoutTagsAndContacts: PropertyItem = {
      ...baseProperty,
      tags: [],
      contacts: {},
    };

    render(<PropertyCard property={propertyWithoutTagsAndContacts} currency="EUR" />);

    expect(screen.queryByText("у моря")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Telegram" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Телефон" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Email" })).not.toBeInTheDocument();
  });

  /** Verifies placeholder is rendered when image file is unavailable. */
  it("renders image placeholder when image file is missing", () => {
    const propertyWithoutImage: PropertyItem = {
      ...baseProperty,
      image: "unavailable-file-34y3729.jpg",
    };

    render(<PropertyCard property={propertyWithoutImage} currency="THB" />);

    expect(screen.getByTestId("property-image-placeholder")).toBeInTheDocument();
    expect(screen.getByText("Изображение недоступно")).toBeInTheDocument();
    expect(screen.queryByTestId("property-image")).not.toBeInTheDocument();
  });
});
