/**
 * Slug phoenixglobal.com.br → SKU Oracle Pro (PAIOS).
 * Manter alinhado com PAIOS apps/api/src/data/site-catalog-mapping.ts
 */
export const SLUG_TO_SKU: Record<string, { sku: string; location: "Fortaleza" | "Foz" }> = {
  "airpods-4": { sku: "APD-4-ANC", location: "Fortaleza" },
  "redmi-buds-6-pro-preto": { sku: "RBM-B6P-BLK", location: "Fortaleza" },
  "redmi-buds-6-pro-lavanda": { sku: "RBM-B6P-LAV", location: "Fortaleza" },
  "amazfit-bip-5": { sku: "AMZ-BIP5", location: "Fortaleza" },
  "apple-airtag": { sku: "APL-AIRTAG", location: "Fortaleza" },
  "sony-zv-e10": { sku: "SONY-ZVE10", location: "Fortaleza" },
  "dji-osmo-pocket-3": { sku: "DJI-OP3", location: "Fortaleza" },
  "insta360-x4": { sku: "INS-X4-ADV", location: "Fortaleza" },
  "gopro-max-360": { sku: "GOP-MAX2-8K", location: "Fortaleza" },
  "nintendo-switch-2": { sku: "NIN-SWITCH2", location: "Fortaleza" },
  "microsd-lexar-professional-gold": { sku: "LEX-GOLD-128", location: "Fortaleza" },
  "gabaon-premium-cream": { sku: "GAB-CRM-FTZ", location: "Fortaleza" },
  "gabaon-mascara-colageno-essence": { sku: "GAB-MASK-COL", location: "Foz" },
  "gabaon-mascara-acido-hialuronico": { sku: "GAB-MASK-HA", location: "Foz" },
  "starlink-mini": { sku: "STARLINK-MINI", location: "Fortaleza" },
  "phoenix-camera-ep-c006": { sku: "CAM-EP-C006", location: "Fortaleza" },
  "pioneer-ddj-400": { sku: "PION-DDJ400", location: "Fortaleza" },
};

export type CatalogExportProduct = {
  slug: string;
  name: string;
  category: string;
  quantity?: number;
  price: number;
  pricePix?: number;
  inStock: boolean;
};
