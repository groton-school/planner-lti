import { render } from 'ejs';
import { Bootstrap, Google } from '../../Services';
import { BaseEvent } from '../BaseEvent';
import detail from './detail.ejs';
import './styles.scss';

export class CalendarEvent extends BaseEvent<{ event: Google.Calendar.Event }> {
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

  protected async classNames(): Promise<string[]> {
    return ['CalendarEvent'];
  }

  public async detail() {
    return (
      await Bootstrap.Modal.create({
        title: this.data.event.title,
        body: render(detail, this),
        classNames: await this.classNames()
      })
    ).elt;
  }
}
