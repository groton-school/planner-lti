import { EventClickArg, EventInput } from '@fullcalendar/core';
import { Canvas } from '@groton/canvas-api.client.web';
import { isAllDay } from '../../Utilities';
import { Assignment } from '../Assignment';
import { Course } from '../Course';

export class CalendarEvent {
  private static cache: Record<string, CalendarEvent> = {};
  private static lists: Record<string, CalendarEvent[]> = {};
  private static classNames = ['canvas', 'calendar_event'];

  private constructor(
    public readonly calendarEvent:
      | Canvas.CalendarEvents.CalendarEvent
      | Canvas.CalendarEvents.AssignmentEvent
  ) {
    CalendarEvent.cache[calendarEvent.id] = this;
  }

  public static async list(
    searchParams: Canvas.v1.CalendarEvents.listSearchParameters,
    callback?: (e: CalendarEvent) => unknown
  ) {
    const key = JSON.stringify(searchParams || {});
    if (!(key in this.lists)) {
      this.lists[key] = (
        await Canvas.v1.CalendarEvents.list({ searchParams })
      ).map((c) => new CalendarEvent(c));
    }
    if (callback) {
      for (const calendarEvent of this.lists[key]) {
        callback(calendarEvent);
      }
    }
    return this.lists[key];
  }

  public toEvent(): EventInput {
    const course = Course.fromContextCode(this.calendarEvent.context_code);

    const event: EventInput = {
      id: `calendar_event_${this.calendarEvent.id}`,
      title: this.calendarEvent.title,
      allDay: isAllDay(this.calendarEvent.start_at, this.calendarEvent.end_at),
      classNames: [
        course.context_code,
        ...CalendarEvent.classNames,
        'assignment' in this.calendarEvent ? 'assignment' : 'planner_item'
      ]
    };
    if (this.calendarEvent.all_day) {
      event.allDay = true;
      event.start = new Date(this.calendarEvent.all_day_date);
    } else {
      event.start = new Date(this.calendarEvent.start_at);
      event.end = new Date(this.calendarEvent.end_at);
    }
    return event;
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
