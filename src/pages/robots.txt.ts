import type { APIRoute } from 'astro';
export const GET: APIRoute = ({site}) => {
  const root=(site?.toString()||'http://localhost:4321/').replace(/\/$/,'');
  return new Response(`User-agent: *\nDisallow: /admin\nDisallow: /api/admin\nSitemap: ${root}/sitemap-index.xml\nSitemap: ${root}/sitemap-events.xml\n`,{headers:{'content-type':'text/plain; charset=utf-8'}});
};
