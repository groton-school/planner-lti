import { calendar_v3 } from '@googleapis/calendar';
import { client } from '../Client';
import { Event } from './Event';

export * from './Event';

const cache: Record<string, Event[]> = {};

export async function listEventsBetween(timeMin: Date, timeMax: Date) {
  const key = JSON.stringify({ timeMin, timeMax });
  if (!(key in cache)) {
    const { items } = await client.fetch<{
      items: calendar_v3.Schema$Event[];
    }>(
      `calendar/v3/calendars/${user_email}/events?timeMin=${encodeURIComponent(timeMin.toISOString())}&timeMax=${encodeURIComponent(timeMax.toISOString())}&singleEvents=true`
    );
    cache[key] = items.map((item) => Event.fromV3Event(item));
  }
  return cache[key];
}
