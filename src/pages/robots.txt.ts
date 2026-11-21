import type {APIRoute} from 'astro';
export const GET:APIRoute=({url})=>{
 const base=(import.meta.env.PUBLIC_SITE_URL || import.meta.env.SITE || url.origin).replace(/\/$/,'');
 return new Response(['User-agent: *','Allow: /','Disallow: /admin','Disallow: /api/','Sitemap: '+base+'/sitemap.xml',''].join('\n'),{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=3600'}});
};
