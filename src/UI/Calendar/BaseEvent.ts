import {
  Calendar,
  EventClickArg,
  EventInput
} from '@fullcalendar/core/index.js';

export abstract class BaseEvent<
  Data extends Record<string, unknown> = Record<string, unknown>
> {
  protected constructor(
    protected id: string,
    protected title: string,
    protected start: Date,
    protected end: Date,
    protected allDay: boolean,
    protected data: Data
  ) {}

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

  public async addTo(calendar: Calendar) {
    if (!calendar.getEventById(this.id)) {
      calendar.addEvent(await this.toEventInput());
    }
  }

  protected abstract classNames(): Promise<string[]>;

  public abstract detail(info: EventClickArg): Promise<Element>;
}
