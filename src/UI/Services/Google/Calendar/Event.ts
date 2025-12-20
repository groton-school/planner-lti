import { BaseEvent } from './BaseEvent';

// TODO Update to https://stackoverflow.com/a/10574546 ?
// Issue URL: https://github.com/groton-school/planner-lti/issues/79
const JSONObjectPattern = /^(.*)(\{(.|\n)*\})(.*)$/;

export class Event extends BaseEvent {
  public get title() {
    return this.summary?.replace(/^\* /, '');
  }

  public get startDate() {
    if (this.start?.dateTime) {
      return new Date(this.start.dateTime);
    }
    return new Date(`${this.start?.date}T00:00`);
  }

  public get endDate() {
    if (this.end?.dateTime) {
      return new Date(this.end?.dateTime);
    }
    return new Date(`${this.end?.date}T00:00`);
  }

  private _cleanDescription: string | undefined = undefined;

  public get cleanDescription() {
    if (this._sis_course_id) {
      if (!this._cleanDescription) {
        this._cleanDescription = this.description
          ?.replace(JSONObjectPattern, '$1\n\n$3')
          .trim();
      }
      return this._cleanDescription;
    }
    return this.description;
  }

  private _sis_course_id?: string = undefined;

  public get sis_course_id(): string | undefined {
    if (!this._sis_course_id) {
      try {
        const data = JSON.parse(
          this.description?.replace(JSONObjectPattern, '$2') || '{}'
        );
        this._sis_course_id = data.sis_course_id;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // ignore error;
      }
    }
    return this._sis_course_id;
  }

  public constructor(event: BaseEvent) {
    super();
    Object.assign(this, event);
  }

  public static fromV3Event(event: BaseEvent) {
    return new Event(event);
  }
}
