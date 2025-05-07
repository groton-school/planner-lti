import GoogleCalendar from '@battis/google.calendar';
import { EventClickArg, EventInput, ViewApi } from '@fullcalendar/core';
import bootstrap from 'bootstrap';
import * as Colors from './Colors';
import { Course } from './Course';

export class ClassMeeting {
  private static fetched: Record<string, boolean> = {};

  public constructor(private event: GoogleCalendar.v3.Event) {}

  public static async list(view?: ViewApi) {
    const now = new Date();
    let start = new Date(
      `${now.getMonth()}/${now.getDate()}/${now.getFullYear()} 12:00 AM`
    );
    let end = new Date(`${now.getMonth() + 1}/1/${now.getFullYear()} 12:00 AM`);
    if (view) {
      start = view.activeStart;
      end = view.activeEnd;
    }
    const params = new URLSearchParams({
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      singleEvents: 'true'
    }).toString();
    if (!this.fetched[params]) {
      this.fetched[params] = true;
      const response = (await (
        await fetch(`/calendar/events?${params}`)
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
      title: canonicalTitle,
      start: new Date(this.event.start.dateTime),
      end: new Date(this.event.end.dateTime),
      classNames: [Colors.classNameFromCourseId(course?.id), 'class_meeting'],
      extendedProps: { class_meeting: this, course }
    };
  }

  public modal(info: EventClickArg) {
    const course = info.event.extendedProps.course as Course;
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.tabIndex = -1;
    modal.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header ${Colors.classNameFromCourseId(course.id)} class_meeting">
              <div class="modal-title">
              <h5>${course.name}</h5>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            <p>
              ${info.event.start?.toLocaleDateString('en-us', {
                day: 'numeric',
                weekday: 'long',
                month: 'long'
              })}<br/>
              ${info.event.start?.toLocaleTimeString('en-us', {
                hour: 'numeric',
                minute: 'numeric'
              })}&nbsp;&ndash;&nbsp;${info.event.end?.toLocaleTimeString(
                'en-us',
                { hour: 'numeric', minute: 'numeric' }
              )}
            </p>
              <p>${this.event.location}</p>
            </div>
          </div>
        </div>
      `;
    document.body.appendChild(modal);
    new bootstrap.Modal(modal).show();
  }
}
