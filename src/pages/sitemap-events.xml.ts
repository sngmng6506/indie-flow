import type { APIRoute } from 'astro';
import { db } from '../lib/db';
export const GET: APIRoute = async ({site}) => {
  const rows=await db()`SELECT id,updated_at FROM events WHERE status='published' AND starts_at >= now() ORDER BY starts_at LIMIT 5000`;
  const root=(site?.toString()||'http://localhost:4321/').replace(/\/$/,'');
  const xml='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+rows.map(r=>`<url><loc>${root}/events/${r.id}</loc><lastmod>${new Date(r.updated_at).toISOString()}</lastmod></url>`).join('')+'</urlset>';
  return new Response(xml,{headers:{'content-type':'application/xml; charset=utf-8'}});
};
