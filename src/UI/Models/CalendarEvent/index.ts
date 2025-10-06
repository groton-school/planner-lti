import {
  Calendar,
  EventClickArg,
  EventInput
} from '@fullcalendar/core/index.js';
import ejs from 'ejs';
import { Bootstrap } from '../../Services';
import * as Google from '../../Services/Google';
import detail from './detail.ejs';
import './styles.scss';

export class CalendarEvent<
  T extends object = { event: Google.Calendar.Event }
> {
  protected constructor(
    protected id: string,
    protected title: string,
    protected start: Date,
    protected end: Date,
    protected allDay: boolean,
    protected data: T
  ) {}

  public static fromGoogleCalendarEvent(event: Google.Calendar.Event) {
    return new CalendarEvent(
      event.id,
      event.title,
      event.startDate,
      event.endDate,
      !!event.start.date && !event.start.dateTime,
      { event }
    );
  }

  protected async toEventInput(): Promise<EventInput> {
    return {
      id: this.id,
      title: this.title,
      start: this.start,
      end: this.end,
      allDay: this.allDay,
      classNames: await this.classNames(),
      extendedProps: {
        model: this
      }
    };
  }

  protected async classNames() {
    return ['CalendarEvent'];
  }

  public async addTo(calendar: Calendar) {
    if (!calendar.getEventById(this.id)) {
      calendar.addEvent(await this.toEventInput());
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async detail(info: EventClickArg) {
    if (
      !('event' in this.data) ||
      !(this.data.event instanceof Google.Calendar.Event)
    ) {
      throw new Error('unexpected data');
    }
    return await Bootstrap.Modal.create({
      title: this.data.event.title,
      body: ejs.render(detail, this),
      classNames: await this.classNames()
    });
  }
}
