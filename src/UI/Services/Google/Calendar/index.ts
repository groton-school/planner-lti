import { DateString } from '@battis/descriptive-types';
import Calendar from '@battis/google.calendar';
import { client } from '../Client';
import { Event } from './Event';

export * from './Event';

const cache: Record<DateString<'ISO'>, Record<Event['id'], Event>> = {};

function toKey(
  startDate: Event['start']['date'] | Event['start']['dateTime']
): DateString<'ISO'> {
  return new Date(startDate).toISOString().slice(0, 10);
}

function nextKey(currDate: DateString<'ISO'>): DateString<'ISO'> {
  const next = new Date(currDate);
  next.setDate(next.getDate() + 1);
  return next.toISOString().slice(0, 10);
}

export async function listEventsBetween(
  timeMin: Date,
  timeMax: Date
): Promise<Event[]> {
  const end = nextKey(toKey(timeMax.toISOString()));
  let cached = true;
  let result: Event[] = [];
  for (
    let curr = toKey(timeMin.toISOString());
    curr !== end;
    curr = nextKey(curr)
  ) {
    if (curr in cache) {
      result.push(...Object.values(cache[curr]));
    } else {
      cached = false;
      break;
    }
  }
  if (!cached) {
    result = [];
    const { items } = await client.fetch<{
      items: Calendar.v3.Event[];
    }>(
      `calendar/v3/calendars/${user_email}/events?timeMin=${encodeURIComponent(timeMin.toISOString())}&timeMax=${encodeURIComponent(timeMax.toISOString())}&singleEvents=true`
    );
    for (const item of items) {
      const event = Event.fromV3Event(item);
      const key = toKey(event.start.dateTime || event.start.date);
      if (!(key in cache)) {
        cache[key] = {};
      }
      cache[key][event.id] = Event.fromV3Event(event);
      result.push(cache[key][event.id]);
    }
  }
  return result;
}
