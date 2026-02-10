"use client";

import { useState } from "react";

import Image from "next/image";
import { House, Mail, MessageCircle, Phone, Send, Sparkles } from "lucide-react";

import { type CurrencyCode, formatPriceFromThb } from "@/lib/currency";
import { type PropertyContacts, type PropertyItem } from "@/lib/properties";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

function getContactIcon(type: keyof PropertyContacts) {
  if (type === "telegram") return Send;
  if (type === "whatsapp") return MessageCircle;
  if (type === "line") return MessageCircle;
  if (type === "phone") return Phone;
  return Mail;
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
    <Card className="group overflow-hidden border-zinc-200/90 bg-white/90 shadow-md backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
        {!imageFailed ? (
          <Image
            src={`/pictures/${property.image}`}
            alt={`Фото объекта: ${property.name}`}
            data-testid="property-image"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
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
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/35 from-0% via-zinc-900/12 via-20% to-transparent to-50%" />
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-zinc-800">
          <Sparkles className="h-3.5 w-3.5" />
          Премиум листинг
        </div>
      </div>

      <CardContent className="space-y-5 p-5">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold leading-tight text-zinc-900">{property.name}</h2>
          <p className="line-clamp-2 text-sm leading-6 text-zinc-600">{property.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-md bg-zinc-900 px-2.5 py-1 text-[13px] text-white hover:bg-zinc-800">{formattedPrice}</Badge>
          <Badge variant="secondary" className="rounded-md px-2.5 py-1 text-[13px]">
            {property.area} м²
          </Badge>
        </div>

        {property.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {property.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] font-medium text-zinc-700">
                  {tag}
                </Badge>
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

              const ContactIcon = getContactIcon(type);

              return (
                <a
                  key={type}
                  href={getContactHref(type, value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition",
                    "hover:border-zinc-400 hover:bg-zinc-100",
                  )}
                  target={type === "phone" || type === "email" ? undefined : "_blank"}
                  rel={type === "phone" || type === "email" ? undefined : "noreferrer noopener"}
                >
                  <ContactIcon className="h-3.5 w-3.5" />
                  {getContactLabel(type)}
                </a>
              );
            })}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
