"use client";

import { useState } from "react";

import Image from "next/image";
import { House } from "lucide-react";

import { type CurrencyCode, formatPriceFromThb } from "@/lib/currency";
import { type PropertyContacts, type PropertyItem } from "@/lib/properties";

interface PropertyCardProps {
  property: PropertyItem;
  currency: CurrencyCode;
}

/**
 * Builds public contact URL by contact type.
 */
function getContactHref(type: keyof PropertyContacts, value: string): string {
  if (type === "email") {
    return `mailto:${value}`;
  }

  if (type === "phone") {
    return `tel:${value}`;
  }

  return value;
}

/**
 * Human-readable labels for contact actions.
 */
function getContactLabel(type: keyof PropertyContacts): string {
  if (type === "telegram") return "Telegram";
  if (type === "whatsapp") return "WhatsApp";
  if (type === "line") return "LINE";
  if (type === "phone") return "Телефон";
  return "Email";
}

/**
 * Property card with image, description, price, area, tags and optional contacts.
 */
export function PropertyCard({ property, currency }: PropertyCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const formattedPrice = formatPriceFromThb(property.price, currency);
  const contactEntries = Object.entries(property.contacts) as Array<[keyof PropertyContacts, string | undefined]>;
  const visibleContacts = contactEntries.filter(([, value]) => Boolean(value));

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="relative aspect-[16/10] w-full bg-zinc-100">
        {!imageFailed ? (
          <Image
            src={`/pictures/${property.image}`}
            alt={`Фото объекта: ${property.name}`}
            data-testid="property-image"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-zinc-500"
            data-testid="property-image-placeholder"
          >
            <House className="h-10 w-10" />
            <span className="text-xs font-medium">Изображение недоступно</span>
          </div>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">{property.name}</h2>
          <p className="text-sm text-zinc-600">{property.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="font-semibold text-zinc-900">{formattedPrice}</span>
          <span className="text-zinc-500">{property.area} м²</span>
        </div>

        {property.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {property.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {visibleContacts.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {visibleContacts.map(([type, value]) => {
              if (!value) {
                return null;
              }

              return (
                <a
                  key={type}
                  href={getContactHref(type, value)}
                  className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
                  target={type === "phone" || type === "email" ? undefined : "_blank"}
                  rel={type === "phone" || type === "email" ? undefined : "noreferrer noopener"}
                >
                  {getContactLabel(type)}
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
    </article>
  );
}
