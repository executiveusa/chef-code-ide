import { Creem } from 'creem';

export function getCreem(): Creem | null {
  const key = globalThis.process.env.CREEM_API_KEY;
  if (!key) {
    return null;
  }
  return new Creem({ apiKey: key });
}

export const CREEM_PRODUCTS = {
  starter: globalThis.process.env.CREEM_STARTER_PRODUCT_ID ?? '',
  pro: globalThis.process.env.CREEM_PRO_PRODUCT_ID ?? '',
  'white-label': globalThis.process.env.CREEM_WHITELABEL_PRODUCT_ID ?? '',
} as const;

export type CreemPlanKey = keyof typeof CREEM_PRODUCTS;
