import { DateTimeString } from '@battis/descriptive-types';
import GoogleCalendar from '@battis/google.calendar';
import { EventClickArg, EventInput } from '@fullcalendar/core';
import { stringify } from '@groton/canvas-cli.utilities';
import bootstrap from 'bootstrap';
import detailModal from '../../views/ejs/ClassMeeting/detail.modal.ejs';
import * as Colors from './Colors';
import { Course } from './Course';
import { render } from './Views';

type Params = {
  timeMin?: DateTimeString<'ISO'>;
  timeMax?: DateTimeString<'ISO'>;
  singleEvents?: 'true' | 'false';
};

export class ClassMeeting {
  private static fetched: Record<string, boolean> = {};

  public constructor(private event: GoogleCalendar.v3.Event) {}

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
        .map((item) => new ClassMeeting(item));
    }
    return [];
  }

  public toEvent(): EventInput {
    // trimming off the first 2 characters because of the custom formatting
    // for SchoolCal events in Google Calendar
    const canonicalTitle = this.event.summary.slice(2);
    const course = Course.fromName(canonicalTitle);
    return {
      id: this.event.iCalUID,
      title: canonicalTitle,
      start: new Date(this.event.start.dateTime),
      end: new Date(this.event.end.dateTime),
      classNames: [Colors.classNameFromCourseId(course?.id), 'class_meeting'],
      extendedProps: { class_meeting: this, course }
    };
  }

  public async detail(info: EventClickArg) {
    const modal = await render({
      template: detailModal,
      parent: document.body,
      data: {
        event: info.event,
        location: this.event.location,
        course_class: Colors.classNameFromCourseId(
          info.event.extendedProps.course?.id
        )
      }
    });
    new bootstrap.Modal(modal).show();
  }
}
