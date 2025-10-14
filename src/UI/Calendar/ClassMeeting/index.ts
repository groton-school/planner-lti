import { render } from 'ejs';
import { Bootstrap, Canvas, FullCalendar, Google } from '../../Services';
import { Assignment } from '../Assignment';
import { BaseEvent } from '../BaseEvent';
import detail from '../CalendarEvent/detail.ejs';
import new_assignment from './new_assignment.ejs';
import './styles.scss';

export class ClassMeeting extends BaseEvent<{
  event: Google.Calendar.Event;
  section: Canvas.Sections.Section;
}> {
  public static readonly className = 'ClassMeeting';

  public static fromGoogleCalendarEventAndCanvasSection(
    event: Google.Calendar.Event,
    section: Canvas.Sections.Section
  ): ClassMeeting {
    return new ClassMeeting(
      event.id,
      event.title,
      event.startDate,
      event.endDate,
      !!event.start.date && !event.start.dateTime,
      { event, section }
    );
  }

  protected async classNames(): Promise<string[]> {
    const course = await this.data.section.course;
    const classNames = [
      ClassMeeting.className,
      course.context_code,
      this.data.section.context_code
    ];
    if (this.data.section.color_block) {
      classNames.push(this.data.section.color_block);
    }
    return classNames;
  }

  public async detail() {
    const course = await this.data.section.course;

    if (course.isTeacher()) {
      // TODO figure out workflow for assigning to multiple sections
      const { modal, elt } = await Bootstrap.Modal.create({
        ...Bootstrap.Modal.stackTitle('New Assignment', course.name),
        body: render(new_assignment, {
          ...this,
          course,
          assignment_groups: await Canvas.AssignmentGroups.listFor(course)
        }),
        classNames: await this.classNames()
      });

      const form = elt?.querySelector<HTMLFormElement>('form');
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

      return elt;
    }
    return (
      await Bootstrap.Modal.create({
        title: this.data.event.title,
        body: render(detail, this),
        classNames: await this.classNames()
      })
    ).elt;
  }
}
