import Calendar from '@battis/google.calendar';
import { CalendarCache } from '../../CalendarCache';
import { client } from '../Client';
import { Event } from './Event';

export * from './Event';

const cache = new CalendarCache<Event['id'], Event>();

export async function listEventsBetween(
  timeMin: Date,
  timeMax: Date
): Promise<Event[]> {
  const cached = cache.get(timeMin, timeMax);
  if (cached) {
    return cached;
  }
  const { items } = await client.fetch<{
    items: Calendar.v3.Event[];
  }>(
    `calendar/v3/calendars/${user_email}/events?timeMin=${encodeURIComponent(timeMin.toISOString())}&timeMax=${encodeURIComponent(timeMax.toISOString())}&singleEvents=true`
  );
  return cache.pushTimeframe(
    (event) => [event.start.dateTime || event.start.date, event.id, event],
    timeMin,
    timeMax,
    items.map((item) => Event.fromV3Event(item))
  );
}
