import { EventClickArg } from '@fullcalendar/core';
import { render } from 'ejs';
import { Bootstrap, Canvas, FullCalendar, Google } from '../../Services';
import { Assignment } from '../Assignment';
import { CalendarEvent } from '../CalendarEvent';
import new_assignment from './new_assignment.ejs';

export class ClassMeeting extends CalendarEvent<{
  event: Google.Calendar.Event;
  section: Canvas.Sections.Section;
}> {
  public static fromGoogleCalendarEventAndCanvasSection(
    event: Google.Calendar.Event,
    section: Canvas.Sections.Section
  ): CalendarEvent {
    return new ClassMeeting(
      event.id,
      event.title,
      event.startDate,
      event.endDate,
      !!event.start.date && !event.start.dateTime,
      { event, section }
    );
  }

  /** @deprecated */
  public static fromGoogleCalendarEvent(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: Google.Calendar.Event
  ): CalendarEvent<{ event: Google.Calendar.Event }> {
    throw new Error();
  }

  protected async classNames(): Promise<string[]> {
    return [
      'ClassMeeting',
      this.data.section.context_code,
      this.data.section.color
    ];
  }

  public async detail(info: EventClickArg) {
    const course = await this.data.section.getCourse();

    if (course.isTeacher()) {
      // TODO figure out workflow for assigning to multiple sections
      const modal = await Bootstrap.Modal.create({
        ...Bootstrap.Modal.stackTitle(
          'New Assignment',
          (await this.data.section.getCourse()).name
        ),
        body: render(new_assignment, {
          ...this,
          course,
          assignment_groups: await Canvas.AssignmentGroups.listFor(course)
        }),
        classNames: await this.classNames()
      });

      const elt = document.querySelector('.modal-content:has(.ClassMeeting)');
      const form = elt?.querySelector('form');
      form?.addEventListener('submit', async (e: SubmitEvent) => {
        if (e.submitter?.id === 'save') {
          e.stopImmediatePropagation();
          e.preventDefault();
          (
            await Assignment.fromAssignment(
              await Canvas.Assignments.create(
                course,
                Array.from(new FormData(form).entries()).reduce(
                  (data, [key, value]) => {
                    data[`assignment[${key}]`] = value;
                    return data;
                  },
                  {} as Record<string, unknown>
                )
              )
            )
          ).forEach((assignment) =>
            assignment.addTo(FullCalendar.getInstance())
          );
          modal.hide();
        }
      });

      return modal;
    }
    return super.detail(info);
  }
}
