import { DateTimeString } from '@battis/descriptive-types';
import GoogleCalendar from '@battis/google.calendar';
import { EventClickArg, EventInput } from '@fullcalendar/core';
import bootstrap from 'bootstrap';
import * as Canvas from '../../Canvas';
import { render } from '../../Utilities/Views';
import { client } from '../Client';
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
    CalendarEvent.cache[event.id] = this;
  }

  public static async list({ params }: { params: Params } = { params: {} }) {
    params.singleEvents = 'true';
    const paramString = JSON.stringify(params);
    if (!this.fetched[paramString]) {
      this.fetched[paramString] = true;
      const response = await client.fetch<{ items: GoogleCalendar.v3.Event[] }>(
        `calendar/v3/calendars/${user_email}/events?${(
          Object.keys(params) as (keyof typeof params)[]
        )
          .map((key) => `${key}=${encodeURIComponent(params[key] || '')}`)
          .join('&')}`
      );
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
    const allDay = !!this.event.start.date && !this.event.start.dateTime;
    const start = allDay
      ? new Date(`${this.event.start.date}T00:00`)
      : new Date(this.event.start.dateTime);
    const end = allDay
      ? new Date(`${this.event.end.date}T00:00`)
      : new Date(this.event.end.dateTime);
    return {
      id: this.event.id,
      title: this.title,
      allDay,
      start,
      end,
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
    const bsModal = new bootstrap.Modal(modal);
    if (this.course.isTeacher()) {
      const form = await Canvas.Assignment.createFrom({
        course: this.course as Canvas.Course,
        event: info.event,
        parent: modal.querySelector('modal-body') || undefined
      });
      modal.querySelector('.modal-body')?.appendChild(form);
      form.addEventListener(Canvas.Assignment.CreatedEvent, () =>
        bsModal.hide()
      );
    }
    bsModal.show();
  }

  public get title() {
    // trimming off the the custom formatting for SchoolCal events in Google Calendar
    return this.event.summary.replace(/^\* /, '');
  }

  public get course() {
    let sis_course_id: string | undefined = undefined;
    try {
      const data = JSON.parse(
        this.event.description?.replace(/^.*(\{(.|\n)*\}).*$/, '$1') || '{}'
      );
      sis_course_id = data.sis_course_id;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      // ignore error
    }
    return Canvas.Course.fromSisId(sis_course_id);
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
