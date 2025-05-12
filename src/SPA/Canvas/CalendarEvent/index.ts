import { EventClickArg, EventInput } from '@fullcalendar/core';
import { stringify } from '@groton/canvas-cli.utilities';
import { isAllDay } from '../../Utilities';
import { Options, paginatedCallback } from '../../Utilities/paginatedCallback';
import { Assignment } from '../Assignment';
import * as Canvas from '../Canvas';
import { Course } from '../Course';

export class CalendarEvent {
  private static cache: Record<string, CalendarEvent> = {};
  private static lists: Record<string, CalendarEvent[]> = {};
  private static classNames = ['canvas', 'calendar_event'];

  private constructor(
    private calendarEvent:
      | Canvas.CalendarEvents.CalendarEvent
      | Canvas.CalendarEvents.AssignmentEvent
  ) {
    CalendarEvent.cache[calendarEvent.id] = this;
  }

  public static async list({
    callback,
    params
  }: Options<CalendarEvent, Canvas.v1.CalendarEvents.listSearchParameters>) {
    const key = stringify(params || {});
    if (!(key in this.lists)) {
      this.lists[key] = await paginatedCallback<
        | Canvas.CalendarEvents.CalendarEvent
        | Canvas.CalendarEvents.AssignmentEvent,
        CalendarEvent,
        Canvas.v1.CalendarEvents.listSearchParameters
      >(
        '/canvas/api/v1/calendar_events',
        (
          calendarEvent:
            | Canvas.CalendarEvents.CalendarEvent
            | Canvas.CalendarEvents.AssignmentEvent
        ) => new CalendarEvent(calendarEvent)
      )({ callback, params });
    } else if (callback) {
      for (const calendarEvent of this.lists[key]) {
        callback(calendarEvent);
      }
    }
    return this.lists[key];
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
        ...CalendarEvent.classNames,
        'assignment' in this.calendarEvent ? 'assignment' : 'planner_item'
      ]
    };
  }

  public get assignment() {
    if ('assignment' in this.calendarEvent) {
      return new Assignment(this.calendarEvent.assignment);
    }
    return undefined;
  }

  public static fromEventId(id: string) {
    return CalendarEvent.cache[id.replace(/^calendar_event_/, '')];
  }

  public static isAssociated(info: EventClickArg) {
    return CalendarEvent.classNames.reduce(
      (assoc, className) => assoc && info.event.classNames.includes(className),
      true
    );
  }
}
