import { z } from 'zod';

const httpsUrl = z.url().refine(v => v.startsWith('https://'), 'HTTPS URL required');
export const safeUrl = z.union([httpsUrl, z.literal('')]).transform(v => v || null);
const optionalAmount = z.preprocess(v => v === '' || v === undefined ? null : v, z.union([z.null(), z.coerce.number().int().nonnegative()]));
const optionalCoordinate = (min:number,max:number) => z.preprocess(v => v === '' || v === undefined ? null : v, z.union([z.null(),z.coerce.number().min(min).max(max)]));
export const eventInput = z.object({
  venueId: z.coerce.number().int().positive(),
  title: z.string().trim().min(2).max(180),
  startsAt: z.iso.datetime({ local: true }),
  doorsOpenAt: z.union([z.iso.datetime({ local: true }), z.literal('')]).optional(),
  doorPrice: optionalAmount,
  advancePrice: optionalAmount,
  ticketUrl: safeUrl,
  sourceUrl: httpsUrl,
  sourceName: z.string().max(120).default(''),
  summary: z.string().max(500).default(''),
  lineup: z.string().max(1000).default(''),
  previewUrl: safeUrl,
  posterUrl: safeUrl,
  posterApproved: z.boolean().default(false),
  status: z.enum(['draft', 'pending', 'published', 'hidden']).default('draft')
});
export const venueInput = z.object({
  name: z.string().trim().min(2).max(120),
  address: z.string().trim().min(5).max(300),
  lat: optionalCoordinate(-90,90),
  lng: optionalCoordinate(-180,180),
  instagram: z.string().trim().max(100).default('')
});
export const editRequestInput = z.object({
  field: z.enum(['time', 'price', 'place', 'canceled', 'other']),
  note: z.string().max(300).default('')
});
export const eventLogInput = z.object({
  type: z.enum(['scan', 'list_view', 'detail_view', 'ticket_click', 'route_click', 'preview_click', 'survey']),
  cafe: z.string().max(80).optional(),
  placement: z.string().max(80).optional(),
  eventId: z.coerce.number().int().positive().optional(),
  value: z.string().max(80).optional()
});
export function optionalNumber(v: number | null | '' | undefined) { return v === '' || v === undefined ? null : v; }
export function fromSeoulLocal(value: string | undefined) {
  if (!value) return null;
  return new Date(value + '+09:00').toISOString();
}
export function safeReturnPath(value: string | null) {
  return value && /^\/(?!\/)[a-zA-Z0-9/?=&_-]*$/.test(value) ? value : '/admin';
}
