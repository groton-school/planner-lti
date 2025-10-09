import {
  Calendar,
  EventClickArg,
  EventInput
} from '@fullcalendar/core/index.js';
import { EventImpl } from '@fullcalendar/core/internal';

export abstract class BaseEvent<
  Data extends Record<string, unknown> = Record<string, unknown>
> {
  protected fcEvent: EventImpl | undefined = undefined;

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
    if (!this.fcEvent) {
      this.fcEvent = calendar.getEventById(this.id) || undefined;
    }
    if (!this.fcEvent) {
      this.fcEvent = calendar.addEvent(await this.toEventInput()) || undefined;
    }
  }

  protected abstract classNames(): Promise<string[]>;

  public abstract detail(info: EventClickArg): Promise<Element>;
}
