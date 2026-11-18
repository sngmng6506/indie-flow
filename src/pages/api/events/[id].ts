import type { APIRoute } from 'astro';
import { getEvent } from '../../../lib/events';
import { fail,json,idFromParam } from '../../../lib/http';
export const GET: APIRoute = async ({params}) => {
  const id = idFromParam(params.id);
  if(!id) return fail('EVENT_NOT_FOUND','공연을 찾을 수 없습니다.',404);
  const e = await getEvent(id);
  if(!e) return fail('EVENT_NOT_FOUND','공연을 찾을 수 없습니다.',404);
  return json({
    id:String(e.id), title:e.title, startsAt:e.starts_at, doorsOpenAt:e.doors_open_at,
    venue:{id:String(e.venue_id),name:e.venue_name,address:e.venue_address,lat:e.lat,lng:e.lng},
    doorPrice:e.door_price,advancePrice:e.advance_price,ticketUrl:e.ticket_url,
    lineup:e.lineup?[{name:e.lineup,summary:e.summary,previewUrl:e.preview_url}]:[],
    poster:e.poster_approved?e.poster_url:null,
    source:{name:e.source_name||e.venue_name,url:e.source_url},checkedAt:e.checked_at
  });
};
