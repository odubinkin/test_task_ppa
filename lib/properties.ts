import rawProperties from "../data.json";

/** Supported contact channels for a property card. */
export interface PropertyContacts {
  telegram?: string;
  whatsapp?: string;
  line?: string;
  phone?: string;
  email?: string;
}

/** Real-estate entity displayed in the list. */
export interface PropertyItem {
  name: string;
  description: string;
  price: number;
  area: number;
  tags: string[];
  image: string;
  contacts: PropertyContacts;
}

/**
 * Returns properties loaded from `data.json`.
 */
export function getProperties(): PropertyItem[] {
  return rawProperties as PropertyItem[];
}
