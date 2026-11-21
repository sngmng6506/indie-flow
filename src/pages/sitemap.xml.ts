import type {APIRoute} from 'astro';
import {db} from '../lib/db';
const xml=(v:string)=>v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
export const GET:APIRoute=async ({url})=>{
  const base=(import.meta.env.PUBLIC_SITE_URL || import.meta.env.SITE || url.origin).replace(/\/$/,'');
  const entries=[{path:'/',modified:null as string|null}];
  const rows=await db()`SELECT id,updated_at FROM events WHERE status='published' AND starts_at>=now() ORDER BY starts_at ASC LIMIT 5000`;
  for(const e of rows)entries.push({path:'/events/'+e.id,modified:e.updated_at?new Date(e.updated_at).toISOString():null});
  const body='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
    entries.map(e=>'<url><loc>'+xml(base+e.path)+'</loc>'+(e.modified?'<lastmod>'+xml(e.modified)+'</lastmod>':'')+'</url>').join('\n')+
    '\n</urlset>';
  return new Response(body,{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=300'}});
};
