import { DateString } from '@battis/descriptive-types';

type DateInformation = DateString<'ISO'> | Date;
type DateIndex = DateString<'ISO'>;

export class CalendarCache<Id extends string | number | symbol, Value> {
  private cache: Record<DateIndex, Record<Id, Value>> = {};

  private static keyFrom(date: DateInformation): DateIndex {
    if (date instanceof Date) {
      date = date.toISOString();
    }
    return date.slice(0, 10);
  }

  private static nextKey(key: DateIndex): DateIndex {
    const next = new Date(key);
    next.setDate(next.getDate() + 1);
    return CalendarCache.keyFrom(next);
  }

  public set(date: DateInformation, id: Id, value: Value) {
    const key = CalendarCache.keyFrom(date);
    if (!(key in this.cache)) {
      this.cache[key] = {} as Record<Id, Value>;
    }
    this.cache[key][id] = value;
  }

  public has(date: DateInformation) {
    return CalendarCache.keyFrom(date) in this.cache;
  }

  public get(start: DateInformation, end: DateInformation) {
    end = CalendarCache.nextKey(CalendarCache.keyFrom(end));
    const result: Value[] = [];
    for (
      let curr = CalendarCache.keyFrom(start);
      curr !== end;
      curr = CalendarCache.nextKey(curr)
    ) {
      if (curr in this.cache) {
        result.push(...Array.from(Object.values<Value>(this.cache[curr])));
      } else {
        return undefined;
      }
    }
    return result;
  }

  public pushTimeframe(
    callback: (value: Value) => [date: DateInformation, id: Id, value: Value],
    start: DateInformation,
    end: DateInformation,
    values: Value[]
  ) {
    end = CalendarCache.nextKey(CalendarCache.keyFrom(end));
    for (
      let curr = CalendarCache.keyFrom(start);
      curr !== end;
      curr = CalendarCache.nextKey(curr)
    ) {
      if (!(curr in this.cache)) {
        this.cache[curr] = {} as Record<Id, Value>;
      }
    }
    for (const v of values) {
      const args = callback(v);
      let [date] = args;
      if (!(date instanceof Date)) {
        date = new Date(date);
      }
      this.set(...args);
    }
    return values;
  }
}
