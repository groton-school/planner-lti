import { DateTimeString } from '@battis/descriptive-types';
import GoogleCalendar from '@battis/google.calendar';
import { EventClickArg, EventInput } from '@fullcalendar/core';
import { stringify } from '@groton/canvas-cli.utilities';
import bootstrap from 'bootstrap';
import * as Canvas from '../../Canvas';
import { render } from '../../Utilities/Views';
import detailModal from './detail.modal.ejs';

type Params = {
  timeMin?: DateTimeString<'ISO'>;
  timeMax?: DateTimeString<'ISO'>;
  singleEvents?: 'true' | 'false';
};

export class CalendarEvent {
  private static cache: Record<string, CalendarEvent> = {};
  private static fetched: Record<string, boolean> = {};

  private static readonly classNames = ['google', 'calendar_event'];

  public constructor(private event: GoogleCalendar.v3.Event) {
    CalendarEvent.cache[event.iCalUID] = this;
  }

  public static async list({ params }: { params: Params } = { params: {} }) {
    params.singleEvents = 'true';
    const paramString = stringify(params);
    if (!this.fetched[paramString]) {
      this.fetched[paramString] = true;
      const response = (await (
        await fetch(`/google/calendar/events?${paramString}`)
      ).json()) as {
        items: GoogleCalendar.v3.Event[];
      };
      return response.items
        .reduce((items, item) => {
          if (items.find((added) => added.id === item.id)) {
            return items;
          }
          items.push(item);
          return items;
        }, [] as GoogleCalendar.v3.Event[])
        .map((item) => new CalendarEvent(item));
    }
    return [];
  }

  public toEvent(): EventInput {
    return {
      id: this.event.iCalUID,
      title: this.title,
      start: new Date(this.event.start.dateTime),
      end: new Date(this.event.end.dateTime),
      classNames: [
        Canvas.Colors.classNameFromCourseId(this.course?.id),
        ...CalendarEvent.classNames
      ]
    };
  }

  public async detail(info: EventClickArg) {
    const modal = await render({
      template: detailModal,
      parent: document.body,
      data: {
        event: info.event,
        location: this.event.location,
        course: this.course
      }
    });
    new bootstrap.Modal(modal).show();
  }

  public get title() {
    // trimming off the first 2 characters because of the custom formatting
    // for SchoolCal events in Google Calendar
    return this.event.summary.slice(2);
  }

  public get course() {
    return Canvas.Course.fromName(this.title);
  }

  public static fromEventId(id: string) {
    return CalendarEvent.cache[id];
  }

  public static isAssociated(info: EventClickArg) {
    return CalendarEvent.classNames.reduce(
      (assoc, className) => assoc && info.event.classNames.includes(className),
      true
    );
  }
}
