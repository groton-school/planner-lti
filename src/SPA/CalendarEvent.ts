import { EventInput } from '@fullcalendar/core';
import * as Canvas from '@groton/canvas-cli.api';
import { stringify } from '@groton/canvas-cli.utilities';
import { Course } from './Course';
import { isAllDay } from './Utilities';
import { Options, paginatedCallback } from './Utilities/paginatedCallback';

export class CalendarEvent {
  private static cache: Record<string, CalendarEvent[]> = {};

  private constructor(
    private calendarEvent: Canvas.CalendarEvents.CalendarEvent
  ) {}

  public static async list({
    callback,
    params
  }: Options<CalendarEvent, Canvas.v1.CalendarEvents.listSearchParameters>) {
    const key = stringify(params || {});
    if (!(key in this.cache)) {
      this.cache[key] = await paginatedCallback<
        Canvas.CalendarEvents.CalendarEvent,
        CalendarEvent,
        Canvas.v1.CalendarEvents.listSearchParameters
      >(
        '/canvas/api/v1/calendar_events',
        (calendarEvent: Canvas.CalendarEvents.CalendarEvent) =>
          new CalendarEvent(calendarEvent)
      )({ callback, params });
    } else if (callback) {
      for (const calendarEvent of this.cache[key]) {
        callback(calendarEvent);
      }
    }
    return this.cache[key];
  }

  public toEvent(): EventInput {
    const course = Course.fromContextCode(this.calendarEvent.context_code);
    return {
      id: `calendar_event_${this.calendarEvent.id}`,
      title: this.calendarEvent.title,
      start: new Date(this.calendarEvent.start_at),
      end: new Date(this.calendarEvent.end_at),
      allDay: isAllDay(this.calendarEvent.start_at, this.calendarEvent.end_at),
      classNames: [
        course.context_code,
        'assignment' in this.calendarEvent ? 'assignment' : 'planner_item'
      ],
      extendedProps: {
        calendar_event: this,
        course
      }
    };
  }
}
